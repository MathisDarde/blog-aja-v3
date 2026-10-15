import { fetchCalendrier, fetchMeta, fetchSaison, fetchSaisonsIndex } from "@/lib/scraped-data";
import SeasonSelector from "@/components/SeasonSelector";
import Calendar from "./_components/Calendar";

export default async function CalendrierPage({
  searchParams,
}: {
  searchParams: Promise<{ saison?: string }>;
}) {
  const { saison } = await searchParams;
  const [index, meta] = await Promise.all([fetchSaisonsIndex(), fetchMeta()]);

  // Saison archivée demandée (?saison=1995), sinon la saison en cours, mise à jour toutes les 2 h
  const requested = Number(saison);
  const archived = requested && requested !== index[0]?.seasonId ? await fetchSaison(requested) : null;
  const matches = archived ? archived.calendrier : await fetchCalendrier();
  const selected = archived?.seasonId ?? index[0]?.seasonId ?? 0;
  const subtitle = archived
    ? `${archived.season} · ${archived.competition.name}`
    : [meta.season, meta.competition.name].filter(Boolean).join(" · ");

  return (
    <div className="text-center bg-gray-100 min-h-screen w-screen box-border p-6 sm:p-10">
      <h1 className="text-center font-Bai_Jamjuree text-3xl sm:text-4xl font-bold uppercase">
        Calendrier
      </h1>
      <p className="font-Montserrat text-gray-600 mt-1 mb-4">{subtitle}</p>
      <div className="mb-6 sm:mb-10">
        <SeasonSelector
          seasons={index.map((s) => ({ seasonId: s.seasonId, season: s.season, competitionName: s.competition.name }))}
          selected={selected}
        />
      </div>
      <Calendar key={selected} matches={matches} />
    </div>
  );
}
