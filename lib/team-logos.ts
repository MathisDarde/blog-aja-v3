// Logo d'un club pour une saison donnée, côté serveur : logo d'époque (Wikipédia FR ou liste
// manuelle, publiés par les scrapers dans logos-historiques.json), sinon logo actuel du site,
// sinon logo Transfermarkt, sinon écusson neutre.

import { cache } from "react";
import { fetchScrapedData, SCRAPERS_URL } from "@/lib/scraped-data";
import { normalizeText } from "@/lib/normalize-text";
import { getTeamInfo } from "@/utils/get-team-info";

interface RegistryClub {
  nom: string;
  noms: string[];
  logo: string | null;
}

interface LogoPeriod {
  de: number | null;
  a: number | null;
  logo: string;
}

export const DEFAULT_TEAM_LOGO = "/_assets/teamlogos/logodefault.png";
const LOCAL_LOGOS = "/_assets/teamlogos/";

/** Année de début de la saison d'une date (la saison bascule au 1er juillet). */
export const seasonOf = (date: Date) => (date.getMonth() >= 6 ? date.getFullYear() : date.getFullYear() - 1);

const absolute = (path: string) => (/^https?:\/\//.test(path) || path.startsWith("/") ? path : `${SCRAPERS_URL}/${path}`);

export interface TeamRef {
  // Identifiant Transfermarkt, si connu (classements, calendriers)
  id?: string | null;
  name?: string | null;
  // Année de début de saison ; sans saison, le logo actuel
  season?: number | null;
}

export interface TeamLogoResolver {
  /** Logo à afficher, jamais vide. */
  logo(team: TeamRef): string;
  /** Logo d'époque seulement (null hors période connue) : pour les logos choisis à la main. */
  periodLogo(team: TeamRef): string | null;
}

export const getTeamLogoResolver = cache(async (): Promise<TeamLogoResolver> => {
  const [registry, periods] = await Promise.all([
    fetchScrapedData<Record<string, RegistryClub>>("clubs.json", {}),
    fetchScrapedData<Record<string, LogoPeriod[]>>("logos-historiques.json", {}),
  ]);

  const idByName = new Map<string, string>();
  for (const [id, club] of Object.entries(registry)) {
    for (const name of [club.nom, ...club.noms]) {
      const key = normalizeText(name);
      if (key && !idByName.has(key)) idByName.set(key, id);
    }
  }
  const idOf = (team: TeamRef) => team.id ?? (team.name ? idByName.get(normalizeText(team.name)) : undefined);

  const periodLogo = (team: TeamRef) => {
    const id = idOf(team);
    if (!id || team.season == null) return null;
    const season = team.season;
    // La période la plus précise l'emporte (un logo d'une saison sur un logo de vingt ans)
    const match = (periods[id] ?? [])
      .filter((p) => (p.de ?? -Infinity) <= season && season <= (p.a ?? Infinity))
      .sort((a, b) => (a.a ?? 3000) - (a.de ?? 0) - ((b.a ?? 3000) - (b.de ?? 0)))[0];
    return match ? absolute(match.logo) : null;
  };

  const currentLogo = (team: TeamRef) => {
    const id = idOf(team);
    const names = [team.name, ...(id ? [registry[id]?.nom, ...(registry[id]?.noms ?? [])] : [])].filter(Boolean) as string[];
    // Logos du site (SVG soignés), reconnus par l'un des noms du club
    for (const name of names) {
      const local = getTeamInfo(name).logo;
      if (local !== "logodefault.png") return `${LOCAL_LOGOS}${local}`;
    }
    const tm = id ? registry[id]?.logo : null;
    return tm ? absolute(tm) : DEFAULT_TEAM_LOGO;
  };

  return {
    logo: (team) => periodLogo(team) ?? currentLogo(team),
    periodLogo,
  };
});

export const AJA_CLUB_ID = "290";

/** Classement avec le logo de chaque club pour la saison. */
export const withTeamLogos = <T extends { equipe: string; club_id?: string | null }>(
  teams: T[],
  season: number | null | undefined,
  resolver: TeamLogoResolver,
) => teams.map((team) => ({ ...team, logoSrc: resolver.logo({ id: team.club_id, name: team.equipe, season }) }));

/** Matchs avec le logo de l'adversaire pour la saison. */
export const withMatchLogos = <T extends { contre: string; adversaire_id?: string | null }>(
  matches: T[],
  season: number | null | undefined,
  resolver: TeamLogoResolver,
) =>
  matches.map((match) => ({
    ...match,
    logoSrc: resolver.logo({ id: match.adversaire_id, name: match.contre.split(" (")[0], season }),
  }));

export const ajaLogo = (season: number | null | undefined, resolver: TeamLogoResolver) =>
  resolver.logo({ id: AJA_CLUB_ID, name: "AJ Auxerre", season });

const FRENCH_MONTHS = ["janv", "févr", "mars", "avr", "mai", "juin", "juil", "août", "sept", "oct", "nov", "déc"];

/** Saison d'une date écrite en français (« mercredi 15 septembre 2010, 20h45 »), ou null. */
export function seasonOfFrenchDate(text: string): number | null {
  const year = text.match(/\b(19|20)\d{2}\b/);
  if (!year) return null;
  const lower = text.toLowerCase();
  const month = FRENCH_MONTHS.findIndex((m) => lower.includes(m));
  return seasonOf(new Date(Number(year[0]), Math.max(month, 0), 1));
}

/** Première année d'une période de club (« 2009-2013 » → 2009), ou null. */
const firstYear = (years: string) => {
  const match = years?.match(/\b(19|20)\d{2}\b/);
  return match ? Number(match[0]) : null;
};

type ClubEntry = [string, string, string]; // [logo, nom, années]

/**
 * Méthode expert avec, pour chaque club d'un parcours (joueur, coach), le logo de l'époque
 * de son arrivée quand il est connu ; sinon le logo choisi à la création de la méthode.
 */
export function withPeriodClubLogos<T extends { typemethode: string }>(methode: T, resolver: TeamLogoResolver): T {
  const swap = (clubs: ClubEntry[]) =>
    clubs.map(([logo, name, years]): ClubEntry => [
      resolver.periodLogo({ name, season: firstYear(years) }) ?? logo,
      name,
      years,
    ]);
  const m = methode as T & { clubs?: ClubEntry[]; clubscoach?: ClubEntry[] };
  if (m.typemethode === "joueur" && Array.isArray(m.clubs)) return { ...m, clubs: swap(m.clubs) };
  if (m.typemethode === "coach" && Array.isArray(m.clubscoach)) return { ...m, clubscoach: swap(m.clubscoach) };
  return methode;
}
