import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Gauge, Sliders, Bell, Palette, TrendingUp } from "lucide-react";
import TopCoinsPanel from "@/components/TopCoinsPanel";
import type { BreakoutConfiguration } from "@shared/schema";

interface ConfigurationPanelProps {
  configuration: Partial<BreakoutConfiguration>;
  onConfigurationChange: (updates: Partial<BreakoutConfiguration>) => void;
}

export default function ConfigurationPanel({ 
  configuration, 
  onConfigurationChange 
}: ConfigurationPanelProps) {
  
  const handleInputChange = (field: keyof BreakoutConfiguration, value: any) => {
    onConfigurationChange({ [field]: value });
  };

  return (
    <aside className="w-80 bg-trading-dark border-r border-trading-border overflow-y-auto ml-[103px] mr-[103px]">
      <div className="p-4 space-y-6 ml-[-30px] mr-[-30px]">
        {/* Scanning Modes */}
        <Card className="bg-trading-card border-trading-border">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold flex items-center">
              <Gauge className="mr-2 text-bullish w-5 h-5" />
              Scanning Modes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup 
              value={configuration.scanMode || "fast"}
              onValueChange={(value) => handleInputChange("scanMode", value)}
              data-testid="radio-group-scan-mode"
            >
              <div className="space-y-3">
                <Label className="flex items-center space-x-3 cursor-pointer hover:bg-trading-darker p-2 rounded transition-colors">
                  <RadioGroupItem value="fast" className="text-bullish" data-testid="radio-fast" />
                  <div>
                    <div className="font-medium">Fast Mode</div>
                    <div className="text-xs text-trading-muted">10 candles, 1.3% threshold</div>
                  </div>
                </Label>
                <Label className="flex items-center space-x-3 cursor-pointer hover:bg-trading-darker p-2 rounded transition-colors">
                  <RadioGroupItem value="medium" className="text-bullish" data-testid="radio-medium" />
                  <div>
                    <div className="font-medium">Medium Mode</div>
                    <div className="text-xs text-trading-muted">15 candles, 1.8% threshold</div>
                  </div>
                </Label>
                <Label className="flex items-center space-x-3 cursor-pointer hover:bg-trading-darker p-2 rounded transition-colors">
                  <RadioGroupItem value="slow" className="text-bullish" data-testid="radio-slow" />
                  <div>
                    <div className="font-medium">Slow Mode</div>
                    <div className="text-xs text-trading-muted">20 candles, 2.4% threshold</div>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Breakout Parameters */}
        <Card className="bg-trading-card border-trading-border">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold flex items-center">
              <Sliders className="mr-2 text-bullish w-5 h-5" />
              Breakout Parameters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="block text-sm font-medium mb-2">Breakout Threshold (%)</Label>
              <Input
                type="number"
                step="0.001"
                value={configuration.breakoutThreshold || 1.3}
                onChange={(e) => handleInputChange("breakoutThreshold", parseFloat(e.target.value))}
                className="w-full bg-trading-darker border-trading-border text-trading-text font-mono"
                data-testid="input-breakout-threshold"
              />
              <div className="text-xs text-trading-muted mt-1">Price must break above previous high by this %</div>
            </div>
            
            <div>
              <Label className="block text-sm font-medium mb-2">Volume Spike Ratio</Label>
              <Input
                type="number"
                step="0.1"
                value={configuration.volumeSpikeRatio || 1.3}
                onChange={(e) => handleInputChange("volumeSpikeRatio", parseFloat(e.target.value))}
                className="w-full bg-trading-darker border-trading-border text-trading-text font-mono"
                data-testid="input-volume-spike-ratio"
              />
              <div className="text-xs text-trading-muted mt-1">Volume must exceed average by this multiple</div>
            </div>
            
            <div>
              <Label className="block text-sm font-medium mb-2">Lookback Candles</Label>
              <Input
                type="number"
                min="5"
                max="50"
                value={configuration.lookbackCandles || 10}
                onChange={(e) => handleInputChange("lookbackCandles", parseInt(e.target.value))}
                className="w-full bg-trading-darker border-trading-border text-trading-text font-mono"
                data-testid="input-lookback-candles"
              />
              <div className="text-xs text-trading-muted mt-1">Number of candles to analyze for breakout</div>
            </div>
            
            <div>
              <Label className="block text-sm font-medium mb-2">Min Volume (USD/min)</Label>
              <Input
                type="number"
                step="100"
                value={configuration.minVolumeUsd || 2000}
                onChange={(e) => handleInputChange("minVolumeUsd", parseFloat(e.target.value))}
                className="w-full bg-trading-darker border-trading-border text-trading-text font-mono"
                data-testid="input-min-volume-usd"
              />
              <div className="text-xs text-trading-muted mt-1">Minimum dollar volume per minute</div>
            </div>
          </CardContent>
        </Card>

        {/* Alert Configuration */}
        <Card className="bg-trading-card border-trading-border">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold flex items-center">
              <Bell className="mr-2 text-warning w-5 h-5" />
              Alert Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Enable Alerts</Label>
              <Switch
                checked={configuration.alertsEnabled || false}
                onCheckedChange={(checked) => handleInputChange("alertsEnabled", checked)}
                data-testid="switch-alerts-enabled"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Sound Alerts</Label>
              <Switch
                checked={configuration.soundAlerts || false}
                onCheckedChange={(checked) => handleInputChange("soundAlerts", checked)}
                data-testid="switch-sound-alerts"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Email Notifications</Label>
              <Switch
                checked={configuration.emailAlerts || false}
                onCheckedChange={(checked) => handleInputChange("emailAlerts", checked)}
                data-testid="switch-email-alerts"
              />
            </div>


            <div>
              <Label className="block text-sm font-medium mb-2">Alert Message Template</Label>
              <Textarea
                rows={3}
                value={configuration.alertTemplate || ""}
                onChange={(e) => handleInputChange("alertTemplate", e.target.value)}
                className="w-full bg-trading-darker border-trading-border text-trading-text text-sm resize-none"
                placeholder="🚨 BREAKOUT: {{symbol}} at ${{price}} | +{{change}}% | Vol: {{volume}}x"
                data-testid="textarea-alert-template"
              />
              <div className="text-xs text-trading-muted mt-1">Variables: symbol, price, change, volume, modes, bandWidth (use with double braces)</div>
            </div>
          </CardContent>
        </Card>

        {/* Visual Settings */}
        <Card className="bg-trading-card border-trading-border">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold flex items-center">
              <Palette className="mr-2 text-bullish w-5 h-5" />
              Visual Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="block text-sm font-medium mb-2">Breakout Signal Color</Label>
              <div className="flex space-x-2">
                <Input
                  type="color"
                  value={configuration.breakoutColor || "#00C853"}
                  onChange={(e) => handleInputChange("breakoutColor", e.target.value)}
                  className="w-12 h-8 rounded border border-trading-border"
                  data-testid="input-breakout-color"
                />
                <span className="text-sm text-trading-muted self-center">Confirmed Breakouts</span>
              </div>
            </div>
            
            <div>
              <Label className="block text-sm font-medium mb-2">Potential Signal Color</Label>
              <div className="flex space-x-2">
                <Input
                  type="color"
                  value={configuration.potentialColor || "#FF9800"}
                  onChange={(e) => handleInputChange("potentialColor", e.target.value)}
                  className="w-12 h-8 rounded border border-trading-border"
                  data-testid="input-potential-color"
                />
                <span className="text-sm text-trading-muted self-center">Potential Breakouts</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Show Volume Histogram</Label>
              <Switch
                checked={configuration.showVolumeHistogram || false}
                onCheckedChange={(checked) => handleInputChange("showVolumeHistogram", checked)}
                data-testid="switch-show-volume-histogram"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Show Labels</Label>
              <Switch
                checked={configuration.showLabels || false}
                onCheckedChange={(checked) => handleInputChange("showLabels", checked)}
                data-testid="switch-show-labels"
              />
            </div>
          </CardContent>
        </Card>

        {/* Top Coins Section */}
        <Separator className="bg-trading-border" />
        
        <TopCoinsPanel 
          onCoinsSelected={(coinIds) => {
            console.log(`🎯 Selected ${coinIds.length} top performing coins:`, coinIds.slice(0, 10));
            // You can integrate this into the scanner by modifying the CRYPTO_PAIRS or 
            // adding a configuration option to use dynamic top coins
          }}
        />
      </div>
    </aside>
  );
}
