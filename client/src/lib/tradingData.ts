export interface CandleData {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface BreakoutSignal {
  timestamp: number;
  type: 'confirmed' | 'potential';
  price: number;
  percentChange: number;
  volumeRatio: number;
}

export interface TradingMetrics {
  currentPrice: number;
  percentChange: number;
  bandWidth: number;
  volumeRatio: number;
  dollarVolume: number;
}

// Mock data generation for demonstration
export function generateMockCandleData(count: number = 50): CandleData[] {
  const candles: CandleData[] = [];
  let basePrice = 67000;
  const baseTime = Date.now() - (count * 60 * 1000); // 1 minute intervals

  for (let i = 0; i < count; i++) {
    const timestamp = baseTime + (i * 60 * 1000);
    const volatility = 0.02; // 2% volatility
    const priceChange = (Math.random() - 0.5) * volatility * basePrice;
    
    const open = basePrice;
    const close = basePrice + priceChange;
    const high = Math.max(open, close) + Math.random() * 0.01 * basePrice;
    const low = Math.min(open, close) - Math.random() * 0.01 * basePrice;
    const volume = 1000 + Math.random() * 5000;

    candles.push({
      timestamp,
      open,
      high,
      low,
      close,
      volume
    });

    basePrice = close;
  }

  return candles;
}

export function calculateBreakout(
  candles: CandleData[],
  lookback: number,
  threshold: number,
  volumeRatio: number
): { isBreakout: boolean; signal?: BreakoutSignal } {
  if (candles.length < lookback + 1) {
    return { isBreakout: false };
  }

  const recentCandles = candles.slice(-lookback);
  const currentCandle = candles[candles.length - 1];
  const previousHighs = recentCandles.slice(0, -1).map(c => c.high);
  const maxHigh = Math.max(...previousHighs);
  
  const avgVolume = recentCandles.slice(0, -1).reduce((sum, c) => sum + c.volume, 0) / (lookback - 1);
  const currentVolRatio = currentCandle.volume / avgVolume;
  
  const priceBreakout = currentCandle.close > maxHigh * (1 + threshold / 100);
  const volumeBreakout = currentVolRatio > volumeRatio;
  
  const startPrice = candles[candles.length - lookback].close;
  const percentChange = ((currentCandle.close - startPrice) / startPrice) * 100;

  if (priceBreakout && volumeBreakout) {
    return {
      isBreakout: true,
      signal: {
        timestamp: currentCandle.timestamp,
        type: 'confirmed',
        price: currentCandle.close,
        percentChange,
        volumeRatio: currentVolRatio
      }
    };
  } else if (priceBreakout && currentVolRatio > volumeRatio * 0.7) {
    return {
      isBreakout: true,
      signal: {
        timestamp: currentCandle.timestamp,
        type: 'potential',
        price: currentCandle.close,
        percentChange,
        volumeRatio: currentVolRatio
      }
    };
  }

  return { isBreakout: false };
}

export function calculateTradingMetrics(candles: CandleData[], lookback: number): TradingMetrics {
  if (candles.length < lookback) {
    return {
      currentPrice: 0,
      percentChange: 0,
      bandWidth: 0,
      volumeRatio: 0,
      dollarVolume: 0
    };
  }

  const recentCandles = candles.slice(-lookback);
  const currentCandle = candles[candles.length - 1];
  const startPrice = recentCandles[0].close;
  
  const highs = recentCandles.map(c => c.high);
  const lows = recentCandles.map(c => c.low);
  const volumes = recentCandles.map(c => c.volume);
  
  const maxHigh = Math.max(...highs);
  const minLow = Math.min(...lows);
  const avgVolume = volumes.reduce((sum, v) => sum + v, 0) / volumes.length;
  
  const percentChange = ((currentCandle.close - startPrice) / startPrice) * 100;
  const bandWidth = ((maxHigh - minLow) / currentCandle.close) * 100;
  const volumeRatio = currentCandle.volume / avgVolume;
  const dollarVolume = currentCandle.volume * currentCandle.close;

  return {
    currentPrice: currentCandle.close,
    percentChange,
    bandWidth,
    volumeRatio,
    dollarVolume
  };
}
