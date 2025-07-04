"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import dayjs from "dayjs";
import "dayjs/locale/fr";
import { fetchMatches } from "@/utils/matchsapi";
import { ChevronLeftCircle, ChevronRightCircle } from "lucide-react";
import { MatchAPI } from "@/contexts/Interfaces";

dayjs.locale("fr");

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

const formatDateTime = (date: string, time?: string) => {
  if (!time) return dayjs(date).format("DD/MM/YYYY");
  return dayjs(`${date}T${time}`).format("DD/MM/YYYY, HH:mm");
};

export default function Calendar() {
  const startDate = dayjs(new Date());

  const [currentMonth, setCurrentMonth] = useState(startDate);
  const [matches, setMatches] = useState<MatchAPI[]>([]);

  const days = useMemo(() => {
    const startOfMonth = currentMonth.startOf("month");
    const endOfMonth = currentMonth.endOf("month");
    const startDateGrid = startOfMonth.startOf("week");
    const endDateGrid = endOfMonth.endOf("week");

    const tempDays: dayjs.Dayjs[] = [];
    let day = startDateGrid;

    while (day.isBefore(endDateGrid, "day") || day.isSame(endDateGrid, "day")) {
      tempDays.push(day);
      day = day.add(1, "day");
    }

    return tempDays;
  }, [currentMonth]);

  useEffect(() => {
    fetchMatches(
      "https://raw.githubusercontent.com/openfootball/football.json/master/2024-25/fr.1.json"
    ).then((data) => {
      const filteredMatches = data.matches.filter((match: MatchAPI) => {
        return match.team1 === "AJ Auxerre" || match.team2 === "AJ Auxerre";
      });

      setMatches(filteredMatches);
    });
  }, []);

  const getMatchColor = (match: MatchAPI) => {
    if (!match.score?.ft || match.score.ft.length !== 2) {
      return "bg-white"; // match pas encore joué
    }

    const [score1, score2] = match.score.ft.map((s) => parseInt(s));

    if (isNaN(score1) || isNaN(score2)) return "bg-white"; // au cas où

    const isAuxerreTeam1 = match.team1 === "AJ Auxerre";

    const auxerreScore = isAuxerreTeam1 ? score1 : score2;
    const opponentScore = isAuxerreTeam1 ? score2 : score1;

    if (auxerreScore > opponentScore) return "bg-green-200";
    if (auxerreScore < opponentScore) return "bg-red-200";
    return "bg-gray-200"; // nul
  };

  return (
    <div className="p-6 w-[1300px] bg-white mx-auto">
      <div className="flex justify-between mb-4 font-Montserrat">
        <button
          onClick={() => setCurrentMonth((prev) => prev.subtract(1, "month"))}
        >
          <ChevronLeftCircle />
        </button>
        <h2 className="text-xl font-bold capitalize">
          {currentMonth.format("MMMM YYYY")}
        </h2>
        <button onClick={() => setCurrentMonth((prev) => prev.add(1, "month"))}>
          <ChevronRightCircle />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 font-Montserrat">
        {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((d) => (
          <div key={d} className="text-center font-semibold">
            {d}
          </div>
        ))}
        {days.map((d, i) => {
          const isCurrentMonth = d.month() === currentMonth.month();
          const matchOfTheDay = matches.find((match) =>
            dayjs(match.date).isSame(d, "day")
          );

          return (
            <div
              key={i}
              className={`border ${
                matchOfTheDay ? "p-0" : "p-2"
              } min-h-[110px] text-sm cursor-pointer rounded-lg ${
                !isCurrentMonth ? "bg-gray-100 text-gray-400" : ""
              }`}
            >
              {matchOfTheDay ? (
                <div
                  className={`w-full h-full rounded-lg py-2 px-3 text-black ${getMatchColor(
                    matchOfTheDay
                  )}`}
                >
                  <div className="flex flex-col items-center justify-between mb-2">
                    {!matchOfTheDay.score?.ft?.length ? (
                      <p className="font-bold font-Montserrat text-xs uppercase italic">
                        À venir
                      </p>
                    ) : (
                      <p className="font-bold font-Montserrat text-xs uppercase italic">
                        Terminé
                      </p>
                    )}
                    <p className="font-Montserrat text-xs">
                      {formatDateTime(matchOfTheDay.date, matchOfTheDay.time)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Image
                      src={clubLogos[matchOfTheDay.team1]}
                      alt="Logo Équipe 1"
                      height={9}
                      width={18}
                      className="object-contain aspect-auto h-6"
                    />
                    <p className="font-Montserrat font-bold text-lg">
                      {formatName[matchOfTheDay.team1]}
                    </p>
                    {matchOfTheDay.score?.ft && (
                      <p className="font-Montserrat font-bold text-lg ml-auto">
                        {matchOfTheDay.score.ft[0]}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 my-2">
                    <Image
                      src={clubLogos[matchOfTheDay.team2]}
                      alt="Logo Équipe 2"
                      height={9}
                      width={18}
                      className="object-contain aspect-auto h-6"
                    />
                    <p className="font-Montserrat font-bold text-lg">
                      {formatName[matchOfTheDay.team2]}
                    </p>
                    {matchOfTheDay.score?.ft && (
                      <p className="font-Montserrat font-bold text-lg ml-auto">
                        {matchOfTheDay.score.ft[1]}
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="font-bold text-center">{d.date()}</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
