// Logos d'époque saisis dans l'admin (/admin/logos), prioritaires sur ceux des scrapers.

import { db } from "@/db/db";
import { clubLogoVersionsTable } from "@/db/schema";
import { normalizeText } from "@/lib/normalize-text";

export interface LogoPeriod {
  // Années de début de saison incluses (1992 = 1992-1993) ; null = sans limite
  de: number | null;
  a: number | null;
  logo: string;
  legende?: string;
  source?: string;
}

export interface ClubLogoVersions {
  nom: string;
  noms: string[];
  periodes: LogoPeriod[];
}

/** Clé d'un club absent du registre des scrapers (« Zenit St. Pétersbourg » → « nom:zenit-st-petersbourg »). */
export const customClubKey = (nom: string) => `nom:${normalizeText(nom).replace(/ /g, "-")}`;

/** Clubs dont les logos ont été repris à la main, par clé ; vide si la base ne répond pas. */
export async function getClubLogoVersions(): Promise<Record<string, ClubLogoVersions>> {
  try {
    const rows = await db.select().from(clubLogoVersionsTable);
    return Object.fromEntries(
      rows.map((row) => [row.clubKey, { nom: row.nom, noms: row.noms, periodes: row.periodes as LogoPeriod[] }]),
    );
  } catch (error) {
    console.error("Logos d'époque de l'admin inaccessibles", error);
    return {};
  }
}
