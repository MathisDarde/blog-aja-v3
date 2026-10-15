// Données publiées chaque nuit par le dépôt AJA-Website-Scrapers (GitHub Pages).

import localEffectif from "@/public/data/players_data.json";
import { MatchAPI, PlayerStats, Team } from "@/contexts/Interfaces";

const SCRAPERS_URL = "https://mathisdarde.github.io/AJA-Website-Scrapers/data";

// Les scrapers tournent toutes les 2 h et GitHub Pages met 10 min en cache : 15 min de cache
// ici gardent le délai entre la fin d'un match et son affichage sous les ~2 h 30.
const REVALIDATE_SECONDS = 900;

export type EffectifMember = (typeof localEffectif)[number];

/** JSON d'un scraper, ou `fallback` si GitHub Pages ne répond pas correctement. */
async function fetchScrapedData<T>(file: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(`${SCRAPERS_URL}/${file}`, {
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return (await res.json()) as T;
  } catch (error) {
    console.error(`Données ${file} indisponibles :`, error);
    return fallback;
  }
}

export interface ScrapedMeta {
  season?: string;
  competition: { id: string; name: string };
}

// Saison et championnat de l'AJA (Ligue 1, Ligue 2…), détectés par les scrapers
export const fetchMeta = () =>
  fetchScrapedData<ScrapedMeta>("meta.json", { competition: { id: "FR1", name: "Ligue 1" } });

export const fetchCalendrier = () => fetchScrapedData<MatchAPI[]>("aja_calendrier.json", []);

export const fetchClassement = () => fetchScrapedData<Team[]>("classementligue1.json", []);

export const fetchStatistiques = () => fetchScrapedData<PlayerStats[]>("aja_statistics.json", []);

// Repli sur la copie du dépôt tant que le scraper d'effectif n'a rien publié.
export const fetchEffectif = () =>
  fetchScrapedData<EffectifMember[]>("aja_effectif.json", localEffectif);
