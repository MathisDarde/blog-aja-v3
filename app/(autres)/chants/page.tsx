"use client"

import { chants } from "@/contexts/Chants";
import SearchBar from "./_components/SearchBar";
import { useMemo, useState } from "react";

export default function PageChants() {
  const [searchTerm, setSearchTerm] = useState("");

  function formatChantText(text: string) {
    return text.split(",").map((part, index, arr) => {
      // Trim et majuscule 1re lettre
      const formatted =
        part.trim().charAt(0).toUpperCase() + part.trim().slice(1);

      return (
        <span key={index}>
          {formatted}
          {index < arr.length - 1 && ","}
          {index < arr.length - 1 && <br />}
        </span>
      );
    });
  }

  const filteredChants = useMemo(() => {
    if (!searchTerm.trim()) return chants;
    const lowerSearch = searchTerm.toLowerCase();
    return chants.filter(
      (chant) =>
        chant.title.toLowerCase().includes(lowerSearch) || chant.chant.toLowerCase().includes(lowerSearch)
    )
  }, [searchTerm])

  return (
    <div className="text-center bg-gray-100 min-h-screen w-screen box-border p-6 sm:p-10">
      <h1 className="text-center font-Bai_Jamjuree text-3xl sm:text-4xl font-bold uppercase mb-4 sm:mb-10">
        Chants auxerrois
      </h1>

      <div className="max-w-[750px] w-full mx-auto">
        <SearchBar
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onSubmit={(e) => e.preventDefault()}
        />
      </div>

      <div className="flex flex-col gap-2 m-4 max-w-[750px] mx-auto">
      {filteredChants.length > 0 ? (
          filteredChants.map((chant, index) => (
            <div
              key={index}
              className="bg-white shadow p-4 rounded-2xl border border-gray-200"
            >
              <p className="font-Montserrat text-base sm:text-lg font-semibold mb-2">
                {chant.title}
              </p>
              <p className="font-Montserrat text-gray-700 leading-relaxed text-sm sm:text-base">
                {formatChantText(chant.chant)}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-600 italic mt-4 font-Montserrat">Aucun chant trouvé.</p>
        )}
      </div>
    </div>
  );
}
