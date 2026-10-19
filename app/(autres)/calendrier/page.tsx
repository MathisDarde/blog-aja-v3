import { fetchCalendrier, fetchCalendrierSaison, fetchSaisonsIndex } from "@/lib/scraped-data";
import { ajaLogo, getTeamLogoResolver, withMatchLogos } from "@/lib/team-logos";
import Calendar from "./_components/Calendar";

export default async function CalendrierPage({
  searchParams,
}: {
  searchParams: Promise<{ saison?: string }>;
}) {
  const { saison } = await searchParams;
  const [index, resolver] = await Promise.all([fetchSaisonsIndex(), getTeamLogoResolver()]);

  // Toutes les saisons à la suite : la saison en cours (mise à jour toutes les 2 h) puis l'archive
  const calendriers = await Promise.all(
    index.map((s, i) => (i === 0 ? fetchCalendrier() : fetchCalendrierSaison(s.seasonId))),
  );
  const matches = index.flatMap((s, i) =>
    withMatchLogos(calendriers[i], s.seasonId, resolver).map((match) => ({
      ...match,
      seasonId: s.seasonId,
      ajaLogo: ajaLogo(s.seasonId, resolver),
    })),
  );

  // ?saison=1995 : le calendrier s'ouvre au début de cette saison
  const requested = Number(saison);

  return (
    <div className="text-center bg-gray-100 min-h-screen w-screen box-border p-6 sm:p-10">
      <h1 className="text-center font-Bai_Jamjuree text-3xl sm:text-4xl font-bold uppercase">
        Calendrier
      </h1>
      <Calendar
        matches={matches}
        seasons={index.map((s) => ({ seasonId: s.seasonId, season: s.season, competitionName: s.competition.name }))}
        initialSeason={index.some((s) => s.seasonId === requested) ? requested : null}
      />
    </div>
  );
}
