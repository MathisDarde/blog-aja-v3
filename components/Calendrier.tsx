import React from "react";
import Image from "next/image";
import { MatchAPI } from "@/contexts/Interfaces";
import { clubLogos, formatName } from "@/contexts/Teams";
import { useGlobalContext } from "@/contexts/GlobalContext";
import { useRouter } from "next/navigation";

function Calendrier() {
  const { matches } = useGlobalContext();

  const router = useRouter();

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
