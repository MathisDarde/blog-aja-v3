import {
  type InfoboxCareerRow,
  findTemplate,
  firstLink,
  parseAppearances,
  parseCareerColumns,
  parseCareerTotal,
  parsePalmares,
  parseRecord,
  plainText,
  templateParam,
} from "@/lib/wikitext";

// Accès en lecture à l'API Wikidata. On n'utilise pas le service SPARQL :
// ses serveurs sont parfois désynchronisés et renvoient des carrières incomplètes.
// Wikimedia exige un User-Agent identifiable : https://meta.wikimedia.org/wiki/User-Agent_policy
const USER_AGENT = "blog-aja/1.0 (https://github.com/MathisDarde/blog-aja-v3)";
const API_URL = "https://www.wikidata.org/w/api.php";
const FRWIKI_API_URL = "https://fr.wikipedia.org/w/api.php";

// Métiers acceptés dans la recherche : footballeur, entraîneur de football
const FOOTBALL_OCCUPATIONS = ["Q937857", "Q628099"];
// Toute équipe nationale (A, espoirs, U17…) en est une sous-classe
const NATIONAL_TEAM = "Q6979593";
const CENTIMETRE = "Q174728";

const CACHE_SECONDS = 60 * 60 * 24;
const MAX_IDS_PER_REQUEST = 50;

export interface WikidataPerson {
  id: string;
  label: string;
  description: string;
}

export interface WikidataCareerEntry {
  // Absent pour un club sans article Wikipédia / élément Wikidata
  clubId: string | null;
  clubName: string;
  start: number | null;
  end: number | null;
  // Logo Wikidata (P154) ; à défaut on regarde l'infobox de la page Wikipédia du club
  logoFile: string | null;
  clubPage: string | null;
}

export interface WikidataFootballer {
  id: string;
  name: string;
  positions: string[];
  heightMeters: number | null;
  career: WikidataCareerEntry[];
  // Totaux de l'infobox Wikipédia (souvent le championnat seulement)
  totals: { matchs: number; buts: number } | null;
}

interface Snak {
  datavalue?: { value: unknown };
}
interface Claim {
  rank: "preferred" | "normal" | "deprecated";
  mainsnak: Snak;
  qualifiers?: Record<string, Snak[]>;
}
interface Entity {
  id: string;
  labels?: Record<string, { value: string }>;
  sitelinks?: Record<string, { title: string }>;
  claims?: Record<string, Claim[]>;
}

export interface WikidataCoach {
  id: string;
  name: string;
  career: WikidataCareerEntry[];
  // Bilan victoires / nuls / défaites additionné depuis l'infobox
  record: { v: number; n: number; d: number } | null;
  // [intitulé, nombre de titres] de la section « Palmarès »
  palmares: string[][];
}

export class WikidataRateLimitError extends Error {}

export const isWikidataId = (value: string) => /^Q\d+$/.test(value);

async function getJson<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    headers: { "User-Agent": USER_AGENT, Accept: "application/json" },
    next: { revalidate: CACHE_SECONDS },
  });
  if (response.status === 429) {
    throw new WikidataRateLimitError("Trop de requêtes vers Wikimedia");
  }
  if (!response.ok) {
    throw new Error(`Wikimedia a répondu ${response.status}`);
  }
  return response.json();
}

async function getEntities(
  ids: string[],
  props: string,
): Promise<Record<string, Entity>> {
  const unique = [...new Set(ids)];
  const chunks: string[][] = [];
  for (let i = 0; i < unique.length; i += MAX_IDS_PER_REQUEST) {
    chunks.push(unique.slice(i, i + MAX_IDS_PER_REQUEST));
  }

  const results = await Promise.all(
    chunks.map((chunk) =>
      getJson<{ entities: Record<string, Entity> }>(
        `${API_URL}?action=wbgetentities&format=json&languages=fr|en&sitefilter=frwiki&props=${props}&ids=${chunk.join("|")}`,
      ),
    ),
  );
  return Object.assign({}, ...results.map((r) => r.entities));
}

