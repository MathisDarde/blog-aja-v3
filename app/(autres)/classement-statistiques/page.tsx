import Classement from "./_components/Classement";
import PlayerStatistics from "./_components/PlayerStatistics";
import { fetchClassement, fetchEffectif, fetchMeta, fetchStatistiques } from "@/lib/scraped-data";

export default async function ClassementStatsPage() {
  const [classement, stats, effectif, meta] = await Promise.all([
    fetchClassement(),
    fetchStatistiques(),
    fetchEffectif(),
    fetchMeta(),
  ]);

  return (
    <div className="text-center bg-gray-100 min-h-screen w-screen box-border p-6 sm:p-10">
      <h1 className="text-center font-Bai_Jamjuree text-3xl sm:text-4xl font-bold uppercase mb-4 sm:mb-10">
        Classement {meta.competition.name}
      </h1>
      <div className="mb-10">
        <Classement teams={classement} competitionId={meta.competition.id} />
      </div>
      <h2 className="text-center font-Bai_Jamjuree text-3xl sm:text-4xl font-bold uppercase mb-4 sm:mb-10">
        Statistiques
      </h2>
      <div>
        <PlayerStatistics stats={stats} effectif={effectif} />
      </div>
    </div>
  );
}
