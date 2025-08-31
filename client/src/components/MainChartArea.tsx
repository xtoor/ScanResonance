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
    <main className="flex-1 flex flex-col ml-[199px] mr-[199px]">
      {/* Chart Header with Controls */}
      <div className="bg-trading-dark border-b border-trading-border p-4 ml-[199px] mr-[199px]">
        <div className="flex items-center justify-center mb-4">
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6">
          <Card className="bg-trading-card border-trading-border p-4 rounded-lg shadow-sm">
            <div className="text-xs text-trading-muted mb-2 font-semibold uppercase tracking-wide">Current Price</div>
            <div className="text-lg font-mono font-bold" data-testid="text-current-price">
              $108804.42500000
            </div>
          </Card>
          <Card className="bg-trading-card border-trading-border p-4 rounded-lg shadow-sm">
            <div className="text-xs text-trading-muted mb-2 font-semibold uppercase tracking-wide">Δ (% Change)</div>
            <div className="text-lg font-mono font-bold text-bearish" data-testid="text-percent-change">
              -0.65%
            </div>
          </Card>
          <Card className="bg-trading-card border-trading-border p-4 rounded-lg shadow-sm">
            <div className="text-xs text-trading-muted mb-2 font-semibold uppercase tracking-wide">W (Band Width)</div>
            <div className="text-lg font-mono font-bold text-warning" data-testid="text-band-width">
              0.84%
            </div>
          </Card>
          <Card className="bg-trading-card border-trading-border p-4 rounded-lg shadow-sm">
            <div className="text-xs text-trading-muted mb-2 font-semibold uppercase tracking-wide">Volume Ratio</div>
            <div className="text-lg font-mono font-bold" data-testid="text-volume-ratio">
              3.9x
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
