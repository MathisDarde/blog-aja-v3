import { Dispositifs } from "@/components/Dispositifs";
import {
  downloadWikimediaText,
  getClubCoachDuring,
  searchSeasonArticles,
  getWikipediaWikitext,
} from "@/lib/wikidata";
import { findTemplate, firstLink, plainText, templateParam } from "@/lib/wikitext";
import { findSquadPlayer, type SquadPlayer } from "@/lib/squad";

export type { SquadPlayer };

const AJ_AUXERRE = "Q182876";

export interface AjaSeason {
  saison: string;
  coach: string;
  // Système et titulaires de l'équipe type (dans l'ordre des postes du dispositif),
  // seulement si l'article la donne sous forme de SVG lisible
  systeme: string | null;
  titulaires: SquadPlayer[] | null;
  // Effectif complet, pour compléter les numéros à la main
  effectif: SquadPlayer[];
}

/** « 2021-2022 », « 2021/22 », « 2021 » → { from: 2021, to: 2022 }. */
export function parseSeason(text: string): { from: number; to: number } | null {
  const match = /((?:19|20)\d{2})\s*(?:[-/–]\s*((?:19|20)?\d{2}))?/.exec(text);
  if (!match) return null;
  const from = Number(match[1]);
  const to = match[2]
    ? Number(match[2].length === 2 ? `${match[1].slice(0, 2)}${match[2]}` : match[2])
    : from + 1;
  return to === from + 1 ? { from, to } : null;
}

/** {{Feff joueur |num=16 |prénom=Donovan |nom=Léon |pos=Gardien}} → joueurs de l'effectif. */
function parseSquad(wikitext: string): SquadPlayer[] {
  const players: SquadPlayer[] = [];
  let rest = wikitext;
  for (;;) {
    const template = findTemplate(rest, ["Feff joueur"]);
    if (!template) break;
    rest = rest.slice(rest.indexOf(template) + template.length);

    const arg = (name: string) => plainText(templateParam(template, [name]) ?? "");
    const nom = [arg("prénom"), arg("nom")].filter(Boolean).join(" ");
    if (nom) {
      const poste = arg("pos");
      players.push({ nom, numero: arg("num"), poste: POSTES[poste] ?? poste, nationalite: arg("nat") });
    }
  }
  return players;
}

/**
 * Noms et positions des joueurs dessinés sur le SVG « équipe type ». Les textes
 * sont souvent placés dans des groupes décalés : on additionne leurs translations.
 */
function parseLineupSvg(svg: string): { name: string; x: number; y: number }[] {
  const translate = (tag: string) => {
    const match = /transform="\s*(?:translate|matrix)\(([^)]*)\)/.exec(tag);
    if (!match) return [0, 0];
    const values = match[1].split(/[\s,]+/).filter(Boolean).map(Number);
    // matrix(a,b,c,d,e,f) : la translation est (e,f)
    return values.length === 6 ? [values[4], values[5]] : [values[0] ?? 0, values[1] ?? 0];
  };

  const players: { name: string; x: number; y: number }[] = [];
  const offsets: number[][] = [];
  const tags = /<g\b[^>]*\/>|<g\b[^>]*>|<\/g>|<text\b([^>]*)>([\s\S]*?)<\/text>/g;
  for (const match of svg.matchAll(tags)) {
    const tag = match[0];
    if (tag.startsWith("</g")) offsets.pop();
    else if (tag.startsWith("<g") && !tag.endsWith("/>")) offsets.push(translate(tag));
    else if (tag.startsWith("<text")) {
      // « Autret (Hein) (Trouillet) » : le titulaire, puis ses remplaçants
      const name = match[2].replace(/<[^>]+>/g, " ").split("(")[0].replace(/\s+/g, " ").trim();
      const x = Number(/\bx="([-\d.]+)"/.exec(match[1])?.[1] ?? NaN);
      const y = Number(/\by="([-\d.]+)"/.exec(match[1])?.[1] ?? NaN);
      if (!name || Number.isNaN(x) || Number.isNaN(y)) continue;
      const [ox, oy] = [...offsets, translate(match[1])].reduce(
        ([ax, ay], [bx, by]) => [ax + bx, ay + by],
        [0, 0],
      );
      players.push({ name, x: x + ox, y: y + oy });
    }
  }
  return players;
}

// Coordonnées ramenées entre 0 et 1 sur chaque axe
const normalizePoints = (points: { x: number; y: number }[]) => {
  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  const [minX, maxX, minY, maxY] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
  return points.map((p) => ({
    x: (p.x - minX) / (maxX - minX || 1),
    y: (p.y - minY) / (maxY - minY || 1),
  }));
};

/**
 * Système et ordre des titulaires : chaque joueur du SVG est associé au poste le plus
 * proche de chaque dispositif, et on garde le dispositif où l'ensemble colle le mieux.
 */
