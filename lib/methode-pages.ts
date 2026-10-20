// Pages des méthodes expert (/joueurs, /coachs, /matchs, /saisons) : croisements entre
// méthodes, phrase de contexte, titres et données structurées. Côté serveur uniquement.

import { cache } from "react";
import getAllMethodes from "@/actions/method/get-all-methodes";
import { getArticles } from "@/controllers/ArticlesController";
import type { MethodeCoach, MethodeJoueur, MethodeMatch, Methodes } from "@/contexts/Interfaces";
import { ficheKey, linkMethodes, mentionedMethodes, methodeKey, methodeUrl, MethodeType } from "@/lib/methodes";
import { normalizeText } from "@/lib/normalize-text";
import { ajaLogo, getTeamLogoResolver, seasonOfFrenchDate, TeamLogoResolver, withPeriodClubLogos } from "@/lib/team-logos";

export interface MatchSide {
  name: string;
  // Abréviation (AJA, BVB…), sinon le nom du club
  short: string;
  logo: string | null;
}

export interface CrossingLink {
  url: string;
  name: string;
  details?: string;
  // Portrait (joueur, coach), bannière (article) ou logo d'époque de l'AJA (saison)
  image?: string | null;
  // Match : les deux équipes et le score
  match?: { sides: [MatchSide, MatchSide]; score: string | null };
  // Méthode de la page elle-même (frise des matchs de la saison)
  current?: boolean;
}

export interface Crossings {
  joueurs: CrossingLink[];
  coachs: CrossingLink[];
  matchs: CrossingLink[];
  saisons: CrossingLink[];
  articles: CrossingLink[];
}

// --- Dates et textes ---

const MONTHS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
const WEEKDAYS = /^(lundi|mardi|mercredi|jeudi|vendredi|samedi|dimanche)\s+/i;

/** « Mardi 20 avril 1993, 20h45 » → « 20 avril 1993 » */
export const shortDate = (date: string) => date.split(",")[0].replace(WEEKDAYS, "").replace(/\s+/g, " ").trim();

/** « Mardi 20 avril 1993, 20h45 » → « 1993-04-20 », ou null si la date n'est pas lisible. */
export function isoDate(date: string): string | null {
  const match = normalizeText(shortDate(date)).match(/^(\d{1,2})(?:er)? ([a-z]+) (\d{4})$/);
  if (!match) return null;
  const month = MONTHS.findIndex((m) => normalizeText(m) === match[2]);
  if (month === -1) return null;
  return `${match[3]}-${String(month + 1).padStart(2, "0")}-${match[1].padStart(2, "0")}`;
}

const firstYear = (text: string) => Number(text.match(/\b(19|20)\d{2}\b/)?.[0] ?? 0) || null;

const lowerFirst = (text: string) => text.charAt(0).toLowerCase() + text.slice(1);

/** « A, B et C » */
const frenchList = (items: string[]) =>
  items.length <= 1 ? items.join("") : `${items.slice(0, -1).join(", ")} et ${items[items.length - 1]}`;

const isAja = (club: string) => ["aj auxerre", "auxerre"].includes(normalizeText(club));

/** « 1999-2004 » → « de 1999 à 2004 », « 2012 » → « en 2012 », « 2024- » → « depuis 2024 » */
function period(years: string) {
  const [start, end] = years.split(/\s*[-–]\s*/);
  if (!start) return "";
  if (end === undefined) return `en ${start}`;
  if (!end) return `depuis ${start}`;
  return start === end ? `en ${start}` : `de ${start} à ${end}`;
}

/** Première et dernière année des périodes à l'AJA : « 1995-2001 » */
function ajaSpan(clubs: [string, string, string][]) {
  const years = clubs
    .filter(([, name]) => isAja(name))
    .flatMap(([, , years]) => years.match(/\b(19|20)\d{2}\b/g) ?? []);
  if (!years.length) return null;
  const sorted = years.map(Number).sort((a, b) => a - b);
  return sorted[0] === sorted[sorted.length - 1] ? `${sorted[0]}` : `${sorted[0]}-${sorted[sorted.length - 1]}`;
}

// --- Compositions des matchs et des saisons ---

export const isCoachEntry = (poste: string | undefined) => /^(coach|entra[iî]neur)$/i.test((poste ?? "").trim());

function squad(methode: Methodes): { players: Set<string>; coaches: Set<string> } {
  const players = new Set<string>();
  const coaches = new Set<string>();
  const add = (list: unknown) => {
    if (!Array.isArray(list)) return;
    for (const p of list as { nom?: string; poste?: string }[]) {
      if (!p?.nom?.trim()) continue;
      (isCoachEntry(p.poste) ? coaches : players).add(normalizeText(p.nom));
    }
  };
  if (methode.typemethode === "match") {
    add(methode.titulairesequipe1);
    add(methode.titulairesequipe2);
    add(methode.remplacantsequipe1);
    add(methode.remplacantsequipe2);
  } else if (methode.typemethode === "saison") {
    add(methode.titulaires);
    add(methode.remplacants);
    if (methode.coach?.trim()) coaches.add(normalizeText(methode.coach));
  }
  return { players, coaches };
}

