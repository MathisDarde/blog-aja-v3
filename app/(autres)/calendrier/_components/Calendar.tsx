"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import dayjs from "dayjs";
import "dayjs/locale/fr";
import { MatchAPI } from "@/contexts/Interfaces";
import { getTeamInfo } from "@/utils/get-team-info";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  CalendarDays,
} from "lucide-react";
import { SeasonOption } from "@/components/SeasonSelector";

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
    console.error(err);
    return dayjs();
  }
};

const formatDateTime = (date: dayjs.Dayjs, time?: string) => {
  if (!time) return date.format("DD/MM/YYYY");
  return date.format(`DD/MM/YYYY, ${time}`);
};

// Match d'une saison du calendrier, avec le logo de l'AJA de cette saison (lib/team-logos)
export type CalendarMatch = MatchAPI & { seasonId: number; ajaLogo?: string };

// Saison d'un mois : de juillet à juin
const seasonOfMonth = (month: dayjs.Dayjs) =>
  month.month() >= 6 ? month.year() : month.year() - 1;

export default function Calendar({
  matches,
  seasons,
  initialSeason,
}: {
  // Toutes les saisons à la suite
  matches: CalendarMatch[];
  // De la plus récente à la plus ancienne
  seasons: SeasonOption[];
  // Saison demandée dans l'URL (?saison=1995), sinon le mois en cours
  initialSeason: number | null;
}) {
  const logoOf = (match: CalendarMatch, isAja: boolean) =>
    (isAja ? match.ajaLogo : match.logoSrc) ??
    `/_assets/teamlogos/${getTeamInfo(isAja ? "AJA" : match.contre.split(" (")[0]).logo}`;

  // parser toutes les dates une fois, dans l'ordre chronologique
  const parsedMatches = useMemo(
    () =>
      matches
        .map((m) => ({ ...m, parsedDate: parseFrenchDate(m.date) }))
        .sort((a, b) => a.parsedDate.valueOf() - b.parsedDate.valueOf()),
    [matches],
  );

  // Bornes de la navigation : premier et dernier mois avec un match
  const firstMonth =
    parsedMatches[0]?.parsedDate.startOf("month") ?? dayjs().startOf("month");
  const lastMonth =
    parsedMatches.at(-1)?.parsedDate.startOf("month") ??
    dayjs().startOf("month");
  const clamp = (month: dayjs.Dayjs) =>
    month.isBefore(firstMonth)
      ? firstMonth
      : month.isAfter(lastMonth)
        ? lastMonth
        : month;

  // Premier mois avec un match de la saison
  const startOfSeason = (seasonId: number) =>
    parsedMatches
      .find((m) => m.seasonId === seasonId)
      ?.parsedDate.startOf("month") ?? null;

  const [currentMonth, setCurrentMonth] = useState(
    () =>
      (initialSeason != null && startOfSeason(initialSeason)) ||
      clamp(dayjs().startOf("month")),
  );
  const goTo = (month: dayjs.Dayjs) =>
    setCurrentMonth(clamp(month.startOf("month")));

  // Sélecteur de date natif, ouvert depuis le titre du mois
  const datePicker = useRef<HTMLInputElement>(null);
  const openDatePicker = () => {
    const input = datePicker.current;
    if (!input) return;
    try {
      input.showPicker();
    } catch {
      input.focus();
    }
  };

  const currentSeason = seasonOfMonth(currentMonth);
  const seasonInfo = seasons.find((s) => s.seasonId === currentSeason);

  // La saison affichée suit dans l'URL, pour recharger ou partager la page au même endroit
  useEffect(() => {
    const url =
      currentSeason === seasons[0]?.seasonId
        ? window.location.pathname
        : `?saison=${currentSeason}`;
    window.history.replaceState(null, "", url);
  }, [currentSeason, seasons]);

  const monthMatches = parsedMatches.filter((m) =>
    m.parsedDate.isSame(currentMonth, "month"),
  );

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

  const navButton = (
    label: string,
    icon: React.ReactNode,
    target: dayjs.Dayjs,
    disabled: boolean,
  ) => (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={() => goTo(target)}
      disabled={disabled}
      className="p-1.5 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
    >
      {icon}
    </button>
  );

  const atStart = !currentMonth.isAfter(firstMonth);
  const atEnd = !currentMonth.isBefore(lastMonth);

  return (
    <>
      <p className="font-Montserrat text-gray-600 mt-1 mb-4">
        {seasonInfo
          ? `${seasonInfo.season} · ${seasonInfo.competitionName}`
          : "Pas de championnat archivé pour cette saison"}
      </p>

      {/* Saison : saute au début de la saison choisie */}
      {seasons.length > 1 && (
        <label className="inline-flex items-center gap-2 font-Montserrat text-sm mb-6 sm:mb-10">
          <span className="font-semibold">Saison</span>
          <select
            value={seasonInfo ? currentSeason : ""}
            onChange={(e) => {
              const start = startOfSeason(Number(e.target.value));
              if (start) goTo(start);
            }}
            className="border border-gray-300 rounded-full px-3 py-1.5 bg-white cursor-pointer"
          >
            {!seasonInfo && <option value="">—</option>}
            {seasons.map((s) => (
              <option key={s.seasonId} value={s.seasonId}>
                {s.season} · {s.competitionName}
              </option>
            ))}
          </select>
        </label>
      )}

      <div className="p-2 sm:p-4 lg:p-6 max-w-[400px] md:max-w-[800px] lg:max-w-none lg:w-[950px] xl:w-[1200px] 2xl:w-[1300px] bg-white mx-auto rounded-xl lg:rounded-none">
        {/* Navigation : année et mois précédents / suivants */}
        <div className="flex items-center justify-between mb-4 font-Montserrat">
          <div className="flex items-center gap-1">
            {navButton(
              "Année précédente",
              <ChevronsLeft />,
              currentMonth.subtract(1, "year"),
              atStart,
            )}
            {navButton(
              "Mois précédent",
              <ChevronLeft />,
              currentMonth.subtract(1, "month"),
              atStart,
            )}
          </div>
          <div className="relative">
            <button
              type="button"
              onClick={openDatePicker}
              title="Choisir une date"
              className="flex items-center gap-2 px-3 py-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <CalendarDays size={18} className="text-aja-blue shrink-0" />
              <h2 className="text-lg sm:text-xl font-bold capitalize">
                {currentMonth.format("MMMM YYYY")}
              </h2>
            </button>
            {/* Invisible : sert d'ancre au calendrier natif du navigateur */}
            <input
              ref={datePicker}
              type="date"
              aria-label="Aller à une date"
              tabIndex={-1}
              min={firstMonth.format("YYYY-MM-DD")}
              max={lastMonth.endOf("month").format("YYYY-MM-DD")}
              value={currentMonth.format("YYYY-MM-DD")}
              onChange={(e) => {
                if (e.target.value) goTo(dayjs(e.target.value));
              }}
              className="absolute inset-x-0 bottom-0 h-0 opacity-0 pointer-events-none"
            />
          </div>
          <div className="flex items-center gap-1">
            {navButton(
              "Mois suivant",
              <ChevronRight />,
              currentMonth.add(1, "month"),
              atEnd,
            )}
            {navButton(
              "Année suivante",
              <ChevronsRight />,
              currentMonth.add(1, "year"),
              atEnd,
            )}
          </div>
        </div>

        <div className="hidden lg:block">
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
                match.parsedDate.isSame(d, "day"),
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
                        matchOfTheDay,
                      )}`}
                    >
                      {/* Header match */}
                      <div className="flex flex-col items-center justify-between mb-2">
                        <p className="font-bold font-Montserrat text-[11px] xl:text-xs uppercase italic">
                          {matchOfTheDay.resultat &&
                          matchOfTheDay.resultat !== "-:-"
                            ? "Terminé"
                            : "À venir"}
                        </p>
                        <p className="font-Montserrat text-[10px] xl:text-xs">
                          {formatDateTime(
                            matchOfTheDay.parsedDate,
                            matchOfTheDay.horaire,
                          )}
                        </p>
                      </div>

                      {/* Équipe 1 */}
                      <div className="flex items-center gap-2">
                        <Image
                          src={logoOf(
                            matchOfTheDay,
                            matchOfTheDay.dom_ext === "D",
                          )}
                          alt="Logo équipe 1"
                          height={24}
                          width={24}
                          className="object-contain size-4 lg:size-6"
                        />
                        <p className="font-Montserrat flex items-center gap-2 font-bold text-medium xl:text-lg">
                          {
                            getTeamInfo(
                              matchOfTheDay.dom_ext === "D"
                                ? "AJA"
                                : matchOfTheDay.contre.split(" (")[0],
                            ).abr
                          }
                          <span className="hidden xl:block text-xs font-medium">
                            {
                              matchOfTheDay.dom_ext === "D"
                                ? matchOfTheDay.classement // AJ Auxerre classement
                                : getOpponentRanking(matchOfTheDay.contre) // adversaire classement
                            }
                          </span>
                        </p>
                        {matchOfTheDay.resultat &&
                          matchOfTheDay.resultat !== "-:-" && (
                            <p className="font-Montserrat font-bold text-medium xl:text-lg ml-auto">
                              {matchOfTheDay.resultat.split(":")[0]}
                            </p>
                          )}
                      </div>

                      {/* Équipe 2 */}
                      <div className="flex items-center gap-2 my-2">
                        <Image
                          src={logoOf(
                            matchOfTheDay,
                            matchOfTheDay.dom_ext === "E",
                          )}
                          alt="Logo équipe 2"
                          height={24}
                          width={24}
                          className="object-contain size-4 lg:size-6"
                        />
                        <p className="font-Montserrat flex items-center gap-2 font-bold text-medium xl:text-lg">
                          {
                            getTeamInfo(
                              matchOfTheDay.dom_ext === "E"
                                ? "AJA"
                                : matchOfTheDay.contre.split(" (")[0],
                            ).abr
                          }
                          <span className="hidden xl:block text-xs font-medium">
                            {
                              matchOfTheDay.dom_ext === "E"
                                ? matchOfTheDay.classement // AJ Auxerre classement
                                : getOpponentRanking(matchOfTheDay.contre) // adversaire classement
                            }
                          </span>
                        </p>
                        {matchOfTheDay.resultat &&
                          matchOfTheDay.resultat !== "-:-" && (
                            <p className="font-Montserrat font-bold text-medium xl:text-lg ml-auto">
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

        {monthMatches.length === 0 && (
          <p className="lg:hidden font-Montserrat text-sm text-gray-500 py-6">
            Aucun match ce mois-ci.
          </p>
        )}
        <div className="lg:hidden p-1 sm:p-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          {monthMatches.map((match, idx) => {
            const teamHome = getTeamInfo(
              match.dom_ext === "D" ? "AJA" : match.contre.split(" (")[0],
            );
            const teamAway = getTeamInfo(
              match.dom_ext === "E" ? "AJA" : match.contre.split(" (")[0],
            );

            return (
              <div
                key={idx}
                className={`rounded-xl shadow-md p-4 font-Montserrat ${getMatchColor(
                  match,
                )}`}
              >
                <p className="underline font-Montserrat text-xs mb-2">
                  Journée {match.journee}{" "}
                </p>
                {/* Statut + date */}
                <div className="flex justify-between items-center mb-2">
                  <p className="text-xs uppercase italic font-bold">
                    {match.resultat && match.resultat !== "-:-"
                      ? "Terminé"
                      : "À venir"}
                  </p>
                  <p className="text-sm">
                    {formatDateTime(match.parsedDate, match.horaire)}
                  </p>
                </div>

                {/* Équipe 1 */}
                <div className="flex items-center gap-2">
                  <Image
                    src={logoOf(match, match.dom_ext === "D")}
                    alt={"Logo Equipe 1"}
                    width={28}
                    height={28}
                    className="object-contain"
                  />
                  <p className="font-semibold font-Bai_Jamjuree text-xl ml-2">
                    {teamHome.actualName}
                    <span className="ml-2 text-xs font-Montserrat font-light">
                      {match.dom_ext === "D"
                        ? match.classement
                        : getOpponentRanking(match.contre)}
                    </span>
                  </p>
                  {match.resultat && match.resultat !== "-:-" && (
                    <p className="ml-auto font-bold text-lg">
                      {match.resultat.split(":")[0]}
                    </p>
                  )}
                </div>

                {/* Équipe 2 */}
                <div className="flex items-center gap-2 my-2">
                  <Image
                    src={logoOf(match, match.dom_ext === "E")}
                    alt={"Logo Equipe 2"}
                    width={28}
                    height={28}
                    className="object-contain"
                  />
                  <p className="font-semibold font-Bai_Jamjuree text-xl ml-2">
                    {teamAway.actualName}
                    <span className="ml-2 text-xs font-Montserrat font-light">
                      {match.dom_ext === "E"
                        ? match.classement
                        : getOpponentRanking(match.contre)}
                    </span>
                  </p>
                  {match.resultat && match.resultat !== "-:-" && (
                    <p className="ml-auto font-bold text-lg">
                      {match.resultat.split(":")[1]}
                    </p>
                  )}
                </div>

                {/* Spectateurs */}
                {match.spectateurs && (
                  <p className="text-xs text-gray-700 mt-2">
                    {teamHome.stade}, {match.spectateurs} spectateurs
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
