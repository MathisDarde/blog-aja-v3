"use server";

import { db } from "@/db/db";
import { clubLogoVersionsTable } from "@/db/schema";
import { ClubLogosSchema } from "@/app/schema";
import { ClubLogosSchemaType } from "@/types/forms";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth-guard";
import { uploadBufferToCloudinary } from "@/lib/cloudinary";
import { customClubKey, getBlogClubLogos, LogoOrigin } from "@/lib/club-logo-versions";
import {
  methodeClubNames,
  pendingClubLogos,
  resetAllLibraryClubs,
  resetLibraryClub,
  syncClubLogos,
} from "@/lib/club-logo-sync";
import { normalizeText } from "@/lib/normalize-text";
import { absolute, buildTeamLogoResolver, DEFAULT_TEAM_LOGO, fetchScrapedClubLogos, libraryKeys } from "@/lib/team-logos";

export interface AdminLogoPeriod {
  legende: string;
  de: number | null;
  a: number | null;
  logo: string;
}

export interface AdminClubLogos {
  key: string;
  nom: string;
  // Noms saisis dans l'admin
  noms: string[];
  // Autres noms connus (scrapers, bibliothèque des méthodes), non modifiables ici
  nomsConnus: string[];
  // « registre » : club croisé en championnat (scrapers) ; « bibliotheque » : club des méthodes ;
  // « manuel » : ajouté dans l'admin
  type: "registre" | "bibliotheque" | "manuel";
  // Versions gérées par le blog : saisies à la main ou lues sur Wikipédia ; null = scrapers
  origine: LogoOrigin | null;
  // Logo affiché hors des périodes : logo du site, Transfermarkt, bibliothèque ou écusson neutre
  logoActuel: string;
  sansLogo: boolean;
  periodes: AdminLogoPeriod[];
}

const bySeason = (a: AdminLogoPeriod, b: AdminLogoPeriod) => (a.de ?? -Infinity) - (b.de ?? -Infinity);

/** Tous les clubs (registre, méthodes, ajoutés à la main) et le nombre de clubs encore à chercher. */
export async function getClubLogosAdmin(): Promise<{ clubs: AdminClubLogos[]; enAttente: number }> {
  await requireAdmin();
  const [scraped, blog, names] = await Promise.all([fetchScrapedClubLogos(), getBlogClubLogos(), methodeClubNames()]);
  const resolver = buildTeamLogoResolver(scraped, blog);
  const { registry } = scraped;
  const keyOfLibrary = libraryKeys(registry, blog.library);
  const libraryByKey = new Map(blog.library.map((club) => [keyOfLibrary.get(club.key)!, club]));

  const keys = new Set([
    ...Object.keys(registry),
    ...Object.keys(scraped.periods),
    ...libraryByKey.keys(),
    ...Object.keys(blog.versions),
  ]);
  const clubs = [...keys].map((key): AdminClubLogos => {
    const custom = blog.versions[key];
    const known = registry[key];
    // Nom le plus complet du registre (« FC Girondins de Bordeaux » plutôt que « G. Bordeaux »)
    const registryName = known ? [known.nom, ...known.noms].sort((a, b) => b.length - a.length)[0] : null;
    const nom = custom?.nom ?? registryName ?? libraryByKey.get(key)?.nom ?? key;
    const logoActuel = resolver.currentLogo({ id: key, name: nom });
    return {
      key,
      nom,
      noms: custom?.origine === "manuel" ? custom.noms : [],
      nomsConnus: resolver.namesOf(key).filter((n) => normalizeText(n) !== normalizeText(nom)),
      type: known ? "registre" : libraryByKey.has(key) ? "bibliotheque" : "manuel",
      origine: custom?.origine ?? null,
      logoActuel,
      sansLogo: logoActuel === DEFAULT_TEAM_LOGO,
      periodes: resolver
        .periodsOf(key)
        .map((p) => ({ legende: p.legende ?? "", de: p.de, a: p.a, logo: absolute(p.logo) }))
        .sort(bySeason),
    };
  });
  clubs.sort((a, b) => a.nom.localeCompare(b.nom, "fr"));

  const pending = await pendingClubLogos(names);
  return { clubs, enAttente: pending.unknownNames.length + pending.toCheck.length };
}

// Hôtes d'images autorisés par next/image (next.config.ts) ; les autres sont copiés sur Cloudinary
const SERVED_HOSTS = ["res.cloudinary.com", "mathisdarde.github.io", "upload.wikimedia.org", "thumb.wikimedia.org"];
const MAX_LOGO_SIZE = 5 * 1024 * 1024;

