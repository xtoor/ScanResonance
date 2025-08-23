import { 
  type BreakoutConfiguration, 
  type InsertBreakoutConfiguration,
  type BreakoutAlert,
  type InsertBreakoutAlert,
  type PineScriptCode,
  type InsertPineScriptCode
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Configuration management
  getConfiguration(id: string): Promise<BreakoutConfiguration | undefined>;
  getAllConfigurations(): Promise<BreakoutConfiguration[]>;
  createConfiguration(config: InsertBreakoutConfiguration): Promise<BreakoutConfiguration>;
  updateConfiguration(id: string, config: Partial<InsertBreakoutConfiguration>): Promise<BreakoutConfiguration>;
  deleteConfiguration(id: string): Promise<boolean>;

  // Alert management
  getAlert(id: string): Promise<BreakoutAlert | undefined>;
  getRecentAlerts(limit?: number): Promise<BreakoutAlert[]>;
  createAlert(alert: InsertBreakoutAlert): Promise<BreakoutAlert>;
  markAlertProcessed(id: string): Promise<boolean>;

  // Pine Script code management
  getPineScriptCode(configurationId: string): Promise<PineScriptCode | undefined>;
  savePineScriptCode(code: InsertPineScriptCode): Promise<PineScriptCode>;
}

export class MemStorage implements IStorage {
  private configurations: Map<string, BreakoutConfiguration>;
  private alerts: Map<string, BreakoutAlert>;
  private pineScriptCodes: Map<string, PineScriptCode>;

  constructor() {
    this.configurations = new Map();
    this.alerts = new Map();
    this.pineScriptCodes = new Map();

    // Initialize with default configuration
    const defaultConfig: BreakoutConfiguration = {
      id: randomUUID(),
      name: "Default Fast Scan",
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
      alertTemplate: "🚨 BREAKOUT: {{symbol}} at ${{price}} | +{{change}}% | Vol: {{volume}}x",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.configurations.set(defaultConfig.id, defaultConfig);
  }

  async getConfiguration(id: string): Promise<BreakoutConfiguration | undefined> {
    return this.configurations.get(id);
  }

  async getAllConfigurations(): Promise<BreakoutConfiguration[]> {
    return Array.from(this.configurations.values());
  }

  async createConfiguration(insertConfig: InsertBreakoutConfiguration): Promise<BreakoutConfiguration> {
    const id = randomUUID();
    const now = new Date();
    const config: BreakoutConfiguration = { 
      ...insertConfig, 
      id, 
      createdAt: now,
      updatedAt: now
    };
    this.configurations.set(id, config);
    return config;
  }

  async updateConfiguration(id: string, updates: Partial<InsertBreakoutConfiguration>): Promise<BreakoutConfiguration> {
    const existing = this.configurations.get(id);
    if (!existing) {
      throw new Error(`Configuration with id ${id} not found`);
    }
    
    const updated: BreakoutConfiguration = {
      ...existing,
      ...updates,
      updatedAt: new Date()
    };
    this.configurations.set(id, updated);
    return updated;
  }

  async deleteConfiguration(id: string): Promise<boolean> {
    return this.configurations.delete(id);
  }

  async getAlert(id: string): Promise<BreakoutAlert | undefined> {
    return this.alerts.get(id);
  }

  async getRecentAlerts(limit: number = 50): Promise<BreakoutAlert[]> {
    const alerts = Array.from(this.alerts.values());
    return alerts
      .sort((a, b) => (b.alertTime?.getTime() || 0) - (a.alertTime?.getTime() || 0))
      .slice(0, limit);
  }

  async createAlert(insertAlert: InsertBreakoutAlert): Promise<BreakoutAlert> {
    const id = randomUUID();
    const alert: BreakoutAlert = { 
      ...insertAlert, 
      id,
      alertTime: new Date(),
      processed: false
    };
    this.alerts.set(id, alert);
    return alert;
  }

  async markAlertProcessed(id: string): Promise<boolean> {
    const alert = this.alerts.get(id);
    if (!alert) return false;
    
    alert.processed = true;
    this.alerts.set(id, alert);
    return true;
  }

  async getPineScriptCode(configurationId: string): Promise<PineScriptCode | undefined> {
    return Array.from(this.pineScriptCodes.values())
      .find(code => code.configurationId === configurationId);
  }

  async savePineScriptCode(insertCode: InsertPineScriptCode): Promise<PineScriptCode> {
    const id = randomUUID();
    const code: PineScriptCode = { 
      ...insertCode, 
      id,
      generatedAt: new Date()
    };
    this.pineScriptCodes.set(id, code);
    return code;
  }
}

export const storage = new MemStorage();
