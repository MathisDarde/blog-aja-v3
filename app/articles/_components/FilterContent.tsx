"use client";

import { Filter } from "@/contexts/Interfaces";
import { useScreenSize } from "@/utils/use-screen-size";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

export default function FilterContent({
  filters,
  applyFilter,
}: {
  filters: Filter[];
  applyFilter: (filterType: string, value: string) => void;
}) {
  const { width } = useScreenSize();

  const [yearFilterOpen, setYearFilterOpen] = useState(false);
  const [leagueFilterOpen, setLeagueFilterOpen] = useState(false);
  const [playerFilterOpen, setPlayerFilterOpen] = useState(false);

  return (
    <>
      {width > 640 ? (
        <div className="grid grid-cols-3 gap-4 p-4 font-Montserrat">
          {/* Années */}
          <div>
            <p className="text-lg font-semibold border-b pb-2 mb-2">Années</p>
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
            <p className="text-lg font-semibold border-b pb-2 mb-2">Joueurs</p>
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
            <p className="text-lg font-semibold border-b pb-2 mb-2">Ligues</p>
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
      ) : (
        <div className="flex flex-col gap-4 pt-4">
          <div>
            <div
              className="flex items-center justify-between px-4 py-2 cursor-pointer"
              onClick={() => setYearFilterOpen((prev) => !prev)}
            >
              <p className="text-base font-semibold font-Montserrat">Années</p>
              <ChevronDown
                size={18}
                className={`${yearFilterOpen && "rotate-180"}`}
              />
            </div>
            {yearFilterOpen && (
              <>
                {filters
                  .filter((filter) => filter.type === "year")
                  .map((filter) => (
                    <button
                      key={filter.id}
                      onClick={() => applyFilter("year", filter.value)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left font-Montserrat"
                    >
                      {filter.tag}
                    </button>
                  ))}
              </>
            )}
          </div>
          <div>
            <div
              className="flex items-center justify-between px-4 py-2 cursor-pointer"
              onClick={() => setPlayerFilterOpen((prev) => !prev)}
            >
              <p className="text-base font-semibold font-Montserrat">Joueurs</p>
              <ChevronDown
                size={18}
                className={`${playerFilterOpen && "rotate-180"}`}
              />
            </div>
            {playerFilterOpen && (
              <>
                {filters
                  .filter((filter) => filter.type === "player")
                  .map((filter) => (
                    <button
                      key={filter.id}
                      onClick={() => applyFilter("player", filter.value)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left font-Montserrat"
                    >
                      {filter.tag}
                    </button>
                  ))}
              </>
            )}
          </div>
          <div>
            <div
              className="flex items-center justify-between px-4 py-2 cursor-pointer"
              onClick={() => setLeagueFilterOpen((prev) => !prev)}
            >
              <p className="text-base font-semibold font-Montserrat">Ligues</p>
              <ChevronDown
                size={18}
                className={`${leagueFilterOpen && "rotate-180"}`}
              />
            </div>
            {leagueFilterOpen && (
              <>
                {filters
                  .filter((filter) => filter.type === "league")
                  .map((filter) => (
                    <button
                      key={filter.id}
                      onClick={() => applyFilter("league", filter.value)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left font-Montserrat"
                    >
                      {filter.tag}
                    </button>
                  ))}
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
