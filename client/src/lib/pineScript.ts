import type { BreakoutConfiguration } from "@shared/schema";

export function generatePineScript(config: BreakoutConfiguration): string {
  const {
    scanMode,
    breakoutThreshold,
    volumeSpikeRatio,
    lookbackCandles,
    minVolumeUsd,
    breakoutColor,
    potentialColor,
    showVolumeHistogram,
    showLabels
  } = config;

  // Determine candle count and thresholds based on scan mode
  let candleCount: number;
  let modeThreshold: number;
  let modeVolumeRatio: number;

  switch (scanMode) {
    case 'fast':
      candleCount = 10;
      modeThreshold = 0.013;
      modeVolumeRatio = 1.3;
      break;
    case 'medium':
      candleCount = 15;
      modeThreshold = 0.018;
      modeVolumeRatio = 1.7;
      break;
    case 'slow':
      candleCount = 20;
      modeThreshold = 0.024;
      modeVolumeRatio = 2.2;
      break;
    default:
      candleCount = lookbackCandles;
      modeThreshold = breakoutThreshold / 100;
      modeVolumeRatio = volumeSpikeRatio;
  }

  return `// This source code is subject to the terms of the Mozilla Public License 2.0 at https://mozilla.org/MPL/2.0/
// © ResonanceAI

//@version=5
indicator("Resonance.ai Breakout Scanner v12.5", overlay=true, max_bars_back=500)

// ===== INPUT PARAMETERS =====
// Scanning mode configuration
scanMode = input.string("${scanMode}", "Scan Mode", options=["fast", "medium", "slow"])
customThreshold = input.float(${breakoutThreshold}, "Custom Breakout Threshold (%)", minval=0.1, maxval=10.0, step=0.1) / 100
customVolumeRatio = input.float(${volumeSpikeRatio}, "Custom Volume Spike Ratio", minval=1.0, maxval=5.0, step=0.1)
lookbackPeriod = input.int(${lookbackCandles}, "Lookback Candles", minval=5, maxval=50)
minVolumeDollar = input.float(${minVolumeUsd}, "Min Volume (USD/min)", minval=100, maxval=100000, step=100)

// Visual settings
breakoutCol = input.color(${breakoutColor}, "Breakout Signal Color")
potentialCol = input.color(${potentialColor}, "Potential Signal Color")
showVolume = input.bool(${showVolumeHistogram}, "Show Volume Histogram")
showSignalLabels = input.bool(${showLabels}, "Show Signal Labels")

// Alert settings
enableAlerts = input.bool(true, "Enable Alerts")

// ===== MODE CONFIGURATION =====
// Set parameters based on scan mode
candleCount = scanMode == "fast" ? 10 : scanMode == "medium" ? 15 : 20
breakoutThreshold = scanMode == "fast" ? 0.013 : scanMode == "medium" ? 0.018 : scanMode == "slow" ? 0.024 : customThreshold
volumeThreshold = scanMode == "fast" ? 1.3 : scanMode == "medium" ? 1.7 : scanMode == "slow" ? 2.2 : customVolumeRatio

// Use custom values if in custom mode
finalCandleCount = scanMode == "custom" ? lookbackPeriod : candleCount
finalBreakoutThreshold = scanMode == "custom" ? customThreshold : breakoutThreshold
finalVolumeThreshold = scanMode == "custom" ? customVolumeRatio : volumeThreshold

// ===== CORE BREAKOUT LOGIC =====
// Calculate price metrics
priceRange = ta.highest(high, finalCandleCount) - ta.lowest(low, finalCandleCount)
bandWidth = (priceRange / close) * 100

// Volume analysis
avgVolume = ta.sma(volume, finalCandleCount)
currentVolume = volume
volumeRatio = currentVolume / avgVolume
dollarVolume = currentVolume * close

// Breakout detection
maxHighExcludingCurrent = ta.highest(high[1], finalCandleCount - 1)
currentClose = close
priceBreakout = currentClose > maxHighExcludingCurrent * (1 + finalBreakoutThreshold)
volumeBreakout = volumeRatio > finalVolumeThreshold
dollarVolumeCheck = dollarVolume >= minVolumeDollar

// Signal classification
confirmedBreakout = priceBreakout and volumeBreakout and dollarVolumeCheck
potentialBreakout = priceBreakout and (volumeRatio > (finalVolumeThreshold * 0.7)) and dollarVolumeCheck

// ===== PERCENT CHANGE CALCULATION =====
startPrice = close[finalCandleCount - 1]
endPrice = close
percentChange = ((endPrice - startPrice) / startPrice) * 100

// ===== VISUALIZATION =====
// Plot breakout signals
plotshape(
    confirmedBreakout and showSignalLabels, 
    title="Confirmed Breakout", 
    location=location.belowbar, 
    color=breakoutCol, 
    style=shape.triangleup, 
    size=size.normal,
    text="🚨"
)

plotshape(
    potentialBreakout and not confirmedBreakout and showSignalLabels, 
    title="Potential Breakout", 
    location=location.belowbar, 
    color=potentialCol, 
    style=shape.triangleup, 
    size=size.small,
    text="⚠️"
)

// Volume histogram overlay
volumeColor = volume > avgVolume * 1.5 ? breakoutCol : volume > avgVolume ? potentialCol : color.gray
plot(showVolume ? volume : na, title="Volume", color=volumeColor, style=plot.style_histogram, transp=70)

// Background highlighting for breakouts
bgcolor(confirmedBreakout ? color.new(breakoutCol, 90) : na, title="Breakout Background")

// ===== DATA TABLE =====
// Display key metrics
var table infoTable = table.new(position.top_right, 3, 6, bgcolor=color.white, border_width=1)

if barstate.islast and showSignalLabels
    table.cell(infoTable, 0, 0, "Metric", text_color=color.black, bgcolor=color.gray)
    table.cell(infoTable, 1, 0, "Value", text_color=color.black, bgcolor=color.gray)
    table.cell(infoTable, 2, 0, "Status", text_color=color.black, bgcolor=color.gray)
    
    table.cell(infoTable, 0, 1, "Δ (Change %)", text_color=color.black)
    table.cell(infoTable, 1, 1, str.tostring(percentChange, "#.##") + "%", text_color=percentChange > 0 ? color.green : color.red)
    table.cell(infoTable, 2, 1, percentChange > 2 ? "Strong" : percentChange > 0 ? "Positive" : "Negative", text_color=color.black)
    
    table.cell(infoTable, 0, 2, "W (Band Width)", text_color=color.black)
    table.cell(infoTable, 1, 2, str.tostring(bandWidth, "#.##") + "%", text_color=color.blue)
    table.cell(infoTable, 2, 2, bandWidth > 3 ? "High Vol" : bandWidth > 1.5 ? "Medium" : "Low", text_color=color.black)
    
    table.cell(infoTable, 0, 3, "Volume Ratio", text_color=color.black)
    table.cell(infoTable, 1, 3, str.tostring(volumeRatio, "#.#") + "x", text_color=volumeRatio > 2 ? color.green : color.orange)
    table.cell(infoTable, 2, 3, volumeRatio > finalVolumeThreshold ? "✔ Pass" : "✘ Fail", text_color=color.black)
    
    table.cell(infoTable, 0, 4, "Dollar Volume", text_color=color.black)
    table.cell(infoTable, 1, 4, str.tostring(dollarVolume/1000, "#") + "K", text_color=color.purple)
    table.cell(infoTable, 2, 4, dollarVolumeCheck ? "✔ Pass" : "✘ Fail", text_color=color.black)
    
    table.cell(infoTable, 0, 5, "Scan Mode", text_color=color.black)
    table.cell(infoTable, 1, 5, str.upper(scanMode), text_color=color.black)
    table.cell(infoTable, 2, 5, str.tostring(finalCandleCount) + " bars", text_color=color.black)

// ===== ALERTS =====
if enableAlerts
    // Confirmed breakout alert
    if confirmedBreakout
        alert("🚨 CONFIRMED BREAKOUT: " + syminfo.ticker + " at $" + str.tostring(close, "#.########") + 
              " | Δ: +" + str.tostring(percentChange, "#.##") + "% | W: " + str.tostring(bandWidth, "#.##") + 
              "% | Vol: " + str.tostring(volumeRatio, "#.#") + "x | Mode: " + str.upper(scanMode), 
              alert.freq_once_per_bar)
    
    // Potential breakout alert
    if potentialBreakout and not confirmedBreakout
        alert("⚠️ POTENTIAL BREAKOUT: " + syminfo.ticker + " at $" + str.tostring(close, "#.########") + 
              " | Δ: +" + str.tostring(percentChange, "#.##") + "% | W: " + str.tostring(bandWidth, "#.##") + 
              "% | Vol: " + str.tostring(volumeRatio, "#.#") + "x | Mode: " + str.upper(scanMode), 
              alert.freq_once_per_bar)

// ===== STRATEGY NOTES =====
// This indicator replicates the Resonance.ai breakout scanner logic:
// 1. Analyzes price breakouts above recent highs with configurable thresholds
// 2. Confirms breakouts with volume spike analysis
// 3. Filters by minimum dollar volume to ensure liquidity
// 4. Provides multiple scanning modes (fast/medium/slow) for different trading styles
// 5. Calculates key metrics: Δ (percent change) and W (band width) for volatility assessment
//
// Signal Types:
// - Confirmed Breakout (🚨): Price + Volume + Dollar Volume all pass thresholds
// - Potential Breakout (⚠️): Price passes, volume partially passes thresholds
//
// Usage:
// - Fast Mode: Quick scalping opportunities (10 bars, 1.3% threshold)
// - Medium Mode: Balanced approach (15 bars, 1.8% threshold) 
// - Slow Mode: Conservative breakouts (20 bars, 2.4% threshold)
//
// The scanner works best on 1-minute timeframes for crypto pairs with high volume.`;
}

export function exportPineScript(config: BreakoutConfiguration): void {
  const pineScript = generatePineScript(config);
  const blob = new Blob([pineScript], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `resonance-breakout-scanner-${config.scanMode}.pine`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
