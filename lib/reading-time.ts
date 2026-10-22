import { htmlToText } from "@/lib/article-search";

// Vitesse de lecture moyenne d'un texte en français
const WORDS_PER_MINUTE = 220;

/** Minutes de lecture d'un contenu HTML, au moins 1. */
export function readingMinutes(html: string): number {
  const words = htmlToText(html).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}
