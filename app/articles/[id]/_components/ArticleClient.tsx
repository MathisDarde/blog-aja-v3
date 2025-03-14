"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import displayUniqueArticle from "@/actions/get-single-article";
import ArticleDisplay from "./ArticleDisplay";
import { JsonValue } from "@prisma/client/runtime/library";

interface Article {
  article_id: number;
  imageUrl: string;
  title: string;
  teaser: string;
  content: string;
  author: string;
  publishedAt: Date;
  tags: JsonValue;
}

export default function ArticleClient() {
  const params = useParams();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!params?.id) return;

    const fetchArticle = async () => {
      setLoading(true);
      const id = Number(params.id);
      if (isNaN(id)) {
        setLoading(false);
        return;
      }
      const fetchedArticle = await displayUniqueArticle(id);
      setArticle(fetchedArticle);
      setLoading(false);
    };

    fetchArticle();
  }, [params?.id]);

  if (loading) return <p>Chargement...</p>;
  if (!article) return <p>Aucun article trouvé.</p>;

  return <ArticleDisplay article={article} />;
}
