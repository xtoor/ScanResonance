import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertBreakoutConfigurationSchema, insertBreakoutAlertSchema, insertPineScriptCodeSchema } from "@shared/schema";
import { generatePineScript } from "../client/src/lib/pineScript.js";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Configuration routes (protected)
  app.get("/api/configurations", isAuthenticated, async (req, res) => {
    try {
      const configurations = await storage.getAllConfigurations();
      res.json(configurations);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch configurations" });
    }
  });

  app.get("/api/configurations/:id", isAuthenticated, async (req, res) => {
    try {
      const configuration = await storage.getConfiguration(req.params.id);
      if (!configuration) {
        return res.status(404).json({ error: "Configuration not found" });
      }
      res.json(configuration);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch configuration" });
    }
  });

  app.post("/api/configurations", isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertBreakoutConfigurationSchema.parse(req.body);
      const configuration = await storage.createConfiguration(validatedData);
      res.status(201).json(configuration);
    } catch (error) {
      res.status(400).json({ error: "Invalid configuration data" });
    }
  });

  app.patch("/api/configurations/:id", isAuthenticated, async (req, res) => {
    try {
      const partialData = insertBreakoutConfigurationSchema.partial().parse(req.body);
      const configuration = await storage.updateConfiguration(req.params.id, partialData);
      res.json(configuration);
    } catch (error) {
      res.status(400).json({ error: "Invalid configuration update" });
    }
  });

  app.delete("/api/configurations/:id", isAuthenticated, async (req, res) => {
    try {
      const deleted = await storage.deleteConfiguration(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Configuration not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete configuration" });
    }
  });

  // Alert routes (public for scanner service)
  app.get("/api/alerts", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const alerts = await storage.getRecentAlerts(limit);
      res.json(alerts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch alerts" });
    }
  });

  app.post("/api/alerts", async (req, res) => {
    try {
      const validatedData = insertBreakoutAlertSchema.parse(req.body);
      const alert = await storage.createAlert(validatedData);
      res.status(201).json(alert);
    } catch (error) {
      res.status(400).json({ error: "Invalid alert data" });
    }
  });

  app.patch("/api/alerts/:id/processed", async (req, res) => {
    try {
      const processed = await storage.markAlertProcessed(req.params.id);
      if (!processed) {
        return res.status(404).json({ error: "Alert not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to process alert" });
    }
  });

  // Pine Script generation routes (protected)
  app.get("/api/pine-script/:configurationId", isAuthenticated, async (req, res) => {
    try {
      const configuration = await storage.getConfiguration(req.params.configurationId);
      if (!configuration) {
        return res.status(404).json({ error: "Configuration not found" });
      }

      let pineScript = await storage.getPineScriptCode(req.params.configurationId);
      
      if (!pineScript) {
        // Generate new Pine Script code
        const scriptCode = generatePineScript(configuration);
        pineScript = await storage.savePineScriptCode({
          configurationId: req.params.configurationId,
          scriptCode,
          version: "v12.5"
        });
      }

      res.json(pineScript);
    } catch (error) {
      res.status(500).json({ error: "Failed to generate Pine Script" });
    }
  });

  app.post("/api/pine-script/regenerate/:configurationId", isAuthenticated, async (req, res) => {
    try {
      const configuration = await storage.getConfiguration(req.params.configurationId);
      if (!configuration) {
        return res.status(404).json({ error: "Configuration not found" });
      }

      const scriptCode = generatePineScript(configuration);
      const pineScript = await storage.savePineScriptCode({
        configurationId: req.params.configurationId,
        scriptCode,
        version: "v12.5"
      });

      res.json(pineScript);
    } catch (error) {
      res.status(500).json({ error: "Failed to regenerate Pine Script" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}