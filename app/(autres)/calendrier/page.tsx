import { fetchMatches } from "@/utils/matchsapi";
import Calendar from "./_components/Calendar";

export default async function CalendrierPage() {
  const matches = await fetchMatches(
    "https://mathisdarde.github.io/AJA-Website-Scrapers/data/aja_calendrier.json"
  );

  return (
    <div className="text-center bg-gray-100 min-h-screen w-screen box-border p-6 sm:p-10">
      <h1 className="text-center font-Bai_Jamjuree text-3xl sm:text-4xl font-bold uppercase mb-4 sm:mb-10">
        Calendrier
      </h1>
      <Calendar matches={matches} />
    </div>
  );
}