const matchSeason = (match: MethodeMatch) => seasonOfFrenchDate(match.date);
const ajaPlays = (match: MethodeMatch) => isAja(match.nomequipe1) || isAja(match.nomequipe2);
const matchTime = (match: MethodeMatch) => isoDate(match.date) ?? String(firstYear(match.date) ?? "");

// --- Graphe des méthodes (une fois par rendu) ---

export const getMethodeGraph = cache(async () => {
  const [raw, articles, resolver] = await Promise.all([getAllMethodes(), getArticles(), getTeamLogoResolver()]);
  // Logos d'époque (clubs des joueurs et coachs, équipes des matchs)
  const methodes = (raw as Methodes[]).map((m) => withPeriodClubLogos(m, resolver));

  // Articles citant chaque méthode (insérée dans l'éditeur ou surlignée automatiquement)
  const citations = new Map<string, CrossingLink[]>();
  for (const article of [...articles].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())) {
    for (const key of mentionedMethodes(linkMethodes(article.content, methodes))) {
      const citation = { url: `/articles/${article.slug}`, name: article.title, image: article.imageUrl || null };
      citations.set(key, [...(citations.get(key) ?? []), citation]);
    }
  }

  const squads = new Map(methodes.map((m) => [m.id_methode, squad(m)]));
  return { methodes, citations, squads, resolver };
});

type Graph = Awaited<ReturnType<typeof getMethodeGraph>>;

export const hasScore = (match: MethodeMatch) =>
  !!match.abreviationequipe1 && !!match.abreviationequipe2 && match.scoreequipe1 != null && match.scoreequipe2 != null;

const side = (name: string, short: string | undefined, logo: string | undefined): MatchSide => ({
  name,
  short: short || name,
  logo: logo || null,
});

/** Carte d'une méthode (lien, nom, image ou logos et score). */
export function methodeLink(methode: Methodes, resolver: TeamLogoResolver): CrossingLink | null {
  const url = methodeUrl(methode);
  if (!url) return null;
  switch (methode.typemethode) {
    case "joueur":
      return { url, name: methode.joueurnom, details: methode.poste, image: methode.imagejoueur || null };
    case "coach":
      return { url, name: methode.nomcoach, details: "Entraîneur", image: methode.imagecoach || null };
    case "match":
      return {
        url,
        name: matchHeading(methode),
        details: shortDate(methode.date),
        match: {
          sides: [
            side(methode.nomequipe1, methode.abreviationequipe1, methode.logoequipe1),
            side(methode.nomequipe2, methode.abreviationequipe2, methode.logoequipe2),
          ],
          score: hasScore(methode) ? `${methode.scoreequipe1} - ${methode.scoreequipe2}` : null,
        },
      };
    case "saison":
      return {
        url,
        name: `Saison ${methode.saison}`,
        details: methode.coach,
        image: ajaLogo(firstYear(methode.saison), resolver),
      };
  }
}

function crossingsOf(methode: Methodes, graph: Graph): Crossings {
  const of = <T extends Methodes["typemethode"]>(type: T) =>
    graph.methodes.filter((m): m is Extract<Methodes, { typemethode: T }> => m.typemethode === type);
  const matchs = of("match").sort((a, b) => matchTime(a).localeCompare(matchTime(b)));
  const saisons = of("saison").sort((a, b) => a.saison.localeCompare(b.saison));
  const squadOf = (m: Methodes) => graph.squads.get(m.id_methode)!;
  const links = (list: Methodes[]) =>
    list
      .map((m) => {
        const l = methodeLink(m, graph.resolver);
        return l && m.id_methode === methode.id_methode ? { ...l, current: true } : l;
      })
      .filter((l): l is CrossingLink => l !== null);

  const crossings: Crossings = {
    joueurs: [],
    coachs: [],
    matchs: [],
    saisons: [],
    articles: graph.citations.get(methodeKey(methode)) ?? [],
  };

  switch (methode.typemethode) {
    case "joueur": {
      const name = normalizeText(methode.joueurnom);
      crossings.matchs = links(matchs.filter((m) => squadOf(m).players.has(name)));
      crossings.saisons = links(saisons.filter((s) => squadOf(s).players.has(name)));
      break;
    }
    case "coach": {
      const name = normalizeText(methode.nomcoach);
      crossings.matchs = links(matchs.filter((m) => squadOf(m).coaches.has(name)));
      crossings.saisons = links(saisons.filter((s) => squadOf(s).coaches.has(name)));
      break;
    }
    case "match": {
      const { players, coaches } = squadOf(methode);
      const season = matchSeason(methode);
      crossings.joueurs = links(of("joueur").filter((j) => players.has(normalizeText(j.joueurnom))));
      crossings.coachs = links(of("coach").filter((c) => coaches.has(normalizeText(c.nomcoach))));
      crossings.saisons = ajaPlays(methode)
        ? links(saisons.filter((s) => firstYear(s.saison) === season))
        : [];
      // Frise de la saison, ce match compris (sauf s'il est seul)
      const campaign = ajaPlays(methode) ? matchs.filter((m) => ajaPlays(m) && matchSeason(m) === season) : [];
      crossings.matchs = campaign.length > 1 ? links(campaign) : [];
      break;
    }
    case "saison": {
      const { players, coaches } = squadOf(methode);
      const season = firstYear(methode.saison);
      crossings.joueurs = links(of("joueur").filter((j) => players.has(normalizeText(j.joueurnom))));
      crossings.coachs = links(of("coach").filter((c) => coaches.has(normalizeText(c.nomcoach))));
      crossings.matchs = links(matchs.filter((m) => ajaPlays(m) && matchSeason(m) === season));
      break;
    }
  }
  return crossings;
}

