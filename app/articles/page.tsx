import { Suspense } from "react";
import ArticleCenter from "./_components/ArticleCenter";
import { getArticles } from "@/controllers/ArticlesController";
import filtersData from "@/public/data/articletags.json";

// Régénérée au plus toutes les 60 s (et immédiatement après une action admin
// sur les articles, cf. revalidateArticlePages) au lieu d'être figée au build.
export const revalidate = 60;

export default async function Page() {
  const articles = await getArticles();

  return (
    <Suspense fallback={<div>Chargement des articles...</div>}>
      <ArticleCenter articles={articles} filters={filtersData} />
    </Suspense>
  );
}
