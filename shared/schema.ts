import { sql } from "drizzle-orm";
import { pgTable, text, varchar, real, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const breakoutConfigurations = pgTable("breakout_configurations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  scanMode: text("scan_mode").notNull(), // 'fast', 'medium', 'slow'
  breakoutThreshold: real("breakout_threshold").notNull().default(1.3),
  volumeSpikeRatio: real("volume_spike_ratio").notNull().default(1.3),
  lookbackCandles: integer("lookback_candles").notNull().default(10),
  minVolumeUsd: real("min_volume_usd").notNull().default(2000),
  alertsEnabled: boolean("alerts_enabled").notNull().default(true),
  soundAlerts: boolean("sound_alerts").notNull().default(true),
  emailAlerts: boolean("email_alerts").notNull().default(false),
  breakoutColor: text("breakout_color").notNull().default("#00C853"),
  potentialColor: text("potential_color").notNull().default("#FF9800"),
  showVolumeHistogram: boolean("show_volume_histogram").notNull().default(true),
  showLabels: boolean("show_labels").notNull().default(true),
  alertTemplate: text("alert_template").notNull().default("🚨 BREAKOUT: {{symbol}} at ${{price}} | +{{change}}% | Vol: {{volume}}x"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const breakoutAlerts = pgTable("breakout_alerts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  symbol: text("symbol").notNull(),
  price: real("price").notNull(),
  percentChange: real("percent_change").notNull(),
  bandWidth: real("band_width").notNull(),
  volumeRatio: real("volume_ratio").notNull(),
  scanMode: text("scan_mode").notNull(),
  alertTime: timestamp("alert_time").defaultNow(),
  processed: boolean("processed").notNull().default(false)
});

export const pineScriptCode = pgTable("pine_script_code", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  configurationId: varchar("configuration_id").references(() => breakoutConfigurations.id),
  scriptCode: text("script_code").notNull(),
  version: text("version").notNull(),
  generatedAt: timestamp("generated_at").defaultNow()
});

export const insertBreakoutConfigurationSchema = createInsertSchema(breakoutConfigurations).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const insertBreakoutAlertSchema = createInsertSchema(breakoutAlerts).omit({
  id: true,
  alertTime: true,
  processed: true
});

export const insertPineScriptCodeSchema = createInsertSchema(pineScriptCode).omit({
  id: true,
  generatedAt: true
});

export type InsertBreakoutConfiguration = z.infer<typeof insertBreakoutConfigurationSchema>;
export type BreakoutConfiguration = typeof breakoutConfigurations.$inferSelect;
export type InsertBreakoutAlert = z.infer<typeof insertBreakoutAlertSchema>;
export type BreakoutAlert = typeof breakoutAlerts.$inferSelect;
export type InsertPineScriptCode = z.infer<typeof insertPineScriptCodeSchema>;
export type PineScriptCode = typeof pineScriptCode.$inferSelect;
