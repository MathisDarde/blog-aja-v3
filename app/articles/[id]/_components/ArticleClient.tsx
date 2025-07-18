"use client";

import { useGettersContext } from "@/contexts/DataGettersContext";
import ArticleDisplay from "./ArticleDisplay";

export default function ArticleClient() {
  const { article, articleLoading } = useGettersContext();

  if (articleLoading) return <p>Chargement...</p>;
  if (!article) return <p>Aucun article trouvé.</p>;

  return <ArticleDisplay article={article} />;
}
