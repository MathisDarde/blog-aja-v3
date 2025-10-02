"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Team } from "@/contexts/Interfaces";

const teamStyles: Record<string, string> = {
  "Champions League": "bg-blue-700",
  "Champions League Qualification": "bg-blue-400",
  "UEFA Europa League": "bg-green-600",
  "Conference League Qualification": "bg-yellow-600",
  "Relegation Playoffs": "bg-red-300",
  Relegation: "bg-red-600",
};

const icons: Record<string, string> = {
  "Champions League": "/_assets/img/logochampionsleague.svg",
  "Champions League Qualification": "/_assets/img/logochampionsleague.svg",
  "UEFA Europa League": "/_assets/img/logoeuropaleague.svg",
  "Conference League Qualification": "/_assets/img/logoconferenceleague.svg",
  "Relegation Playoffs": "/_assets/img/logoligue2.svg",
  Relegation: "/_assets/img/logoligue2.svg",
};

const getTeamClass = (description: string): string => {
  return teamStyles[description] ?? "";
};

const getIcon = (description: string): string => {
  return icons[description] ?? "";
};

function Classement() {
  const [loading, setLoading] = useState(false);
  const [teams, setTeams] = useState<Team[]>([]);

  useEffect(() => {
    const fetchTeamStats = async () => {
      try {
        const response = await fetch(
          "https://www.thesportsdb.com/api/v1/json/3/lookuptable.php?l=4334&s=2025-2026"
        );
        const data = await response.json();
        setTeams(data.table);
        setLoading(false);
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
        setLoading(false);
      }
    };

    fetchTeamStats();
  }, []);

  if (loading) {
    return <p>Chargement des données...</p>;
  }

  if (!teams || teams.length === 0) {
    return <p>Aucune équipe trouvée.</p>;
  }

  return (
    <div className="px-4 mt-10 h-auto w-[800px] mx-auto">
      {/* Header */}
      <div className="grid grid-cols-[75px_minmax(150px,1fr)_40px_40px_40px_40px_50px_50px_50px_70px] bg-gray-200 p-2 font-Montserrat font-semibold text-center rounded">
        <div>Pos.</div>
        <div className="text-left">Équipe</div>
        <div>J</div>
        <div>G</div>
        <div>N</div>
        <div>P</div>
        <div>BP</div>
        <div>BC</div>
        <div>Diff</div>
        <div>Pts</div>
      </div>

      {/* Rows */}
      <div className="space-y-2 mt-2">
        {teams.map((team: Team) => (
          <div
            key={team.idTeam}
            className={`relative grid grid-cols-[75px_minmax(150px,1fr)_40px_40px_40px_40px_50px_50px_50px_70px] items-center px-2 py-3 rounded shadow bg-white`}
          >
            <div
              className={`absolute left-0 top-0 h-full w-2 rounded-l ${getTeamClass(
                team.strDescription
              )}`}
            ></div>

            {/* Position + Icon */}
            <div className="flex items-center gap-2 font-Montserrat font-semibold justify-center">
              {getIcon(team.strDescription) && (
                <Image
                  src={getIcon(team.strDescription)}
                  width={20}
                  height={20}
                  alt="Logo compétition"
                />
              )}
              {team.intRank}.
            </div>

            {/* Team */}
            <div className="flex items-center gap-2 font-Montserrat font-semibold text-left">
              <Image
                src={`/_assets/teamlogos/logo${team.strTeam
                  .replace(/\s+/g, "")
                  .replace(/[^\w]/g, "")
                  .toLowerCase()}.svg`}
                width={20}
                height={20}
                alt={`${team.strTeam} logo`}
                className="h-5 w-5 object-contain"
              />
              {team.strTeam}
            </div>

            {/* Stats */}
            <div className="text-center font-Montserrat text-base font-medium">{team.intPlayed}</div>
            <div className="text-center font-Montserrat text-base font-medium">{team.intWin}</div>
            <div className="text-center font-Montserrat text-base font-medium">{team.intDraw}</div>
            <div className="text-center font-Montserrat text-base font-medium">{team.intLoss}</div>
            <div className="text-center font-Montserrat text-base font-medium">{team.intGoalsFor}</div>
            <div className="text-center font-Montserrat text-base font-medium">{team.intGoalsAgainst}</div>
            <div className="text-center font-Montserrat text-base font-medium">
              {team.intGoalDifference > 0
                ? `+${team.intGoalDifference}`
                : team.intGoalDifference}
            </div>
            <div className="text-center font-Montserrat font-bold">{team.intPoints} pts</div>
          </div>
        ))}
      </div>

    </div>
  );
}

export default Classement;
