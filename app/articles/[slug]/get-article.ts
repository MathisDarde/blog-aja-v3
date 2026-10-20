import { cache } from "react";
import { getArticleBySlug } from "@/controllers/ArticlesController";

// Une seule requête par rendu : generateMetadata et la page lisent le même article
export const getArticle = cache(getArticleBySlug);
