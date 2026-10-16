// Logos des clubs cités dans les méthodes, cherchés automatiquement : club retrouvé sur Wikidata
// (bibliothèque clubs_table), puis logos d'époque lus dans la galerie la plus complète de ses
// articles Wikipédia (français, sinon anglais, italien, allemand… : les clubs étrangers ont souvent
// la leur dans leur langue), rangés dans club_logo_versions_table (origine « wikipedia »).
// Les images restent chez Wikimedia (adresses directes) : rien n'est copié sur Cloudinary.
// Les clubs du registre des scrapers sont laissés aux scrapers, et une saisie manuelle de
// l'admin n'est jamais écrasée.

import { eq, sql } from "drizzle-orm";
import { after } from "next/server";
import { revalidatePath } from "next/cache";
import { db } from "@/db/db";
import { clubLogoVersionsTable, clubsTable } from "@/db/schema";
import { customClubKey, getBlogClubLogos, LibraryClub, LogoPeriod } from "@/lib/club-logo-versions";
import { logosFromWikitext, sinceMinSeason, WikiLogo } from "@/lib/historical-logos";
import { normalizeText } from "@/lib/normalize-text";
import { buildTeamLogoResolver, DEFAULT_TEAM_LOGO, fetchScrapedClubLogos } from "@/lib/team-logos";
import {
  findWikidataClub,
  getWikidataClub,
  getWikimediaThumbs,
  getWikipediaLogoFile,
  getWikitextIn,
  isWikidataId,
  WikidataClub,
  WikidataRateLimitError,
} from "@/lib/wikidata";
import { getMatchMethodes } from "@/controllers/MethodeMatchController";
import { getJoueurMethodes } from "@/controllers/MethodeJoueurController";
import { getCoachMethodes } from "@/controllers/MethodeCoachController";

export interface ClubLogoSyncResult {
  // Clubs examinés pendant cet appel
  traites: number;
  // Clubs encore à examiner (appeler de nouveau)
  restants: number;
  // Noms de méthodes sans club Wikidata : ajoutés à la liste sans logo, à compléter à la main
  introuvables: string[];
}

// Logos depuis 1970 à partir desquels une galerie française suffit
const GOOD_GALLERY = 3;

/** Galerie de logos la plus fournie (depuis 1970) parmi les articles du club, à égalité la première langue. */
async function bestGallery(club: WikidataClub): Promise<{ lang: string; title: string; logos: WikiLogo[] } | null> {
  const read = async ([lang, title]: [string, string]) => ({
    lang,
    title,
    logos: sinceMinSeason(logosFromWikitext((await getWikitextIn(lang, title)) ?? "")),
  });
  const [first, ...others] = Object.entries(club.wikis);
  if (!first) return null;
  // Galerie française déjà fournie : inutile d'interroger les autres langues
  const french = await read(first);
  if (first[0] === "fr" && french.logos.length >= GOOD_GALLERY) return french;
  // Sinon toutes les autres en même temps ; à égalité, l'ordre de LOGO_WIKIS (français d'abord)
  const galleries = [french, ...(await Promise.all(others.map(read)))];
  let best: { lang: string; title: string; logos: WikiLogo[] } | null = null;
  for (const gallery of galleries) {
    if (gallery.logos.length > (best?.logos.length ?? 0)) best = gallery;
  }
  return best;
}

/** Noms de clubs de toutes les méthodes (équipes des matchs, parcours des joueurs et coachs). */
export async function methodeClubNames(): Promise<string[]> {
  const [matchs, joueurs, coachs] = await Promise.all([getMatchMethodes(), getJoueurMethodes(), getCoachMethodes()]);
  const names = [
    ...matchs.flatMap((m) => [m.nomequipe1, m.nomequipe2]),
    ...joueurs.flatMap((j) => (j.clubs as string[][]).map((c) => c[1])),
    ...coachs.flatMap((c) => (c.clubscoach as string[][]).map((club) => club[1])),
  ];
  // « Olympique de Marseille (prêt) » → « Olympique de Marseille »
  return [...new Set(names.map((n) => n?.replace(/\s*\([^)]*\)$/, "").trim()).filter(Boolean))];
}

