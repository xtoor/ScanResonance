import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTopCoins, useTopCoinIds, useRefreshTopCoins } from "@/lib/topCoinsService";
import { RefreshCw, TrendingUp, DollarSign, BarChart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TopCoinsPanelProps {
  onCoinsSelected?: (coinIds: string[]) => void;
  className?: string;
}

export default function TopCoinsPanel({ onCoinsSelected, className }: TopCoinsPanelProps) {
  const [limit, setLimit] = useState(50);
  const [showFullData, setShowFullData] = useState(false);
  const [refreshConfig, setRefreshConfig] = useState({
    topN: 50,
    minUsdPerMin: 2000,
    maxSpreadPct: 0.005
  });

  const { toast } = useToast();

  // Queries
  const { data: topCoinsData, isLoading: coinsLoading, error: coinsError } = useTopCoins(limit);
  const { data: topIdsData, isLoading: idsLoading } = useTopCoinIds(limit);
  const refreshMutation = useRefreshTopCoins();

  const handleRefresh = async () => {
    try {
      await refreshMutation.mutateAsync(refreshConfig);
      toast({
        title: "Top Coins Refreshed",
        description: `Updated top ${refreshConfig.topN} coins based on latest market data`
      });
    } catch (error) {
      toast({
        title: "Refresh Failed",
        description: "Failed to refresh top coins data",
        variant: "destructive"
      });
    }
  };

  const handleUseTopCoins = () => {
    if (topIdsData?.coinIds && onCoinsSelected) {
      onCoinsSelected(topIdsData.coinIds);
      toast({
        title: "Top Coins Applied",
        description: `Now using top ${topIdsData.coinIds.length} performing coins for scanning`
      });
    }
  };

  if (coinsError) {
    return (
      <Card className={`bg-trading-dark border-trading-border ${className || ''}`}>
        <CardHeader>
          <CardTitle className="text-trading-text">Top Coins Fetcher</CardTitle>
          <CardDescription className="text-trading-muted">
            Error loading top coins data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-red-400">
            Failed to load top coins: {coinsError.message}
          </div>
          <Button 
            onClick={handleRefresh} 
            variant="outline" 
            className="mt-4"
            disabled={refreshMutation.isPending}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`bg-trading-dark border-trading-border ${className || ''}`}>
      <CardHeader>
        <CardTitle className="text-trading-text flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Top Coins Fetcher
        </CardTitle>
        <CardDescription className="text-trading-muted">
          Dynamic top-performing cryptocurrency pairs based on volatility and liquidity
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Configuration Controls */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="limit" className="text-sm text-trading-muted">
                Number of Coins
              </Label>
              <Input
                id="limit"
                type="number"
                value={limit}
                onChange={(e) => setLimit(parseInt(e.target.value) || 50)}
                min={10}
                max={100}
                className="bg-trading-darker border-trading-border text-trading-text"
                data-testid="input-coin-limit"
              />
            </div>
            <div>
              <Label htmlFor="minVolume" className="text-sm text-trading-muted">
                Min Volume (USD/min)
              </Label>
              <Input
                id="minVolume"
                type="number"
                value={refreshConfig.minUsdPerMin}
                onChange={(e) => setRefreshConfig(prev => ({
                  ...prev,
                  minUsdPerMin: parseInt(e.target.value) || 2000
                }))}
                className="bg-trading-darker border-trading-border text-trading-text"
                data-testid="input-min-volume"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={handleRefresh}
              disabled={refreshMutation.isPending}
              className="flex-1"
              data-testid="button-refresh-coins"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshMutation.isPending ? 'animate-spin' : ''}`} />
              {refreshMutation.isPending ? 'Refreshing...' : 'Refresh Top Coins'}
            </Button>
            
            {onCoinsSelected && topIdsData && (
              <Button 
                onClick={handleUseTopCoins}
                variant="outline"
                disabled={idsLoading}
                data-testid="button-use-top-coins"
              >
                Use Top Coins
              </Button>
            )}
          </div>
        </div>

        <Separator className="bg-trading-border" />

        {/* Results Display */}
        <div className="space-y-4">
          {/* Summary */}
          {topIdsData && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-trading-muted">
                Found {topIdsData.count} top coins
              </span>
              <Badge variant="outline" className="text-trading-text">
                Updated: {new Date(topIdsData.timestamp).toLocaleTimeString()}
              </Badge>
            </div>
          )}

          {/* Quick Preview */}
          {topIdsData && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm text-trading-muted">
                  Top 10 Preview:
                </Label>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowFullData(!showFullData)}
                  data-testid="toggle-full-data"
                >
                  {showFullData ? 'Show Less' : 'Show Details'}
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-1">
                {topIdsData.coinIds.slice(0, 10).map((coin) => (
                  <Badge 
                    key={coin} 
                    variant="secondary" 
                    className="text-xs bg-trading-darker text-trading-text"
                  >
                    {coin}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Detailed View */}
          {showFullData && topCoinsData && (
            <ScrollArea className="h-64 w-full">
              <div className="space-y-2" data-testid="detailed-coins-list">
                {topCoinsData.coins.map((coin, index) => (
                  <div 
                    key={coin.product_id}
                    className="flex items-center justify-between p-2 bg-trading-darker rounded border border-trading-border"
                  >
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="w-8 text-center">
                        {index + 1}
                      </Badge>
                      <span className="font-mono text-sm text-trading-text">
                        {coin.product_id}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-xs text-trading-muted">
                      {coin.metrics && (
                        <>
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-3 h-3" />
                            <span>${coin.metrics.avg_usd_per_min.toFixed(0)}/min</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <BarChart className="w-3 h-3" />
                            <span>{coin.score.toFixed(2)}</span>
                          </div>
                        </>
                      )}
                      {coin.spread && (
                        <span>{(coin.spread * 100).toFixed(3)}% spread</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}

          {/* Loading State */}
          {(coinsLoading || idsLoading) && (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center gap-2 text-trading-muted">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Loading top coins...</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}