import Classement from "./_components/Classement";
import PlayerStatistics from "./_components/PlayerStatistics";

export default async function ClassementStatsPage() {
  const res = await fetch(
    "https://mathisdarde.github.io/AJA-Website-Scrapers/data/classementligue1.json"
  );
  const classement = await res.json();

  const statistics = await fetch(
    "https://mathisdarde.github.io/AJA-Website-Scrapers/data/aja_statistics.json"
  );

  const stats = await statistics.json();

  return (
    <div className="text-center bg-gray-100 min-h-screen w-screen box-border p-10">
      <h1 className="text-center font-Bai_Jamjuree text-4xl font-bold uppercase mb-10">
        Classement Ligue 1
      </h1>
      <div className="mb-10">
        <Classement teams={classement} />
      </div>
      <h1 className="text-center font-Bai_Jamjuree text-4xl font-bold uppercase mb-10">
        Statistiques
      </h1>
      <div>
        <PlayerStatistics stats={stats} />
      </div>
    </div>
  );
}
