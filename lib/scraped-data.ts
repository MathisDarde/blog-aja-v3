// Données publiées chaque nuit par le dépôt AJA-Website-Scrapers (GitHub Pages).

import localEffectif from "@/public/data/players_data.json";
import { MatchAPI, PlayerStats, Team } from "@/contexts/Interfaces";

// SCRAPERS_URL permet de tester avec un dossier data/ servi en local
export const SCRAPERS_URL = process.env.SCRAPERS_URL ?? "https://mathisdarde.github.io/AJA-Website-Scrapers/data";

// Les scrapers tournent toutes les 2 h et GitHub Pages met 10 min en cache : 15 min de cache
// ici gardent le délai entre la fin d'un match et son affichage sous les ~2 h 30.
const REVALIDATE_SECONDS = 900;

export type EffectifMember = (typeof localEffectif)[number];

/** JSON d'un scraper, ou `fallback` si GitHub Pages ne répond pas correctement. */
export async function fetchScrapedData<T>(file: string, fallback: T): Promise<T> {
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
  seasonId?: number;
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

// --- Archive des saisons (data/saisons/, depuis 1974-1975) ---

export interface Competition {
  id: string;
  name: string;
}

export interface SaisonIndexEntry {
  seasonId: number;
  season: string;
  competition: Competition;
  equipes: number;
  aja: {
    position: number;
    points: number;
    matchs_joues: number;
    gagnes: number;
    nuls: number;
    perdus: number;
    buts_marques: number;
    buts_encaisses: number;
  } | null;
}

export interface HistoMatch {
  seasonId: number;
  competition: string;
  journee: string;
  date: string;
  horaire: string;
  dom_ext: string;
  adversaire: string;
  adversaire_id?: string | null;
  // Logo de l'adversaire pour la saison du match, résolu côté serveur (lib/team-logos)
  logo?: string;
  resultat: string;
  buts_aja: number | null;
  buts_adversaire: number | null;
  spectateurs: string;
}

export interface SaisonData {
  seasonId: number;
  season: string;
  competition: Competition;
  calendrier: MatchAPI[];
  classement: Team[];
  statistiques: PlayerStats[];
}

/** Parcours de l'AJA, une ligne par saison, de la plus récente à la plus ancienne. */
export const fetchSaisonsIndex = () => fetchScrapedData<SaisonIndexEntry[]>("saisons/index.json", []);

/** Tous les matchs de championnat de l'AJA archivés, toutes saisons confondues. */
export const fetchHistoriqueMatchs = () => fetchScrapedData<HistoMatch[]>("saisons/matchs.json", []);

/** Une saison archivée, ou null si elle n'existe pas. */
export async function fetchSaison(seasonId: number): Promise<SaisonData | null> {
  const [infos, calendrier, classement, statistiques] = await Promise.all([
    fetchScrapedData<{ season: string; competition: Competition } | null>(`saisons/${seasonId}/saison.json`, null),
    fetchScrapedData<MatchAPI[]>(`saisons/${seasonId}/calendrier.json`, []),
    fetchScrapedData<Team[]>(`saisons/${seasonId}/classement.json`, []),
    fetchScrapedData<PlayerStats[]>(`saisons/${seasonId}/statistiques.json`, []),
  ]);
  if (!infos) return null;
  return { seasonId, season: infos.season, competition: infos.competition, calendrier, classement, statistiques };
}
