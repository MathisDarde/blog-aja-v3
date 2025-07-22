"use client"

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Team } from "@/contexts/Interfaces";

const teamStyles: Record<string, string> = {
  "Champions League": "bg-blue-200",
  "Champions League Qualification": "bg-blue-100",
  "UEFA Europa League": "bg-green-100",
  "Conference League Qualification": "bg-yellow-100",
  "Relegation Playoffs": "bg-red-100",
  Relegation: "bg-red-300",
};

const getTeamClass = (description: string): string => {
  return teamStyles[description] ?? "";
};

function Classement() {
  const [loading, setLoading] = useState(false);
  const [teams, setTeams] = useState<Team[]>([]);

  useEffect(() => {
    const fetchTeamStats = async () => {
      try {
        const response = await fetch(
          "https://www.thesportsdb.com/api/v1/json/3/lookuptable.php?l=4334&s=2024-2025"
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
    <>
      <div className="px-4 mt-10 h-auto w-[800px] overflow-x-auto mx-auto">
        <table className="w-full table-fixed border-collapse">
          <thead>
            <tr className="bg-gray-200 text-black border border-black">
              <th className="p-2 w-[45px] font-bold font-Montserrat border border-black text-center ">
                Pos.
              </th>
              <th className="p-2 w-[200px] font-bold font-Montserrat border border-black text-left">
                Équipe
              </th>
              <th className="p-2 w-[45px] font-bold font-Montserrat border border-black text-center">
                J
              </th>
              <th className="p-2 w-[45px] font-bold font-Montserrat border border-black text-center">
                G
              </th>
              <th className="p-2 w-[45px] font-bold font-Montserrat border border-black text-center">
                N
              </th>
              <th className="p-2 w-[45px] font-bold font-Montserrat border border-black text-center">
                P
              </th>
              <th className="p-2 w-[45px] font-bold font-Montserrat border border-black text-center">
                BP
              </th>
              <th className="p-2 w-[45px] font-bold font-Montserrat border border-black text-center">
                BC
              </th>
              <th className="p-2 w-[45px] font-bold font-Montserrat border border-black text-center">
                Diff
              </th>
              <th className="p-2 w-[65px] font-bold font-Montserrat border border-black text-center">
                Pts
              </th>
            </tr>
          </thead>
          <tbody>
            {teams.map((team: Team) => (
              <tr
                key={team.idTeam}
                className={`border border-black ${getTeamClass(
                  team.strDescription
                )}`}
              >
                <td className="w-[25px] text-center p-2 font-Montserrat font-semibold border border-black">
                  {team.intRank}.
                </td>
                <td className="w-[200px] border border-black text-left p-2">
                  <div className="flex gap-2 font-Montserrat justify-left items-center font-semibold">
                    <Image
                      src={`/_assets/teamlogos/logo${team.strTeam
                        .replace(/\s+/g, "")
                        .replace(/[^\w]/g, "")
                        .toLowerCase()}.svg`}
                      width={20}
                      height={20}
                      alt={`${team.strTeam} logo`}
                      className="h-5 w-5 object-contain font-Montserrat"
                    />

                    {team.strTeam}
                  </div>
                </td>
                <td className="px-1 font-Montserrat font-semibold border border-black text-center">
                  {team.intPlayed}
                </td>
                <td className="px-1 font-Montserrat font-semibold border border-black text-center">
                  {team.intWin}
                </td>
                <td className="px-1 font-Montserrat font-semibold border border-black text-center">
                  {team.intDraw}
                </td>
                <td className="px-1 font-Montserrat font-semibold border border-black text-center">
                  {team.intLoss}
                </td>
                <td className="px-1 font-Montserrat font-semibold border border-black text-center">
                  {team.intGoalsFor}
                </td>
                <td className="px-1 font-Montserrat font-semibold border border-black text-center">
                  {team.intGoalsAgainst}
                </td>
                {team.intGoalDifference > 0 ? (
                  <td className="px-1 font-Montserrat font-semibold border border-black text-center">
                    +{team.intGoalDifference}
                  </td>
                ) : (
                  <td className="px-1 font-Montserrat font-semibold border border-black text-center">
                    {team.intGoalDifference}
                  </td>
                )}
                <td className="font-bold font-Montserrat border border-black text-center">
                  {team.intPoints} pts
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="w-[800px] mx-auto mt-4">
        <div className="m-2  mr-auto">
          <div className="flex items-center">
            <div className="h-3 w-3 rounded-full bg-blue-200 my-0.5 mx-2 border border-black"></div>
            <p className="font-Montserrat text-sm">
              : Qualification en Ligue des Champions
            </p>
          </div>
          <div className="flex items-center">
            <div className="h-3 w-3 rounded-full bg-blue-100 my-0.5 mx-2 border border-black"></div>
            <p className="font-Montserrat text-sm">
              : Barrages de Ligue des Champions
            </p>
          </div>
          <div className="flex items-center">
            <div className="h-3 w-3 rounded-full bg-green-100 my-0.5 mx-2 border border-black"></div>
            <p className="font-Montserrat text-sm">
              : Qualification en Ligue Europa
            </p>
          </div>
          <div className="flex items-center">
            <div className="h-3 w-3 rounded-full bg-yellow-100 my-0.5 mx-2 border border-black"></div>
            <p className="font-Montserrat text-sm">
              : Barrages de Ligue Conference
            </p>
          </div>
          <div className="flex items-center">
            <div className="h-3 w-3 rounded-full bg-red-100 my-0.5 mx-2 border border-black"></div>
            <p className="font-Montserrat text-sm">
              : Barrages de relégation en Ligue 2
            </p>
          </div>
          <div className="flex items-center">
            <div className="h-3 w-3 rounded-full bg-red-300 my-0.5 mx-2 border border-black"></div>
            <p className="font-Montserrat text-sm">: Relégation en Ligue 2</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Classement;
