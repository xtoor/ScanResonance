import { Card } from "@/components/ui/card";

interface StatusIndicatorProps {
  isScanning: boolean;
  scanCount: number;
  breakoutCount?: number;
  currentPair?: string;
}

export default function StatusIndicator({ isScanning, scanCount, breakoutCount = 0, currentPair }: StatusIndicatorProps) {
  return (
    <Card className="fixed top-20 left-1/2 -translate-x-1/2 bg-trading-card border-trading-border rounded-lg p-3 shadow-lg z-50 ml-[234px] mr-[234px]">
      <div className="flex items-center space-x-2">
        <div 
          className={`w-2 h-2 rounded-full ${
            isScanning ? 'bg-bullish animate-pulse' : 'bg-trading-muted'
          }`}
          data-testid="status-indicator-dot"
        />
        <span className="text-sm font-medium" data-testid="status-text">
          {isScanning ? 'Scanning Active' : 'Scanning Inactive'}
        </span>
        <div className="text-xs text-trading-muted font-mono space-y-1" data-testid="scan-stats">
          <div>{scanCount} scanned | {breakoutCount} breakouts</div>
          {currentPair && isScanning && (
            <div className="text-bullish">→ {currentPair}</div>
          )}
        </div>
      </div>
    </Card>
  );
}
