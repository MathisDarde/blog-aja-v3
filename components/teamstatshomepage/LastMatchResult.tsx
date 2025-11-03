"use client";

import Image from "next/image";
import Button from "../BlueButton";
import Link from "next/link";
import { MatchAPI } from "@/contexts/Interfaces";
import { getTeamInfo } from "@/utils/get-team-info";

export default function LastMatchResult({
  lastMatch,
}: {
  lastMatch: MatchAPI;
}) {
  const auxerreTeam = "AJ Auxerre";
  let teamHomeName = "";
  let teamAwayName = "";

  if (lastMatch.dom_ext === "D") {
    teamHomeName = auxerreTeam;
    teamAwayName = lastMatch.contre.split(" (")[0];
  } else {
    teamHomeName = lastMatch.contre.split(" (")[0];
    teamAwayName = auxerreTeam;
  }

  const [scoreHome, scoreAway] = lastMatch.resultat.split(":");
  const matchDate = lastMatch.date;

  const teamHomeInfo = getTeamInfo(teamHomeName);
  const teamAwayInfo = getTeamInfo(teamAwayName);

  return (
    <div className="flex flex-col items-center">
      <p className="mb-4 text-center font-Montserrat uppercase text-base sm:text-lg lg:text-base xl:text-lg font-semibold">
        Dernier match joué:
      </p>

      <div className="flex flex-col justify-center items-center gap-1">
        <div className="flex flex-col sm:flex-row justify-center items-start sm:items-center gap-3 xl:gap-6">
          <div className="flex items-center gap-10">
          {/* Équipe à domicile */}
          <div className="flex flex-row sm:flex-col items-center gap-2">
            <Image
              src={`/_assets/teamlogos/${teamHomeInfo.logo}`}
              alt={`Logo de ${teamHomeInfo.actualName}`}
              width={100}
              height={100}
              className="w-10 sm:w-20 xl:w-28 h-10 sm:h-20 xl:h-28 object-contain"
            />
            <p className="w-[150px] sm:w-24 truncate font-Bai_Jamjuree font-semibold text-lg sm:text-center text-left" >
              {teamHomeInfo.actualName}
            </p>
          </div>

          <p className="font-Bai_Jamjuree text-3xl sm:text-5xl xl:text-6xl font-bold">
            <span className="w-24">{scoreHome}</span>{" "}
          </p>
          </div>

          <span className="hidden sm:block font-Bai_Jamjuree text-5xl xl:text-6xl font-bold mx-6">-</span>{" "}

          <div className="flex flex-row-reverse sm:flex-row items-center gap-10">
          {/* Équipe à l'extérieur */}
          <p className="font-Bai_Jamjuree text-3xl sm:text-5xl xl:text-6xl font-bold">
            <span className="w-24">{scoreAway}</span>{" "}
          </p>
          <div className="flex flex-row sm:flex-col items-center justify-center gap-2">
            <Image
              src={`/_assets/teamlogos/${teamAwayInfo.logo}`}
              alt={`Logo de ${teamAwayInfo.actualName}`}
              width={100}
              height={100}
              className="w-10 sm:w-20 xl:w-28 h-10 sm:h-20 xl:h-28 object-contain"
            />
            <p className="w-[150px] sm:w-24 truncate font-Bai_Jamjuree font-semibold text-lg sm:text-center text-left">
              {teamAwayInfo.actualName}
            </p>
          </div>
          </div>
        </div>

        {/* Date et horaire */}
        <div className="flex justify-center mt-4 sm:mt-0">
          <p className="font-Montserrat text-sm sm:text-base xl:text-lg">{matchDate}</p>
        </div>
      </div>

      <Link href="/calendrier">
        <Button size="default">Accéder au calendrier</Button>
      </Link>
    </div>
  );
}
