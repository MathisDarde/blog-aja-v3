import displayArticles from "@/actions/article/display-articles";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";

interface Article {
  id_article: string;
  imageUrl: string;
  title: string;
  teaser: string;
  content: string;
  author: string;
}

export default function DisplayRandom() {
  const [isLoading, setIsLoading] = useState(false);
  const [randomSelection, setRandomSelection] = useState<Article[]>([]);

  const selectRandomArticles = (articles: Article[]) => {
    if (articles.length <= 3) return articles;

    const shuffled = [...articles].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  };

  const fetchArticles = async () => {
    try {
      setIsLoading(true);
      const fetchedArticles = await displayArticles();
      setRandomSelection(selectRandomArticles(fetchedArticles));
    } catch (error) {
      console.error("Erreur lors de la récupération des articles :", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  return (
    <div>
      {isLoading ? (
        <p>Chargement...</p>
      ) : (
        <div className="flex flex-col gap-3">
          {randomSelection.length === 0 ? (
            <p>Aucun article disponible.</p>
          ) : (
            randomSelection.map((article, index) => (
              <Link href={`/articles/${article.id_article}`} key={index}>
                <div className="bg-white border border-stone-200 shadow-xl rounded-xl p-4">
                  <Image
                    className="w-full object-cover rounded-md aspect-video"
                    width={512}
                    height={512}
                    src={article.imageUrl}
                    alt={article.title}
                  />
                  <h2 className="text-[0.7rem] font-Montserrat font-semibold mt-2">
                    {article.title}
                  </h2>
                </div>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
}