/** Une fiche sans aucun lien vers le reste du site n'est pas proposée aux moteurs. */
export const hasCrossings = (crossings: Crossings) =>
  Object.values(crossings).some((list: CrossingLink[]) => list.some((l) => !l.current));

// --- Titres et phrase de contexte ---

export function matchHeading(match: MethodeMatch) {
  if (hasScore(match)) {
    return `${match.nomequipe1} ${match.scoreequipe1} - ${match.scoreequipe2} ${match.nomequipe2}`;
  }
  return match.titrematch;
}

function intro(methode: Methodes): string {
  switch (methode.typemethode) {
    case "joueur": {
      const aja = methode.clubs.filter(([, name]) => isAja(name)).map(([, , years]) => period(years)).filter(Boolean);
      const poste = lowerFirst(methode.poste.trim());
      if (aja.length) {
        return `${methode.joueurnom}, ${poste}, a porté le maillot de l'AJ Auxerre ${aja.join(" puis ")}.`;
      }
      const clubs = [...new Set(methode.clubs.map(([, name]) => name).filter(Boolean))].slice(0, 3);
      return clubs.length
        ? `${methode.joueurnom}, ${poste} passé notamment par ${frenchList(clubs)}.`
        : `${methode.joueurnom}, ${poste}.`;
    }
    case "coach": {
      const aja = methode.clubscoach.filter(([, name]) => isAja(name)).map(([, , years]) => period(years)).filter(Boolean);
      const others = [...new Set(methode.clubscoach.map(([, name]) => name).filter((name) => name && !isAja(name)))];
      if (aja.length) {
        const sentence = `${methode.nomcoach} a entraîné l'AJ Auxerre ${aja.join(" puis ")}.`;
        return others.length ? `${sentence} Autres clubs entraînés : ${frenchList(others.slice(0, 3))}.` : sentence;
      }
      return others.length
        ? `${methode.nomcoach}, entraîneur passé notamment par ${frenchList(others.slice(0, 3))}.`
        : `${methode.nomcoach}, entraîneur.`;
    }
    case "match": {
      const date = shortDate(methode.date);
      const first = `${date ? `Le ${date}, ` : ""}${methode.nomequipe1} affronte ${methode.nomequipe2}${methode.stade ? ` (${methode.stade})` : ""}.`;
      if (methode.scoreequipe1 == null || !methode.abreviationequipe1) return first;
      const extras = [
        methode.prolongation ? "après prolongation" : "",
        methode.tabequipe1 != null && methode.tabequipe2 != null
          ? `${methode.tabequipe1} tirs au but à ${methode.tabequipe2}`
          : "",
      ].filter(Boolean);
      return `${first} Score final : ${matchHeading(methode)}${extras.length ? `, ${extras.join(", ")}` : ""}.`;
    }
    case "saison":
      return `Saison ${methode.saison} de l'AJ Auxerre, sous la direction de ${methode.coach}${methode.systeme ? `, en ${methode.systeme}` : ""}.`;
  }
}

const DESCRIPTION_SUFFIX: Record<MethodeType, string> = {
  joueur: "Profil, clubs et matchs référencés sur Mémoire d'Auxerrois.",
  coach: "Clubs, palmarès et saisons référencées sur Mémoire d'Auxerrois.",
  match: "Compositions, buteurs et remplaçants des deux équipes.",
  saison: "Composition type et effectif de la saison.",
};

