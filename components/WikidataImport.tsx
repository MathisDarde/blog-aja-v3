"use client";

import React, { useState } from "react";
import { Globe, Loader2, Search } from "lucide-react";
import { toast } from "sonner";
import {
  type ActionResult,
  searchWikidataPeople,
} from "@/actions/method/wikidata-import";
import type { WikidataPerson } from "@/lib/wikidata";

/** Recherche une personne sur Wikidata puis préremplit le formulaire de la méthode. */
export default function WikidataImport<T extends { clubs: string[][]; clubsSansLogo: number }>({
  importer,
  onImport,
  placeholder,
  hint,
}: {
  importer: (id: string) => Promise<ActionResult<T>>;
  onImport: (data: T) => void;
  placeholder: string;
  hint: string;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<WikidataPerson[] | null>(null);
  const [searching, setSearching] = useState(false);
  const [importingId, setImportingId] = useState<string | null>(null);

  const search = async () => {
    if (query.trim().length < 2) return;
    setSearching(true);
    const response = await searchWikidataPeople(query);
    setSearching(false);

    if (!response.success) {
      toast.error(response.message);
      return;
    }
    setResults(response.data);
  };

  const importPerson = async (person: WikidataPerson) => {
    setImportingId(person.id);
    const response = await importer(person.id);
    setImportingId(null);

    if (!response.success) {
      toast.error(response.message);
      return;
    }

    onImport(response.data);
    setResults(null);
    setQuery("");

    const { clubs, clubsSansLogo } = response.data;
    toast.success(
      `${clubs.length} club(s) importé(s)` +
        (clubsSansLogo > 0 ? `, ${clubsSansLogo} sans logo à compléter` : ""),
    );
  };

  return (
    <div className="relative w-full my-4 p-4 rounded-xl border border-dashed border-aja-blue font-Montserrat">
      <span className="font-semibold text-sm sm:text-base flex items-center text-gray-600 mb-2">
        <Globe className="mr-4" />
        Préremplir depuis Wikidata :
      </span>

      <div className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            // Ne pas soumettre le formulaire de la méthode
            if (e.key === "Enter") {
              e.preventDefault();
              search();
            }
          }}
          placeholder={placeholder}
          className="w-full py-3 px-6 rounded-full border border-gray-600 text-xs sm:text-sm"
        />
        <button
          type="button"
          onClick={search}
          disabled={searching || query.trim().length < 2}
          className="shrink-0 px-4 rounded-full bg-aja-blue text-white disabled:opacity-50"
          aria-label="Rechercher"
        >
          {searching ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Search size={18} />
          )}
        </button>
      </div>

      {results && (
        <ul className="mt-3 space-y-1">
          {results.length === 0 && (
            <li className="text-xs sm:text-sm text-gray-500 text-center">
              Aucun footballeur trouvé.
            </li>
          )}
          {results.map((person) => (
            <li key={person.id}>
              <button
                type="button"
                onClick={() => importPerson(person)}
                disabled={importingId !== null}
                className="w-full flex items-center justify-between gap-2 text-left px-4 py-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 text-xs sm:text-sm"
              >
                <span>
                  <span className="font-semibold">{person.label}</span>
                  {person.description && (
                    <span className="text-gray-500"> — {person.description}</span>
                  )}
                </span>
                {importingId === person.id && (
                  <Loader2 size={16} className="animate-spin shrink-0" />
                )}
              </button>
            </li>
          ))}
        </ul>
      )}

      <p className="mt-2 text-[11px] text-gray-500">{hint}</p>
    </div>
  );
}
