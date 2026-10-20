import { MetadataRoute } from "next";
import { getArticles } from "@/controllers/ArticlesController";
import { indexableMethodePages } from "@/lib/methode-pages";
import { SITE_URL, socialImageUrl } from "@/lib/seo";

// Régénérée au plus toutes les 60 s (et immédiatement après une action admin
// sur les articles, cf. revalidateArticlePages) au lieu d'être figée au build.
export const revalidate = 60;

type Route = {
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
};

// Pages dont le contenu suit l'actualité des articles : leur date est celle du dernier article
const ARTICLE_LISTINGS: Route[] = [
  { path: "", changeFrequency: "daily", priority: 1.0 },
  { path: "/articles", changeFrequency: "daily", priority: 0.9 },
  { path: "/categories", changeFrequency: "weekly", priority: 0.7 },
];

// Pas de lastModified : une date qui change à chaque requête ferait ignorer le champ par Google
const STATIC_ROUTES: Route[] = [
  { path: "/calendrier", changeFrequency: "daily", priority: 0.8 },
  { path: "/classement-statistiques", changeFrequency: "daily", priority: 0.8 },
  { path: "/effectif-actuel", changeFrequency: "weekly", priority: 0.7 },
  { path: "/methodes-expert", changeFrequency: "weekly", priority: 0.7 },
  { path: "/historique", changeFrequency: "monthly", priority: 0.7 },
  { path: "/palmares", changeFrequency: "monthly", priority: 0.7 },
  { path: "/chants", changeFrequency: "monthly", priority: 0.6 },
  { path: "/quiz", changeFrequency: "weekly", priority: 0.6 },
  { path: "/about", changeFrequency: "yearly", priority: 0.4 },
  { path: "/charte-graphique", changeFrequency: "yearly", priority: 0.2 },
  { path: "/utilisation", changeFrequency: "yearly", priority: 0.2 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articles, methodePages] = await Promise.all([getArticles(), indexableMethodePages()]);

  const lastModified = (article: (typeof articles)[number]) =>
    new Date(article.updatedAt ?? article.createdAt);

  const latestArticle = articles.reduce<Date | undefined>((latest, article) => {
    const date = lastModified(article);
    return !latest || date > latest ? date : latest;
  }, undefined);

  return [
    ...ARTICLE_LISTINGS.map(({ path, ...route }) => ({
      url: `${SITE_URL}${path}`,
      lastModified: latestArticle,
      ...route,
    })),
    ...STATIC_ROUTES.map(({ path, ...route }) => ({
      url: `${SITE_URL}${path}`,
      ...route,
    })),
    // Avec leur bannière : référencement dans Google Images
    ...articles.map((article) => ({
      url: `${SITE_URL}/articles/${article.slug}`,
      lastModified: lastModified(article),
      changeFrequency: "monthly" as const,
      priority: 0.8,
      images: article.imageUrl ? [socialImageUrl(article.imageUrl)] : undefined,
    })),
    // Fiches des méthodes ayant au moins un croisement (les autres sont en noindex)
    ...methodePages.map((page) => ({
      url: `${SITE_URL}${page.url}`,
      lastModified: page.lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.6,
      images: page.image ? [page.image] : undefined,
    })),
  ];
}
