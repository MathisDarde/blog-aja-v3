"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import SearchInput from "./SearchInput";
import { useRouter, useSearchParams } from "next/navigation";
import { Article, Filter } from "@/contexts/Interfaces";
import FilterContent from "./FilterContent";
import Button from "@/components/BlueButton";
import ArticleShowcase from "@/components/ArticleComponent";

export default function ArticleCenter({
  articles,
  filters,
}: {
  articles: Article[];
  filters: Filter[];
}) {
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
      const tags = article.tags?.map((t) => t.toLowerCase()) || [];
      const content = article.content?.toLowerCase() || "";
      const teaser = article.teaser?.toLowerCase() || "";
      const author = article.author?.toLowerCase() || "";

      // Filtre exact sur les tags year, player, league
      if (yearfilter && !tags.includes(yearfilter.toLowerCase())) return false;
      if (playerfilter && !tags.includes(playerfilter.toLowerCase()))
        return false;
      if (leaguefilter && !tags.includes(leaguefilter.toLowerCase()))
        return false;

      // Recherche textuelle sur contenu, teaser, auteur ou tags
      if (qLower) {
        const inTags = tags.some((tag) => tag.includes(qLower));
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
    <div className="text-center bg-gray-100 min-h-screen w-screen box-border p-6 md:p-10">
      <h1 className="text-center font-Bai_Jamjuree text-3xl md:text-4xl font-bold uppercase mb-4 md:mb-10">
        Rechercher un article
      </h1>

      <div className="w-full max-w-[750px] mx-auto relative flex items-center justify-center">
        <SearchInput
          value={searchValue}
          onChange={handleSearchChange}
          onFilterClick={toggleFilterMenu}
          onSubmit={handleSearch}
        />

        {isFilterOpen && (
          <div
            ref={filterRef}
            className="absolute z-[5] mt-4 w-full max-w-[748px] p-4 bg-white ring-1 ring-black ring-opacity-5 top-3 right-1/2 transform translate-x-1/2"
          >
            <div className="py-1">
              <FilterContent filters={filters} applyFilter={applyFilter} />
            </div>
          </div>
        )}
      </div>

      <div className="mt-4">
        <Button onClick={clearFilters} size="slim">
          Réinitialiser la recherche
        </Button>
      </div>

      <div className="relative max-w-[1500px] mx-auto">
        <p className="text-base sm:text-lg md:text-xl font-Montserrat font-semibold text-center md:text-left ml-0 md:ml-12 py-3 md:py-6 ">
          Résultats les plus pertinents :
        </p>

        {(searchQuery || yearfilter || playerfilter || leaguefilter) && (
          <div className="mb-2 flex flex-wrap gap-2 justify-center font-Montserrat">
            {searchQuery && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-orange-third text-white">
                Recherche : {searchQuery}
              </span>
            )}
            {yearfilter && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-orange-third text-white">
                Année :{" "}
                {filters.find((f) => f.value === yearfilter)?.tag || yearfilter}
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
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-orange-third text-white">
                Joueur :{" "}
                {filters.find((f) => f.value === playerfilter)?.tag ||
                  playerfilter}
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
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-orange-third text-white">
                Ligue :{" "}
                {filters.find((f) => f.value === leaguefilter)?.tag ||
                  leaguefilter}
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
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 justify-items-center gap-3 lg:gap-6 my-2 mx-0 lg:mx-5"
        >
          {filteredArticles.length === 0 ? (
            <p className="col-span-3 text-center text-sm sm:text-base text-gray-600 font-Montserrat py-5 sm:py-10">
              Aucun article ne correspond à votre recherche.
            </p>
          ) : (
            filteredArticles.map((article, index) => (
              <div key={index} className="bg-white p-4">
                <ArticleShowcase
                  article={article}
                  displayPosition="vertical"
                  size="small"
                  showAuthor={false}
                  showDate={false}
                  showTags={true}
                  showTeaser={true}
                />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
