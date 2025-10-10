import { fetchMatches } from "@/utils/matchsapi";
import ClassementAuxerre from "./ClassementAuxerre";
import LastMatchResult from "./LastMatchResult";
import { fetchClassement } from "@/utils/classementapi";
import { MatchAPI } from "@/contexts/Interfaces";

export default async function TeamStatsBlock() {
  const matches = await fetchMatches(
    "https://mathisdarde.github.io/AJA-Website-Scrapers/data/aja_calendrier.json"
  );
  const teams = await fetchClassement(
    "https://mathisdarde.github.io/AJA-Website-Scrapers/data/classementligue1.json"
  );

  const lastMatch = matches
    .slice()
    .reverse()
    .find((match: MatchAPI) => match.resultat && match.resultat !== "-:-");

  return (
    <div className="bg-white mx-auto max-w-[1300px] h-auto">
      <div className="flex flex-col lg:flex-row justify-center items-center gap-6 p-6 rounded-md">
        <div className="flex-1">
          <LastMatchResult lastMatch={lastMatch} />
        </div>
        <div className="flex-1">
          <ClassementAuxerre teams={teams} />
        </div>
      </div>
    </div>
  );
}
