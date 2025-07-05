import displayLastPublished from "@/actions/article/display-last-published";
import Link from "next/link";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { Article } from "@/contexts/Interfaces";
import { useGlobalContext } from "@/contexts/GlobalContext";

export default function LastArticle() {
  const { article, setArticle } = useGlobalContext();

  const [loading, setLoading] = useState(false);

  const DisplayLastArticle = async () => {
    try {
      setLoading(true);
      const lastArticle = await displayLastPublished();
      setArticle(lastArticle as Article);
    } catch (error) {
      console.error("Erreur lors de la récupération de l'article :", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    DisplayLastArticle();
  }, []);

  return (
    <div>
      {loading ? (
        <div className="relative w-full h-64 flex items-center justify-center">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 border-8 rounded-full border-t-8 border-white border-t-aja-blue animate-spin"></div>
        </div>
      ) : article == null ? (
        <div id="noarticlefound">
          <p className="flex items-center justify-center text-5xl font-bold text-center">
            Aucun article publié.
          </p>
        </div>
      ) : (
        <Link href={`/articles/${article.id_article}`}>
          <div
            className="bg-white rounded-xl text-center border border-stone-200 shadow-xl p-6"
            key={article.id_article}
          >
            <Image
              className="inline-block w-full h-auto mx-auto rounded-xl object-cover"
              width={512}
              height={512}
              src={`${article.imageUrl}`}
              alt={article.title}
            />
            <h2 className="text-justify text-black font-semibold font-Montserrat w-full text-lg py-2 pr-2 mx-auto">
              {article.title}
            </h2>
            <p className="w-full text-black text-justify font-Montserrat mx-auto text-sm leading-5">
              {article.teaser}
            </p>
          </div>
        </Link>
      )}
    </div>
  );
}