/** État de la recherche : noms de méthodes sans club connu et clubs de la bibliothèque à examiner. */
export async function pendingClubLogos(names: string[]) {
  const [scraped, blog] = await Promise.all([fetchScrapedClubLogos(), getBlogClubLogos()]);
  const resolver = buildTeamLogoResolver(scraped, blog);
  const unknownNames = names.filter((name) => !resolver.clubKey({ name }));
  const toCheck = blog.library.filter((club) => !club.logosVerifiesAt);
  return { unknownNames, toCheck, registry: scraped.registry, versions: blog.versions };
}

// Clubs examinés en même temps : bien plus rapide, sans dépasser ce que Wikimedia tolère
const CONCURRENCY = 4;

/**
 * Traite `items` par groupes de CONCURRENCY jusqu'à épuisement du temps. Renvoie les éléments
 * traités ; une erreur sur un élément ne bloque pas les autres (il sera repris au prochain appel),
 * sauf si Wikimedia demande de ralentir.
 */
async function inBatches<T>(items: T[], outOfTime: () => boolean, work: (item: T) => Promise<unknown>): Promise<T[]> {
  const done: T[] = [];
  for (let i = 0; i < items.length && !outOfTime(); i += CONCURRENCY) {
    const batch = items.slice(i, i + CONCURRENCY);
    const results = await Promise.allSettled(batch.map(work));
    results.forEach((result, j) => {
      if (result.status === "fulfilled") done.push(batch[j]);
      else console.error("Logos des clubs :", batch[j], result.reason);
    });
    if (results.some((r) => r.status === "rejected" && r.reason instanceof WikidataRateLimitError)) break;
  }
  return done;
}

/**
 * Cherche les clubs inconnus et les logos d'époque manquants, dans la limite de `budgetMs`.
 * Sans `names`, part des clubs de toutes les méthodes.
 */
export async function syncClubLogos({
  names,
  budgetMs = 40000,
}: { names?: string[]; budgetMs?: number } = {}): Promise<ClubLogoSyncResult> {
  const started = Date.now();
  const outOfTime = () => Date.now() - started > budgetMs;
  const wanted = names ?? (await methodeClubNames());
  const { unknownNames } = await pendingClubLogos(wanted);
  const introuvables: string[] = [];

  // 1. Clubs cités sous un nom inconnu : retrouvés sur Wikidata et ajoutés à la bibliothèque
  const found = await inBatches(unknownNames, outOfTime, async (name) => {
    const club = await findWikidataClub(name);
    if (club) {
      await addToLibrary(club.id, club.label || name, name, club.frwiki, club.transfermarktId);
    } else {
      // Introuvable : dans la liste de l'admin quand même, sans logo, déjà examiné
      introuvables.push(name);
      await db
        .insert(clubsTable)
        .values({ wikidataId: customClubKey(name), nom: name, logoUrl: DEFAULT_TEAM_LOGO, logosVerifiesAt: new Date() })
        .onConflictDoNothing();
    }
  });

  // 2. Logos d'époque des clubs de la bibliothèque pas encore examinés (dont ceux de l'étape 1)
  const { toCheck, registry, versions } = await pendingClubLogos([]);
  const checked = await inBatches(toCheck, outOfTime, (club) => readHistoricalLogos(club, registry, versions));

  return {
    traites: found.length + checked.length,
    restants: unknownNames.length - found.length + toCheck.length - checked.length,
    introuvables,
  };
}

