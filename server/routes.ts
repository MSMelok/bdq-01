import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { qualificationService } from "./services/qualification.service";
import { qualificationRequestSchema, settingsSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/settings", async (req, res) => {
    try {
      const settings = await storage.getSettings();
      res.json(settings);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/settings", async (req, res) => {
    try {
      const validatedData = settingsSchema.parse(req.body);
      const settings = await storage.updateSettings(validatedData);
      res.json(settings);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/qualify", async (req, res) => {
    try {
      const validatedData = qualificationRequestSchema.parse(req.body);
      const settings = await storage.getSettings();
      const result = await qualificationService.qualifyLocation(
        validatedData.address,
        settings
      );
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Failed to qualify location" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
