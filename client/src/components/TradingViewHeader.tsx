import { Settings, Signal } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TradingViewHeaderProps {
  isConnected: boolean;
}

export default function TradingViewHeader({ isConnected }: TradingViewHeaderProps) {
  return (
    <header className="bg-trading-dark border-b border-trading-border px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Signal className="text-bullish text-xl" data-testid="logo-signal" />
            <h1 className="text-xl font-bold" data-testid="text-title">Resonance.ai Breakout Scanner</h1>
            <span className="bg-bullish text-trading-darker px-2 py-1 rounded text-xs font-mono" data-testid="text-version">
              v12.5
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm">
            <Signal className="text-bullish w-4 h-4" data-testid="status-signal" />
            <span data-testid="text-connection-status">
              {isConnected ? "Connected" : "Disconnected"}
            </span>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            className="p-2 hover:bg-trading-card rounded transition-colors"
            data-testid="button-settings"
          >
            <Settings className="text-trading-muted hover:text-trading-text w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