// Valeurs d'une propriété, hors rang « obsolète », rang « préféré » en premier
const claimsOf = (entity: Entity | undefined, property: string) =>
  (entity?.claims?.[property] ?? [])
    .filter((claim) => claim.rank !== "deprecated" && claim.mainsnak.datavalue)
    .sort((a, b) => Number(b.rank === "preferred") - Number(a.rank === "preferred"));

const itemId = (snak?: Snak) =>
  (snak?.datavalue?.value as { id?: string } | undefined)?.id ?? null;

const label = (entity: Entity | undefined) =>
  entity?.labels?.fr?.value ?? entity?.labels?.en?.value ?? "";

// "+1999-00-00T00:00:00Z" → 1999
const year = (snak?: Snak) => {
  const time = (snak?.datavalue?.value as { time?: string } | undefined)?.time;
  return time ? Number.parseInt(time.slice(1, 5), 10) : null;
};

// Passage dans une équipe, à partir d'une déclaration « membre de » / « entraîneur de »
function careerEntry(team: Entity, claim: Claim): WikidataCareerEntry {
  const logo = claimsOf(team, "P154")[0]?.mainsnak.datavalue?.value;
  return {
    clubId: team.id,
    clubName: label(team),
    start: year(claim.qualifiers?.P580?.[0]),
    end: year(claim.qualifiers?.P582?.[0]),
    logoFile: typeof logo === "string" ? logo : null,
    clubPage: team.sitelinks?.frwiki?.title ?? null,
  };
}

// Ordre chronologique, les passages sans date à la fin
const chronological = (a: WikidataCareerEntry, b: WikidataCareerEntry) =>
  (a.start ?? Infinity) - (b.start ?? Infinity);

/** Classes qui sont des équipes nationales (en remontant les sous-classes). */
async function findNationalTeamClasses(classIds: string[]): Promise<Set<string>> {
  const parents = new Map<string, string[]>();
  let toVisit = [...new Set(classIds)];

  // 3 niveaux suffisent (ex. U17 féminine → équipe féminine → équipe nationale)
  for (let depth = 0; depth < 3 && toVisit.length > 0; depth++) {
    const entities = await getEntities(toVisit, "claims");
    for (const id of toVisit) {
      parents.set(
        id,
        claimsOf(entities[id], "P279").map((c) => itemId(c.mainsnak)!).filter(Boolean),
      );
    }
    toVisit = [...new Set([...parents.values()].flat())].filter(
      (id) => !parents.has(id) && id !== NATIONAL_TEAM,
    );
  }

  const isNational = (id: string, seen = new Set<string>()): boolean => {
    if (id === NATIONAL_TEAM) return true;
    if (seen.has(id)) return false;
    seen.add(id);
    return (parents.get(id) ?? []).some((parent) => isNational(parent, seen));
  };
  return new Set(classIds.filter((id) => isNational(id)));
}

/** Recherche des footballeurs / entraîneurs par nom. */
export async function searchFootballPeople(
  query: string,
): Promise<WikidataPerson[]> {
  return (await searchFootballEntities(query)).map(({ person }) => person);
}

// Résultats de recherche limités aux personnes dont le métier est lié au football
async function searchFootballEntities(
  query: string,
): Promise<{ person: WikidataPerson; entity: Entity }[]> {
  const search = await getJson<{
    search: { id: string; label: string; description?: string }[];
  }>(
    `${API_URL}?action=wbsearchentities&format=json&language=fr&uselang=fr&type=item&limit=15&search=${encodeURIComponent(query)}`,
  );
  if (search.search.length === 0) return [];

  const entities = await getEntities(
    search.search.map((r) => r.id),
    "claims|sitelinks",
  );
  return search.search
    .filter((r) =>
      claimsOf(entities[r.id], "P106").some((c) =>
        FOOTBALL_OCCUPATIONS.includes(itemId(c.mainsnak) ?? ""),
      ),
    )
    .map((r) => ({
      person: { id: r.id, label: r.label, description: r.description ?? "" },
      entity: entities[r.id],
    }));
}

const AJ_AUXERRE = "Q182876";
const FOOTBALL_MANAGER = "Q628099";

export interface WikidataPlayerCard {
  id: string;
  positions: string[];
  // Entraîneur pendant la période demandée (d'après sa carrière d'entraîneur Wikipédia)
  coachedDuring: boolean;
  country: { id: string; label: string; flagFile: string | null } | null;
}

