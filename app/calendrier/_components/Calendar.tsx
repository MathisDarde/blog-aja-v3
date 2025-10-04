"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import dayjs from "dayjs";
import "dayjs/locale/fr";
import { MatchAPI } from "@/contexts/Interfaces";
import { getTeamInfo } from "@/utils/get-team-info";
import { ChevronLeftCircle, ChevronRightCircle } from "lucide-react";

dayjs.locale("fr");

// mapping des mois français en index 0-11
const monthMap: { [key: string]: number } = {
  janv: 0,
  févr: 1,
  mars: 2,
  avr: 3,
  mai: 4,
  juin: 5,
  juil: 6,
  août: 7,
  sept: 8,
  oct: 9,
  nov: 10,
  déc: 11,
};

const parseFrenchDate = (dateStr: string) => {
  try {
    const parts = dateStr.replace(/\./g, "").split(" "); // ["sam", "27", "sept", "2025"]
    const day = parseInt(parts[1], 10);
    const month = monthMap[parts[2].toLowerCase()] ?? 0;
    const year = parseInt(parts[3], 10);
    const dateObj = dayjs(new Date(year, month, day));
    return dateObj;
  } catch (err) {
    console.log("Erreur parse date:", dateStr, err);
    return dayjs();
  }
};

const formatDateTime = (date: dayjs.Dayjs, time?: string) => {
  if (!time) return date.format("DD/MM/YYYY");
  return date.format(`DD/MM/YYYY, ${time}`);
};

export default function Calendar({ matches }: { matches: MatchAPI[] }) {
  const [currentMonth, setCurrentMonth] = useState(dayjs());

  // parser toutes les dates une fois
  const parsedMatches = useMemo(() => {
    const result = matches.map((m) => ({
      ...m,
      parsedDate: parseFrenchDate(m.date),
    }));
    console.log(
      "parsedMatches:",
      result.map((m) => ({
        date: m.date,
        parsed: m.parsedDate.format("DD/MM/YYYY"),
      }))
    );
    return result;
  }, [matches]);

  // créer la grille des jours du mois
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

  const getMatchColor = (match: MatchAPI) => {
    if (!match.resultat || match.resultat === "-:-") return "bg-white";
    const [home, away] = match.resultat.split(":").map(Number);
    const auxScore = match.dom_ext === "D" ? home : away;
    const oppScore = match.dom_ext === "D" ? away : home;

    if (auxScore > oppScore) return "bg-green-200";
    if (auxScore < oppScore) return "bg-red-200";
    return "bg-gray-200";
  };

  const getOpponentRanking = (contre: string) => {
    const match = contre.match(/\(([^)]+)\)/);
    return match ? match[0] : "";
  };

  return (
    <div className="p-6 w-[1300px] bg-white mx-auto">
      {/* Header mois */}
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

      {/* Grille */}
      <div className="grid grid-cols-7 gap-1 font-Montserrat">
        {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((d) => (
          <div key={d} className="text-center font-semibold">
            {d}
          </div>
        ))}

        {days.map((d, i) => {
          const isCurrentMonth = d.month() === currentMonth.month();
          const matchOfTheDay = parsedMatches.find((match) =>
            match.parsedDate.isSame(d, "day")
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
                  {/* Header match */}
                  <div className="flex flex-col items-center justify-between mb-2">
                    <p className="font-bold font-Montserrat text-xs uppercase italic">
                      {matchOfTheDay.resultat &&
                      matchOfTheDay.resultat !== "-:-"
                        ? "Terminé"
                        : "À venir"}
                    </p>
                    <p className="font-Montserrat text-xs">
                      {formatDateTime(
                        matchOfTheDay.parsedDate,
                        matchOfTheDay.horaire
                      )}
                    </p>
                  </div>

                  {/* Équipe 1 */}
                  <div className="flex items-center gap-2">
                    <Image
                      src={`/_assets/teamlogos/${
                        getTeamInfo(
                          matchOfTheDay.dom_ext === "D"
                            ? "AJA"
                            : matchOfTheDay.contre.split(" (")[0]
                        ).logo
                      }`}
                      alt="Logo équipe 1"
                      height={24}
                      width={24}
                      className="object-contain"
                    />
                    <p className="font-Montserrat font-bold text-lg">
                      {
                        getTeamInfo(
                          matchOfTheDay.dom_ext === "D"
                            ? "AJA"
                            : matchOfTheDay.contre.split(" (")[0]
                        ).abr
                      }
                      <span className="text-xs font-medium ml-2">
                        {
                          matchOfTheDay.dom_ext === "D"
                            ? matchOfTheDay.classement // AJ Auxerre classement
                            : getOpponentRanking(matchOfTheDay.contre) // adversaire classement
                        }
                      </span>
                    </p>
                    {matchOfTheDay.resultat &&
                      matchOfTheDay.resultat !== "-:-" && (
                        <p className="font-Montserrat font-bold text-lg ml-auto">
                          {matchOfTheDay.resultat.split(":")[0]}
                        </p>
                      )}
                  </div>

                  {/* Équipe 2 */}
                  <div className="flex items-center gap-2 my-2">
                    <Image
                      src={`/_assets/teamlogos/${
                        getTeamInfo(
                          matchOfTheDay.dom_ext === "E"
                            ? "AJA"
                            : matchOfTheDay.contre.split(" (")[0]
                        ).logo
                      }`}
                      alt="Logo équipe 2"
                      height={24}
                      width={24}
                      className="object-contain"
                    />
                    <p className="font-Montserrat font-bold text-lg">
                      {
                        getTeamInfo(
                          matchOfTheDay.dom_ext === "E"
                            ? "AJA"
                            : matchOfTheDay.contre.split(" (")[0]
                        ).abr
                      }
                      <span className="text-xs font-medium ml-2">
                        {
                          matchOfTheDay.dom_ext === "E"
                            ? matchOfTheDay.classement // AJ Auxerre classement
                            : getOpponentRanking(matchOfTheDay.contre) // adversaire classement
                        }
                      </span>
                    </p>
                    {matchOfTheDay.resultat &&
                      matchOfTheDay.resultat !== "-:-" && (
                        <p className="font-Montserrat font-bold text-lg ml-auto">
                          {matchOfTheDay.resultat.split(":")[1]}
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
