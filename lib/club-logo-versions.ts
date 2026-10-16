// Clubs et logos gérés par le blog : bibliothèque (clubs_table, clubs des méthodes) et
// logos d'époque (club_logo_versions_table, saisis dans l'admin ou lus sur Wikipédia).

import { db } from "@/db/db";
import { clubLogoVersionsTable, clubsTable } from "@/db/schema";
import { normalizeText } from "@/lib/normalize-text";

export interface LogoPeriod {
  // Années de début de saison incluses (1992 = 1992-1993) ; null = sans limite
  de: number | null;
  a: number | null;
  logo: string;
  legende?: string;
  source?: string;
}

export type LogoOrigin = "manuel" | "wikipedia";

export interface ClubLogoVersions {
  nom: string;
  noms: string[];
  periodes: LogoPeriod[];
  origine: LogoOrigin;
}

export interface LibraryClub {
  // Identifiant Wikidata, ou « nom:<nom-normalisé> »
  key: string;
  nom: string;
  noms: string[];
  logoUrl: string;
  transfermarktId: string | null;
  logosVerifiesAt: Date | null;
}

export interface BlogClubLogos {
  versions: Record<string, ClubLogoVersions>;
  library: LibraryClub[];
}

/** Clé d'un club sans élément Wikidata (« Zenit St. Pétersbourg » → « nom:zenit-st-petersbourg »). */
export const customClubKey = (nom: string) => `nom:${normalizeText(nom).replace(/ /g, "-")}`;

/** Bibliothèque et logos d'époque du blog ; vides si la base ne répond pas. */
export async function getBlogClubLogos(): Promise<BlogClubLogos> {
  try {
    const [versionRows, libraryRows] = await Promise.all([
      db.select().from(clubLogoVersionsTable),
      db.select().from(clubsTable),
    ]);
    return {
      versions: Object.fromEntries(
        versionRows.map((row) => [
          row.clubKey,
          {
            nom: row.nom,
            noms: row.noms,
            periodes: row.periodes as LogoPeriod[],
            origine: row.origine as LogoOrigin,
          },
        ]),
      ),
      library: libraryRows.map((row) => ({
        key: row.wikidataId,
        nom: row.nom,
        noms: row.noms,
        logoUrl: row.logoUrl,
        transfermarktId: row.transfermarktId,
        logosVerifiesAt: row.logosVerifiesAt,
      })),
    };
  } catch (error) {
    console.error("Logos des clubs du blog inaccessibles", error);
    return { versions: {}, library: [] };
  }
}
