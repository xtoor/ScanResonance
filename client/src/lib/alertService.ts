import type { BreakoutResult } from './scannerService';

export interface AlertConfig {
  discordWebhook?: string;
  emailEnabled?: boolean;
  soundEnabled?: boolean;
  template?: string;
}

export class AlertService {
  private config: AlertConfig = {
    soundEnabled: true,
    emailEnabled: false,
    template: "🚨 BREAKOUT: {{symbol}} at ${{price}} | +{{change}}% | Vol: {{volume}}x"
  };

  updateConfig(newConfig: Partial<AlertConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  async sendBreakoutAlert(result: BreakoutResult): Promise<void> {
    if (!result.details) return;

    const message = this.formatAlertMessage(result);
    
    // Send to various channels
    const promises: Promise<void>[] = [];

    if (this.config.discordWebhook) {
      promises.push(this.sendDiscordAlert(message, result));
    }

    if (this.config.soundEnabled) {
      promises.push(this.playAlertSound());
    }

    // Execute all alerts concurrently
    await Promise.allSettled(promises);
  }

  private formatAlertMessage(result: BreakoutResult): string {
    if (!result.details) return '';

    const template = this.config.template || 
      "🚨 BREAKOUT: {{symbol}} at ${{price}} | +{{change}}% | Vol: {{volume}}x";

    return template
      .replace('{{symbol}}', result.symbol)
      .replace('{{price}}', result.details.price.toFixed(8))
      .replace('{{change}}', result.details.percentChange.toFixed(2))
      .replace('{{volume}}', result.details.volumeRatio.toFixed(1))
      .replace('{{modes}}', result.details.modes.join(', '))
      .replace('{{bandWidth}}', result.details.bandWidth.toFixed(2));
  }

  private async sendDiscordAlert(message: string, result: BreakoutResult): Promise<void> {
    if (!this.config.discordWebhook || !result.details) return;

    try {
      const richMessage = this.buildRichDiscordMessage(result, message);
      
      await fetch(this.config.discordWebhook, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          content: richMessage,
          username: 'Resonance.ai Scanner',
          avatar_url: 'https://i.imgur.com/4M34hi2.png'
        })
      });
    } catch (error) {
      console.error('Failed to send Discord alert:', error);
    }
  }

  private buildRichDiscordMessage(result: BreakoutResult, basicMessage: string): string {
    if (!result.details) return basicMessage;

    const lines = [
      "🚨 **BREAKOUT DETECTED** 🚨",
      `**Pair**: \`${result.symbol}\``,
      `**Price**: \`$${result.details.price.toFixed(8)}\``,
      `**Δ**: \`${result.details.percentChange.toFixed(2)}%\`  |  **W**: \`${result.details.bandWidth.toFixed(2)}%\``,
      `**Volume**: \`${result.details.volumeRatio.toFixed(1)}x\` (\`$${(result.details.dollarVolume / 1000).toFixed(0)}K/min\`)`,
      `**Modes**: ${result.details.modes.map(m => `\`${m}\``).join(', ')}`,
      `**Time**: ${new Date().toLocaleTimeString('en-US', { timeZone: 'UTC', hour12: false })} UTC`
    ];

    return lines.join('\n');
  }

  private async playAlertSound(): Promise<void> {
    try {
      // Create audio context and play alert tone
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Create a sequence of tones for the alert
      await this.playTone(audioContext, 800, 0.1);
      await this.sleep(50);
      await this.playTone(audioContext, 1000, 0.1);
      await this.sleep(50);
      await this.playTone(audioContext, 1200, 0.2);
      
      audioContext.close();
    } catch (error) {
      console.warn('Failed to play alert sound:', error);
    }
  }

  private playTone(audioContext: AudioContext, frequency: number, duration: number): Promise<void> {
    return new Promise((resolve) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration);

      oscillator.onended = () => resolve();
    });
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const alertService = new AlertService();