import { MetadataRoute } from "next";
import { getArticles } from "@/controllers/ArticlesController";

// 1. Définition de l'URL de base propre
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://memoiredauxerrois.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 2. Récupération des articles depuis ton contrôleur
  const articles = await getArticles();

  // 3. Définition des pages statiques
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/articles`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/categories`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/calendrier`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/classement-statistiques`, 
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/quiz`, 
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/chants`, 
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/effectif-actuel`, 
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/about`, 
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/charte-graphique`, 
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/utilisation`, 
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  // 4. Mapping des articles (Pages dynamiques)
  const articleRoutes: MetadataRoute.Sitemap = articles.map((article) => {
    const dateToUse = article.updatedAt 
      ? new Date(article.updatedAt) 
      : new Date(article.createdAt);

    return {
      url: `${SITE_URL}/articles/${article.slug}`,
      lastModified: dateToUse,
      changeFrequency: "monthly",
      priority: 0.7,
    };
  });

  // 5. Fusion des deux tableaux
  return [...staticRoutes, ...articleRoutes];
}