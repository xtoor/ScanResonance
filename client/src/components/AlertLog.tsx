import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { History, TrendingUp } from "lucide-react";
import type { BreakoutAlert } from "@shared/schema";

export default function AlertLog() {
  const { data: alerts = [], isLoading } = useQuery<BreakoutAlert[]>({
    queryKey: ["/api/alerts"],
    queryFn: async () => {
      const response = await fetch("/api/alerts?limit=10");
      if (!response.ok) throw new Error("Failed to fetch alerts");
      return response.json();
    },
    refetchInterval: 5000 // Refresh every 5 seconds
  });

  if (isLoading) {
    return (
      <div className="bg-trading-dark border-t border-trading-border p-4 h-48">
        <div className="flex items-center justify-center h-full">
          <div className="text-trading-muted">Loading alerts...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-trading-dark border-t border-trading-border p-4 h-48 overflow-y-auto pl-[16px] pr-[16px] ml-[0px] mr-[0px]">
      <h3 className="text-sm font-semibold mb-3 flex items-center">
        <History className="mr-2 text-warning w-4 h-4" />
        Recent Alerts
      </h3>
      <div className="space-y-2" data-testid="alert-list">
        {alerts.length === 0 ? (
          <div className="text-center text-trading-muted py-8">
            <History className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No alerts yet. Start scanning to see breakout alerts here.</p>
          </div>
        ) : (
          alerts.map((alert) => (
            <Card 
              key={alert.id} 
              className="flex items-center justify-between p-2 bg-trading-card border-trading-border text-sm"
              data-testid={`alert-${alert.id}`}
            >
              <div className="flex items-center space-x-3">
                <TrendingUp 
                  className={`w-4 h-4 ${
                    alert.percentChange > 2 ? 'text-bullish' : 'text-warning'
                  }`} 
                />
                <span className="font-mono font-semibold" data-testid={`alert-symbol-${alert.id}`}>
                  {alert.symbol}
                </span>
                <span className="text-trading-muted">
                  {alert.alertTime ? new Date(alert.alertTime).toLocaleTimeString() : ''}
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="font-mono" data-testid={`alert-price-${alert.id}`}>
                  ${alert.price.toFixed(8)}
                </span>
                <span 
                  className={`font-mono ${
                    alert.percentChange > 0 ? 'text-bullish' : 'text-bearish'
                  }`}
                  data-testid={`alert-change-${alert.id}`}
                >
                  {alert.percentChange > 0 ? '+' : ''}{alert.percentChange.toFixed(2)}%
                </span>
                <span 
                  className={`font-mono ${
                    alert.volumeRatio > 2 ? 'text-bullish' : 'text-warning'
                  }`}
                  data-testid={`alert-volume-${alert.id}`}
                >
                  {alert.volumeRatio.toFixed(1)}x vol
                </span>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