/**
 * Poste et nationalité sportive d'un joueur à partir de son seul nom.
 * Entre homonymes, on privilégie celui qui est passé par l'AJ Auxerre.
 * `period` (années de la saison ou du match) sert à savoir s'il était alors entraîneur.
 */
export async function findPlayerCard(
  name: string,
  period?: { from: number; to: number },
): Promise<WikidataPlayerCard | null> {
  const candidates = await searchFootballEntities(name);
  const passedByAuxerre = (entity: Entity) =>
    ["P54", "P6087"].some((property) =>
      claimsOf(entity, property).some((c) => itemId(c.mainsnak) === AJ_AUXERRE),
    );
  const best = candidates.find(({ entity }) => passedByAuxerre(entity)) ?? candidates[0];
  if (!best) return null;

  const positionIds = claimsOf(best.entity, "P413").map((c) => itemId(c.mainsnak)!);
  // Nationalité sportive en priorité (un Guadeloupéen joue pour la France), sinon citoyenneté
  const countryId =
    itemId(claimsOf(best.entity, "P1532")[0]?.mainsnak) ??
    itemId(claimsOf(best.entity, "P27")[0]?.mainsnak);

  const linked = await getEntities(
    [...positionIds, ...(countryId ? [countryId] : [])],
    "labels|claims",
  );
  const flag = countryId ? claimsOf(linked[countryId], "P41")[0]?.mainsnak.datavalue?.value : null;

  const isManager = claimsOf(best.entity, "P106").some(
    (c) => itemId(c.mainsnak) === FOOTBALL_MANAGER,
  );
  const frwikiTitle = best.entity.sitelinks?.frwiki?.title;
  const coachingRows =
    isManager && period && frwikiTitle
      ? (await getInfoboxRows(frwikiTitle, COACH_CAREER_PARAMS)).rows
      : [];

  return {
    id: best.person.id,
    positions: positionIds.map((id) => label(linked[id])).filter(Boolean),
    coachedDuring: coachingRows.some(
      (row) =>
        row.start !== null &&
        row.start <= period!.to &&
        (row.end ?? Number.POSITIVE_INFINITY) >= period!.from,
    ),
    country: countryId
      ? {
          id: countryId,
          label: label(linked[countryId]),
          flagFile: typeof flag === "string" ? flag : null,
        }
      : null,
  };
}

/** Profil d'un joueur : poste, taille et carrière en club (sans les sélections). */
export async function getFootballer(id: string): Promise<WikidataFootballer> {
  if (!isWikidataId(id)) throw new Error("Identifiant Wikidata invalide");

  const person = (await getEntities([id], "labels|claims|sitelinks"))[id];
  if (!person) throw new Error(`Entité Wikidata introuvable : ${id}`);

  const frwikiTitle = person.sitelinks?.frwiki?.title;
  const infobox = frwikiTitle
    ? await getInfoboxRows(frwikiTitle, PLAYER_CAREER_PARAMS)
    : { rows: [], total: null };
  const infoboxCareer = await toCareerEntries(infobox.rows);

  // Matchs et buts : ligne « Total » de l'infobox, sinon somme des « 169 (90) » des clubs
  const appearances = infobox.total
    ? [parseAppearances(infobox.total)]
    : infobox.rows.map((row) => parseAppearances(row.stats));
  const counted = appearances.filter((a) => a !== null);
  const totals =
    counted.length > 0
      ? counted.reduce((sum, a) => ({ matchs: sum.matchs + a.matchs, buts: sum.buts + a.buts }))
      : null;

  // Carrière Wikidata seulement en repli, quand l'infobox n'a pas de parcours
  const teamClaims = infoboxCareer.length > 0 ? [] : claimsOf(person, "P54");
  const positionIds = claimsOf(person, "P413").map((c) => itemId(c.mainsnak)!);
  const teamIds = teamClaims.map((c) => itemId(c.mainsnak)!).filter(Boolean);

  const linked = await getEntities([...teamIds, ...positionIds], "labels|claims|sitelinks");
  const nationalClasses = await findNationalTeamClasses(
    teamIds.flatMap((teamId) =>
      claimsOf(linked[teamId], "P31").map((c) => itemId(c.mainsnak)!),
    ),
  );

  const wikidataCareer = teamClaims
    .map((claim) => {
      const team = linked[itemId(claim.mainsnak)!];
      const isNational = claimsOf(team, "P31").some((c) =>
        nationalClasses.has(itemId(c.mainsnak)!),
      );
      return !team || isNational ? null : careerEntry(team, claim);
    })
    .filter((entry): entry is WikidataCareerEntry => entry !== null)
    .sort(chronological);

  const height = claimsOf(person, "P2048")[0]?.mainsnak.datavalue?.value as
    | { amount: string; unit: string }
    | undefined;
  const heightValue = height ? Number.parseFloat(height.amount) : null;

  return {
    id,
    name: label(person),
    positions: [...new Set(positionIds.map((p) => label(linked[p])).filter(Boolean))],
    heightMeters:
      heightValue && height?.unit.endsWith(CENTIMETRE)
        ? heightValue / 100
        : heightValue,
    career: infoboxCareer.length > 0 ? infoboxCareer : wikidataCareer,
    totals,
  };
}

