// Logo d'un club pour une saison donnée, côté serveur : logo d'époque (saisi dans l'admin ou lu
// sur Wikipédia par le blog, à défaut publié par les scrapers dans logos-historiques.json), sinon
// logo actuel du site, Transfermarkt, de la bibliothèque des méthodes, sinon écusson neutre.

import { cache } from "react";
import { BlogClubLogos, getBlogClubLogos, LogoPeriod } from "@/lib/club-logo-versions";
import { sinceMinSeason } from "@/lib/historical-logos";
import { fetchScrapedData, SCRAPERS_URL } from "@/lib/scraped-data";
import { normalizeText } from "@/lib/normalize-text";
import { getTeamInfo } from "@/utils/get-team-info";

export interface RegistryClub {
  nom: string;
  noms: string[];
  logo: string | null;
}

export const DEFAULT_TEAM_LOGO = "/_assets/teamlogos/logodefault.png";
const LOCAL_LOGOS = "/_assets/teamlogos/";

/** Année de début de la saison d'une date (la saison bascule au 1er juillet). */
export const seasonOf = (date: Date) => (date.getMonth() >= 6 ? date.getFullYear() : date.getFullYear() - 1);

export const absolute = (path: string) => (/^https?:\/\//.test(path) || path.startsWith("/") ? path : `${SCRAPERS_URL}/${path}`);

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
  /** Logo actuel (site, Transfermarkt, bibliothèque, écusson neutre), sans les logos d'époque. */
  currentLogo(team: TeamRef): string;
  /** Clé du club (Transfermarkt, sinon bibliothèque), ou undefined pour un club inconnu. */
  clubKey(team: TeamRef): string | undefined;
  /** Versions d'époque du club depuis 1970 (blog, sinon scrapers). */
  periodsOf(key: string): LogoPeriod[];
  /** Tous les noms connus du club. */
  namesOf(key: string): string[];
}

export interface ScrapedClubLogos {
  registry: Record<string, RegistryClub>;
  periods: Record<string, LogoPeriod[]>;
}

/** Registre des clubs et logos d'époque publiés par les scrapers. */
export const fetchScrapedClubLogos = cache(async (): Promise<ScrapedClubLogos> => {
  const [registry, periods] = await Promise.all([
    fetchScrapedData<Record<string, RegistryClub>>("clubs.json", {}),
    fetchScrapedData<Record<string, LogoPeriod[]>>("logos-historiques.json", {}),
  ]);
  return { registry, periods };
});

/**
 * Clé de chaque club de la bibliothèque : celle du registre quand c'est le même club
 * (identifiant Transfermarkt, à défaut même nom), sinon la sienne.
 */
export function libraryKeys(registry: Record<string, RegistryClub>, library: BlogClubLogos["library"]) {
  const registryByName = new Map<string, string>();
  for (const [id, club] of Object.entries(registry)) {
    for (const name of [club.nom, ...club.noms]) registryByName.set(normalizeText(name), id);
  }
  return new Map(
    library.map((club) => {
      if (club.transfermarktId && registry[club.transfermarktId]) return [club.key, club.transfermarktId];
      const byName = [club.nom, ...club.noms].map((n) => registryByName.get(normalizeText(n))).find(Boolean);
      return [club.key, byName ?? club.key];
    }),
  );
}

