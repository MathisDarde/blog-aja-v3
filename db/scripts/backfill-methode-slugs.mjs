// Adresses des pages des méthodes existantes (migration 0025), pour une base mise à jour
// avec `db:push`. Ne touche qu'aux méthodes sans adresse : sans effet si on le relance.
//
//   node db/scripts/backfill-methode-slugs.mjs            → base de dev (.env.development.local)
//   node db/scripts/backfill-methode-slugs.mjs --prod     → base de prod (.env.local)

import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";
import { baseMethodeSlug, uniqueSlug } from "../../lib/methode-slug.ts";

const prod = process.argv.includes("--prod");
config({ path: prod ? ".env.local" : ".env.development.local" });
if (!process.env.DATABASE_URL) throw new Error(`DATABASE_URL manquant (${prod ? ".env.local" : ".env.development.local"})`);

const sql = neon(process.env.DATABASE_URL);

const TABLES = {
  joueur: "methode_expert_joueur_table",
  coach: "methode_expert_coach_table",
  match: "methode_expert_match_table",
  saison: "methode_expert_saison_table",
};

const columns = await sql`
  SELECT table_name FROM information_schema.columns
  WHERE column_name = 'slug' AND table_name = ANY(${Object.values(TABLES)})`;
if (columns.length !== Object.keys(TABLES).length) {
  throw new Error("Colonnes slug absentes : lance d'abord `pnpm db:push" + (prod ? ":prod" : "") + "`.");
}

const updates = [];
const duplicates = [];

for (const [type, table] of Object.entries(TABLES)) {
  const rows = await sql(`SELECT * FROM "${table}" ORDER BY "createdAt"`);
  const taken = new Set(rows.map((row) => row.slug).filter(Boolean));

  for (const row of rows.filter((row) => !row.slug)) {
    const base = baseMethodeSlug({ ...row, typemethode: type });
    const slug = uniqueSlug(base, taken);
    taken.add(slug);
    if (slug !== base) duplicates.push(`${type} : ${slug} (adresse « ${base} » déjà prise)`);
    updates.push({ type, slug, query: sql(`UPDATE "${table}" SET "slug" = $1 WHERE "id_methode" = $2`, [slug, row.id_methode]) });
  }
}

if (updates.length) await sql.transaction(updates.map((update) => update.query));

for (const { type, slug } of updates) console.log(`✓ ${type.padEnd(6)} ${slug}`);
console.log(`\n${updates.length} adresses créées sur la base de ${prod ? "prod" : "dev"}.`);
if (duplicates.length) {
  console.log("\nÀ vérifier (deux méthodes auraient eu la même adresse) :");
  for (const line of duplicates) console.log(`  - ${line}`);
}
