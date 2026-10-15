import Classement from "./_components/Classement";
import PlayerStatistics from "./_components/PlayerStatistics";
import SeasonSelector from "@/components/SeasonSelector";
import {
  fetchClassement,
  fetchEffectif,
  fetchMeta,
  fetchSaison,
  fetchSaisonsIndex,
  fetchStatistiques,
} from "@/lib/scraped-data";

export default async function ClassementStatsPage({
  searchParams,
}: {
  searchParams: Promise<{ saison?: string }>;
}) {
  const { saison } = await searchParams;
  const [index, meta, effectif] = await Promise.all([fetchSaisonsIndex(), fetchMeta(), fetchEffectif()]);

  // Saison archivée demandée (?saison=1995), sinon la saison en cours, mise à jour toutes les 2 h
  const requested = Number(saison);
  const archived = requested && requested !== index[0]?.seasonId ? await fetchSaison(requested) : null;
  const [classement, stats] = archived
    ? [archived.classement, archived.statistiques]
    : await Promise.all([fetchClassement(), fetchStatistiques()]);
  const competition = archived?.competition ?? meta.competition;
  const season = archived?.season ?? meta.season;
  const selected = archived?.seasonId ?? index[0]?.seasonId ?? 0;

  return (
    <div className="text-center bg-gray-100 min-h-screen w-screen box-border p-6 sm:p-10">
      <h1 className="text-center font-Bai_Jamjuree text-3xl sm:text-4xl font-bold uppercase">
        Classement {competition.name}
      </h1>
      {season && <p className="font-Montserrat text-gray-600 mt-1 mb-4">Saison {season}</p>}
      <div className="mb-6 sm:mb-10">
        <SeasonSelector
          seasons={index.map((s) => ({ seasonId: s.seasonId, season: s.season, competitionName: s.competition.name }))}
          selected={selected}
        />
      </div>
      <div className="mb-10">
        <Classement key={selected} teams={classement} competitionId={competition.id} />
      </div>
      <h2 className="text-center font-Bai_Jamjuree text-3xl sm:text-4xl font-bold uppercase mb-4 sm:mb-10">
        Statistiques
      </h2>
      <div>
        {/* Photos de l'effectif actuel seulement : les saisons passées gardent l'image par défaut */}
        <PlayerStatistics key={selected} stats={stats} effectif={archived ? [] : effectif} />
      </div>
    </div>
  );
}
