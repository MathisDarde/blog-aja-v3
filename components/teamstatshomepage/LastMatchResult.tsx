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
      <p className="mb-4 text-center font-Montserrat uppercase text-lg font-semibold">
        Dernier match joué:
      </p>

      <div className="flex flex-col justify-center items-center gap-1">
        <div className="flex justify-center gap-6">
          {/* Équipe à domicile */}
          <div className="flex flex-col items-center gap-2">
            <Image
              src={`/_assets/teamlogos/${teamHomeInfo.logo}`}
              alt={`Logo de ${teamHomeInfo.actualName}`}
              width={100}
              height={100}
            />
            <p className="w-24 truncate font-Bai_Jamjuree font-semibold text-lg">
              {teamHomeInfo.actualName}
            </p>
          </div>

          {/* Score */}
          <div className="flex justify-center items-center rounded-md p-6">
            <p className="font-Bai_Jamjuree text-6xl font-bold">
              <span className="w-24">{scoreHome}</span>{" "}
              <span className="mx-6">-</span>{" "}
              <span className="w-24">{scoreAway}</span>
            </p>
          </div>

          {/* Équipe à l'extérieur */}
          <div className="flex flex-col items-center gap-2">
            <Image
              src={`/_assets/teamlogos/${teamAwayInfo.logo}`}
              alt={`Logo de ${teamAwayInfo.actualName}`}
              width={100}
              height={100}
            />
            <p className="w-24 truncate font-Bai_Jamjuree font-semibold text-lg">
              {teamAwayInfo.actualName}
            </p>
          </div>
        </div>

        {/* Date et horaire */}
        <div className="flex justify-center">
          <p className="font-Bai_Jamjuree font-medium text-lg">{matchDate}</p>
        </div>
      </div>

      <Link href="/calendrier">
        <Button>Accéder au calendrier</Button>
      </Link>
    </div>
  );
}
