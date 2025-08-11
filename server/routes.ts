import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertGameSchema, type TaskCategory } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Create a new game
  app.post("/api/games", async (req, res) => {
    try {
      const gameData = insertGameSchema.parse(req.body);
      const game = await storage.createGame(gameData);
      res.json(game);
    } catch (error) {
      res.status(400).json({ error: "Invalid game data" });
    }
  });

  // Get a game by ID
  app.get("/api/games/:id", async (req, res) => {
    const game = await storage.getGame(req.params.id);
    if (!game) {
      return res.status(404).json({ error: "Game not found" });
    }
    res.json(game);
  });

  // Update game (for player rotation)
  app.patch("/api/games/:id", async (req, res) => {
    try {
      const game = await storage.updateGame(req.params.id, req.body);
      if (!game) {
        return res.status(404).json({ error: "Game not found" });
      }
      res.json(game);
    } catch (error) {
      res.status(400).json({ error: "Invalid update data" });
    }
  });

  // Get tasks by category
  app.get("/api/tasks/:category", (req, res) => {
    const category = req.params.category as TaskCategory;
    if (!["spicy", "funny", "party"].includes(category)) {
      return res.status(400).json({ error: "Invalid category" });
    }
    
    const tasks = storage.getTasksByCategory(category);
    res.json(tasks);
  });

  // Get random task from category
  app.get("/api/tasks/:category/random", (req, res) => {
    const category = req.params.category as TaskCategory;
    if (!["spicy", "funny", "party"].includes(category)) {
      return res.status(400).json({ error: "Invalid category" });
    }
    
    const tasks = storage.getTasksByCategory(category);
    const randomTask = tasks[Math.floor(Math.random() * tasks.length)];
    res.json(randomTask);
  });

  const httpServer = createServer(app);
  return httpServer;
}
