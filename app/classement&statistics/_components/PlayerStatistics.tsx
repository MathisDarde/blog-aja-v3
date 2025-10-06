"use client"

import { PlayerStats } from "@/contexts/Interfaces";
import { useMemo, useState } from "react";
import playersInfo from "@/public/data/players_data.json"
import Image from "next/image";

export default function PlayerStatistics({ stats }: { stats: PlayerStats[] }) {
  const [allStatsWindow, setAllStatsWindow] = useState("galerie");

  const bestScorers = useMemo(() => {
    return [...stats]
      .sort((a, b) => b.goals - a.goals)
      .slice(0, 3);
  }, [stats]);

  const bestPassers = useMemo(() => {
    return [...stats].sort((a, b) => b.assists - a.assists).slice(0, 3);
  }, [stats])

  const getPlayerInfo = (name: string) => {
    const player = playersInfo.find((p) => p.nom === name);
    return player;
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
        <table>
          <thead className="font-Montserrat text-sm">
            <tr>
              <th className="border border-gray-300 px-4 py-2">#</th>
              <th className="border border-gray-300 px-4 py-2">Nom</th>
              <th className="border border-gray-300 px-4 py-2">Pos.</th>
              <th className="border border-gray-300 px-4 py-2">Effectif</th>
              <th className="border border-gray-300 px-4 py-2">Matches</th>
              <th className="border border-gray-300 px-4 py-2">Buts</th>
              <th className="border border-gray-300 px-4 py-2">Passes</th>
              <th className="border border-gray-300 px-4 py-2">Cartons Jaunes</th>
              <th className="border border-gray-300 px-4 py-2">Cartons Rouges</th>
              <th className="border border-gray-300 px-4 py-2">Entrées en jeu</th>
              <th className="border border-gray-300 px-4 py-2">Minutes</th>
            </tr>
          </thead>
          <tbody className="font-Montserrat text-sm">
            {stats.map((player, index) => {
              const info = getPlayerInfo(player.nom);

              return (
              <tr key={index}>
                <td className="border border-gray-300 px-4 py-2">{player.numero}</td>
                <td className="border border-gray-300 px-4 py-2">{player.nom}</td>
                <td className="border border-gray-300 px-4 py-2">{info?.poste[0]}</td>
                <td className="border border-gray-300 px-4 py-2">{player.matches}</td>
                <td className="border border-gray-300 px-4 py-2">{player.titularisations}</td>
                <td className="border border-gray-300 px-4 py-2">{player.goals || 0}</td>
                <td className="border border-gray-300 px-4 py-2">{player.assists || 0}</td>
                <td className="border border-gray-300 px-4 py-2">{player.yellow_cards}</td>
                <td className="border border-gray-300 px-4 py-2">{player.red_cards}</td>
                <td className="border border-gray-300 px-4 py-2">{player.substitutions_in}</td>
                <td className="border border-gray-300 px-4 py-2">{player.minutes}</td>
              </tr>
            )})}
          </tbody>
        </table>
      )}
    </div>
  );
}
