"use server";

import logosList from "@/lib/image-assets/clubs-list.json";
import { db } from "@/db/db";
import { clubsTable } from "@/db/schema";

const LOCAL_LOGOS_PATH = "/_assets/teamlogos/";

export interface LogoOption {
  src: string;
  label: string;
}

/** Logos proposés dans le sélecteur : fichiers du projet puis bibliothèque (logos importés). */
export async function getTeamLogos() {
  const local: LogoOption[] = logosList.map((file) => ({
    src: `${LOCAL_LOGOS_PATH}${file}`,
    label: file.replace(/^logo/, "").replace(/\.[a-z]+$/, ""),
  }));

  let library: LogoOption[] = [];
  try {
    const clubs = await db.select().from(clubsTable).orderBy(clubsTable.nom);
    // Un même logo peut être rangé sous l'identifiant Wikidata et sous le nom du club
    const seen = new Set(local.map((logo) => logo.src));
    library = clubs
      .filter((club) => !seen.has(club.logoUrl) && seen.add(club.logoUrl))
      .map((club) => ({ src: club.logoUrl, label: club.nom }));
  } catch (error) {
    // Bibliothèque inaccessible : on propose au moins les fichiers locaux
    console.error("Bibliothèque de logos inaccessible", error);
  }

  return { success: true, files: [...local, ...library] };
}
