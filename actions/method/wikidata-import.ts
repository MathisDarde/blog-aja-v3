"use server";

import { requireAdmin } from "@/lib/auth-guard";
import { clubLogoKey, resolveClubLogos } from "@/lib/club-logos";
import {
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
}

export interface ImportedCoach extends ImportedClubs {
  nomcoach: string;
}

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
        ...(await buildClubRows(coach.career)),
      },
    };
  } catch (error) {
    return failure(error, "L'import depuis Wikidata a échoué.");
  }
}
