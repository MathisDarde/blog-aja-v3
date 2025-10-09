"use client"

import { PlayerStats, StatsSortKey } from "@/contexts/Interfaces";
import { useMemo, useState } from "react";
import playersInfo from "@/public/data/players_data.json"
import Image from "next/image";

export default function PlayerStatistics({ stats }: { stats: PlayerStats[] }) {
  const [allStatsWindow, setAllStatsWindow] = useState("galerie");
  const [sortKey, setSortKey] = useState<StatsSortKey>("titularisations");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const handleSort = (key: StatsSortKey) => {
    if (sortKey === key) setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    else {
      setSortKey(key);
      setSortOrder("desc"); 
    }
  };

  const normalizeValue = (key: StatsSortKey, val: string | number | null | undefined): number => {
    if (key === "minutes") {
      if (val === "-" || val == null) return 0;
      return Number(String(val).replace("'", "")) || 0;
    }
    if (key === "titularisations") {
      if (
        val === "pas dans l'effectif cette saison" ||
        val === "n'a pas été utilisé cette saison" ||
        val === "-" ||
        val == null
      ) return 0;
      return Number(val) || 0;
    }

    // Pour toutes les autres clés numériques
    const num = Number(val);
    return isNaN(num) ? 0 : num;
  };

  // Tri des stats
  const sortedStats = useMemo(() => {
    return [...stats].sort((a, b) => {
      const aValue = normalizeValue(sortKey, a[sortKey]);
      const bValue = normalizeValue(sortKey, b[sortKey]);
      return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
    });
  }, [stats, sortKey, sortOrder]);

  // Meilleurs buteurs / passeurs
  const bestScorers = useMemo(() => {
    return [...stats]
      .sort((a, b) => (normalizeValue("goals", b.goals) - normalizeValue("goals", a.goals)))
      .slice(0, 3);
  }, [stats]);

  const bestPassers = useMemo(() => {
    return [...stats]
      .sort((a, b) => (normalizeValue("assists", b.assists) - normalizeValue("assists", a.assists)))
      .slice(0, 3);
  }, [stats]);

  const getPlayerInfo = (name: string) => {
    return playersInfo.find((p) => p.nom === name);
  };


  return (
    <div className="w-[1200px] mx-auto space-y-4">
      <div className="flex items-center gap-10 justify-center font-Montserrat">
        <p onClick={() => setAllStatsWindow("galerie")} className={`cursor-pointer ${allStatsWindow === "galerie"
          ? "border-b-2 border-aja-blue font-semibold"
          : ""
          }`}>Galerie</p>
        <p onClick={() => setAllStatsWindow("allStats")} className={`cursor-pointer ${allStatsWindow === "allStats"
          ? "border-b-2 border-aja-blue font-semibold"
          : ""
          }`}>Toutes les stats</p>
      </div>

      {allStatsWindow === "galerie" ? (
        <>
          <p className="text-left font-Montserrat font-semibold text-lg">Meilleurs buteurs</p>
          <div className="grid grid-cols-3 gap-10">
            {bestScorers.map((player, index) => {
              const info = getPlayerInfo(player.nom);

              return (
                <div key={index} className="bg-white p-4 rounded-md">
                  <Image
                    src={info?.image_url || "/img/pdpdebase.png"}
                    alt={player.nom}
                    width={240}
                    height={240}
                    className="rounded-full mx-auto w-36 h-36 object-cover object-top border border-black"
                  />
                  <p className="text-2xl font-semibold font-Bai_Jamjuree">{player.nom}</p>
                  <p className="font-Montserrat text-xs">{player?.position}, {info?.age} ans</p>
                  <div className="text-left font-Montserrat mt-2 text-sm">
                    <p>Nombre de matchs : {player.titularisations}</p>
                    <p>Buts marqués : {player.goals || 0}</p>
                    <p>Passes décisives : {player.assists || 0}</p>
                    <p>Minutes : {player.minutes}</p>
                  </div>
                </div>
              )
            })}
          </div>
          <p className="text-left font-Montserrat font-semibold text-lg">Meilleurs passeurs</p>
          <div className="grid grid-cols-3 gap-10">
            {bestPassers.map((player, index) => {
              const info = getPlayerInfo(player.nom);

              return (
                <div key={index} className="bg-white p-4 rounded-md">
                  <Image
                    src={info?.image_url || "/img/pdpdebase.png"}
                    alt={player.nom}
                    width={240}
                    height={240}
                    className="rounded-full mx-auto w-36 h-36 object-cover object-top border border-black"
                  />
                  <p className="text-2xl font-semibold font-Bai_Jamjuree">{player.nom}</p>
                  <p className="font-Montserrat text-xs">{player?.position}, {info?.age} ans</p>
                  <div className="text-left font-Montserrat mt-2 text-sm">
                    <p>Nombre de matches : {player.titularisations}</p>
                    <p>Buts marqués : {player.goals || 0}</p>
                    <p>Passes décisives : {player.assists || 0}</p>
                    <p>Minutes : {player.minutes}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </>
      ) : (
        <table className="mx-auto">
          <thead className="font-Montserrat text-sm">
            <tr>
              <th className="border border-gray-300 px-4 py-2 cursor-pointer" onClick={() => handleSort("numero")}>
                # {sortKey === "numero" && (sortOrder === "asc" ? "↑" : "↓")}
              </th>
              <th className="border border-gray-300 px-4 py-2 cursor-pointer" onClick={() => handleSort("nom")}>
                Nom {sortKey === "nom" && (sortOrder === "asc" ? "↑" : "↓")}
              </th>
              <th className="border border-gray-300 px-4 py-2 cursor-pointer" onClick={() => handleSort("position")}>
                Pos. {sortKey === "position" && (sortOrder === "asc" ? "↑" : "↓")}
              </th>
              <th className="border border-gray-300 px-4 py-2 cursor-pointer" onClick={() => handleSort("matches")}>
                Effectif {sortKey === "matches" && (sortOrder === "asc" ? "↑" : "↓")}
              </th>
              <th className="border border-gray-300 px-4 py-2 cursor-pointer" onClick={() => handleSort("titularisations")}>
                Matches {sortKey === "titularisations" && (sortOrder === "asc" ? "↑" : "↓")}
              </th>
              <th className="border border-gray-300 px-4 py-2 cursor-pointer" onClick={() => handleSort("goals")}>
                Buts {sortKey === "goals" && (sortOrder === "asc" ? "↑" : "↓")}
              </th>
              <th className="border border-gray-300 px-4 py-2 cursor-pointer" onClick={() => handleSort("assists")}>
                Passes {sortKey === "assists" && (sortOrder === "asc" ? "↑" : "↓")}
              </th>
              <th className="border border-gray-300 px-4 py-2 cursor-pointer" onClick={() => handleSort("yellow_cards")}>
                Jaunes {sortKey === "yellow_cards" && (sortOrder === "asc" ? "↑" : "↓")}
              </th>
              <th className="border border-gray-300 px-4 py-2 cursor-pointer" onClick={() => handleSort("red_cards")}>
                Rouges {sortKey === "red_cards" && (sortOrder === "asc" ? "↑" : "↓")}
              </th>
              <th className="border border-gray-300 px-4 py-2 cursor-pointer" onClick={() => handleSort("substitutions_in")}>
                Entrées {sortKey === "substitutions_in" && (sortOrder === "asc" ? "↑" : "↓")}
              </th>
              <th className="border border-gray-300 px-4 py-2 cursor-pointer" onClick={() => handleSort("minutes")}>
                Minutes {sortKey === "minutes" && (sortOrder === "asc" ? "↑" : "↓")}
              </th>
            </tr>
          </thead>
          <tbody className="font-Montserrat text-sm">
            {sortedStats.map((player, index) => {
              const info = getPlayerInfo(player.nom);

              return (
                <tr key={index}>
                  <td className="border border-gray-300 px-4 py-2">{player.numero}</td>
                  <td className="border border-gray-300 px-4 py-2">{player.nom}</td>
                  <td className="border border-gray-300 px-4 py-2">{info?.poste[0]}</td>
                  <td className="border border-gray-300 px-4 py-2">{player.matches}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    {player.titularisations === "Pas dans l'effectif cette saison" ||
                      player.titularisations === "N'a pas été utilisé cette saison"
                      ? 0
                      : player.titularisations}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">{player.goals || 0}</td>
                  <td className="border border-gray-300 px-4 py-2">{player.assists || 0}</td>
                  <td className="border border-gray-300 px-4 py-2">{player.yellow_cards}</td>
                  <td className="border border-gray-300 px-4 py-2">{player.red_cards}</td>
                  <td className="border border-gray-300 px-4 py-2">{player.substitutions_in}</td>
                  <td className="border border-gray-300 px-4 py-2">{player.minutes}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
