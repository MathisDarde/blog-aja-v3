import { Suspense } from "react";
import ArticleCenter from "./_components/ArticleCenter";
import { getArticlesbyKeywords } from "@/controllers/ArticlesController";
import filtersData from "@/public/data/articletags.json";

export default async function Page() {
  const articles = await getArticlesbyKeywords();

  return (
    <Suspense fallback={<div>Chargement des articles...</div>}>
      <ArticleCenter articles={articles} filters={filtersData} />
    </Suspense>
  );
}
