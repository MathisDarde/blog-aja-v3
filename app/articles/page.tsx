import { Suspense } from "react";
import ArticleCenter, { ArticleCenterView } from "./_components/ArticleCenter";
import { getArticles } from "@/controllers/ArticlesController";
import filtersData from "@/public/data/articletags.json";
import { toSearchableArticle } from "@/lib/article-search";

// Régénérée au plus toutes les 60 s (et immédiatement après une action admin
// sur les articles, cf. revalidateArticlePages) au lieu d'être figée au build.
export const revalidate = 60;

export default async function Page() {
  // Texte brut préparé ici : le client reçoit de quoi chercher, pas le HTML complet des articles
  const articles = (await getArticles())
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .map((article) => toSearchableArticle(article, filtersData));

  return (
    <Suspense
      fallback={
        <ArticleCenterView
          articles={articles}
          filters={filtersData}
          // Valeurs écrites ici : une constante importée d'un module client
          // n'arrive pas jusqu'au rendu serveur
          searchQuery=""
          yearfilter=""
          playerfilter=""
          leaguefilter=""
          page={1}
        />
      }
    >
      <ArticleCenter articles={articles} filters={filtersData} />
    </Suspense>
  );
}
