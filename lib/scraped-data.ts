// Données publiées chaque nuit par le dépôt AJA-Website-Scrapers (GitHub Pages).

import localEffectif from "@/public/data/players_data.json";
import { MatchAPI, PlayerStats, Team } from "@/contexts/Interfaces";

const SCRAPERS_URL = "https://mathisdarde.github.io/AJA-Website-Scrapers/data";

// Les scrapers tournent une fois par jour : une heure de cache suffit largement.
const REVALIDATE_SECONDS = 3600;

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

export const fetchCalendrier = () => fetchScrapedData<MatchAPI[]>("aja_calendrier.json", []);

export const fetchClassement = () => fetchScrapedData<Team[]>("classementligue1.json", []);

export const fetchStatistiques = () => fetchScrapedData<PlayerStats[]>("aja_statistics.json", []);

// Repli sur la copie du dépôt tant que le scraper d'effectif n'a rien publié.
export const fetchEffectif = () =>
  fetchScrapedData<EffectifMember[]>("aja_effectif.json", localEffectif);