/** Ajoute (ou complète d'un nom) un club de la bibliothèque, avec son logo actuel. */
async function addToLibrary(
  wikidataId: string,
  nom: string,
  alias: string,
  frwiki: string | null,
  transfermarktId: string | null,
) {
  const [existing] = await db.select().from(clubsTable).where(eq(clubsTable.wikidataId, wikidataId));
  if (existing) {
    const noms = [...new Set([...existing.noms, alias])].filter((n) => normalizeText(n) !== normalizeText(existing.nom));
    await db.update(clubsTable).set({ noms, transfermarktId }).where(eq(clubsTable.wikidataId, wikidataId));
    return;
  }
  const logoFile = frwiki ? await getWikipediaLogoFile(frwiki) : null;
  // Sans logo actuel, le club reste dans la liste de l'admin avec l'écusson neutre
  const logoUrl = (logoFile && (await getWikimediaThumbs("fr", [logoFile])).get(logoFile)) || DEFAULT_TEAM_LOGO;
  // Deux noms du même club peuvent être traités en même temps : le second complète le premier
  const noms = normalizeText(alias) === normalizeText(nom) ? [] : [alias];
  await db
    .insert(clubsTable)
    .values({ wikidataId, nom, noms, logoUrl, transfermarktId })
    .onConflictDoUpdate({
      target: clubsTable.wikidataId,
      set: { noms: sql`array(select distinct unnest(${clubsTable.noms} || ${noms}::text[]))` },
    });
}

/** Logos d'époque d'un club de la bibliothèque, lus sur Wikipédia FR. */
async function readHistoricalLogos(
  club: LibraryClub,
  registry: Record<string, unknown>,
  versions: Awaited<ReturnType<typeof getBlogClubLogos>>["versions"],
) {
  const markChecked = (transfermarktId: string | null = club.transfermarktId) =>
    db
      .update(clubsTable)
      .set({ logosVerifiesAt: new Date(), transfermarktId })
      .where(eq(clubsTable.wikidataId, club.key));

  // Club sans élément Wikidata (« nom:… ») : rien à lire
  if (!isWikidataId(club.key)) return markChecked();
  const info = await getWikidataClub(club.key);
  const transfermarktId = info?.transfermarktId ?? null;
  // Club du registre : ses logos d'époque viennent des scrapers ; saisie manuelle : on n'y touche pas
  if ((transfermarktId && registry[transfermarktId]) || versions[club.key]?.origine === "manuel" || !info) {
    return markChecked(transfermarktId);
  }

  const gallery = await bestGallery(info);
  if (gallery) {
    const thumbs = await getWikimediaThumbs(gallery.lang, gallery.logos.map((logo) => logo.file));
    const source = `Wikipédia (${gallery.lang}) : ${gallery.title}`;
    const periodes: LogoPeriod[] = gallery.logos.flatMap((logo) => {
      const url = thumbs.get(logo.file);
      return url ? [{ de: logo.de, a: logo.a, logo: url, legende: logo.caption, source }] : [];
    });
    if (periodes.length > 0) {
      const values = { nom: club.nom, noms: club.noms, periodes, origine: "wikipedia" };
      await db
        .insert(clubLogoVersionsTable)
        .values({ clubKey: club.key, ...values })
        .onConflictDoUpdate({ target: clubLogoVersionsTable.clubKey, set: values });
    }
  }
  return markChecked(transfermarktId);
}

/** Club de la bibliothèque à relire sur Wikipédia (bouton « Revenir aux logos automatiques »). */
export async function resetLibraryClub(key: string) {
  await db.update(clubsTable).set({ logosVerifiesAt: null }).where(eq(clubsTable.wikidataId, key));
}

/**
 * Après l'enregistrement d'une méthode, sans retarder la réponse : clubs cités ajoutés à la
 * liste des logos, avec leur logo actuel et leurs logos d'époque trouvés sur Wikipédia.
 */
export function syncClubLogosAfterSave(names: (string | undefined)[]) {
  const wanted = [...new Set(names.map((n) => n?.replace(/\s*\([^)]*\)$/, "").trim()).filter(Boolean))] as string[];
  if (wanted.length === 0) return;
  after(async () => {
    try {
      await syncClubLogos({ names: wanted, budgetMs: 30000 });
      revalidatePath("/", "layout");
    } catch (error) {
      // Les clubs restants seront cherchés depuis /admin/logos
      console.error("Logos des clubs de la méthode non cherchés", error);
    }
  });
}
