// Conversion des données de la migration 0024, pour une base mise à jour avec
// `db:push` (qui crée les colonnes mais n'exécute pas les requêtes de données).
// À lancer une fois après `pnpm db:push:prod` ; sans effet si on le relance.
//
//   node db/scripts/convert-match-titles.mjs            → base de dev (.env.development.local)
//   node db/scripts/convert-match-titles.mjs --prod     → base de prod (.env.local)

import { readFileSync } from "node:fs";
import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";

const prod = process.argv.includes("--prod");
config({ path: prod ? ".env.local" : ".env.development.local" });
if (!process.env.DATABASE_URL) throw new Error(`DATABASE_URL manquant (${prod ? ".env.local" : ".env.development.local"})`);

const sql = neon(process.env.DATABASE_URL);

const columns = await sql`
  SELECT column_name FROM information_schema.columns
  WHERE table_name = 'methode_expert_match_table' AND column_name = 'abreviationequipe1'`;
if (columns.length === 0) {
  throw new Error("Colonnes absentes : lance d'abord `pnpm db:push" + (prod ? ":prod" : "") + "`.");
}

// Requêtes UPDATE de la migration (les ALTER TABLE sont déjà faits par db:push)
const statements = readFileSync(new URL("../migrations/0024_match_score_logos.sql", import.meta.url), "utf8")
  .split("--> statement-breakpoint")
  .map((statement) => statement.replace(/^\s*--.*$/gm, "").trim())
  .filter((statement) => statement.startsWith("UPDATE"));

await sql.transaction(statements.map((statement) => sql(statement)));

const rows = await sql`
  SELECT "titrematch", "abreviationequipe1", "abreviationequipe2"
  FROM "methode_expert_match_table" ORDER BY "titrematch"`;
for (const row of rows) {
  const ok = row.abreviationequipe1 && row.abreviationequipe2;
  console.log(`${ok ? "✓" : "✗ non converti :"} ${row.titrematch}`);
}
console.log(`\n${statements.length} requêtes exécutées sur la base de ${prod ? "prod" : "dev"}.`);
