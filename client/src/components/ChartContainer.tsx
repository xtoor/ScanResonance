import { Card } from "@/components/ui/card";
import type { BreakoutConfiguration } from "@shared/schema";
import { useState, useEffect } from "react";
import { usePriceData } from "@/lib/priceService";
import { scannerService, type BreakoutResult } from "@/lib/scannerService";

interface CandleData {
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  time: string;
  isBreakout?: boolean;
  isPotential?: boolean;
  breakoutType?: 'confirmed' | 'potential';
}

interface ChartContainerProps {
  selectedSymbol: string;
  timeframe: string;
  configuration: Partial<BreakoutConfiguration>;
}

export default function ChartContainer({ 
  selectedSymbol, 
  timeframe, 
  configuration 
}: ChartContainerProps) {
  const [candleData, setCandleData] = useState<CandleData[]>([]);
  const [breakoutSignals, setBreakoutSignals] = useState<BreakoutResult[]>([]);
  const { priceData } = usePriceData(selectedSymbol);

  // Generate realistic candle data
  useEffect(() => {
    if (!priceData) return;
    
    const generateCandleData = () => {
      const candles: CandleData[] = [];
      const basePrice = priceData.price;
      const now = new Date();
      
      // Generate 20 candles with realistic price movements
      for (let i = 19; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 5 * 60 * 1000); // 5-minute intervals
        const volatility = 0.02; // 2% volatility
        const priceChange = (Math.random() - 0.5) * volatility;
        
        const open = basePrice * (1 + priceChange);
        const close = open * (1 + (Math.random() - 0.5) * volatility);
        const high = Math.max(open, close) * (1 + Math.random() * volatility * 0.5);
        const low = Math.min(open, close) * (1 - Math.random() * volatility * 0.5);
        
        candles.push({
          open,
          high,
          low,
          close,
          volume: Math.random() * 1000000 + 100000,
          time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        });
      }
      
      setCandleData(candles);
    };
    
    generateCandleData();
    const interval = setInterval(generateCandleData, 30000); // Update every 30 seconds
    
    return () => clearInterval(interval);
  }, [priceData, selectedSymbol]);

  // Listen for breakout signals
  useEffect(() => {
    const unsubscribe = scannerService.onBreakoutDetected((result: BreakoutResult) => {
      if (result.symbol === selectedSymbol) {
        setBreakoutSignals(prev => [...prev.slice(-4), result]); // Keep last 5 signals
      }
    });
    
    return unsubscribe;
  }, [selectedSymbol]);

  // Calculate price range for chart scaling
  const priceRange = candleData.length > 0 ? {
    min: Math.min(...candleData.map(c => c.low)),
    max: Math.max(...candleData.map(c => c.high))
  } : { min: 0, max: 100 };
  
  const priceSpread = priceRange.max - priceRange.min;
  
  const getCandleHeight = (candle: CandleData) => {
    const bodyHeight = Math.abs(candle.close - candle.open) / priceSpread * 200;
    return Math.max(bodyHeight, 2); // Minimum 2px height
  };
  
  const getCandlePosition = (candle: CandleData) => {
    return ((priceRange.max - Math.max(candle.open, candle.close)) / priceSpread) * 200;
  };
  return (
    <div className="flex-1 relative bg-trading-darker">
      <div className="absolute inset-0 p-6 ml-[135px] mr-[135px]">
        <Card className="w-full h-full bg-trading-dark border-trading-border relative overflow-hidden">
          {/* Chart Grid Background */}
          <svg className="absolute inset-0 w-full h-full opacity-20">
            <defs>
              <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="var(--trading-border)" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)"/>
          </svg>

          {/* Price Chart Area */}
          <div className="absolute inset-6">
            {/* Dynamic Candlestick Chart */}
            <div className="relative h-4/5" data-testid="chart-candlesticks">
              <div className="flex items-end justify-between h-full space-x-1">
                {candleData.map((candle, index) => {
                  const isBullish = candle.close > candle.open;
                  const hasBreakout = breakoutSignals.some(() => 
                    Math.random() > 0.8 // 20% chance for demo purposes
                  );
                  const isPotential = Math.random() > 0.7; // 30% chance for demo
                  
                  return (
                    <div 
                      key={index}
                      className={`relative w-2 rounded-sm opacity-80 transition-all duration-300 ${
                        isBullish ? 'bg-bullish' : 'bg-bearish'
                      }`}
                      style={{ height: `${getCandleHeight(candle)}px` }}
                    >
                      {/* Confirmed Breakout Signal */}
                      {hasBreakout && index >= candleData.length - 3 && (
                        <>
                          <div 
                            className="absolute -top-8 -left-6 px-2 py-1 rounded text-xs font-mono whitespace-nowrap text-white animate-pulse"
                            style={{ backgroundColor: configuration.breakoutColor || "#00C853" }}
                            data-testid="breakout-signal"
                          >
                            🚨 BREAKOUT
                          </div>
                          <div 
                            className="absolute top-0 left-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent transform -translate-x-1/2 -translate-y-1"
                            style={{ borderBottomColor: configuration.breakoutColor || "#00C853" }}
                          ></div>
                        </>
                      )}
                      
                      {/* Potential Breakout Signal */}
                      {isPotential && !hasBreakout && index >= candleData.length - 5 && (
                        <>
                          <div 
                            className="absolute -top-8 -left-6 px-2 py-1 rounded text-xs font-mono whitespace-nowrap text-white"
                            style={{ backgroundColor: configuration.potentialColor || "#FF9800" }}
                            data-testid="potential-signal"
                          >
                            ⚠ POTENTIAL
                          </div>
                          <div 
                            className="absolute top-0 left-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent transform -translate-x-1/2 -translate-y-1"
                            style={{ borderBottomColor: configuration.potentialColor || "#FF9800" }}
                          ></div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Dynamic Volume Histogram */}
            {configuration.showVolumeHistogram && (
              <div className="flex items-end justify-between h-1/5 space-x-1 mt-4" data-testid="volume-histogram">
                {candleData.map((candle, index) => {
                  const isBullish = candle.close > candle.open;
                  const maxVolume = Math.max(...candleData.map(c => c.volume));
                  const volumeHeight = (candle.volume / maxVolume) * 60; // Scale to max 60px
                  
                  return (
                    <div 
                      key={index}
                      className={`w-2 rounded-sm opacity-40 ${
                        isBullish ? 'bg-bullish' : 'bg-bearish'
                      }`}
                      style={{ height: `${Math.max(volumeHeight, 2)}px` }}
                    ></div>
                  );
                })}
              </div>
            )}

            {/* Dynamic Price Labels */}
            <div className="absolute right-0 top-0 space-y-8 text-xs font-mono text-trading-muted">
              {priceRange.max > 0 && [
                priceRange.max,
                priceRange.max - priceSpread * 0.2,
                priceRange.max - priceSpread * 0.4, 
                priceData?.price || (priceRange.max - priceSpread * 0.5),
                priceRange.max - priceSpread * 0.7,
                priceRange.min
              ].map((price, index) => (
                <div 
                  key={index} 
                  className={index === 3 ? "text-bullish font-bold" : ""}
                >
                  ${price.toFixed(2)}
                </div>
              ))}
            </div>

            {/* Dynamic Time Labels */}
            <div className="absolute bottom-0 left-0 right-8 flex justify-between text-xs font-mono text-trading-muted">
              {candleData.length >= 5 && [
                candleData[0]?.time,
                candleData[Math.floor(candleData.length * 0.25)]?.time,
                candleData[Math.floor(candleData.length * 0.5)]?.time,
                candleData[Math.floor(candleData.length * 0.75)]?.time,
                candleData[candleData.length - 1]?.time
              ].map((time, index) => (
                <span key={index}>{time}</span>
              ))}
            </div>
          </div>

          {/* Chart Legend */}
          {configuration.showLabels && (
            <div className="absolute top-4 left-4 space-y-2" data-testid="chart-legend">
              <div className="flex items-center space-x-2 text-sm">
                <div 
                  className="w-3 h-3 rounded"
                  style={{ backgroundColor: configuration.breakoutColor || "#00C853" }}
                ></div>
                <span>Confirmed Breakout</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <div 
                  className="w-3 h-3 rounded"
                  style={{ backgroundColor: configuration.potentialColor || "#FF9800" }}
                ></div>
                <span>Potential Breakout</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-3 h-2 bg-bullish rounded opacity-40"></div>
                <span>Volume</span>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
