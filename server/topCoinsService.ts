// Using built-in Node.js fetch (no import needed)

export interface ProductInfo {
  id: string;
  base_currency: string;
  quote_currency: string;
  status: string;
  trading_disabled?: boolean;
}

export interface CandleMetrics {
  avg_usd_per_min: number;
  last_close: number;
  ret_stdev: number;
  range_pct: number;
}

export interface ScoredCoin {
  product_id: string;
  score: number;
  metrics?: CandleMetrics;
  spread?: number;
}

export interface TopCoinsConfig {
  topN: number;
  granularitySec: number;
  lookbackMin: number;
  minUsdPerMin: number;
  maxSpreadPct: number;
  minPriceUsd: number;
  excludeBases: Set<string>;
}

export class TopCoinsService {
  private config: TopCoinsConfig;
  private exchangeApi = 'https://api.exchange.coinbase.com';

  constructor(config?: Partial<TopCoinsConfig>) {
    this.config = {
      topN: 50,
      granularitySec: 60,
      lookbackMin: 45,
      minUsdPerMin: 2000.0,
      maxSpreadPct: 0.5 / 100,
      minPriceUsd: 0.0001,
      excludeBases: new Set(['USDC', 'DAI', 'USDT', 'PYUSD']),
      ...config
    };
  }

