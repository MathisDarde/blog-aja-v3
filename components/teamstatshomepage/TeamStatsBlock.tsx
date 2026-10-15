import ClassementAuxerre from "./ClassementAuxerre";
import LastMatchResult from "./LastMatchResult";
import { fetchCalendrier, fetchClassement, fetchMeta } from "@/lib/scraped-data";
import { ajaLogo, getTeamLogoResolver, withMatchLogos, withTeamLogos } from "@/lib/team-logos";
import { MatchAPI } from "@/contexts/Interfaces";

export default async function TeamStatsBlock() {
  const [matches, teams, meta, resolver] = await Promise.all([
    fetchCalendrier(),
    fetchClassement(),
    fetchMeta(),
    getTeamLogoResolver(),
  ]);
  const season = meta.seasonId;

  const lastMatch = withMatchLogos(matches, season, resolver)
    .reverse()
    .find((match: MatchAPI) => match.resultat && match.resultat !== "-:-");

  return (
    <div className="bg-white mx-auto max-w-[1300px] h-auto">
      <div className="flex flex-col lg:flex-row justify-center items-center gap-6 p-6 rounded-md">
        {lastMatch && (
          <div className="flex-1">
            <LastMatchResult lastMatch={lastMatch} ajaLogo={ajaLogo(season, resolver)} />
          </div>
        )}
        <div className="flex-1">
          <ClassementAuxerre teams={withTeamLogos(teams, season, resolver)} />
        </div>
      </div>
    </div>
  );
}
