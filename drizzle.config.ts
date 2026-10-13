import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

// Par défaut, drizzle-kit cible la base de dev (.env.development.local).
// Pour la prod, passer explicitement DB_TARGET=prod (cf. scripts db:*:prod).
const target = process.env.DB_TARGET === "prod" ? "prod" : "dev";
config({ path: target === "prod" ? ".env.local" : ".env.development.local" });

if (!process.env.DATABASE_URL) {
  throw new Error(`DATABASE_URL manquant pour la cible "${target}"`);
}

export default defineConfig({
  schema: "./db/schema.ts",
  out: "./db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
