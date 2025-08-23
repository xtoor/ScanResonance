import { Card } from "@/components/ui/card";
import type { BreakoutConfiguration } from "@shared/schema";

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
  return (
    <div className="flex-1 relative bg-trading-darker">
      <div className="absolute inset-0 p-6">
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
            {/* Mock Candlestick Chart */}
            <div className="flex items-end justify-between h-4/5 space-x-1" data-testid="chart-candlesticks">
              {/* Candlestick bars */}
              <div className="bg-bullish w-2 h-16 rounded-sm opacity-80"></div>
              <div className="bg-bearish w-2 h-12 rounded-sm opacity-80"></div>
              <div className="bg-bullish w-2 h-20 rounded-sm opacity-80"></div>
              <div className="bg-bullish w-2 h-18 rounded-sm opacity-80"></div>
              <div className="bg-bearish w-2 h-8 rounded-sm opacity-80"></div>
              <div className="bg-bullish w-2 h-24 rounded-sm opacity-80"></div>
              <div className="bg-bullish w-2 h-28 rounded-sm opacity-80"></div>
              <div className="bg-bullish w-2 h-32 rounded-sm opacity-80 relative">
                {/* Breakout Signal */}
                <div 
                  className="absolute -top-8 -left-4 px-2 py-1 rounded text-xs font-mono whitespace-nowrap text-white"
                  style={{ backgroundColor: configuration.breakoutColor || "#00C853" }}
                  data-testid="breakout-signal"
                >
                  🚨 BREAKOUT
                </div>
                <div 
                  className="absolute top-0 left-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent transform -translate-x-1/2 -translate-y-1"
                  style={{ borderBottomColor: configuration.breakoutColor || "#00C853" }}
                ></div>
              </div>
              <div className="bg-bullish w-2 h-26 rounded-sm opacity-80"></div>
              <div className="bg-bearish w-2 h-14 rounded-sm opacity-80"></div>
              <div className="bg-bullish w-2 h-22 rounded-sm opacity-80"></div>
            </div>

            {/* Volume Histogram */}
            {configuration.showVolumeHistogram && (
              <div className="flex items-end justify-between h-1/5 space-x-1 mt-4" data-testid="volume-histogram">
                <div className="bg-bullish w-2 h-6 rounded-sm opacity-40"></div>
                <div className="bg-bearish w-2 h-4 rounded-sm opacity-40"></div>
                <div className="bg-bullish w-2 h-8 rounded-sm opacity-40"></div>
                <div className="bg-bullish w-2 h-7 rounded-sm opacity-40"></div>
                <div className="bg-bearish w-2 h-3 rounded-sm opacity-40"></div>
                <div className="bg-bullish w-2 h-10 rounded-sm opacity-40"></div>
                <div className="bg-bullish w-2 h-12 rounded-sm opacity-40"></div>
                <div className="bg-bullish w-2 h-16 rounded-sm opacity-60"></div>
                <div className="bg-bullish w-2 h-11 rounded-sm opacity-40"></div>
                <div className="bg-bearish w-2 h-5 rounded-sm opacity-40"></div>
                <div className="bg-bullish w-2 h-9 rounded-sm opacity-40"></div>
              </div>
            )}

            {/* Price Labels */}
            <div className="absolute right-0 top-0 space-y-8 text-xs font-mono text-trading-muted">
              <div>$68,500</div>
              <div>$68,000</div>
              <div>$67,500</div>
              <div className="text-bullish">$67,245</div>
              <div>$67,000</div>
              <div>$66,500</div>
            </div>

            {/* Time Labels */}
            <div className="absolute bottom-0 left-0 right-8 flex justify-between text-xs font-mono text-trading-muted">
              <span>10:00</span>
              <span>10:15</span>
              <span>10:30</span>
              <span>10:45</span>
              <span>11:00</span>
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
