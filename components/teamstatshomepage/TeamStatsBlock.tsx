import ClassementAuxerre from "./ClassementAuxerre";
import LastMatchResult from "./LastMatchResult";
import { fetchCalendrier, fetchClassement } from "@/lib/scraped-data";
import { MatchAPI } from "@/contexts/Interfaces";

export default async function TeamStatsBlock() {
  const [matches, teams] = await Promise.all([fetchCalendrier(), fetchClassement()]);

  const lastMatch = matches
    .slice()
    .reverse()
    .find((match: MatchAPI) => match.resultat && match.resultat !== "-:-");

  return (
    <div className="bg-white mx-auto max-w-[1300px] h-auto">
      <div className="flex flex-col lg:flex-row justify-center items-center gap-6 p-6 rounded-md">
        {lastMatch && (
          <div className="flex-1">
            <LastMatchResult lastMatch={lastMatch} />
          </div>
        )}
        <div className="flex-1">
          <ClassementAuxerre teams={teams} />
        </div>
      </div>
    </div>
  );
}
