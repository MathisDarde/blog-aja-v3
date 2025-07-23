import Calendar from "./_components/Calendar";

export default function CalendrierPage() {
  return (
    <div className="text-center bg-gray-100 min-h-screen w-screen box-border p-10">
      <h1 className="text-center font-Bai_Jamjuree text-4xl font-bold uppercase mb-10">
        Calendrier
      </h1>
      <Calendar />
    </div>
  );
}