  async getProductsUsd(): Promise<string[]> {
    try {
      const response = await fetch(`${this.exchangeApi}/products`, {
        headers: { 'User-Agent': 'usd-curator/1.0' }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const products: ProductInfo[] = await response.json();
      const usdPairs: string[] = [];

      for (const product of products) {
        if (
          product.quote_currency === 'USD' &&
          product.status === 'online' &&
          !product.trading_disabled &&
          !this.config.excludeBases.has(product.base_currency)
        ) {
          usdPairs.push(product.id);
        }
      }

      return usdPairs;
    } catch (error) {
      console.error('Error fetching USD products:', error);
      return [];
    }
  }

  async getL1SpreadPct(productId: string): Promise<number | null> {
    try {
      const response = await fetch(`${this.exchangeApi}/products/${productId}/book?level=1`);

      if (!response.ok) return null;

      const data: any = await response.json();
      const bids = data.bids || [];
      const asks = data.asks || [];

      if (!bids.length || !asks.length) return null;

      const bid = parseFloat(bids[0][0]);
      const ask = parseFloat(asks[0][0]);
      const mid = (bid + ask) / 2.0;

      if (mid <= 0) return null;

      return (ask - bid) / mid;
    } catch (error) {
      return null;
    }
  }

  async getRecentCandles(productId: string): Promise<number[][] | null> {
    try {
      const end = new Date();
      const start = new Date(end.getTime() - (this.config.lookbackMin + 2) * 60 * 1000);

      const params = new URLSearchParams({
        start: start.toISOString(),
        end: end.toISOString(),
        granularity: this.config.granularitySec.toString()
      });

      const response = await fetch(`${this.exchangeApi}/products/${productId}/candles?${params}`);

      if (!response.ok) return null;

      const data: number[][] = await response.json();
      if (!Array.isArray(data)) return null;

      // Sort by timestamp
      data.sort((a, b) => a[0] - b[0]);
      return data;
    } catch (error) {
      return null;
    }
  }

  calculateCandleMetrics(candles: number[][]): CandleMetrics | null {
    if (!candles.length) return null;

    const closes = candles.map(c => c[4]);
    const volsBase = candles.map(c => c[5]);
    const usdVols = volsBase.map((vol, i) => vol * closes[i]);

    const avgUsdPerMin = usdVols.reduce((sum, vol) => sum + vol, 0) / Math.max(1, usdVols.length);
    const lastClose = closes[closes.length - 1];

    // Calculate return standard deviation
    const returns: number[] = [];
    for (let i = 1; i < closes.length; i++) {
      if (closes[i - 1] > 0) {
        returns.push(Math.log(closes[i] / closes[i - 1]));
      }
    }

    let stdev = 0;
    if (returns.length >= 2) {
      const mean = returns.reduce((sum, ret) => sum + ret, 0) / returns.length;
      const variance = returns.reduce((sum, ret) => sum + Math.pow(ret - mean, 2), 0) / returns.length;
      stdev = Math.sqrt(variance);
    }

    const highs = candles.map(c => c[2]);
    const lows = candles.map(c => c[1]);
    const hi = Math.max(...highs);
    const lo = Math.min(...lows);
    const rangePct = lo > 0 ? (hi - lo) / lo : 0;

    return {
      avg_usd_per_min: avgUsdPerMin,
      last_close: lastClose,
      ret_stdev: stdev,
      range_pct: rangePct
    };
  }

  scoreCoin(metrics: CandleMetrics): number {
    const volScore = (metrics.ret_stdev * 10000.0) + (metrics.range_pct * 100.0);
    const liqBonus = Math.min(1.0, metrics.avg_usd_per_min / (this.config.minUsdPerMin * 3.0));
    return volScore + liqBonus;
  }

  async getTopCoins(progressCallback?: (current: number, total: number, coin: string) => void): Promise<ScoredCoin[]> {
    const products = await this.getProductsUsd();
    console.log(`Found ${products.length} USD pairs. Scanning...`);

    const scoredCoins: ScoredCoin[] = [];

    for (let i = 0; i < products.length; i++) {
      const productId = products[i];
      
      if (progressCallback) {
        progressCallback(i + 1, products.length, productId);
      }

      // Check spread
      const spread = await this.getL1SpreadPct(productId);
      if (spread === null || spread > this.config.maxSpreadPct) {
        console.log(`[${i + 1}/${products.length}] ${productId.padEnd(12)} ❌ skipped (spread ${spread ? (spread * 100).toFixed(3) : 0}%)`);
        continue;
      }

      // Get candles
      const candles = await this.getRecentCandles(productId);
      if (!candles) {
        console.log(`[${i + 1}/${products.length}] ${productId.padEnd(12)} ❌ skipped (no candles)`);
        continue;
      }

      // Calculate metrics
      const metrics = this.calculateCandleMetrics(candles);
      if (!metrics) {
        console.log(`[${i + 1}/${products.length}] ${productId.padEnd(12)} ❌ skipped (metrics fail)`);
        continue;
      }

      // Apply filters
      if (metrics.last_close < this.config.minPriceUsd) {
        console.log(`[${i + 1}/${products.length}] ${productId.padEnd(12)} ❌ skipped (price ${metrics.last_close.toFixed(6)} < min)`);
        continue;
      }

      if (metrics.avg_usd_per_min < this.config.minUsdPerMin) {
        console.log(`[${i + 1}/${products.length}] ${productId.padEnd(12)} ❌ skipped ($/min ${metrics.avg_usd_per_min.toFixed(0)} < ${this.config.minUsdPerMin})`);
        continue;
      }

      // Score and keep
      const score = this.scoreCoin(metrics);
      scoredCoins.push({
        product_id: productId,
        score,
        metrics,
        spread
      });

      console.log(`[${i + 1}/${products.length}] ${productId.padEnd(12)} ✅ kept | price=${metrics.last_close.toFixed(6)} $/min=${metrics.avg_usd_per_min.toFixed(0)} spread=${(spread * 100).toFixed(3)}% score=${score.toFixed(2)}`);

      // Rate limiting
      if ((i + 1) % 10 === 0) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    // Sort by score and return top N
    scoredCoins.sort((a, b) => b.score - a.score);
    const topCoins = scoredCoins.slice(0, this.config.topN);

    console.log(`\nFound ${topCoins.length} top coins`);
    console.log('Top 10 preview:', topCoins.slice(0, 10).map(c => c.product_id));

    return topCoins;
  }

  async getTopCoinIds(): Promise<string[]> {
    const topCoins = await this.getTopCoins();
    return topCoins.map(coin => coin.product_id);
  }
}

export const topCoinsService = new TopCoinsService();