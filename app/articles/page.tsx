import ArticleCenter from "./_components/ArticleCenter";
import { getArticles } from "@/controllers/ArticlesController";
import filtersData from "@/public/data/articletags.json";

export default async function Page() {
  const articles = await getArticles();

  return <ArticleCenter articles={articles} filters={filtersData} />;
}
