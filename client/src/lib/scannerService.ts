import { CRYPTO_PAIRS, SCAN_MODE_CONFIGS } from './coinList';
import type { BreakoutConfiguration } from '@shared/schema';

export interface CandleData {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface BreakoutResult {
  symbol: string;
  isBreakout: boolean;
  details?: {
    price: number;
    percentChange: number;
    bandWidth: number;
    volumeRatio: number;
    dollarVolume: number;
    modes: string[];
    scanMode: string;
  };
}

export interface ScanStats {
  totalScanned: number;
  breakoutsDetected: number;
  currentPair: string;
  lastScanTime: Date;
}

class RealtimeScannerService {
  private isRunning = false;
  private configuration: BreakoutConfiguration | null = null;
  private scanStats: ScanStats = {
    totalScanned: 0,
    breakoutsDetected: 0,
    currentPair: '',
    lastScanTime: new Date()
  };
  private listeners: ((result: BreakoutResult) => void)[] = [];
  private statsListeners: ((stats: ScanStats) => void)[] = [];

  async startScanning(config: BreakoutConfiguration): Promise<void> {
    if (this.isRunning) {
      console.log('Scanner is already running');
      return;
    }

    this.isRunning = true;
    this.configuration = config;
    this.scanStats = {
      totalScanned: 0,
      breakoutsDetected: 0,
      currentPair: '',
      lastScanTime: new Date()
    };

    console.log(`🚀 Starting Resonance.ai Breakout Scanner in ${config.scanMode} mode`);
    this.scanLoop();
  }

  stopScanning(): void {
    console.log('🛑 Stopping Resonance.ai Breakout Scanner');
    this.isRunning = false;
  }

  isScanning(): boolean {
    return this.isRunning;
  }

