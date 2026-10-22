// Articles liés en bas d'un article : ceux qui citent les mêmes joueurs, coachs, matchs ou
// saisons, puis les mêmes tags ; à égalité (ou sans rien en commun), les plus récents.

import type { Article, ArticleCard } from "@/contexts/Interfaces";
import { getArticles } from "@/controllers/ArticlesController";
import { linkMethodes, mentionedMethodes } from "@/lib/methodes";
import { getMethodeGraph } from "@/lib/methode-pages";
import { readingMinutes } from "@/lib/reading-time";

export const RELATED_COUNT = 3;
// Une méthode citée en commun pèse plus qu'un tag (« 2001 - 2010 » est partagé par beaucoup)
const METHODE_WEIGHT = 2;

export interface RelatedCandidate {
  slug: string;
  tags: string[];
  createdAt: Date;
  // Méthodes citées (« joueur:<id> »…)
  methodes: Set<string>;
}

/** Slugs des articles les plus proches, sans l'article lui-même. */
export function rankRelated(
  current: { slug: string; tags: string[]; methodes: Set<string> },
  candidates: RelatedCandidate[],
  limit = RELATED_COUNT,
): string[] {
  const tags = new Set(current.tags);
  return candidates
    .filter((c) => c.slug !== current.slug)
    .map((c) => ({
      c,
      score:
        METHODE_WEIGHT * [...c.methodes].filter((key) => current.methodes.has(key)).length +
        c.tags.filter((tag) => tags.has(tag)).length,
    }))
    .sort((a, b) => b.score - a.score || b.c.createdAt.getTime() - a.c.createdAt.getTime())
    .slice(0, limit)
    .map(({ c }) => c.slug);
}

/** Cartes des articles liés à un article (publié ou brouillon prévisualisé). */
export async function relatedArticles(current: Pick<Article, "slug" | "tags" | "content">): Promise<ArticleCard[]> {
  const [graph, articles] = await Promise.all([getMethodeGraph(), getArticles()]);

  // Méthodes citées par chaque article publié (le graphe les a déjà relevées)
  const methodesOf = new Map<string, Set<string>>();
  for (const [key, links] of graph.citations) {
    for (const link of links) methodesOf.set(link.url, (methodesOf.get(link.url) ?? new Set()).add(key));
  }

  const slugs = rankRelated(
    { ...current, methodes: mentionedMethodes(linkMethodes(current.content, graph.methodes)) },
    articles.map((a) => ({ ...a, methodes: methodesOf.get(`/articles/${a.slug}`) ?? new Set<string>() })),
  );

  return slugs.map((slug) => {
    const { content, ...card } = articles.find((a) => a.slug === slug)!;
    return { ...card, readingMinutes: readingMinutes(content) };
  });
}
