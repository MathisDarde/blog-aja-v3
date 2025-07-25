"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import SearchInput from "./SearchInput";
import { useRouter, useSearchParams } from "next/navigation";
import Button from "@/components/BlueButton";
import { Article, Filter } from "@/contexts/Interfaces";

export default function ArticleCenter({ articles, filters }: { articles: Article[], filters: Filter[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const searchQuery = searchParams ? searchParams.get("q") || "" : "";
  const yearfilter = searchParams ? searchParams.get("year") || "" : "";
  const playerfilter = searchParams ? searchParams.get("player") || "" : "";
  const leaguefilter = searchParams ? searchParams.get("league") || "" : "";

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchValue, setSearchValue] = useState(searchQuery);
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
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

  // Met à jour la barre de recherche quand searchQuery change (ex: via navigation)
  useEffect(() => {
    setSearchValue(searchQuery);
  }, [searchQuery]);

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

    if (yearfilter) params.set("year", yearfilter);
    if (playerfilter) params.set("player", playerfilter);
    if (leaguefilter) params.set("league", leaguefilter);

    if (searchValue) {
      params.set("q", searchValue);
    } else {
      params.delete("q");
    }

    router.push(`/articles?${params.toString()}`);
  };

  const applyFilter = (filterType: string, value: string) => {
    const params = new URLSearchParams(window.location.search);

    if (searchQuery) params.set("q", searchQuery);

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

  const removeFilter = (type: "year" | "player" | "league") => {
    const params = new URLSearchParams(window.location.search);
    params.delete(type);
    router.push(`/articles?${params.toString()}`);
  };

  // Filtrage local des articles selon filtres et recherche
  const filteredArticles = useMemo(() => {
    const qLower = searchQuery.toLowerCase();

    return articles.filter((article) => {
      const tags = article.tags?.map(t => t.toLowerCase()) || [];
      const content = article.content?.toLowerCase() || "";
      const teaser = article.teaser?.toLowerCase() || "";
      const author = article.author?.toLowerCase() || "";

      // Filtre exact sur les tags year, player, league
      if (yearfilter && !tags.includes(yearfilter.toLowerCase())) return false;
      if (playerfilter && !tags.includes(playerfilter.toLowerCase())) return false;
      if (leaguefilter && !tags.includes(leaguefilter.toLowerCase())) return false;

      // Recherche textuelle sur contenu, teaser, auteur ou tags
      if (qLower) {
        const inTags = tags.some(tag => tag.includes(qLower));
        if (
          !(
            content.includes(qLower) ||
            teaser.includes(qLower) ||
            author.includes(qLower) ||
            inTags
          )
        ) {
          return false;
        }
      }

      return true;
    });
  }, [articles, searchQuery, yearfilter, playerfilter, leaguefilter]);

  return (
    <div className="text-center bg-gray-100 min-h-screen w-screen box-border p-10">
      <h1 className="text-center font-Bai_Jamjuree text-4xl font-bold uppercase mb-10">
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
                    .filter(filter => filter.type === "year")
                    .map(filter => (
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
                    .filter(filter => filter.type === "player")
                    .map(filter => (
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
                    .filter(filter => filter.type === "league")
                    .map(filter => (
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
                {filters.find(f => f.value === yearfilter)?.tag || yearfilter}
                <button
                  onClick={() => removeFilter("year")}
                  className="ml-2 text-white font-bold hover:text-gray-300"
                  aria-label="Supprimer le filtre Année"
                >
                  ×
                </button>
              </span>
            )}
            {playerfilter && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-aja-blue text-white">
                Joueur :{" "}
                {filters.find(f => f.value === playerfilter)?.tag || playerfilter}
                <button
                  onClick={() => removeFilter("player")}
                  className="ml-2 text-white font-bold hover:text-gray-300"
                  aria-label="Supprimer le filtre Joueur"
                >
                  ×
                </button>
              </span>
            )}
            {leaguefilter && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-aja-blue text-white">
                Ligue :{" "}
                {filters.find(f => f.value === leaguefilter)?.tag || leaguefilter}
                <button
                  onClick={() => removeFilter("league")}
                  className="ml-2 text-white font-bold hover:text-gray-300"
                  aria-label="Supprimer le filtre Ligue"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        )}

        <div
          id="articlecontainerteaser"
          className="grid grid-cols-3 justify-items-center gap-6 my-2 mx-5"
        >
          {filteredArticles.length === 0 ? (
            <p className="col-span-3 text-center text-gray-600 font-Montserrat py-10">
              Aucun article ne correspond à votre recherche.
            </p>
          ) : (
            filteredArticles.map((article, index) => (
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
  );
}
