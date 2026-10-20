import { db } from "@/db/db";
import {
  methodeExpertCoachTable,
  methodeExpertJoueurTable,
  methodeExpertMatchTable,
  methodeExpertSaisonTable,
} from "@/db/schema";
import { baseMethodeSlug, uniqueSlug } from "@/lib/methode-slug";

const TABLES = {
  joueur: methodeExpertJoueurTable,
  coach: methodeExpertCoachTable,
  match: methodeExpertMatchTable,
  saison: methodeExpertSaisonTable,
};

/** Adresse libre pour une nouvelle méthode (unique parmi celles du même type). */
export async function newMethodeSlug(source: Parameters<typeof baseMethodeSlug>[0] & { typemethode: keyof typeof TABLES }) {
  const table = TABLES[source.typemethode];
  const rows = await db.select({ slug: table.slug }).from(table);
  const taken = new Set(rows.map((row) => row.slug).filter((slug): slug is string => !!slug));
  return uniqueSlug(baseMethodeSlug(source), taken);
}
