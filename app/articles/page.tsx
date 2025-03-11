"use client";

import { useEffect, useState } from "react";
import { Search, Filter, ListRestart } from "lucide-react";
import Image from "next/image";
import displayArticles from "@/actions/display-articles";
import fetchArticlesByTag from "@/actions/display-articles-tags";
import SidebarResp from "@/components/SidebarResp";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";

interface Article {
  article_id: number;
  imageUrl: string;
  title: string;
  teaser: string;
  content: string;
  author: string;
}

interface Tag {
  value: string;
  tag: string;
  type: string;
}

export default function ArticleCenter() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [filters, setFilters] = useState<Tag[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sidebarState, setSidebarState] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const toggleSidebar = () => {
    setSidebarState((prevState) => (prevState === 0 ? 1 : 0));
  };

  const fetchAndDisplayArticles = async (tag?: string) => {
    try {
      setIsLoading(true);
      const articles = tag
        ? await fetchArticlesByTag(tag)
        : await displayArticles();
      setArticles(articles);
    } catch (error) {
      console.error("Erreur lors de la récupération des articles :", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFilters = async () => {
    try {
      const response = await fetch("../../data/articletags.json");
      console.log(response);
      if (!response.ok) {
        throw new Error(`Erreur HTTP : ${response.status}`);
      }

      const data: Tag[] = await response.json();
      console.log(data);
      setFilters(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des tags :", error);
    }
  };

  useEffect(() => {
    fetchFilters();
    const queryParams = new URLSearchParams(window.location.search);
    const tagFromURL = queryParams.get("tag");
    fetchAndDisplayArticles(tagFromURL || undefined);
  }, []);

  const handleFilterClick = (tag: string) => {
    window.location.href = `/articles?tag=${encodeURIComponent(tag)}`;
  };

  const resetFilters = () => {
    fetchAndDisplayArticles();
    window.location.href = `/articles`;
  };

  return (
    <div className="text-center bg-gray-100 h-full w-screen box-border">
      {sidebarState === 0 ? (
        <SidebarResp onToggle={toggleSidebar} />
      ) : (
        <Sidebar onToggle={toggleSidebar} />
      )}

      <div className="ml-24">
        <div className="text-5xl text-center font-title italic uppercase font-bold text-aja-blue py-10 font-Bai_Jamjuree">
          <Link href={"/"}>
            <h2>Mémoire d&apos;Auxerrois</h2>
          </Link>
        </div>

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
            <div className="text-left relative">
              <div
                className="inline-flex items-center ml-12 transition-all cursor-pointer"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
              >
                <p className="text-base font-Montserrat hover:underline">
                  Filtrer les résultats
                </p>
                <Filter size={32} className="pt-1 px-2" />
              </div>
              <div
                className="inline-flex items-center ml-12 transition-all bg-aja-blue text-white py-2 px-4 rounded-2xl hover:cursor-pointer hover:bg-white hover:text-aja-blue hover:border hover:border-aja-blue"
                onClick={resetFilters}
              >
                <p className="text-base font-Montserrat">
                  Réinitialiser les filtres
                </p>
                <ListRestart size={32} className="pt-1 px-2" />
              </div>

              {isFilterOpen && (
                <div
                  className="bg-white my-4 w-full rounded-2xl text-center grid grid-cols-4"
                  id="filteroptions"
                >
                  {filters.map((filter) => (
                    <div
                      key={filter.value}
                      className="py-4 w-[95%] mx-auto my-2 rounded-lg cursor-pointer bg-white justify-self-center transition-all hover:bg-aja-blue hover:text-white"
                      onClick={() => handleFilterClick(filter.value)}
                    >
                      <p className="option font-Montserrat">{filter.tag}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div
              id="articlecontainerteaser"
              className="grid grid-cols-2 justify-items-center my-2 mx-5"
            >
              {isLoading ? (
                <div className="relative w-full h-64 flex items-center justify-center">
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 border-8 rounded-full border-t-8 border-white border-t-aja-blue animate-spin"></div>
                </div>
              ) : articles.length === 0 ? (
                <div id="noarticlefound">
                  <p className="flex items-center justify-center text-5xl font-bold text-center">
                    Aucun article trouvé pour ce tag.
                  </p>
                </div>
              ) : (
                articles.map((article, index) => (
                  <Link href={`/articles/${article.article_id}`} key={index}>
                    <div className="my-4 mx-6 bg-white rounded text-center w-[90%]">
                      <Image
                        className="inline-block w-[90%] h-64 mx-auto my-2 rounded-sm object-cover aspect-video"
                        width={512}
                        height={512}
                        src={`${article.imageUrl}`}
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
    </div>
  );
}
