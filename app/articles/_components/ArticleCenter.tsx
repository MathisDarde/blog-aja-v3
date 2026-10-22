"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import SearchInput from "./SearchInput";
import { useRouter, useSearchParams } from "next/navigation";
import { Filter } from "@/contexts/Interfaces";
import { SearchableArticle, searchArticles } from "@/lib/article-search";
import FilterContent from "./FilterContent";
import Button from "@/components/BlueButton";
import ArticleShowcase from "@/components/ArticleComponent";
import { paginate, parsePage } from "@/lib/pagination";
import Pagination from "./Pagination";

type ArticleParams = {
  searchQuery: string;
  yearfilter: string;
  playerfilter: string;
  leaguefilter: string;
  page: number;
};

type ArticleCenterProps = {
  articles: SearchableArticle[];
  filters: Filter[];
};

// Lit la recherche et les filtres dans l'URL (rendu côté navigateur uniquement)
export default function ArticleCenter(props: ArticleCenterProps) {
  const searchParams = useSearchParams();

  return (
    <ArticleCenterView
      {...props}
      searchQuery={searchParams.get("q") || ""}
      yearfilter={searchParams.get("year") || ""}
      playerfilter={searchParams.get("player") || ""}
      leaguefilter={searchParams.get("league") || ""}
      page={parsePage(searchParams.get("page"))}
    />
  );
}

// Sans useSearchParams : rendu au build sans recherche ni filtre (fallback du Suspense),
// pour que la liste complète des articles soit dans le HTML lu par les moteurs
export function ArticleCenterView({
  articles,
  filters,
  searchQuery,
  yearfilter,
  playerfilter,
  leaguefilter,
  page,
}: ArticleCenterProps & ArticleParams) {
  const router = useRouter();

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
    params.delete("page");

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

  const activeFilters = { year: yearfilter, player: playerfilter, league: leaguefilter };

  // Un clic sur le filtre déjà actif le retire
  const applyFilter = (filterType: "year" | "player" | "league", value: string) => {
    const params = new URLSearchParams(window.location.search);
    params.delete("page");

    if (searchQuery) params.set("q", searchQuery);

    if (activeFilters[filterType] === value) params.delete(filterType);
    else params.set(filterType, value);

    router.push(`/articles?${params.toString()}`);
    setIsFilterOpen(false);
  };

  // Articles par tag, pour les pastilles des filtres
  const tagCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const article of articles) {
      for (const tag of new Set(article.tags)) counts[tag] = (counts[tag] ?? 0) + 1;
    }
    return counts;
  }, [articles]);

  const removeFilter = (type: "year" | "player" | "league") => {
    const params = new URLSearchParams(window.location.search);
    params.delete(type);
    params.delete("page");
    router.push(`/articles?${params.toString()}`);
  };

  // Filtres exacts sur les tags, puis recherche classée par pertinence (cf. lib/article-search)
  const filteredArticles = useMemo(() => {
    const tagFilters = [yearfilter, playerfilter, leaguefilter].filter(Boolean);
    const tagged = articles.filter((article) =>
      tagFilters.every((filter) => article.tags.includes(filter))
    );
    return searchArticles(tagged, searchQuery);
  }, [articles, searchQuery, yearfilter, playerfilter, leaguefilter]);

  const pagination = paginate(filteredArticles, page);

  // Lien vers une autre page en gardant la recherche et les filtres en cours
  const pageHref = (target: number) => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (yearfilter) params.set("year", yearfilter);
    if (playerfilter) params.set("player", playerfilter);
    if (leaguefilter) params.set("league", leaguefilter);
    if (target > 1) params.set("page", String(target));
    const query = params.toString();
    return query ? `/articles?${query}` : "/articles";
  };

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
            className="absolute z-[5] top-full mt-2 left-0 right-0 max-h-[75vh] overflow-y-auto p-4 sm:p-5 bg-white rounded-xl shadow-xl ring-1 ring-black/5"
          >
            <FilterContent
              filters={filters}
              counts={tagCounts}
              active={activeFilters}
              applyFilter={applyFilter}
              onClose={() => setIsFilterOpen(false)}
            />
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
          {searchQuery
            ? filteredArticles.length > 1
              ? `${filteredArticles.length} résultats, du plus pertinent au moins pertinent :`
              : `${filteredArticles.length} résultat :`
            : "Derniers articles :"}
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
            pagination.items.map((article) => (
              <div key={article.id_article} className="bg-white p-4">
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

        <Pagination
          page={pagination.page}
          totalPages={pagination.totalPages}
          pageHref={pageHref}
        />
      </div>
    </div>
  );
}