/**
 * Carrière d'entraîneur, lue en priorité dans la section « carrière entraîneur »
 * de l'infobox Wikipédia, bien plus complète que Wikidata.
 * Les sélections nationales sont gardées (sélectionneur).
 */
export async function getCoach(id: string): Promise<WikidataCoach> {
  if (!isWikidataId(id)) throw new Error("Identifiant Wikidata invalide");

  const person = (await getEntities([id], "labels|sitelinks"))[id];
  if (!person) throw new Error(`Entité Wikidata introuvable : ${id}`);

  const frwikiTitle = person.sitelinks?.frwiki?.title;
  const [infobox, palmares] = frwikiTitle
    ? await Promise.all([
        getInfoboxRows(frwikiTitle, COACH_CAREER_PARAMS),
        getPalmares(frwikiTitle, /entra[iî]neur/i),
      ])
    : [{ rows: [], total: null }, []];
  const career = await toCareerEntries(infobox.rows);

  // Bilan : somme des « 64v 52n 54d » de chaque passage
  const records = infobox.rows.map((row) => parseRecord(row.stats)).filter((r) => r !== null);
  const record =
    records.length > 0
      ? records.reduce((sum, r) => ({ v: sum.v + r.v, n: sum.n + r.n, d: sum.d + r.d }))
      : null;

  return {
    id,
    name: label(person),
    career: career.length > 0 ? career : await getCoachCareerFromWikidata(id),
    record,
    palmares,
  };
}

// Paramètres d'infobox essayés dans l'ordre : le premier groupe qui donne un parcours l'emporte
const COACH_CAREER_PARAMS = [["carrière entraîneur", "parcours entraîneur"]];
const PLAYER_CAREER_PARAMS = [["parcours senior", "parcours pro"], ["parcours amateur"]];

