"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import displayUniqueArticle from "@/actions/get-single-article";
import ArticleDisplay from "./ArticleDisplay";

interface Article {
  id_article: string;
  title: string;
  teaser: string;
  imageUrl: string;
  content: string;
  author: string;
  userId: string;
  publishedAt: Date;
  updatedAt: Date;
  tags: string[];
}

export default function ArticleClient() {
  const params = useParams();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!params?.id) return;

    const fetchArticle = async () => {
      try {
        setLoading(true);
        const id_article = params.id as string;
        if (id_article === "") {
          setLoading(false);
          return;
        }

        const fetchedArticles = await displayUniqueArticle(id_article);
        console.log("Fetched article data:", fetchedArticles);

        if (
          fetchedArticles &&
          Array.isArray(fetchedArticles) &&
          fetchedArticles.length > 0
        ) {
          setArticle(fetchedArticles[0]);
        } else {
          setArticle(null);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération de l'article:", error);
        setArticle(null);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [params?.id]);

  if (loading) return <p>Chargement...</p>;
  if (!article) return <p>Aucun article trouvé.</p>;

  console.log("Article to display:", article);
  return <ArticleDisplay article={article} />;
}