  onBreakoutDetected(callback: (result: BreakoutResult) => void): () => void {
    this.listeners.push(callback);
    return () => {
      const index = this.listeners.indexOf(callback);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  onStatsUpdate(callback: (stats: ScanStats) => void): () => void {
    this.statsListeners.push(callback);
    return () => {
      const index = this.statsListeners.indexOf(callback);
      if (index > -1) {
        this.statsListeners.splice(index, 1);
      }
    };
  }

  getStats(): ScanStats {
    return { ...this.scanStats };
  }

  private async scanLoop(): Promise<void> {
    while (this.isRunning && this.configuration) {
      for (const pair of CRYPTO_PAIRS) {
        if (!this.isRunning) break;

        this.scanStats.currentPair = pair;
        this.scanStats.totalScanned++;
        this.notifyStatsListeners();

        try {
          const candles = await this.getCandleData(pair);
          if (!candles || candles.length === 0) {
            continue;
          }

          const result = await this.analyzeBreakout(pair, candles, this.configuration);
          if (result.isBreakout) {
            this.scanStats.breakoutsDetected++;
            this.notifyBreakoutListeners(result);
            
            // Create alert in backend
            await this.createAlert(result);
          }

        } catch (error) {
          console.error(`Error scanning ${pair}:`, error);
        }
      }

      // Rest between full scan cycles
      await this.sleep(2000);
    }
  }

  private async getCandleData(pair: string): Promise<CandleData[]> {
    try {
      const lookbackCandles = this.configuration?.lookbackCandles || 10;
      const granularity = 60; // 1 minute candles
      const end = new Date();
      const start = new Date(end.getTime() - (granularity * lookbackCandles * 1000));

      const url = `https://api.exchange.coinbase.com/products/${pair}/candles`;
      const params = new URLSearchParams({
        granularity: granularity.toString(),
        start: start.toISOString(),
        end: end.toISOString()
      });

      const response = await fetch(`${url}?${params}`, {
        headers: {
          'Accept': 'application/json',
        }
      });

      if (!response.ok) {
        console.warn(`Failed to fetch candles for ${pair}: ${response.status}`);
        return [];
      }

      const data = await response.json();
      if (!Array.isArray(data) || data.length === 0) {
        return [];
      }

      // Convert Coinbase format [timestamp, low, high, open, close, volume] to our format
      return data
        .map(([timestamp, low, high, open, close, volume]) => ({
          timestamp: timestamp * 1000, // Convert to milliseconds
          open: parseFloat(open),
          high: parseFloat(high),
          low: parseFloat(low),
          close: parseFloat(close),
          volume: parseFloat(volume)
        }))
        .sort((a, b) => a.timestamp - b.timestamp);

    } catch (error) {
      console.error(`Error fetching candles for ${pair}:`, error);
      return [];
    }
  }

  private async analyzeBreakout(
    symbol: string,
    candles: CandleData[],
    config: BreakoutConfiguration
  ): Promise<BreakoutResult> {
    if (candles.length < 3) {
      return { symbol, isBreakout: false };
    }

    // Calculate basic metrics
    const startPrice = candles[0].close;
    const endPrice = candles[candles.length - 1].close;
    const percentChange = ((endPrice - startPrice) / startPrice) * 100;

    const highs = candles.map(c => c.high);
    const lows = candles.map(c => c.low);
    const bandWidth = (Math.max(...highs) - Math.min(...lows)) / endPrice * 100;

    // Test all scan modes like Python version
    const detectedModes: string[] = [];
    
    for (const [modeName, modeConfig] of Object.entries(SCAN_MODE_CONFIGS)) {
      const isBreakout = this.testBreakoutMode(
        candles, 
        modeConfig.candleCount, 
        modeConfig.breakoutThreshold, 
        modeConfig.volumeSpikeRatio, 
        config.minVolumeUsd || 2000
      );
      
      if (isBreakout) {
        detectedModes.push(modeConfig.name);
      }
    }

    if (detectedModes.length > 0) {
      const currentCandle = candles[candles.length - 1];
      const dollarVolume = currentCandle.volume * currentCandle.close;
      
      // Calculate volume ratio
      const volumes = candles.slice(0, -1).map(c => c.volume);
      const avgVolume = volumes.reduce((sum, vol) => sum + vol, 0) / volumes.length;
      const volumeRatio = currentCandle.volume / avgVolume;

      return {
        symbol,
        isBreakout: true,
        details: {
          price: endPrice,
          percentChange,
          bandWidth,
          volumeRatio,
          dollarVolume,
          modes: detectedModes,
          scanMode: config.scanMode || 'fast'
        }
      };
    }

    return { symbol, isBreakout: false };
  }

  private testBreakoutMode(
    candles: CandleData[],
    windowSize: number,
    threshold: number,
    volumeRatio: number,
    minDollarVolume: number
  ): boolean {
    if (candles.length < windowSize) return false;

    const window = candles.slice(-windowSize);
    const highs = window.map(c => c.high);
    const volumes = window.map(c => c.volume);

    if (highs.length < 2 || volumes.length < 2) return false;

    // Get max high before last candle
    const maxHigh = Math.max(...highs.slice(0, -1));
    const lastCandle = window[window.length - 1];
    const lastClose = lastCandle.close;
    const lastVolume = lastCandle.volume;
    
    // Calculate average volume excluding last candle
    const avgVolume = volumes.slice(0, -1).reduce((sum, vol) => sum + vol, 0) / (volumes.length - 1);
    const dollarVolume = lastVolume * lastClose;

    // Breakout conditions (matching Python logic)
    const priceBreakout = lastClose > maxHigh * (1 + threshold);
    const volumeBreakout = lastVolume > avgVolume * volumeRatio;
    const dollarVolumeCheck = dollarVolume >= minDollarVolume;

    return priceBreakout && volumeBreakout && dollarVolumeCheck;
  }

  private async createAlert(result: BreakoutResult): Promise<void> {
    if (!result.details) return;

    try {
      await fetch('/api/alerts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          symbol: result.symbol,
          price: result.details.price,
          percentChange: result.details.percentChange,
          bandWidth: result.details.bandWidth,
          volumeRatio: result.details.volumeRatio,
          scanMode: result.details.scanMode
        })
      });
    } catch (error) {
      console.error('Failed to create alert:', error);
    }
  }

  private notifyBreakoutListeners(result: BreakoutResult): void {
    this.listeners.forEach(callback => {
      try {
        callback(result);
      } catch (error) {
        console.error('Error in breakout callback:', error);
      }
    });
  }

  private notifyStatsListeners(): void {
    this.scanStats.lastScanTime = new Date();
    this.statsListeners.forEach(callback => {
      try {
        callback({ ...this.scanStats });
      } catch (error) {
        console.error('Error in stats callback:', error);
      }
    });
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const scannerService = new RealtimeScannerService();