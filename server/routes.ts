import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage"; // games ok
import { insertGameSchema, type TaskCategory, tasks } from "@shared/schema";
import { db } from "./db";
import { sql, eq } from "drizzle-orm";

const allowedCategories = new Set<TaskCategory>([
  "spicy",
  "funny",
  "party",
  "extreme",
]);

export async function registerRoutes(app: Express): Promise<Server> {
  // Games (storage)
  app.post("/api/games", async (req, res) => {
    try {
      const gameData = insertGameSchema.parse(req.body);
      const game = await storage.createGame(gameData);
      res.json(game);
    } catch {
      res.status(400).json({ error: "Invalid game data" });
    }
  });

  app.get("/api/games/:id", async (req, res) => {
    const game = await storage.getGame(req.params.id);
    if (!game) return res.status(404).json({ error: "Game not found" });
    res.json(game);
  });

  app.patch("/api/games/:id", async (req, res) => {
    try {
      const game = await storage.updateGame(req.params.id, req.body);
      if (!game) return res.status(404).json({ error: "Game not found" });
      res.json(game);
    } catch {
      res.status(400).json({ error: "Invalid update data" });
    }
  });

  // Tasks (DB)
  app.get("/api/tasks/:category", async (req, res, next) => {
    try {
      const category = req.params.category as TaskCategory;
      if (!allowedCategories.has(category)) {
        return res.status(400).json({ error: "Invalid category" });
      }

      const rows = await db
        .select({
          id: tasks.id,
          text: tasks.text,
          category: tasks.category,
        })
        .from(tasks)
        .where(eq(tasks.category, category))
        .orderBy(tasks.id as any);

      res.json(rows);
    } catch (e) {
      next(e);
    }
  });

  app.get("/api/tasks/:category/random", async (req, res, next) => {
    try {
      const category = req.params.category as TaskCategory;
      if (!allowedCategories.has(category)) {
        return res.status(400).json({ error: "Invalid category" });
      }

      // 👇 tärkeä muutos: destrukturoi rows
      const { rows } = await db.execute(sql`
        SELECT ${tasks.id} AS id, ${tasks.text} AS text, ${tasks.category} AS category
        FROM ${tasks}
        WHERE ${tasks.category} = ${category}
        ORDER BY random()
        LIMIT 1
      `);

      if (rows.length === 0) return res.status(404).json({ error: "no tasks" });
      res.json(rows[0]);
    } catch (e) {
      next(e);
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
