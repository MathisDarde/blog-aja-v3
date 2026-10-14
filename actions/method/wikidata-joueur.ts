"use server";

import { requireAdmin } from "@/lib/auth-guard";
import { resolveClubLogos } from "@/lib/club-logos";
import {
  getFootballer,
  isWikidataId,
  searchFootballPeople,
  WikidataPerson,
} from "@/lib/wikidata";

export interface ImportedJoueur {
  joueurnom: string;
  poste: string;
  taille: string;
  // [logo, nom, années, wikidataId du club]
  clubs: string[][];
  clubsSansLogo: number;
}

type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; message: string };

const formatYears = (start: number | null, end: number | null) => {
  if (!start) return end ? `(${end})` : "";
  if (!end) return `(${start}-)`;
  return start === end ? `(${start})` : `(${start}-${end})`;
};

// 1.83 → "1m83"
const formatHeight = (meters: number | null) => {
  if (!meters) return "";
  const [m, cm = "00"] = meters.toFixed(2).split(".");
  return `${m}m${cm}`;
};

const capitalize = (value: string) =>
  value.charAt(0).toUpperCase() + value.slice(1);

export async function searchWikidataPeople(
  query: string,
): Promise<ActionResult<WikidataPerson[]>> {
  await requireAdmin();

  const trimmed = query.trim();
  if (trimmed.length < 2) return { success: true, data: [] };

  try {
    return { success: true, data: await searchFootballPeople(trimmed) };
  } catch (error) {
    console.error(error);
    return { success: false, message: "La recherche Wikidata a échoué." };
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
    const logos = await resolveClubLogos(joueur.career);

    const clubs = joueur.career.map((entry) => {
      const logo = logos.get(entry.clubId);
      return [
        logo?.logoUrl ?? "",
        logo?.nom ?? entry.clubName,
        formatYears(entry.start, entry.end),
        entry.clubId,
      ];
    });

    return {
      success: true,
      data: {
        joueurnom: joueur.name,
        poste: joueur.positions.map(capitalize).join(" / "),
        taille: formatHeight(joueur.heightMeters),
        clubs,
        clubsSansLogo: clubs.filter(([logo]) => !logo).length,
      },
    };
  } catch (error) {
    console.error(error);
    return { success: false, message: "L'import depuis Wikidata a échoué." };
  }
}