function headings(methode: Methodes): { h1: string; title: string } {
  switch (methode.typemethode) {
    case "joueur": {
      const span = ajaSpan(methode.clubs);
      return {
        h1: methode.joueurnom,
        title: span ? `${methode.joueurnom} à l'AJ Auxerre (${span})` : `${methode.joueurnom}, ${lowerFirst(methode.poste)}`,
      };
    }
    case "coach": {
      const span = ajaSpan(methode.clubscoach);
      return {
        h1: methode.nomcoach,
        title: span ? `${methode.nomcoach}, entraîneur de l'AJ Auxerre (${span})` : `${methode.nomcoach}, entraîneur`,
      };
    }
    case "match": {
      const h1 = matchHeading(methode);
      const date = shortDate(methode.date);
      return { h1, title: date ? `${h1} (${date})` : h1 };
    }
    case "saison":
      return { h1: `Saison ${methode.saison} de l'AJ Auxerre`, title: `Saison ${methode.saison} de l'AJ Auxerre` };
  }
}

// --- Accès aux pages ---

export interface MethodePageData {
  methode: Methodes;
  url: string;
  h1: string;
  title: string;
  intro: string;
  description: string;
  crossings: Crossings;
  indexable: boolean;
  // Joueur ou coach passé par l'AJA
  ajaMember: boolean;
  // Fiches des joueurs et coachs d'un match ou d'une saison : nom normalisé → page
  fiches: Record<string, string>;
  // Logo de l'AJA à l'époque (saison)
  logo: string | null;
  // Saison du match (« 1992-1993 »), pour les matchs de l'AJA
  season: string | null;
}


export const getMethodePage = cache(async (type: MethodeType, slug: string): Promise<MethodePageData | null> => {
  const graph = await getMethodeGraph();
  const methode = graph.methodes.find((m) => m.typemethode === type && m.slug === slug);
  const url = methode && methodeUrl(methode);
  if (!methode || !url) return null;

  const crossings = crossingsOf(methode, graph);
  const sentence = intro(methode);
  const fiches = Object.fromEntries([...crossings.joueurs, ...crossings.coachs].map((l) => [ficheKey(l.name), l.url]));
  const matchYear = methode.typemethode === "match" && ajaPlays(methode) ? matchSeason(methode) : null;
  return {
    methode,
    url,
    ...headings(methode),
    intro: sentence,
    description: `${sentence} ${DESCRIPTION_SUFFIX[type]}`,
    crossings,
    indexable: hasCrossings(crossings),
    ajaMember:
      (methode.typemethode === "joueur" && methode.clubs.some(([, name]) => isAja(name))) ||
      (methode.typemethode === "coach" && methode.clubscoach.some(([, name]) => isAja(name))),
    fiches,
    logo: methode.typemethode === "saison" ? ajaLogo(firstYear(methode.saison), graph.resolver) : null,
    season: matchYear ? `${matchYear}-${matchYear + 1}` : null,
  };
});

/** Adresses des méthodes d'un type (pré-rendu au build). */
export async function methodeSlugs(type: MethodeType) {
  const { methodes } = await getMethodeGraph();
  return methodes.filter((m) => m.typemethode === type && m.slug).map((m) => ({ slug: m.slug! }));
}

/** Pages des méthodes proposées aux moteurs (sitemap). */
export async function indexableMethodePages() {
  const graph = await getMethodeGraph();
  return graph.methodes
    .filter((m) => methodeUrl(m) && hasCrossings(crossingsOf(m, graph)))
    .map((m) => ({
      url: methodeUrl(m)!,
      lastModified: new Date(m.updatedAt),
      image:
        m.typemethode === "joueur" ? (m as MethodeJoueur).imagejoueur : m.typemethode === "coach" ? (m as MethodeCoach).imagecoach : null,
    }));
}

// --- Méthodes citées par un article ---

export type CitedMethodes = Pick<Crossings, "joueurs" | "coachs" | "matchs" | "saisons">;

/**
 * Méthodes citées dans le HTML d'un article (après linkMethodes), par type et dans l'ordre
 * du texte : seules ces cartes partent au navigateur, pas toutes les méthodes.
 * `methodes` : avec leurs logos d'époque (withPeriodClubLogos).
 */
export function citedMethodes(content: string, methodes: Methodes[], resolver: TeamLogoResolver): CitedMethodes {
  const byKey = new Map(methodes.map((m) => [methodeKey(m), m]));
  const cited: CitedMethodes = { joueurs: [], coachs: [], matchs: [], saisons: [] };
  const lists = { joueur: cited.joueurs, coach: cited.coachs, match: cited.matchs, saison: cited.saisons };
  for (const key of mentionedMethodes(content)) {
    const methode = byKey.get(key);
    const card = methode && methodeLink(methode, resolver);
    if (card) lists[methode.typemethode].push(card);
  }
  return cited;
}
