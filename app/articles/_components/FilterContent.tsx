"use client";

import { Filter } from "@/contexts/Interfaces";
import { normalizeText } from "@/lib/normalize-text";
import { Search, X } from "lucide-react";
import { useState } from "react";

type FilterType = "year" | "league" | "player";

const SECTIONS: { type: FilterType; title: string }[] = [
  { type: "year", title: "Époques" },
  { type: "league", title: "Compétitions" },
  { type: "player", title: "Joueurs" },
];

/**
 * Filtres de /articles en pastilles, avec le nombre d'articles de chacune. Un clic sur le
 * filtre actif le retire ; les joueurs se cherchent par leur nom.
 */
export default function FilterContent({
  filters,
  counts,
  active,
  applyFilter,
  onClose,
}: {
  filters: Filter[];
  // Articles publiés par tag
  counts: Record<string, number>;
  active: Record<FilterType, string>;
  applyFilter: (filterType: FilterType, value: string) => void;
  onClose: () => void;
}) {
  const [playerSearch, setPlayerSearch] = useState("");

  return (
    <div className="font-Montserrat text-left">
      <div className="flex items-center justify-between mb-4">
        <p className="font-Bai_Jamjuree text-lg font-bold uppercase">Filtrer les articles</p>
        <button
          type="button"
          onClick={onClose}
          aria-label="Fermer les filtres"
          className="p-1.5 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-900"
        >
          <X size={18} />
        </button>
      </div>

      {SECTIONS.map(({ type, title }) => {
        let list = filters.filter((f) => f.type === type);
        if (type === "player") {
          const wanted = normalizeText(playerSearch);
          // Les joueurs les plus racontés d'abord, puis par ordre alphabétique
          list = list
            .filter((f) => !wanted || normalizeText(f.tag).includes(wanted))
            .sort((a, b) => (counts[b.value] ?? 0) - (counts[a.value] ?? 0) || a.tag.localeCompare(b.tag, "fr"));
        }

        return (
          <section key={type} className="mb-4 last:mb-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{title}</p>
              {type === "player" && (
                <div className="relative w-full sm:w-56">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="search"
                    value={playerSearch}
                    onChange={(e) => setPlayerSearch(e.target.value)}
                    placeholder="Chercher un joueur…"
                    className="w-full h-8 rounded-full pl-8 pr-3 text-sm border border-gray-200 focus:border-aja-blue focus:outline-none"
                  />
                </div>
              )}
            </div>

            <div className={`flex flex-wrap gap-2 ${type === "player" ? "max-h-48 overflow-y-auto pr-1" : ""}`}>
              {list.length === 0 && <p className="text-sm text-gray-500">Aucun joueur ne correspond.</p>}
              {list.map((filter) => {
                const count = counts[filter.value] ?? 0;
                const selected = active[type] === filter.value;
                return (
                  <button
                    key={filter.id}
                    type="button"
                    disabled={count === 0 && !selected}
                    onClick={() => applyFilter(type, filter.value)}
                    className={`px-3 py-1.5 rounded-full border text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                      selected
                        ? "bg-aja-blue text-white border-aja-blue"
                        : "bg-white text-gray-700 border-gray-200 hover:border-aja-blue hover:text-aja-blue disabled:hover:border-gray-200 disabled:hover:text-gray-700"
                    }`}
                  >
                    {filter.tag}{" "}
                    <span className={selected ? "text-white/80" : "text-gray-400"}>{count}</span>
                  </button>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
