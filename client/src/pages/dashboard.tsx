import { useState, useEffect } from "react";
import TradingViewHeader from "@/components/TradingViewHeader";
import ConfigurationPanel from "@/components/ConfigurationPanel";
import MainChartArea from "@/components/MainChartArea";
import FloatingActionButton from "@/components/FloatingActionButton";
import StatusIndicator from "@/components/StatusIndicator";
import type { BreakoutConfiguration } from "@shared/schema";
import { scannerService, type BreakoutResult, type ScanStats } from "@/lib/scannerService";
import { alertService } from "@/lib/alertService";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const [isScanning, setIsScanning] = useState(false);
  const [scanStats, setScanStats] = useState<ScanStats>({
    totalScanned: 0,
    breakoutsDetected: 0,
    currentPair: '',
    lastScanTime: new Date()
  });
  const { toast } = useToast();
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

  const handleStartScanning = async () => {
    try {
      const fullConfig: BreakoutConfiguration = {
        id: 'temp',
        name: 'Live Scanner',
        ...configuration,
        createdAt: new Date(),
        updatedAt: new Date()
      } as BreakoutConfiguration;
      
      // Update alert service with configuration
      alertService.updateConfig({
        discordWebhook: (fullConfig as any).discordWebhook,
        soundEnabled: fullConfig.soundAlerts,
        emailEnabled: fullConfig.emailAlerts,
        template: fullConfig.alertTemplate
      });
      
      await scannerService.startScanning(fullConfig);
      setIsScanning(true);
      
      toast({
        title: "Scanner Started",
        description: `Scanning ${fullConfig.scanMode?.toUpperCase()} mode across 330+ crypto pairs`
      });
    } catch (error) {
      console.error('Failed to start scanner:', error);
      toast({
        title: "Scanner Error", 
        description: "Failed to start the scanner",
        variant: "destructive"
      });
    }
  };

  const handleStopScanning = () => {
    scannerService.stopScanning();
    setIsScanning(false);
    toast({
      title: "Scanner Stopped",
      description: "Breakout scanner has been stopped"
    });
  };

  const handleConfigurationChange = (updates: Partial<BreakoutConfiguration>) => {
    setConfiguration(prev => ({ ...prev, ...updates }));
  };

  useEffect(() => {
    // Subscribe to breakout alerts
    const unsubscribeBreakout = scannerService.onBreakoutDetected(async (result: BreakoutResult) => {
      if (result.details) {
        // Send comprehensive alerts
        await alertService.sendBreakoutAlert(result);
        
        // Show toast notification
        toast({
          title: "🚨 BREAKOUT DETECTED!",
          description: `${result.symbol}: $${result.details.price.toFixed(8)} (+${result.details.percentChange.toFixed(2)}%) | ${result.details.modes.join(', ')}`
        });
      }
    });

    // Subscribe to scan stats
    const unsubscribeStats = scannerService.onStatsUpdate((stats: ScanStats) => {
      setScanStats(stats);
    });

    // Set initial scanner state
    setIsScanning(scannerService.isScanning());
    setScanStats(scannerService.getStats());

    return () => {
      unsubscribeBreakout();
      unsubscribeStats();
    };
  }, [toast]);

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
          currentPair={scanStats.currentPair}
        />
      </div>

      <FloatingActionButton />
      <StatusIndicator 
        isScanning={isScanning} 
        scanCount={scanStats.totalScanned}
        breakoutCount={scanStats.breakoutsDetected}
        currentPair={scanStats.currentPair}
      />
    </div>
  );
}
