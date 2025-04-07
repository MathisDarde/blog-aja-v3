"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import Image from "next/image";
import displayArticles from "@/actions/display-articles";
import Link from "next/link";

interface Article {
  id_article: string;
  imageUrl: string;
  title: string;
  teaser: string;
  content: string;
  author: string;
}

export default function ArticleCenter() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    document.title = "Articles - Mémoire d'Auxerrois";

    if (!document.getElementById("favicon")) {
      const link = document.createElement("link");
      link.id = "favicon";
      link.rel = "icon";
      link.href = "/_assets/teamlogos/logoauxerre.svg";
      document.head.appendChild(link);
    }
  }, []);

  // Charger les articles automatiquement au montage du composant
  useEffect(() => {
    fetchAndDisplayArticles();
  }, []);

  const fetchAndDisplayArticles = async () => {
    try {
      setIsLoading(true);
      const fetchedArticles = await displayArticles();
      console.log("Articles récupérés:", fetchedArticles); // Pour déboguer
      setArticles(fetchedArticles || []);
    } catch (error) {
      console.error("Erreur lors de la récupération des articles :", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="text-center bg-gray-100 h-full w-screen box-border">
      <div className="text-center">
        <div className="relative flex items-center justify-center max-w-[500px] mx-auto">
          <input
            type="text"
            id="mainsearchbox"
            className="w-full h-12 rounded-full py-2 pl-6 pr-12 border border-gray-600 font-Montserrat text-sm"
            placeholder="Recherchez du contenu..."
          />
          <span>
            <Search className="absolute right-5 top-1/2 -translate-y-1/2 text-lg text-gray-600 cursor-pointer" />
          </span>
        </div>

        <div className="relative w-3/4 mx-auto">
          <p className="text-xl font-Montserrat font-semibold text-left ml-12 py-6 ">
            Résultats les plus pertinents :
          </p>

          <div
            id="articlecontainerteaser"
            className="grid grid-cols-2 justify-items-center my-2 mx-5"
          >
            {isLoading ? (
              <div className="relative w-full h-64 flex items-center justify-center col-span-2">
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 border-8 rounded-full border-t-8 border-white border-t-aja-blue animate-spin"></div>
              </div>
            ) : articles.length === 0 ? (
              <div id="noarticlefound" className="col-span-2">
                <p className="flex items-center justify-center text-2xl font-bold text-center mt-8">
                  Aucun article trouvé.
                </p>
              </div>
            ) : (
              articles.map((article, index) => (
                <Link href={`/articles/${article.id_article}`} key={index}>
                  <div className="my-4 mx-6 bg-white rounded text-center w-[90%]">
                    <Image
                      className="inline-block w-[90%] h-64 mx-auto my-2 rounded-sm object-cover aspect-video"
                      width={512}
                      height={512}
                      src={article.imageUrl}
                      alt={article.title}
                    />
                    <h2 className="text-justify text-black font-semibold font-Montserrat w-[90%] text-lg py-2 pr-2 mx-auto">
                      {article.title}
                    </h2>
                    <p className="w-[90%] text-black text-justify font-Montserrat mx-auto pb-4 text-sm leading-5">
                      {article.teaser}
                    </p>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
