import "dotenv/config";
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { tasks } from "../shared/schema";
import type { TaskCategory } from "../shared/schema";

const seedData: Record<TaskCategory, string[]> = {
  spicy: [ "Kerro salaisuus...", /* ... */ ],
  funny: [ "Jäljittele jotakuta...", /* ... */ ],
  party: [ "Kaikki pöydän ympärillä juovat!", /* ... */ ],
  
};

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle(pool);

  const rows = Object.entries(seedData).flatMap(([category, arr]) =>
    arr.map((text) => ({ text, category: category as TaskCategory }))
  );
  await db.insert(tasks).values(rows);
  console.log("Seed OK:", rows.length, "riviä");
  await pool.end();
}
main().catch((e) => { console.error(e); process.exit(1); });