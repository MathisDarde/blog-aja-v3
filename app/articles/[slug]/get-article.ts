import { cache } from "react";
import { getPublishedArticleBySlug } from "@/controllers/ArticlesController";

// Une seule requête par rendu : generateMetadata et la page lisent le même article.
// Articles publiés seulement, sans session : la page est servie en cache
export const getArticle = cache(getPublishedArticleBySlug);
