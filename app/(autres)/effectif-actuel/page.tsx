import { fetchEffectif } from "@/lib/scraped-data";
import EffectifGrid from "./_components/EffectifGrid";

export default async function EffectifActuel() {
  const players = await fetchEffectif();

  return (
    <div className="text-center bg-gray-100 min-h-screen w-screen box-border p-10">
      <h1 className="text-center font-Bai_Jamjuree text-3xl sm:text-4xl font-bold uppercase mb-4 sm:mb-10">
        Effectif Actuel
      </h1>
      <EffectifGrid players={players} />
    </div>
  );
}
