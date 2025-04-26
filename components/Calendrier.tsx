import React, { useEffect, useState } from "react";
import { fetchMatches } from "../utils/matchsapi";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface MatchAPI {
  round: string;
  date: string;
  time: string;
  team1: string;
  team2: string;
  score: {
    ht: string[];
    ft: string[];
  };
}

const clubLogos: { [key: string]: string } = {
  "AJ Auxerre": "/_assets/teamlogos/logoauxerre.svg",
  "Paris Saint-Germain FC": "/_assets/teamlogos/logoparissg.svg",
  "Olympique de Marseille": "/_assets/teamlogos/logomarseille.svg",
  "Stade Brestois 29": "/_assets/teamlogos/logobrest.svg",
  "Le Havre AC": "/_assets/teamlogos/logolehavre.svg",
  "Racing Club de Lens": "/_assets/teamlogos/logolens.svg",
  "Toulouse FC": "/_assets/teamlogos/logotoulouse.svg",
  "Olympique Lyonnais": "/_assets/teamlogos/logolyon.svg",
  "AS Saint-Étienne": "/_assets/teamlogos/logostetienne.svg",
  "Lille OSC": "/_assets/teamlogos/logolille.svg",
  "Stade Rennais FC 1901": "/_assets/teamlogos/logorennes.svg",
  "FC Nantes": "/_assets/teamlogos/logonantes.svg",
  "Angers SCO": "/_assets/teamlogos/logoangers.svg",
  "AS Monaco FC": "/_assets/teamlogos/logomonaco.svg",
  "OGC Nice": "/_assets/teamlogos/logonice.svg",
  "Montpellier HSC": "/_assets/teamlogos/logomontpellier.svg",
  "Stade de Reims": "/_assets/teamlogos/logostadedereims.svg",
  "RC Strasbourg Alsace": "/_assets/teamlogos/logostrasbourg.svg",
};

const formatName: { [key: string]: string } = {
  "AJ Auxerre": "AJA",
  "Paris Saint-Germain FC": "PSG",
  "Olympique de Marseille": "OM",
  "Stade Brestois 29": "SB29",
  "Le Havre AC": "HAC",
  "Racing Club de Lens": "RCL",
  "Toulouse FC": "TFC",
  "Olympique Lyonnais": "OL",
  "AS Saint-Étienne": "ASSE",
  "Lille OSC": "LOSC",
  "Stade Rennais FC 1901": "SRFC",
  "FC Nantes": "NAN",
  "Angers SCO": "SCO",
  "AS Monaco FC": "ASM",
  "OGC Nice": "OGCN",
  "Montpellier HSC": "MHSC",
  "Stade de Reims": "SDR",
  "RC Strasbourg Alsace": "RSCA",
};

function Calendrier() {
  const router = useRouter();
  const [matches, setMatches] = useState<MatchAPI[]>([]);

  useEffect(() => {
    fetchMatches(
      "https://raw.githubusercontent.com/openfootball/football.json/master/2024-25/fr.1.json"
    ).then((data) => {
      const filteredMatches = data.matches.filter((match: MatchAPI) => {
        return match.team1 === "AJ Auxerre" || match.team2 === "AJ Auxerre";
      });

      const lastFinishedIndex = [...filteredMatches]
        .reverse()
        .findIndex((match) => match.score?.ft && match.score.ft.length > 0);

      let selectedMatches: MatchAPI[] = [];

      if (lastFinishedIndex !== -1) {
        const actualIndex = filteredMatches.length - 1 - lastFinishedIndex;
        selectedMatches = filteredMatches.slice(actualIndex, actualIndex + 5);
      } else {
        selectedMatches = filteredMatches.slice(0, 5);
      }

      setMatches(selectedMatches);
    });
  }, []);

  return (
    <div className="bg-white h-48 w-[1000px] mx-auto rounded-xl">
      <div className="flex justify-between items-center pt-2">
        <h3 className="inline-block text-sm ml-9 mt-2 font-bold uppercase font-Montserrat">
          Calendrier de l&apos;AJ Auxerre
        </h3>
        <button
          className="underline text-aja-blue font-Montserrat mr-9 mt-2"
          onClick={() => router.push("/calendrier")}
        >
          Voir plus
        </button>
      </div>
      <div className="relative">
        <div
          className="mx-6 flex flex-row justify-center"
          id="matchs-container"
        >
          {matches.map((match: MatchAPI, index: number) => (
            <div
              key={index}
              className="w-48 h-28 m-2 border border-gray-600 rounded-xl box-border bg-white match flex flex-col gap-2"
            >
              <div className="flex flex-row items-center justify-between mt-2 mb-1 mx-3">
                {!match.score ||
                !match.score.ft ||
                match.score.ft.length === 0 ? (
                  <p className="font-bold font-Montserrat text-xs uppercase italic">
                    A venir
                  </p>
                ) : (
                  <p className="font-bold font-Montserrat text-xs uppercase italic">
                    Terminé
                  </p>
                )}
                {match.date && (
                  <p className="font-Montserrat text-xs">
                    {new Date(match.date).toLocaleDateString("fr-FR")}
                  </p>
                )}
              </div>
              <div
                className={`flex flex-row items-center ${
                  !match.score.ft ? "justify-start" : "justify-between"
                } gap-3 px-3`}
              >
                <Image
                  src={clubLogos[match.team1]}
                  height={9}
                  width={18}
                  alt="Logo Club 1"
                  className="object-contain aspect-auto h-6"
                />
                <p className="font-Montserrat font-bold text-lg">
                  {formatName[match.team1]}
                </p>
                {match.score.ft && (
                  <p className="font-Montserrat font-bold text-lg ml-auto">
                    {match.score.ft[0]}
                  </p>
                )}
              </div>
              <div
                className={`flex flex-row items-center ${
                  !match.score.ft ? "justify-start" : "justify-between"
                } gap-3 px-3`}
              >
                <Image
                  src={clubLogos[match.team2]}
                  width={18}
                  height={9}
                  alt="Logo Club 2"
                  className="object-contain aspect-auto h-6"
                />
                <p className="font-Montserrat font-bold text-lg">
                  {formatName[match.team2]}
                </p>
                {match.score.ft && (
                  <p className="font-Montserrat font-bold text-lg ml-auto">
                    {match.score.ft[1]}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Calendrier;
