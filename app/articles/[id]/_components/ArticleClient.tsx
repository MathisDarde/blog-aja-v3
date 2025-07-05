"use client";

import ArticleDisplay from "./ArticleDisplay";
import { useGlobalContext } from "@/contexts/GlobalContext";

export default function ArticleClient() {
  const { article, loading } = useGlobalContext();

  if (loading) return <p>Chargement...</p>;
  if (!article) return <p>Aucun article trouvé.</p>;

  console.log("Article to display:", article);
  return <ArticleDisplay article={article} />;
}