/** Lignes d'un parcours d'infobox → passages en club rattachés à leur élément Wikidata. */
async function toCareerEntries(rows: InfoboxCareerRow[]): Promise<WikidataCareerEntry[]> {
  if (rows.length === 0) return [];

  // Club écrit uniquement avec un modèle ({{FRA football}}…) : on le fait développer par Wikipédia
  const unlinked = rows.filter((row) => !row.clubTitle && !row.clubName && /\{\{/.test(row.clubCell));
  if (unlinked.length > 0) {
    const separator = "\n@@@\n";
    const expanded = await getJson<{ expandtemplates: { wikitext: string } }>(
      `${FRWIKI_API_URL}?action=expandtemplates&format=json&prop=wikitext&text=${encodeURIComponent(unlinked.map((row) => row.clubCell).join(separator))}`,
    );
    expanded.expandtemplates.wikitext.split(separator).forEach((cell, i) => {
      const link = firstLink(cell);
      unlinked[i].clubTitle = link?.title ?? null;
      unlinked[i].clubName = unlinked[i].clubName || link?.label || plainText(cell);
    });
  }

  const clubIds = await getWikidataIdsForPages(
    rows.map((row) => row.clubTitle).filter((t): t is string => Boolean(t)),
  );
  const clubs = await getEntities([...new Set(clubIds.values())], "claims");

  return rows
    .filter((row) => row.clubName)
    .map((row) => {
      const clubId = row.clubTitle ? (clubIds.get(row.clubTitle) ?? null) : null;
      const logo = clubId ? claimsOf(clubs[clubId], "P154")[0]?.mainsnak.datavalue?.value : null;
      return {
        clubId,
        clubName: row.note ? `${row.clubName} (${row.note})` : row.clubName,
        start: row.start,
        end: row.end,
        logoFile: typeof logo === "string" ? logo : null,
        clubPage: row.clubTitle,
      };
    })
    .sort(chronological);
}

/**
 * Lignes brutes d'un parcours d'infobox, sans rattachement des clubs à Wikidata,
 * et statistiques de sa ligne « Total » s'il y en a une.
 */
async function getInfoboxRows(
  pageTitle: string,
  paramGroups: string[][],
): Promise<{ rows: InfoboxCareerRow[]; total: string | null }> {
  const infobox = await getInfobox(pageTitle);
  if (!infobox) return { rows: [], total: null };

  for (const params of paramGroups) {
    const value = templateParam(infobox, params) ?? "";
    const rows = parseCareerColumns(value);
    if (rows.length > 0) return { rows, total: parseCareerTotal(value) };
  }
  return { rows: [], total: null };
}

/** Palmarès de la section « Palmarès » d'un article (sous-partie `part` si elle existe). */
async function getPalmares(pageTitle: string, part?: RegExp): Promise<string[][]> {
  const sections = await getJson<{ parse?: { sections: { line: string; index: string }[] } }>(
    `${FRWIKI_API_URL}?action=parse&format=json&prop=sections&redirects=1&page=${encodeURIComponent(pageTitle)}`,
  );
  // « Palmarès entraîneur » en priorité ; jamais une section « Palmarès joueur »
  const candidates = (sections.parse?.sections ?? []).filter(
    (s) => /^palmar[eè]s/i.test(plainText(s.line)) && !/joueur/i.test(s.line),
  );
  const section =
    candidates.find((s) => part && part.test(s.line)) ?? candidates[0];
  if (!section) return [];

  const page = await getJson<{ parse?: { wikitext: { "*": string } } }>(
    `${FRWIKI_API_URL}?action=parse&format=json&prop=wikitext&redirects=1&section=${section.index}&page=${encodeURIComponent(pageTitle)}`,
  );
  return parsePalmares(page.parse?.wikitext["*"] ?? "", part);
}

/** Titre d'article Wikipédia FR → identifiant Wikidata (redirections suivies). */
async function getWikidataIdsForPages(titles: string[]): Promise<Map<string, string>> {
  const result = new Map<string, string>();
  const unique = [...new Set(titles)];

  for (let i = 0; i < unique.length; i += MAX_IDS_PER_REQUEST) {
    const chunk = unique.slice(i, i + MAX_IDS_PER_REQUEST);
    const data = await getJson<{
      query?: {
        normalized?: { from: string; to: string }[];
        redirects?: { from: string; to: string }[];
        pages?: Record<string, { title: string; pageprops?: { wikibase_item?: string } }>;
      };
    }>(
      `${FRWIKI_API_URL}?action=query&format=json&redirects=1&prop=pageprops&ppprop=wikibase_item&titles=${encodeURIComponent(chunk.join("|"))}`,
    );

    const idByTitle = new Map(
      Object.values(data.query?.pages ?? {})
        .filter((page) => page.pageprops?.wikibase_item)
        .map((page) => [page.title, page.pageprops!.wikibase_item!]),
    );
    const follow = (steps: { from: string; to: string }[] | undefined, title: string) =>
      steps?.find((step) => step.from === title)?.to ?? title;

    for (const title of chunk) {
      const final = follow(data.query?.redirects, follow(data.query?.normalized, title));
      const qid = idByTitle.get(final);
      if (qid) result.set(title, qid);
    }
  }
  return result;
}

/**
 * Repli quand Wikipédia n'a pas de parcours : Wikidata range la carrière à deux
 * endroits, chacun souvent incomplet — « entraîneur de » (P6087) sur la personne,
 * « entraîneur principal » (P286) sur les clubs. On fusionne les deux.
 */
async function getCoachCareerFromWikidata(id: string): Promise<WikidataCareerEntry[]> {
  const [person, coachedClubs] = await Promise.all([
    getEntities([id], "claims").then((entities) => entities[id]),
    // Clubs dont une déclaration P286 pointe vers cette personne
    getJson<{ query: { search: { title: string }[] } }>(
      `${API_URL}?action=query&format=json&list=search&srlimit=50&srsearch=${encodeURIComponent(`haswbstatement:P286=${id}`)}`,
    ).then((r) => r.query.search.map((result) => result.title).filter(isWikidataId)),
  ]);
  const personClaims = claimsOf(person, "P6087");
  const teams = await getEntities(
    [...personClaims.map((c) => itemId(c.mainsnak)!), ...coachedClubs],
    "labels|claims|sitelinks",
  );

  const entries = [
    ...personClaims
      .filter((claim) => teams[itemId(claim.mainsnak)!])
      .map((claim) => careerEntry(teams[itemId(claim.mainsnak)!], claim)),
    ...coachedClubs.flatMap((clubId) =>
      claimsOf(teams[clubId], "P286")
        .filter((claim) => itemId(claim.mainsnak) === id)
        .map((claim) => careerEntry(teams[clubId], claim)),
    ),
  ];

  // Doublons entre les deux sources, et passages sans date quand le même club est daté
  const seen = new Set<string>();
  return entries
    .filter((entry) => {
      const key = `${entry.clubId}:${entry.start}:${entry.end}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .filter(
      (entry, _, all) =>
        entry.start !== null ||
        entry.end !== null ||
        !all.some((other) => other.clubId === entry.clubId && (other.start || other.end)),
    )
    .sort(chronological);
}

/** Articles « Saison 2021-2022 … » d'un club sur Wikipédia FR, les plus pertinents d'abord. */
export async function searchSeasonArticles(team: string, saison: string): Promise<string[]> {
  const search = await getJson<{ query?: { search: { title: string }[] } }>(
    `${FRWIKI_API_URL}?action=query&format=json&list=search&srlimit=5&srsearch=${encodeURIComponent(`intitle:"Saison ${saison}" ${team}`)}`,
  );
  return (search.query?.search ?? [])
    .map((result) => result.title)
    .filter((title) => title.startsWith(`Saison ${saison}`));
}

/** Wikitext complet d'une page Wikipédia FR, ou null si elle n'existe pas. */
export async function getWikipediaWikitext(pageTitle: string): Promise<string | null> {
  const page = await getJson<{ parse?: { wikitext: { "*": string } } }>(
    `${FRWIKI_API_URL}?action=parse&format=json&prop=wikitext&redirects=1&page=${encodeURIComponent(pageTitle)}`,
  );
  return page.parse?.wikitext["*"] ?? null;
}

/** Contenu texte d'un fichier Wikimedia (ex. un SVG), tel qu'il a été déposé. */
export async function downloadWikimediaText(file: string): Promise<string | null> {
  const info = await getJson<{
    query: { pages: Record<string, { imageinfo?: { url: string }[] }> };
  }>(
    `${FRWIKI_API_URL}?action=query&format=json&prop=imageinfo&iiprop=url&titles=${encodeURIComponent(`File:${file}`)}`,
  );
  const url = Object.values(info.query.pages)[0]?.imageinfo?.[0]?.url;
  if (!url) return null;
  const response = await fetch(url, {
    headers: { "User-Agent": USER_AGENT },
    next: { revalidate: CACHE_SECONDS },
  });
  return response.ok ? response.text() : null;
}

/** Entraîneur principal (P286) d'un club pendant une période, d'après Wikidata. */
export async function getClubCoachDuring(
  clubId: string,
  from: number,
  to: number,
): Promise<string | null> {
  const club = (await getEntities([clubId], "claims"))[clubId];
  const claim = claimsOf(club, "P286").find((c) => {
    const start = year(c.qualifiers?.P580?.[0]);
    const end = year(c.qualifiers?.P582?.[0]);
    return start !== null && start <= to && (end ?? Number.POSITIVE_INFINITY) >= from;
  });
  const coachId = itemId(claim?.mainsnak);
  if (!coachId) return null;
  return label((await getEntities([coachId], "labels"))[coachId]) || null;
}

/** Infobox d'une page Wikipédia FR (section d'introduction), ou null. */
async function getInfobox(pageTitle: string): Promise<string | null> {
  const page = await getJson<{ parse?: { wikitext: { "*": string } } }>(
    `${FRWIKI_API_URL}?action=parse&format=json&prop=wikitext&section=0&redirects=1&page=${encodeURIComponent(pageTitle)}`,
  );
  return findTemplate(page.parse?.wikitext["*"] ?? "", ["Infobox[^|}]*"]);
}

const toHexColor = (value: string | null) => {
  const hex = value?.replace(/^#/, "").trim();
  return hex && /^[0-9a-f]{6}$/i.test(hex) ? `#${hex.toUpperCase()}` : null;
};

/**
 * Couleurs d'un club à partir du nom tapé (« AJ Auxerre », « Lens ») : paramètres
 * « couleur cadre » et « couleur écriture » de son infobox Wikipédia.
 */
export async function getClubColors(
  name: string,
): Promise<{ primary: string; secondary: string } | null> {
  // Titre exact (souvent une redirection, « AJ Auxerre »), sinon recherche
  const search = await getJson<{ query?: { search: { title: string }[] } }>(
    `${FRWIKI_API_URL}?action=query&format=json&list=search&srlimit=3&srsearch=${encodeURIComponent(`${name} football club`)}`,
  );
  const titles = [name, ...(search.query?.search.map((r) => r.title) ?? [])];

  for (const title of titles) {
    const infobox = await getInfobox(title);
    if (!infobox) continue;
    const primary = toHexColor(templateParam(infobox, ["couleur cadre"]));
    const secondary = toHexColor(templateParam(infobox, ["couleur écriture"]));
    if (primary) return { primary, secondary: secondary ?? primary };
  }
  return null;
}

/** Fichier du paramètre « logo » de l'infobox d'une page Wikipédia FR (club). */
export async function getWikipediaLogoFile(pageTitle: string): Promise<string | null> {
  const page = await getJson<{ parse?: { wikitext: { "*": string } } }>(
    `${FRWIKI_API_URL}?action=parse&format=json&prop=wikitext&section=0&redirects=1&page=${encodeURIComponent(pageTitle)}`,
  );
  const infobox = findTemplate(page.parse?.wikitext["*"] ?? "", ["Infobox[^|}]*"]);
  const logo = infobox ? templateParam(infobox, ["logo"]) : null;
  if (!logo) return null;

  // « JS Saint-Pierroise.jpeg », « [[Fichier:X.svg|120px]] » ou « Fichier:X.svg »
  const file = logo
    .replace(/^\[\[/, "")
    .replace(/^(?:Fichier|File|Image)\s*:/i, "")
    .split("|")[0]
    .replace(/\]\]$/, "")
    .trim();
  return /\.(svg|png|jpe?g|gif|webp)$/i.test(file) ? file : null;
}

/**
 * Télécharge une image de Wikimedia en PNG (les SVG sont rastérisés).
 * L'API de Wikipédia FR sert aussi bien ses propres fichiers que ceux de Commons.
 */
export async function downloadCommonsImage(
  file: string,
  width = 512,
): Promise<Buffer> {
  const info = await getJson<{
    query: { pages: Record<string, { imageinfo?: { thumburl?: string; url: string }[] }> };
  }>(
    `${FRWIKI_API_URL}?action=query&format=json&prop=imageinfo&iiprop=url&iiurlwidth=${width}&titles=${encodeURIComponent(`File:${file}`)}`,
  );
  const image = Object.values(info.query.pages)[0]?.imageinfo?.[0];
  const url = image?.thumburl ?? image?.url;
  if (!url) throw new Error(`Fichier Commons introuvable : ${file}`);

  const response = await fetch(url, { headers: { "User-Agent": USER_AGENT } });
  if (response.status === 429) {
    throw new WikidataRateLimitError("Trop de requêtes vers Wikimedia");
  }
  if (!response.ok) throw new Error(`Téléchargement impossible : ${file}`);
  return Buffer.from(await response.arrayBuffer());
}
