// server/seedTasks.ts
import "dotenv/config";
import pg from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { tasks } from "../shared/schema"; // varmista että exporttaat tasks-taulun

const { Pool } = pg;

// määrittele kategoriasi – niiden pitää vastata skeemaa ja APIa
type TaskCategory = "spicy" | "funny" | "party";

const seedData: Record<TaskCategory, string[]> = {
  spicy: [
    "Kerro salaisuus – jos et, juo 3 huikkaa 🤫",
    "Anna suudelma poskelle – jos et, juo 2 huikkaa 💋",
    "Kerro keneen olet ihastunut – jos et, juo 4 huikkaa 💕",
    "Näytä paras tanssiliikkeesi – jos et, juo 2 💃",
    "Soita exällesi (kaiuttimella) – jos et, juo 5 📱",
    "Kerro noloin muistosi – jos et, juo 3 😳",
    "Tee 5 punnerrusta – jos et, juo 2 💪",
    "Tee 10 kyykkyä – jos et, juo 2 🏋️",
    "Anna jollekin 30 sek hieronta – jos et, juo 2 💆",
    "Vaihda profiilikuvasi hassuksi 10 min – jos et, juo 3 🤡",
  ],
  funny: [
    "Jäljittele jotakuta pöydässä – muut arvaa kuka 🎭",
    "Puhu minuutin ajan vain eläinten äänillä 🐶",
    "Tee mini-standup 30 s 🎤",
    "Laula suosikkibiisisi oopperatyylillä 🎵",
    "Esitä pantomiimi 'kala vedessä' 🐟",
    "Kerro vitsi – jos kukaan ei naura, juo 2 😄",
    "Tee TikTok-tanssi 💃",
    "Puhu 30 sekuntia nenä-äänellä 👃",
    "Keksi 4-sanan runo tästä porukasta ✍️",
    "Kerro tarina käyttäen vain kolme sanaa kerrallaan 📖",
  ],
  party: [
    "Kaikki pöydän ympärillä juovat! 🍻",
    "Keksi uusi juomisääntö koko porukalle 📜",
    "Aloita 'Never Have I Ever' -kierros 🙈",
    "Kaikki miehet juovat 🍺",
    "Kaikki naiset juovat 🥂",
    "Sinun oikealla puolellasi oleva juo 2 ➡️",
    "Kaikilla, joilla on siniset silmät, juo 👁️",
    "Ota 3 huikkaa ja anna 3 huikkaa jollekin 🔄",
    "Kaikki, joilla on puhelin kädessä, juovat 📱",
    "Vaihda paikkaa jonkun kanssa – molemmat juovat 🔁",
  ],
  
};

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL puuttuu (aseta .env tai PowerShellissä $env:DATABASE_URL)");
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle(pool);

  // Rakenna rivit
  const rows = (Object.keys(seedData) as TaskCategory[]).flatMap((category) =>
    seedData[category].map((text) => ({ text, category }))
  );

  // (valinnainen) tyhjennä ennen inserttiä
  // await pool.query("TRUNCATE TABLE tasks RESTART IDENTITY");

  // (valinnainen) jos teit unique-indeksin (text,category), voidaan ohittaa duplikaatit:
  // await db.insert(tasks).values(rows).onConflictDoNothing();

  await db.insert(tasks).values(rows);
  console.log(`✅ Seed OK: ${rows.length} riviä`);
  await pool.end();
}

main().catch((e) => {
  console.error("❌ Seed epäonnistui:", e);
  process.exit(1);
});
