// Recherche plein texte des articles, sans dépendance serveur : le texte est préparé
// une fois côté serveur (toSearchableArticle) puis filtré et classé côté client.

import { Article, Filter } from "@/contexts/Interfaces";
import { normalizeText } from "@/lib/normalize-text";
import { readingMinutes } from "@/lib/reading-time";

export type SearchableArticle = Omit<Article, "content"> & {
  readingMinutes: number;
  // Titre, tags, chapô, auteur et texte brut de l'article, déjà normalisés
  search: { title: string; tags: string; teaser: string; author: string; content: string };
};

const ENTITIES: Record<string, string> = {
  nbsp: " ",
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  rsquo: "'",
  lsquo: "'",
  laquo: "«",
  raquo: "»",
};

/** Texte lisible d'un contenu HTML Tiptap (balises et attributs retirés, entités décodées). */
export function htmlToText(html: string): string {
  return html
    .replace(/<(script|style)[\s\S]*?<\/\1>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(parseInt(code, 16)))
    .replace(/&([a-z]+);/gi, (match, name) => ENTITIES[name.toLowerCase()] ?? match);
}

export function toSearchableArticle(article: Article, filters: Filter[]): SearchableArticle {
  const { content, ...rest } = article;
  // Les tags sont des slugs (« djibrilcisse ») : on cherche aussi dans leur libellé (« Djibril Cissé »)
  const tagLabels = article.tags.map((value) => filters.find((f) => f.value === value)?.tag ?? "");

  return {
    ...rest,
    readingMinutes: readingMinutes(content),
    search: {
      title: normalizeText(article.title),
      tags: normalizeText([...article.tags, ...tagLabels].join(" ")),
      teaser: normalizeText(article.teaser),
      author: normalizeText(article.author),
      content: normalizeText(htmlToText(content)),
    },
  };
}

// Poids d'un terme trouvé selon l'endroit : un titre compte bien plus qu'une mention dans le texte
const WEIGHTS = { title: 10, tags: 6, teaser: 4, author: 3, content: 1 } as const;
const MAX_CONTENT_HITS = 10;

function countOccurrences(haystack: string, needle: string): number {
  let count = 0;
  for (let i = haystack.indexOf(needle); i !== -1; i = haystack.indexOf(needle, i + needle.length)) {
    count++;
  }
  return count;
}

/** Score d'un article pour la requête : 0 si l'un des termes est absent partout. */
function scoreArticle(article: SearchableArticle, terms: string[]): number {
  let score = 0;
  for (const term of terms) {
    let termScore = 0;
    for (const field of ["title", "tags", "teaser", "author"] as const) {
      if (article.search[field].includes(term)) termScore += WEIGHTS[field];
    }
    termScore += Math.min(countOccurrences(article.search.content, term), MAX_CONTENT_HITS) * WEIGHTS.content;
    if (termScore === 0) return 0;
    score += termScore;
  }
  // Bonus quand la requête entière apparaît telle quelle dans le titre (« guy roux »)
  if (terms.length > 1 && article.search.title.includes(terms.join(" "))) score += WEIGHTS.title * 2;
  return score;
}

/**
 * Articles contenant tous les termes de la requête, du plus pertinent au moins pertinent.
 * Sans requête, l'ordre d'origine est conservé.
 */
export function searchArticles(articles: SearchableArticle[], query: string): SearchableArticle[] {
  // Les lettres isolées (le « l » de « l'équipe ») sont partout : on les ignore
  const terms = normalizeText(query)
    .split(" ")
    .filter((term) => term.length > 1 || /\d/.test(term));
  if (terms.length === 0) return articles;

  return articles
    .map((article) => ({ article, score: scoreArticle(article, terms) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ article }) => article);
}
