"use server";

import { db } from "@/db/db";
import { methodeExpertMatchTable } from "@/db/schema";
import { requireAdmin } from "@/lib/auth-guard";
import { normalizeText } from "@/lib/normalize-text";
import { DEFAULT_TEAM_LOGO, getTeamLogoResolver, seasonOfFrenchDate } from "@/lib/team-logos";
import { desc } from "drizzle-orm";

export interface MatchTeamDefaults {
  // Logo d'époque (ou actuel) du club à la date du match
  logo: string;
  logoFound: boolean;
  // Dernière abréviation utilisée pour ce club dans une méthode match, sinon vide
  abreviation: string;
}

/** Valeurs proposées dans le formulaire de méthode match quand le nom d'une équipe est saisi. */
export async function getMatchTeamDefaults(name: string, date: string): Promise<MatchTeamDefaults> {
  await requireAdmin();

  const resolver = await getTeamLogoResolver();
  const logo = resolver.logo({ name, season: seasonOfFrenchDate(date) });

  const target = normalizeText(name);
  const matches = await db
    .select({
      nomequipe1: methodeExpertMatchTable.nomequipe1,
      abreviationequipe1: methodeExpertMatchTable.abreviationequipe1,
      nomequipe2: methodeExpertMatchTable.nomequipe2,
      abreviationequipe2: methodeExpertMatchTable.abreviationequipe2,
    })
    .from(methodeExpertMatchTable)
    .orderBy(desc(methodeExpertMatchTable.updatedAt));

  const abreviation =
    matches
      .flatMap((m) => [
        [m.nomequipe1, m.abreviationequipe1],
        [m.nomequipe2, m.abreviationequipe2],
      ])
      .find(([nom, abreviation]) => abreviation && normalizeText(nom) === target)?.[1] ?? "";

  return { logo, logoFound: logo !== DEFAULT_TEAM_LOGO, abreviation };
}
