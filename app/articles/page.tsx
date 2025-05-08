"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import SearchInput from "./_components/SearchInput";
import { useRouter, useSearchParams } from "next/navigation";
import { getArticlesbyKeywords } from "@/actions/article/get-article-by-keywords";
import Button from "@/components/BlueButton";

interface Article {
  id_article: string;
  imageUrl: string;
  title: string;
  teaser: string;
  content: string;
  author: string;
}

interface Filter {
  id: number;
  tag: string;
  value: string;
  img: string;
  type: string;
}

export default function ArticleCenter() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const searchQuery = searchParams ? searchParams.get("q") || "" : "";
  const yearfilter = searchParams ? searchParams.get("year") || "" : "";
  const playerfilter = searchParams ? searchParams.get("player") || "" : "";
  const leaguefilter = searchParams ? searchParams.get("league") || "" : "";

  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<Filter[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchValue, setSearchValue] = useState(searchQuery);
  const filterRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    async function fetchFilters() {
      try {
        const response = await fetch("/data/articletags.json");
        if (!response.ok) {
          throw new Error(`Erreur HTTP : ${response.status}`);
        }
        const data: Filter[] = await response.json();
        setFilters(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des filtres :", error);
      }
    }

    fetchFilters();
  }, []);

  useEffect(() => {
    async function fetchArticles() {
      setIsLoading(true);
      try {
        const data: Article[] = await getArticlesbyKeywords({
          query: searchQuery || undefined,
          year: yearfilter || undefined,
          player: playerfilter || undefined,
          league: leaguefilter || undefined,
        });
        setArticles(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des articles :", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchArticles();
  }, [searchQuery, yearfilter, playerfilter, leaguefilter]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setIsFilterOpen(false);
      }
    }

    if (isFilterOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isFilterOpen]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  const clearFilters = () => {
    setSearchValue("");
    router.push("/articles");
  };

  const toggleFilterMenu = () => {
    setIsFilterOpen(!isFilterOpen);
  };
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(window.location.search);

    // Keep existing filters
    if (yearfilter) {
      params.set("year", yearfilter);
    }
    if (playerfilter) {
      params.set("player", playerfilter);
    }
    if (leaguefilter) {
      params.set("league", leaguefilter);
    }

    // Update search query
    if (searchValue) {
      params.set("q", searchValue);
    } else {
      params.delete("q");
    }

    router.push(`/articles?${params.toString()}`);
  };

  const applyFilter = (filterType: string, value: string) => {
    const params = new URLSearchParams(window.location.search);

    // Keep existing search query if present
    if (searchQuery) {
      params.set("q", searchQuery);
    }

    // Update or add the new filter while keeping other filters
    if (filterType === "year") {
      params.set("year", value);
    } else if (filterType === "player") {
      params.set("player", value);
    } else if (filterType === "league") {
      params.set("league", value);
    }

    router.push(`/articles?${params.toString()}`);
    setIsFilterOpen(false);
  };

  return (
    <div className="text-center bg-gray-100 min-h-screen w-screen box-border">
      <div className="text-center">
        <h1 className="text-center font-Montserrat text-4xl font-bold uppercase pt-10 mb-10">
          Rechercher un article
        </h1>

        <div className="relative flex items-center justify-center max-w-[500px] mx-auto">
          <SearchInput
            value={searchValue}
            onChange={handleSearchChange}
            onFilterClick={toggleFilterMenu}
            onSubmit={handleSearch}
          />

          {isFilterOpen && (
            <div
              ref={filterRef}
              className="absolute z-10 mt-4 w-[748px] p-4 bg-white ring-1 ring-black ring-opacity-5 top-3 right-1/2 transform translate-x-1/2"
            >
              <div className="py-1">
                <div className="grid grid-cols-3 gap-4 p-4 font-Montserrat">
                  {/* Années */}
                  <div>
                    <h3 className="text-lg font-semibold border-b pb-2 mb-2">
                      Années
                    </h3>
                    {filters
                      .filter((filter) => filter.type === "year")
                      .map((filter) => (
                        <button
                          key={filter.id}
                          onClick={() => applyFilter("year", filter.value)}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full md:text-left"
                        >
                          {filter.tag}
                        </button>
                      ))}
                  </div>

                  {/* Joueurs */}
                  <div>
                    <h3 className="text-lg font-semibold border-b pb-2 mb-2">
                      Joueurs
                    </h3>
                    {filters
                      .filter((filter) => filter.type === "player")
                      .map((filter) => (
                        <button
                          key={filter.id}
                          onClick={() => applyFilter("player", filter.value)}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full md:text-left"
                        >
                          {filter.tag}
                        </button>
                      ))}
                  </div>

                  {/* Ligues */}
                  <div>
                    <h3 className="text-lg font-semibold border-b pb-2 mb-2">
                      Ligues
                    </h3>
                    {filters
                      .filter((filter) => filter.type === "league")
                      .map((filter) => (
                        <button
                          key={filter.id}
                          onClick={() => applyFilter("league", filter.value)}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full md:text-left"
                        >
                          {filter.tag}
                        </button>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="mt-4">
          <Button onClick={clearFilters} className="px-6 py-2">
            Réinitialiser la recherche
          </Button>
        </div>

        <div className="relative w-[1500px] mx-auto">
          <p className="text-xl font-Montserrat font-semibold text-left ml-12 py-6 ">
            Résultats les plus pertinents :
          </p>

          {(searchQuery || yearfilter || playerfilter || leaguefilter) && (
            <div className="mb-2 flex flex-wrap gap-2 justify-center font-Montserrat">
              {searchQuery && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-aja-blue text-white">
                  Recherche : {searchQuery}
                </span>
              )}
              {yearfilter && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-aja-blue text-white">
                  Année :{" "}
                  {filters.find((f) => f.value === yearfilter)?.tag ||
                    yearfilter}
                </span>
              )}
              {playerfilter && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-aja-blue text-white">
                  Joueur :{" "}
                  {filters.find((f) => f.value === playerfilter)?.tag ||
                    playerfilter}
                </span>
              )}
              {leaguefilter && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-aja-blue text-white">
                  Ligue :{" "}
                  {filters.find((f) => f.value === leaguefilter)?.tag ||
                    leaguefilter}
                </span>
              )}
            </div>
          )}

          <div
            id="articlecontainerteaser"
            className="grid grid-cols-3 justify-items-center gap-6 my-2 mx-5"
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
                <Link
                  href={`/articles/${article.id_article}`}
                  key={index}
                  className="w-full h-full"
                >
                  <div className="flex flex-col bg-white rounded text-center p-6 h-full">
                    <Image
                      className="inline-block w-full h-auto mx-auto rounded-sm object-cover aspect-video object-top"
                      width={512}
                      height={512}
                      src={article.imageUrl}
                      alt={article.title}
                    />
                    <h2 className="text-justify text-black font-semibold font-Montserrat text-lg pt-4 py-2 pr-2 mx-auto">
                      {article.title}
                    </h2>
                    <p className="text-black text-justify font-Montserrat mx-auto text-sm leading-5">
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
