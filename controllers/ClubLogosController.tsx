"use server";

import { db } from "@/db/db";
import { clubLogoVersionsTable } from "@/db/schema";
import { ClubLogosSchema } from "@/app/schema";
import { ClubLogosSchemaType } from "@/types/forms";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth-guard";
import { clubLogoLibraryFinder } from "@/lib/club-logos";
import { uploadBufferToCloudinary } from "@/lib/cloudinary";
import { customClubKey, getClubLogoVersions } from "@/lib/club-logo-versions";
import { normalizeText } from "@/lib/normalize-text";
import { absolute, DEFAULT_TEAM_LOGO, fetchScrapedClubLogos, getTeamLogoResolver } from "@/lib/team-logos";
import { getMatchMethodes } from "@/controllers/MethodeMatchController";

export interface AdminLogoPeriod {
  legende: string;
  de: number | null;
  a: number | null;
  logo: string;
}

export interface AdminClubLogos {
  key: string;
  nom: string;
  // Noms saisis dans l'admin, puis noms connus des scrapers (non modifiables)
  noms: string[];
  nomsRegistre: string[];
  // Club du registre des scrapers (rencontré en championnat) ou ajouté à la main
  enRegistre: boolean;
  // Versions reprises dans l'admin (sinon celles des scrapers)
  personnalise: boolean;
  // Logo affiché hors des périodes : logo du site, Transfermarkt ou écusson neutre
  logoActuel: string;
  periodes: AdminLogoPeriod[];
}

// Hôtes d'images autorisés par next/image (next.config.ts) ; les autres sont copiés sur Cloudinary
const SERVED_HOSTS = ["res.cloudinary.com", "mathisdarde.github.io"];
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

const bySeason = (a: AdminLogoPeriod, b: AdminLogoPeriod) => (a.de ?? -Infinity) - (b.de ?? -Infinity);

/** Tous les clubs et leurs versions de logo, et les clubs des méthodes encore sans logo. */
export async function getClubLogosAdmin(): Promise<{ clubs: AdminClubLogos[]; sansLogo: string[] }> {
  await requireAdmin();
  const [{ registry, periods }, versions, resolver, findLibraryLogo, matchs] = await Promise.all([
    fetchScrapedClubLogos(),
    getClubLogoVersions(),
    getTeamLogoResolver(),
    clubLogoLibraryFinder(),
    getMatchMethodes(),
  ]);

  const keys = new Set([...Object.keys(registry), ...Object.keys(periods), ...Object.keys(versions)]);
  const clubs = [...keys].map((key): AdminClubLogos => {
    const known = registry[key];
    const custom = versions[key];
    const nomsRegistre = known ? [...new Set([known.nom, ...known.noms])] : [];
    // Nom le plus complet du registre (« FC Girondins de Bordeaux » plutôt que « G. Bordeaux »)
    const nom = custom?.nom ?? [...nomsRegistre].sort((a, b) => b.length - a.length)[0] ?? key;
    return {
      key,
      nom,
      noms: custom?.noms ?? [],
      nomsRegistre,
      enRegistre: Boolean(known),
      personnalise: Boolean(custom),
      logoActuel: resolver.currentLogo({ id: key, name: nom }),
      periodes: (custom?.periodes ?? periods[key] ?? [])
        .map((p) => ({ legende: p.legende ?? "", de: p.de, a: p.a, logo: absolute(p.logo) }))
        .sort(bySeason),
    };
  });
  clubs.sort((a, b) => a.nom.localeCompare(b.nom, "fr"));

  // Équipes des méthodes match qui n'ont que l'écusson neutre (comme sur /methodes-expert)
  const sansLogo = [...new Set(matchs.flatMap((m) => [m.nomequipe1.trim(), m.nomequipe2.trim()]))].filter(
    (name) => resolver.logo({ name }) === DEFAULT_TEAM_LOGO && !findLibraryLogo(name),
  );

  return { clubs, sansLogo };
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
    key = customClubKey(nom);
    const [{ registry }, versions] = await Promise.all([fetchScrapedClubLogos(), getClubLogoVersions()]);
    const wanted = new Set([nom, ...noms].map(normalizeText));
    const existing = [
      ...Object.entries(versions).map(([k, c]) => [k, c.nom, [c.nom, ...c.noms]] as const),
      ...Object.entries(registry).map(([k, c]) => [k, c.nom, [c.nom, ...c.noms]] as const),
    ].find(([k, , names]) => k === key || names.some((n) => wanted.has(normalizeText(n))));
    if (existing) return { success: false, message: `Ce club existe déjà (« ${existing[1]} ») : modifiez-le plutôt.` };
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
  };
  await db
    .insert(clubLogoVersionsTable)
    .values({ clubKey: key, ...values })
    .onConflictDoUpdate({ target: clubLogoVersionsTable.clubKey, set: { ...values, updatedAt: new Date() } });

  // Les logos apparaissent sur la plupart des pages (classements, calendriers, méthodes…)
  revalidatePath("/", "layout");
  return { success: true, message: "Logos enregistrés." };
}

/** Club du registre : retour aux logos des scrapers. Club ajouté à la main : supprimé. */
export async function resetClubLogos(key: string) {
  await requireAdmin();
  await db.delete(clubLogoVersionsTable).where(eq(clubLogoVersionsTable.clubKey, key));
  revalidatePath("/", "layout");
  return {
    success: true,
    message: key.startsWith("nom:") ? "Club supprimé." : "Logos automatiques rétablis.",
  };
}
