import { Card } from "@/components/ui/card";

interface StatusIndicatorProps {
  isScanning: boolean;
  scanCount: number;
}

export default function StatusIndicator({ isScanning, scanCount }: StatusIndicatorProps) {
  return (
    <Card className="fixed top-20 right-6 bg-trading-card border-trading-border rounded-lg p-3 shadow-lg">
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
        <span className="text-xs text-trading-muted font-mono" data-testid="scan-count">
          {scanCount} pairs
        </span>
      </div>
    </Card>
  );
}
