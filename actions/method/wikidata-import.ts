"use server";

import { requireAdmin } from "@/lib/auth-guard";
import { clubLogoKey, resolveClubLogos } from "@/lib/club-logos";
import { resolveFlag } from "@/lib/flags";
import { type AjaSeason, getAjaSeason } from "@/lib/saison-aja";
import {
  findPlayerCard,
  getClubColors,
  getCoach,
  getFootballer,
  isWikidataId,
  searchFootballPeople,
  WikidataCareerEntry,
  WikidataPerson,
  WikidataRateLimitError,
} from "@/lib/wikidata";

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; message: string };

interface ImportedClubs {
  // [logo, nom, années, wikidataId du club s'il est connu]
  clubs: string[][];
  clubsSansLogo: number;
}

export interface ImportedJoueur extends ImportedClubs {
  joueurnom: string;
  poste: string;
  taille: string;
  // Totaux de l'infobox Wikipédia, vides s'ils n'y figurent pas
  matchs: string;
  buts: string;
}

export interface ImportedCoach extends ImportedClubs {
  nomcoach: string;
  // « 597 matchs (231v - 165n - 201d) »
  statistiques: string;
  palmares: string[][];
}

export interface PlayerCard {
  poste: string;
  drapeau: string;
}

// Postes Wikidata (« arrière gauche », « milieu offensif »…) → postes des feuilles de match
const POSTE_RULES: [RegExp, string][] = [
  [/gardien/i, "Gardien"],
  [/défenseur|arrière|latéral|libéro|stoppeur/i, "Défenseur"],
  [/milieu|meneur/i, "Milieu"],
  [/attaquant|ailier|avant|buteur/i, "Attaquant"],
];

const toPoste = (positions: string[], coachedDuring: boolean) => {
  if (coachedDuring) return "Coach";
  for (const position of positions) {
    const rule = POSTE_RULES.find(([pattern]) => pattern.test(position));
    if (rule) return rule[1];
  }
  return "";
};

// « 2021-2022 » → 2021..2022 ; « dimanche 16 mai 2022 » → 2022..2022
const periodFromText = (text?: string) => {
  const years = (text?.match(/\b(19|20)\d{2}\b/g) ?? []).map(Number);
  return years.length > 0
    ? { from: Math.min(...years), to: Math.max(...years) }
    : undefined;
};

// Sans parenthèses : l'affichage des méthodes les ajoute
const formatYears = (start: number | null, end: number | null) => {
  if (!start) return end ? `${end}` : "";
  if (!end) return `${start}-`;
  return start === end ? `${start}` : `${start}-${end}`;
};

// 1.83 → "1m83"
const formatHeight = (meters: number | null) => {
  if (!meters) return "";
  const [m, cm = "00"] = meters.toFixed(2).split(".");
  return `${m}m${cm}`;
};

const capitalize = (value: string) =>
  value.charAt(0).toUpperCase() + value.slice(1);

async function buildClubRows(
  career: WikidataCareerEntry[],
): Promise<ImportedClubs> {
  const logos = await resolveClubLogos(career);

  const clubs = career.map((entry) => {
    const row = [
      logos.get(clubLogoKey(entry)) ?? "",
      entry.clubName,
      formatYears(entry.start, entry.end),
    ];
    return entry.clubId ? [...row, entry.clubId] : row;
  });

  return { clubs, clubsSansLogo: clubs.filter(([logo]) => !logo).length };
}

const failure = (error: unknown, message: string) => {
  console.error(error);
  return {
    success: false as const,
    message:
      error instanceof WikidataRateLimitError
        ? "Wikidata limite les requêtes, réessaie dans une minute."
        : message,
  };
};

export async function searchWikidataPeople(
  query: string,
): Promise<ActionResult<WikidataPerson[]>> {
  await requireAdmin();

  const trimmed = query.trim();
  if (trimmed.length < 2) return { success: true, data: [] };

  try {
    return { success: true, data: await searchFootballPeople(trimmed) };
  } catch (error) {
    return failure(error, "La recherche Wikidata a échoué.");
  }
}

export async function importJoueurFromWikidata(
  id: string,
): Promise<ActionResult<ImportedJoueur>> {
  await requireAdmin();

  if (!isWikidataId(id)) {
    return { success: false, message: "Identifiant Wikidata invalide." };
  }

  try {
    const joueur = await getFootballer(id);

    return {
      success: true,
      data: {
        joueurnom: joueur.name,
        poste: joueur.positions.map(capitalize).join(" / "),
        taille: formatHeight(joueur.heightMeters),
        matchs: joueur.totals ? String(joueur.totals.matchs) : "",
        buts: joueur.totals ? String(joueur.totals.buts) : "",
        ...(await buildClubRows(joueur.career)),
      },
    };
  } catch (error) {
    return failure(error, "L'import depuis Wikidata a échoué.");
  }
}

export async function importCoachFromWikidata(
  id: string,
): Promise<ActionResult<ImportedCoach>> {
  await requireAdmin();

  if (!isWikidataId(id)) {
    return { success: false, message: "Identifiant Wikidata invalide." };
  }

  try {
    const coach = await getCoach(id);

    return {
      success: true,
      data: {
        nomcoach: coach.name,
        statistiques: coach.record
          ? `${coach.record.v + coach.record.n + coach.record.d} matchs (${coach.record.v}v - ${coach.record.n}n - ${coach.record.d}d)`
          : "",
        palmares: coach.palmares,
        ...(await buildClubRows(coach.career)),
      },
    };
  } catch (error) {
    return failure(error, "L'import depuis Wikidata a échoué.");
  }
}

/**
 * Poste et drapeau d'un joueur à partir de son nom (remplaçants des méthodes match / saison).
 * `periodText` : la saison ou la date du match, pour reconnaître le coach de l'époque.
 */
export async function lookupPlayerCard(
  name: string,
  periodText?: string,
): Promise<ActionResult<PlayerCard | null>> {
  await requireAdmin();

  const trimmed = name.trim();
  if (trimmed.length < 3) return { success: true, data: null };

  try {
    const card = await findPlayerCard(trimmed, periodFromText(periodText));
    if (!card) return { success: true, data: null };

    return {
      success: true,
      data: {
        poste: toPoste(card.positions, card.coachedDuring),
        drapeau: card.country ? ((await resolveFlag(card.country)) ?? "") : "",
      },
    };
  } catch (error) {
    return failure(error, `Impossible de compléter ${trimmed}.`);
  }
}

/** Couleurs principale et secondaire d'une équipe à partir de son nom (méthodes match). */
export async function lookupClubColors(
  name: string,
): Promise<ActionResult<{ primary: string; secondary: string } | null>> {
  await requireAdmin();

  const trimmed = name.trim();
  if (trimmed.length < 2) return { success: true, data: null };

  try {
    return { success: true, data: await getClubColors(trimmed) };
  } catch (error) {
    return failure(error, `Couleurs introuvables pour ${trimmed}.`);
  }
}

/** Coach, équipe type et effectif d'une saison de l'AJ Auxerre (méthodes saison). */
export async function importAjaSeason(
  saison: string,
): Promise<ActionResult<AjaSeason | null>> {
  await requireAdmin();

  try {
    return { success: true, data: await getAjaSeason(saison) };
  } catch (error) {
    return failure(error, `Impossible de compléter la saison ${saison}.`);
  }
}