function matchFormation(players: { name: string; x: number; y: number }[]) {
  const playerPoints = normalizePoints(players);
  let best: { systeme: string; order: number[]; cost: number } | null = null;

  for (const dispositif of Dispositifs) {
    if (dispositif.postes.length !== players.length) continue;
    // Le gardien est en haut du SVG, comme dans positionDom
    const slots = normalizePoints(
      dispositif.postes.map((poste) => {
        const [x, y] = poste.positionDom.split(",").map((v) => Number.parseFloat(v));
        return { x, y };
      }),
    );

    // Affectation gloutonne des paires les plus proches
    const pairs = slots
      .flatMap((slot, s) =>
        playerPoints.map((p, j) => ({ s, j, d: (slot.x - p.x) ** 2 + (slot.y - p.y) ** 2 })),
      )
      .sort((a, b) => a.d - b.d);
    const order = new Array<number>(slots.length).fill(-1);
    const used = new Set<number>();
    let cost = 0;
    for (const { s, j, d } of pairs) {
      if (order[s] !== -1 || used.has(j)) continue;
      order[s] = j;
      used.add(j);
      cost += d;
    }
    if (!best || cost < best.cost) best = { systeme: dispositif.name, order, cost };
  }
  return best;
}

/** Effectif d'un article de saison : dans l'article, ou dans son modèle {{Effectif de …}}. */
async function squadFromPage(page: string): Promise<SquadPlayer[]> {
  const effectif = parseSquad(page);
  if (effectif.length > 0) return effectif;
  const squadTemplate = /\{\{\s*(Effectif d[eu'][^}|]*)\}\}/.exec(page)?.[1];
  return squadTemplate
    ? parseSquad((await getWikipediaWikitext(`Modèle:${squadTemplate.trim()}`)) ?? "")
    : [];
}

const MOIS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];

/**
 * Saison d'un match d'après sa date (« samedi 16 mai 2022, 20h45 » → 2021-2022) :
 * une saison commence en juillet.
 */
export function seasonFromDate(date: string): string | null {
  const year = /\b((?:19|20)\d{2})\b/.exec(date)?.[1];
  if (!year) return null;
  const lower = date.toLowerCase();
  const monthName = MOIS.findIndex((m) => lower.includes(m));
  const numeric = /\b\d{1,2}[/.-](\d{1,2})[/.-](?:19|20)\d{2}\b/.exec(date)?.[1];
  const month = monthName !== -1 ? monthName + 1 : numeric ? Number(numeric) : 8;
  const from = month >= 7 ? Number(year) : Number(year) - 1;
  return `${from}-${from + 1}`;
}

const isAuxerre = (team: string) => /auxerre|^aja$/i.test(team.trim());

// Mots qui identifient un club (« Olympique de Marseille » → marseille)
const GENERIC = new Set(["saison", "football", "club", "olympique", "sporting", "association", "united", "city", "real"]);
const clubWords = (name: string) =>
  name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .split(/[^a-z]+/)
    .filter((w) => w.length >= 4 && !GENERIC.has(w));

// Postes abrégés de certains effectifs
const POSTES: Record<string, string> = { G: "Gardien", D: "Défenseur", M: "Milieu", A: "Attaquant" };

/**
 * Effectif d'une équipe pour une saison : l'article de saison de l'AJA, ou pour un
 * autre club le premier article « Saison 2021-2022 … » trouvé qui contient un effectif.
 */
export async function getTeamSquad(team: string, saison: string): Promise<SquadPlayer[]> {
  if (isAuxerre(team)) {
    const page = await getWikipediaWikitext(`Saison ${saison} de l'AJ Auxerre`);
    return page ? squadFromPage(page) : [];
  }

  // Le titre doit nommer le club : la recherche renvoie aussi les saisons d'autres clubs
  const words = clubWords(team);
  const titles = (await searchSeasonArticles(team, saison)).filter((title) =>
    clubWords(title).some((w) => words.includes(w)),
  );
  for (const title of titles) {
    const page = await getWikipediaWikitext(title);
    const effectif = page ? await squadFromPage(page) : [];
    if (effectif.length > 0) return effectif;
  }
  return [];
}

/** Coach, équipe type et effectif d'une saison de l'AJ Auxerre, d'après Wikipédia. */
export async function getAjaSeason(text: string): Promise<AjaSeason | null> {
  const season = parseSeason(text);
  if (!season) return null;
  const saison = `${season.from}-${season.to}`;

  const page = await getWikipediaWikitext(`Saison ${saison} de l'AJ Auxerre`);
  if (!page) return null;

  // Coach : infobox de la saison, à défaut l'entraîneur principal noté sur Wikidata
  const infobox = findTemplate(page, ["Infobox[^|}]*"]);
  const coachCell = infobox ? templateParam(infobox, ["entraineur", "entraîneur"]) : null;
  const coach =
    (coachCell && (firstLink(coachCell)?.label ?? plainText(coachCell))) ||
    (await getClubCoachDuring(AJ_AUXERRE, season.from, season.to)) ||
    "";

  const effectif = await squadFromPage(page);

  // Équipe type : seulement un SVG, dont on peut lire les noms
  const lineupFile = /\[\[\s*(?:Fichier|File|Image)\s*:\s*([^|\]]*(?:quipe|compo)[^|\]]*\.svg)/i.exec(page)?.[1];
  const lineup = lineupFile ? parseLineupSvg((await downloadWikimediaText(lineupFile.trim())) ?? "") : [];
  const formation = lineup.length === 11 ? matchFormation(lineup) : null;

  return {
    saison,
    coach,
    systeme: formation?.systeme ?? null,
    titulaires: formation
      ? formation.order.map((j) => {
          const player = findSquadPlayer(effectif, lineup[j].name);
          return { nom: player?.nom ?? lineup[j].name, numero: player?.numero ?? "" };
        })
      : null,
    effectif,
  };
}