export function buildTeamLogoResolver(
  { registry, periods: scrapedPeriods }: ScrapedClubLogos,
  { versions, library }: BlogClubLogos,
): TeamLogoResolver {
  const keyOfLibrary = libraryKeys(registry, library);
  const libraryLogo = new Map<string, string>();
  const libraryNames = new Map<string, string[]>();
  for (const club of library) {
    const key = keyOfLibrary.get(club.key)!;
    if (!libraryLogo.has(key)) libraryLogo.set(key, club.logoUrl);
    libraryNames.set(key, [...(libraryNames.get(key) ?? []), club.nom, ...club.noms]);
  }

  // Noms saisis dans l'admin d'abord, puis registre, puis bibliothèque
  const namesOf = (id: string) => [
    ...(versions[id] ? [versions[id].nom, ...versions[id].noms] : []),
    ...(registry[id] ? [registry[id].nom, ...registry[id].noms] : []),
    ...(libraryNames.get(id) ?? []),
  ];
  const idByName = new Map<string, string>();
  for (const id of new Set([...Object.keys(versions), ...Object.keys(registry), ...libraryNames.keys()])) {
    for (const name of namesOf(id)) {
      const key = normalizeText(name);
      if (key && !idByName.has(key)) idByName.set(key, id);
    }
  }
  // « Real Madrid CF » → « Real Madrid » : le plus long nom de la bibliothèque qui commence le nom
  const libraryPrefixes = [...libraryNames.entries()]
    .flatMap(([id, names]) => names.map((name) => [normalizeText(name), id] as const))
    .sort((a, b) => b[0].length - a[0].length);
  const idOfName = (name: string) => {
    const wanted = normalizeText(name);
    return idByName.get(wanted) ?? libraryPrefixes.find(([known]) => known && wanted.startsWith(`${known} `))?.[1];
  };
  const idOf = (team: TeamRef) => team.id ?? (team.name ? idOfName(team.name) : undefined);

  // Un club repris par le blog n'a plus que ses propres versions ; rien d'avant 1970
  const periodsOf = (id: string) => sinceMinSeason(versions[id]?.periodes ?? scrapedPeriods[id] ?? []);

  const periodLogo = (team: TeamRef) => {
    const id = idOf(team);
    if (!id) return null;
    // Sans saison, le logo du jour : seules les versions du blog couvrent la saison en cours
    // (les scrapers écartent la période actuelle, laissée au logo du site)
    const season = team.season ?? (versions[id] ? seasonOf(new Date()) : null);
    if (season == null) return null;
    // La période la plus précise l'emporte (un logo d'une saison sur un logo de vingt ans)
    const match = periodsOf(id)
      .filter((p) => (p.de ?? -Infinity) <= season && season <= (p.a ?? Infinity))
      .sort((a, b) => (a.a ?? 3000) - (a.de ?? 0) - ((b.a ?? 3000) - (b.de ?? 0)))[0];
    return match ? absolute(match.logo) : null;
  };

  const currentLogo = (team: TeamRef) => {
    const id = idOf(team);
    const names = [team.name, ...(id ? namesOf(id) : [])].filter(Boolean) as string[];
    // Logos du site (SVG soignés), reconnus par l'un des noms du club
    for (const name of names) {
      const local = getTeamInfo(name).logo;
      if (local !== "logodefault.png") return `${LOCAL_LOGOS}${local}`;
    }
    const tm = id ? registry[id]?.logo : null;
    if (tm) return absolute(tm);
    return (id && libraryLogo.get(id)) || DEFAULT_TEAM_LOGO;
  };

  return {
    logo: (team) => periodLogo(team) ?? currentLogo(team),
    periodLogo,
    currentLogo,
    clubKey: idOf,
    periodsOf,
    namesOf: (id) => [...new Set(namesOf(id))],
  };
}

export const getTeamLogoResolver = cache(async (): Promise<TeamLogoResolver> => {
  const [scraped, blog] = await Promise.all([fetchScrapedClubLogos(), getBlogClubLogos()]);
  return buildTeamLogoResolver(scraped, blog);
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
 * Logo choisi à la main dans une méthode, ou null. L'écusson neutre n'en est pas un : le
 * formulaire l'enregistrait pour un club encore inconnu, il ne doit pas masquer un logo
 * ajouté depuis dans la bibliothèque ou l'historique.
 */
export const chosenLogo = (logo: string | null | undefined) => (logo && logo !== DEFAULT_TEAM_LOGO ? logo : null);

/**
 * Méthode expert avec, pour chaque club d'un parcours (joueur, coach), le logo de l'époque
 * de son arrivée quand il est connu ; sinon le logo choisi à la création de la méthode.
 */
export function withPeriodClubLogos<T extends { typemethode: string }>(methode: T, resolver: TeamLogoResolver): T {
  const swap = (clubs: ClubEntry[]) =>
    clubs.map(([logo, name, years]): ClubEntry => [
      resolver.periodLogo({ name, season: firstYear(years) }) ?? chosenLogo(logo) ?? resolver.currentLogo({ name }),
      name,
      years,
    ]);
  const m = methode as T & {
    clubs?: ClubEntry[];
    clubscoach?: ClubEntry[];
    date?: string;
    nomequipe1?: string;
    nomequipe2?: string;
    logoequipe1?: string;
    logoequipe2?: string;
  };
  if (m.typemethode === "joueur" && Array.isArray(m.clubs)) return { ...m, clubs: swap(m.clubs) };
  if (m.typemethode === "coach" && Array.isArray(m.clubscoach)) return { ...m, clubscoach: swap(m.clubscoach) };
  // Match : logo choisi dans le formulaire, sinon logo d'époque à la date du match
  if (m.typemethode === "match") {
    const season = seasonOfFrenchDate(m.date ?? "");
    return {
      ...m,
      logoequipe1: chosenLogo(m.logoequipe1) ?? resolver.logo({ name: m.nomequipe1, season }),
      logoequipe2: chosenLogo(m.logoequipe2) ?? resolver.logo({ name: m.nomequipe2, season }),
    };
  }
  return methode;
}
