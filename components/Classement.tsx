import React, { useState, useEffect } from "react";

interface Team {
  idTeam: string;
  intRank: number;
  strTeam: string;
  intPoints: number;
  strDescription: string;
}

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
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

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
      <div className="px-4 py-1 h-auto">
        {teams.map((team: Team) => (
          <div
            key={team.idTeam}
            className={`border border-black w-full flex flex-row items-center h-10 mt-0.5 ${getTeamClass(
              team.strDescription
            )}`}
          >
            <p className="pl-2 font-semibold">{team.intRank}.</p>
            <img
              src={`/_assets/teamlogos/logo${team.strTeam
                .replace(/\s+/g, "")
                .replace(/[^\w]/g, "")
                .toLowerCase()}.svg`}
              alt={`${team.strTeam} logo`}
              className="h-5 w-5 object-contain mx-2 font-Montserrat "
            />
            <p className="px-1 font-Montserrat font-semibold">{team.strTeam}</p>
            <p className="font-bold font-Montserrat pr-2 ml-auto">
              {team.intPoints} pts
            </p>
          </div>
        ))}
      </div>

      <div className="m-2">
        <div className=" flex items-center">
          <div
            className={`h-3 w-3 rounded-full bg-blue-200 my-0.5 mx-2 border border-black`}
          ></div>
          <p className="font-Montserrat text-xs">
            : Qualification en Ligue des Champions
          </p>
        </div>
        <div className=" flex items-center">
          <div
            className={`h-3 w-3 rounded-full bg-blue-100 my-0.5 mx-2 border border-black`}
          ></div>
          <p className="font-Montserrat text-xs">
            : Barrages de Ligue des Champions
          </p>
        </div>
        <div className=" flex items-center">
          <div
            className={`h-3 w-3 rounded-full bg-green-100 my-0.5 mx-2 border border-black`}
          ></div>
          <p className="font-Montserrat text-xs">
            : Qualification en Ligue Europa
          </p>
        </div>
        <div className=" flex items-center">
          <div
            className={`h-3 w-3 rounded-full bg-yellow-100 my-0.5 mx-2 border border-black`}
          ></div>
          <p className="font-Montserrat text-xs">
            : Barrages de Ligue Conference
          </p>
        </div>
        <div className=" flex items-center">
          <div
            className={`h-3 w-3 rounded-full bg-red-100 my-0.5 mx-2 border border-black`}
          ></div>
          <p className="font-Montserrat text-xs">
            : Barrages de relégation en Ligue 2
          </p>
        </div>
        <div className=" flex items-center">
          <div
            className={`h-3 w-3 rounded-full bg-red-300 my-0.5 mx-2 border border-black`}
          ></div>
          <p className="font-Montserrat text-xs">: Relégation en Ligue 2</p>
        </div>
      </div>
    </>
  );
}

export default Classement;
