// Accès en lecture à l'API Wikidata. On n'utilise pas le service SPARQL :
// ses serveurs sont parfois désynchronisés et renvoient des carrières incomplètes.
// Wikimedia exige un User-Agent identifiable : https://meta.wikimedia.org/wiki/User-Agent_policy
const USER_AGENT = "blog-aja/1.0 (https://github.com/MathisDarde/blog-aja-v3)";
const API_URL = "https://www.wikidata.org/w/api.php";
const COMMONS_API_URL = "https://commons.wikimedia.org/w/api.php";

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
  clubId: string;
  clubName: string;
  start: number | null;
  end: number | null;
  logoFile: string | null;
}

export interface WikidataFootballer {
  id: string;
  name: string;
  positions: string[];
  heightMeters: number | null;
  career: WikidataCareerEntry[];
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
  claims?: Record<string, Claim[]>;
}

export interface WikidataCoach {
  id: string;
  name: string;
  career: WikidataCareerEntry[];
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
        `${API_URL}?action=wbgetentities&format=json&languages=fr|en&props=${props}&ids=${chunk.join("|")}`,
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
  const search = await getJson<{
    search: { id: string; label: string; description?: string }[];
  }>(
    `${API_URL}?action=wbsearchentities&format=json&language=fr&uselang=fr&type=item&limit=15&search=${encodeURIComponent(query)}`,
  );
  if (search.search.length === 0) return [];

  // On ne garde que les personnes dont le métier est lié au football
  const entities = await getEntities(
    search.search.map((r) => r.id),
    "claims",
  );
  return search.search
    .filter((r) =>
      claimsOf(entities[r.id], "P106").some((c) =>
        FOOTBALL_OCCUPATIONS.includes(itemId(c.mainsnak) ?? ""),
      ),
    )
    .map((r) => ({ id: r.id, label: r.label, description: r.description ?? "" }));
}

/** Profil d'un joueur : poste, taille et carrière en club (sans les sélections). */
export async function getFootballer(id: string): Promise<WikidataFootballer> {
  if (!isWikidataId(id)) throw new Error("Identifiant Wikidata invalide");

  const person = (await getEntities([id], "labels|claims"))[id];
  if (!person) throw new Error(`Entité Wikidata introuvable : ${id}`);

  const teamClaims = claimsOf(person, "P54");
  const positionIds = claimsOf(person, "P413").map((c) => itemId(c.mainsnak)!);
  const teamIds = teamClaims.map((c) => itemId(c.mainsnak)!).filter(Boolean);

  const linked = await getEntities([...teamIds, ...positionIds], "labels|claims");
  const nationalClasses = await findNationalTeamClasses(
    teamIds.flatMap((teamId) =>
      claimsOf(linked[teamId], "P31").map((c) => itemId(c.mainsnak)!),
    ),
  );

  const career = teamClaims
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
    career,
  };
}

/**
 * Carrière d'entraîneur. Wikidata la range à deux endroits, chacun souvent incomplet :
 * « entraîneur de » (P6087) sur la personne, « entraîneur principal » (P286) sur les clubs.
 * On fusionne les deux. Les sélections nationales sont gardées (sélectionneur).
 */
export async function getCoach(id: string): Promise<WikidataCoach> {
  if (!isWikidataId(id)) throw new Error("Identifiant Wikidata invalide");

  const [person, coachedClubs] = await Promise.all([
    getEntities([id], "labels|claims").then((entities) => entities[id]),
    // Clubs dont une déclaration P286 pointe vers cette personne
    getJson<{ query: { search: { title: string }[] } }>(
      `${API_URL}?action=query&format=json&list=search&srlimit=50&srsearch=${encodeURIComponent(`haswbstatement:P286=${id}`)}`,
    ).then((r) => r.query.search.map((result) => result.title).filter(isWikidataId)),
  ]);
  if (!person) throw new Error(`Entité Wikidata introuvable : ${id}`);

  const personClaims = claimsOf(person, "P6087");
  const teams = await getEntities(
    [...personClaims.map((c) => itemId(c.mainsnak)!), ...coachedClubs],
    "labels|claims",
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
  const career = entries
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

  return { id, name: label(person), career };
}

/** Télécharge un fichier Commons en PNG (les SVG sont rastérisés par Wikimedia). */
export async function downloadCommonsImage(
  file: string,
  width = 512,
): Promise<Buffer> {
  const info = await getJson<{
    query: { pages: Record<string, { imageinfo?: { thumburl?: string; url: string }[] }> };
  }>(
    `${COMMONS_API_URL}?action=query&format=json&prop=imageinfo&iiprop=url&iiurlwidth=${width}&titles=${encodeURIComponent(`File:${file}`)}`,
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
