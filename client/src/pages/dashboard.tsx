import { useState } from "react";
import TradingViewHeader from "@/components/TradingViewHeader";
import ConfigurationPanel from "@/components/ConfigurationPanel";
import MainChartArea from "@/components/MainChartArea";
import FloatingActionButton from "@/components/FloatingActionButton";
import StatusIndicator from "@/components/StatusIndicator";
import type { BreakoutConfiguration } from "@shared/schema";

export default function Dashboard() {
  const [isScanning, setIsScanning] = useState(false);
  const [selectedSymbol, setSelectedSymbol] = useState("BTC-USD");
  const [timeframe, setTimeframe] = useState("1m");
  const [configuration, setConfiguration] = useState<Partial<BreakoutConfiguration>>({
    scanMode: "fast",
    breakoutThreshold: 1.3,
    volumeSpikeRatio: 1.3,
    lookbackCandles: 10,
    minVolumeUsd: 2000,
    alertsEnabled: true,
    soundAlerts: true,
    emailAlerts: false,
    breakoutColor: "#00C853",
    potentialColor: "#FF9800",
    showVolumeHistogram: true,
    showLabels: true,
    alertTemplate: "🚨 BREAKOUT: {{symbol}} at ${{price}} | +{{change}}% | Vol: {{volume}}x"
  });

  const handleStartScanning = () => {
    setIsScanning(true);
  };

  const handleStopScanning = () => {
    setIsScanning(false);
  };

  const handleConfigurationChange = (updates: Partial<BreakoutConfiguration>) => {
    setConfiguration(prev => ({ ...prev, ...updates }));
  };

  return (
    <div className="bg-trading-darker text-trading-text font-sans min-h-screen">
      <TradingViewHeader isConnected={true} />
      
      <div className="flex h-screen">
        <ConfigurationPanel 
          configuration={configuration}
          onConfigurationChange={handleConfigurationChange}
        />
        
        <MainChartArea
          selectedSymbol={selectedSymbol}
          onSymbolChange={setSelectedSymbol}
          timeframe={timeframe}
          onTimeframeChange={setTimeframe}
          isScanning={isScanning}
          onStartScanning={handleStartScanning}
          onStopScanning={handleStopScanning}
          configuration={configuration}
        />
      </div>

      <FloatingActionButton />
      <StatusIndicator isScanning={isScanning} scanCount={247} />
    </div>
  );
}
