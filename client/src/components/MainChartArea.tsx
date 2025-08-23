import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Play, Square } from "lucide-react";
import ChartContainer from "./ChartContainer";
import AlertLog from "./AlertLog";
import type { BreakoutConfiguration } from "@shared/schema";
import { POPULAR_PAIRS } from "@/lib/coinList";
import { usePriceData } from "@/lib/priceService";

interface MainChartAreaProps {
  selectedSymbol: string;
  onSymbolChange: (symbol: string) => void;
  timeframe: string;
  onTimeframeChange: (timeframe: string) => void;
  isScanning: boolean;
  onStartScanning: () => void;
  onStopScanning: () => void;
  configuration: Partial<BreakoutConfiguration>;
}

export default function MainChartArea({
  selectedSymbol,
  onSymbolChange,
  timeframe,
  onTimeframeChange,
  isScanning,
  onStartScanning,
  onStopScanning,
  configuration
}: MainChartAreaProps) {
  const { priceData, loading } = usePriceData(selectedSymbol);
  return (
    <main className="flex-1 flex flex-col">
      {/* Chart Header with Controls */}
      <div className="bg-trading-dark border-b border-trading-border p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <Select value={selectedSymbol} onValueChange={onSymbolChange}>
              <SelectTrigger className="bg-trading-darker border-trading-border text-trading-text w-40" data-testid="select-symbol">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {POPULAR_PAIRS.map(pair => (
                  <SelectItem key={pair} value={pair}>{pair}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-trading-muted">Timeframe:</span>
              <Select value={timeframe} onValueChange={onTimeframeChange}>
                <SelectTrigger className="bg-trading-darker border-trading-border text-trading-text w-20" data-testid="select-timeframe">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1m">1m</SelectItem>
                  <SelectItem value="5m">5m</SelectItem>
                  <SelectItem value="15m">15m</SelectItem>
                  <SelectItem value="1h">1h</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {!isScanning ? (
              <Button 
                onClick={onStartScanning}
                className="px-4 py-2 bg-bullish hover:bg-bullish/90 text-white font-medium transition-colors"
                data-testid="button-start-scanning"
              >
                <Play className="mr-2 w-4 h-4" />
                Start Scanning
              </Button>
            ) : (
              <Button 
                onClick={onStopScanning}
                className="px-4 py-2 bg-trading-muted hover:bg-trading-muted/90 text-white font-medium transition-colors"
                data-testid="button-stop-scanning"
              >
                <Square className="mr-2 w-4 h-4" />
                Stop
              </Button>
            )}
          </div>
        </div>

        {/* Real-time Stats Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-trading-card border-trading-border p-3">
            <div className="text-xs text-trading-muted mb-1">Current Price</div>
            <div className="text-lg font-mono font-bold" data-testid="text-current-price">
              {loading ? '...' : priceData ? `$${priceData.price.toFixed(8)}` : '$0.00000000'}
            </div>
          </Card>
          <Card className="bg-trading-card border-trading-border p-3">
            <div className="text-xs text-trading-muted mb-1">Δ (% Change)</div>
            <div 
              className={`text-lg font-mono font-bold ${
                (priceData?.percentChange ?? 0) >= 0 ? 'text-bullish' : 'text-bearish'
              }`} 
              data-testid="text-percent-change"
            >
              {loading ? '...' : priceData ? `${priceData.percentChange >= 0 ? '+' : ''}${priceData.percentChange.toFixed(2)}%` : '+0.00%'}
            </div>
          </Card>
          <Card className="bg-trading-card border-trading-border p-3">
            <div className="text-xs text-trading-muted mb-1">W (Band Width)</div>
            <div className="text-lg font-mono font-bold text-warning" data-testid="text-band-width">
              {loading ? '...' : priceData ? `${priceData.bandWidth.toFixed(2)}%` : '0.00%'}
            </div>
          </Card>
          <Card className="bg-trading-card border-trading-border p-3">
            <div className="text-xs text-trading-muted mb-1">Volume Ratio</div>
            <div className="text-lg font-mono font-bold" data-testid="text-volume-ratio">
              {loading ? '...' : priceData ? `${priceData.volumeRatio.toFixed(1)}x` : '0.0x'}
            </div>
          </Card>
        </div>
      </div>

      {/* Chart Container */}
      <ChartContainer 
        selectedSymbol={selectedSymbol}
        timeframe={timeframe}
        configuration={configuration}
      />

      {/* Alert Log Panel */}
      <AlertLog />
    </main>
  );
}