/** Logo affichable par next/image : chemin du site, Cloudinary, scrapers, sinon copie sur Cloudinary. */
async function servableLogo(url: string) {
  if (url.startsWith("/") || SERVED_HOSTS.includes(new URL(url).hostname)) return url;
  // Wikimedia refuse les requêtes sans User-Agent
  const res = await fetch(url, { headers: { "User-Agent": "MemoireDAuxerrois/1.0 (logos des clubs)" } });
  const type = res.headers.get("content-type") ?? "";
  if (!res.ok || !type.startsWith("image/")) throw new Error(`${url} : pas une image (HTTP ${res.status}, ${type})`);
  const image = Buffer.from(await res.arrayBuffer());
  if (image.length > MAX_LOGO_SIZE) throw new Error(`${url} : image trop lourde`);
  return (await uploadBufferToCloudinary(image, { folder: "clubs", resource_type: "image" })).secure_url;
}

export async function saveClubLogos(data: ClubLogosSchemaType) {
  await requireAdmin();
  const parsed = ClubLogosSchema.safeParse(data);
  if (!parsed.success) return { success: false, message: parsed.error.issues[0]?.message ?? "Formulaire invalide." };
  const { nom, periodes } = parsed.data;
  const noms = [...new Set(parsed.data.noms)].filter((n) => normalizeText(n) !== normalizeText(nom));

  let key = parsed.data.key;
  if (!key) {
    // Nouveau club : refusé s'il est déjà connu sous ce nom ou l'un des autres
    const resolver = buildTeamLogoResolver(await fetchScrapedClubLogos(), await getBlogClubLogos());
    const existing = [nom, ...noms].map((name) => resolver.clubKey({ name })).find(Boolean);
    if (existing) {
      return { success: false, message: `Ce club existe déjà (« ${resolver.namesOf(existing)[0]} ») : modifiez-le plutôt.` };
    }
    key = customClubKey(nom);
  }

  let logos: string[];
  try {
    logos = await Promise.all(periodes.map((p) => servableLogo(p.logo)));
  } catch (error) {
    console.error("Logo inaccessible", error);
    return { success: false, message: "Un des logos est introuvable à son adresse : importez plutôt l'image." };
  }

  const values = {
    nom,
    noms,
    periodes: periodes.map((p, i) => ({ ...p, logo: logos[i], legende: p.legende || undefined })),
    origine: "manuel",
  };
  await db
    .insert(clubLogoVersionsTable)
    .values({ clubKey: key, ...values })
    .onConflictDoUpdate({ target: clubLogoVersionsTable.clubKey, set: { ...values, updatedAt: new Date() } });

  // Les logos apparaissent sur la plupart des pages (classements, calendriers, méthodes…)
  revalidatePath("/", "layout");
  return { success: true, message: "Logos enregistrés." };
}

/**
 * Annule la saisie manuelle d'un club : logos des scrapers (registre), relus sur Wikipédia
 * (club des méthodes), ou club supprimé (ajouté à la main).
 */
export async function resetClubLogos(key: string) {
  await requireAdmin();
  const { library } = await getBlogClubLogos();
  await db.delete(clubLogoVersionsTable).where(eq(clubLogoVersionsTable.clubKey, key));
  let message = "Logos automatiques rétablis.";
  if (library.some((club) => club.key === key)) {
    await resetLibraryClub(key);
    await syncClubLogos({ names: [], budgetMs: 5000 });
    message = "Logos relus sur Wikipédia.";
  } else if (key.startsWith("nom:")) {
    message = "Club supprimé.";
  }
  revalidatePath("/", "layout");
  return { success: true, message };
}

/** Remet tous les clubs des méthodes en attente : la recherche les relira sur Wikipédia. */
export async function rereadAllClubLogos() {
  await requireAdmin();
  await resetAllLibraryClubs();
  const { toCheck, unknownNames } = await pendingClubLogos(await methodeClubNames());
  return toCheck.length + unknownNames.length;
}

/** Une étape de la recherche des clubs et logos manquants (l'admin rappelle tant qu'il en reste). */
export async function syncClubLogosStep() {
  await requireAdmin();
  // Marge sous maxDuration (60 s) : un dernier groupe de clubs peut déborder du budget
  const result = await syncClubLogos({ budgetMs: 30000 });
  if (result.traites > 0) revalidatePath("/", "layout");
  return result;
}
