"use client";

import React, { useState } from "react";
import { ClassementSortKey, Team } from "@/contexts/Interfaces";
import Image from "next/image";
import { getTeamInfo } from "@/utils/get-team-info";

// --- Styles pour les positions ---
const teamStyles: Record<string, string> = {
  "UEFA Champions League": "bg-blue-700",
  "Barrages Champions League": "bg-blue-400",
  "UEFA Europa League": "bg-green-600",
  "Barrages Conference League": "bg-yellow-600",
  "Barrages Ligue 2": "bg-red-300",
  "Ligue 2": "bg-red-600",
  "": "bg-gray-400",
};

// --- Logos des compétitions ---
const icons: Record<string, string> = {
  "UEFA Champions League": "/_assets/img/logochampionsleague.svg",
  "Barrages Champions League": "/_assets/img/logochampionsleague.svg",
  "UEFA Europa League": "/_assets/img/logoeuropaleague.svg",
  "Barrages Conference League": "/_assets/img/logoconferenceleague.svg",
  "Barrages Ligue 2": "/_assets/img/logoligue2.svg",
  "Ligue 2": "/_assets/img/logoligue2.svg",
  "": "/_assets/img/logoligue1.svg",
};

const getTeamClass = (description: string): string => {
  return teamStyles[description] ?? "";
};

const getIcon = (description: string): string => {
  return icons[description] ?? "";
};

export default function Classement({ teams }: { teams: Team[] }) {
  const [sortKey, setSortKey] = useState<ClassementSortKey>("position");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const sortedTeams = [...teams].sort((a, b) => {
    const aValue = a[sortKey];
    const bValue = b[sortKey];

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
    }
    return sortOrder === "asc"
      ? String(aValue).localeCompare(String(bValue))
      : String(bValue).localeCompare(String(aValue));
  });

  const handleSort = (key: ClassementSortKey) => {
    if (sortKey === key) setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  return (
    <div className="px-4 mt-10 h-auto w-[800px] mx-auto">
      {/* Header */}
      <div className="grid grid-cols-[75px_minmax(150px,1fr)_40px_40px_40px_40px_50px_50px_50px_70px] bg-gray-200 p-2 font-Montserrat font-semibold text-center rounded">
        <div className="cursor-pointer" onClick={() => handleSort("position")}>
          Pos. {sortKey === "position" && (sortOrder === "asc" ? "↑" : "↓")}
        </div>
        <div className="text-left cursor-pointer" onClick={() => handleSort("equipe")}>
          Équipe {sortKey === "equipe" && (sortOrder === "asc" ? "↑" : "↓")}
        </div>
        <div className="cursor-pointer" onClick={() => handleSort("matchs_joues")}>
          J {sortKey === "matchs_joues" && (sortOrder === "asc" ? "↑" : "↓")}
        </div>
        <div className="cursor-pointer" onClick={() => handleSort("gagnes")}>
          G {sortKey === "gagnes" && (sortOrder === "asc" ? "↑" : "↓")}
        </div>
        <div className="cursor-pointer" onClick={() => handleSort("nuls")}>
          N {sortKey === "nuls" && (sortOrder === "asc" ? "↑" : "↓")}
        </div>
        <div className="cursor-pointer" onClick={() => handleSort("perdus")}>
          P {sortKey === "perdus" && (sortOrder === "asc" ? "↑" : "↓")}
        </div>
        <div className="cursor-pointer" onClick={() => handleSort("buts_marques")}>
          BP {sortKey === "buts_marques" && (sortOrder === "asc" ? "↑" : "↓")}
        </div>
        <div className="cursor-pointer" onClick={() => handleSort("buts_encaisses")}>
          BC {sortKey === "buts_encaisses" && (sortOrder === "asc" ? "↑" : "↓")}
        </div>
        <div className="cursor-pointer" onClick={() => handleSort("difference")}>
          Diff {sortKey === "difference" && (sortOrder === "asc" ? "↑" : "↓")}
        </div>
        <div className="cursor-pointer" onClick={() => handleSort("points")}>
          Pts {sortKey === "points" && (sortOrder === "asc" ? "↑" : "↓")}
        </div>
      </div>

      <div className="space-y-2 mt-2">
        {sortedTeams.map((team: Team, index) => {
          const { actualName, logo } = getTeamInfo(team.equipe);

          return (
            <div
              key={index}
              className={`relative grid grid-cols-[75px_minmax(150px,1fr)_40px_40px_40px_40px_50px_50px_50px_70px] items-center px-2 py-3 rounded shadow bg-white`}
            >
              {/* Bande de couleur selon position */}
              <div
                className={`absolute left-0 top-0 h-full w-2 rounded-l ${getTeamClass(
                  team.positionStatus
                )}`}
              ></div>

              {/* Position et icône compétition */}
              <div className="flex items-center gap-2 font-Montserrat font-semibold justify-center">
                {getIcon(team.positionStatus) && (
                  <Image
                    src={getIcon(team.positionStatus)}
                    width={20}
                    height={20}
                    alt="Logo compétition"
                  />
                )}
                {team.position}.
              </div>

              {/* Nom et logo de l'équipe */}
              <div className="flex items-center gap-2 font-Montserrat font-semibold text-left">
                <Image
                  src={`/_assets/teamlogos/${logo}`}
                  width={20}
                  height={20}
                  alt={`${actualName} logo`}
                  className="h-5 w-5 object-contain"
                />
                {actualName}
              </div>

              <div className="text-center font-Montserrat text-base font-medium">
                {team.matchs_joues}
              </div>
              <div className="text-center font-Montserrat text-base font-medium">
                {team.gagnes}
              </div>
              <div className="text-center font-Montserrat text-base font-medium">
                {team.nuls}
              </div>
              <div className="text-center font-Montserrat text-base font-medium">
                {team.perdus}
              </div>
              <div className="text-center font-Montserrat text-base font-medium">
                {team.buts_marques}
              </div>
              <div className="text-center font-Montserrat text-base font-medium">
                {team.buts_encaisses}
              </div>
              <div className="text-center font-Montserrat text-base font-medium">
                {team.difference}
              </div>
              <div className="text-center font-Montserrat font-bold">
                {team.points} pts
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
