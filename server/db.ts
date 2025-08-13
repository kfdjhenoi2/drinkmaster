import "dotenv/config";
import pg from "pg";                    // ⬅️ default-import, ei named
import { drizzle } from "drizzle-orm/node-postgres";

const { Pool } = pg;                    // ⬅️ pura Pool tästä
export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle(pool);
