import { sql } from "drizzle-orm";
import { pgTable, text, varchar, jsonb, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const games = pgTable("games", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  players: jsonb("players").$type<string[]>().notNull(),
  currentPlayerIndex: integer("current_player_index").notNull().default(0),
  category: text("category").notNull(),
});

export const insertGameSchema = createInsertSchema(games).pick({
  players: true,
  category: true,
});

export const tasks = pgTable("tasks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  text: text("text").notNull(),
  category: text("category").notNull(), // sama union kuin TaskCategory
});


export type InsertGame = z.infer<typeof insertGameSchema>;
export type Game = typeof games.$inferSelect;

export type TaskCategory = "spicy" | "funny" | "party" | "extreme";

export interface Task {
  id: string;
  text: string;
  category: TaskCategory;
}
