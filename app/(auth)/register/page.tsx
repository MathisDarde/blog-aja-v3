import Link from "next/link";
import InscForm from "./_components/InscForm";

export default async function Inscription() {
  return (
    <div className="text-center bg-gray-100 min-h-screen w-screen box-border p-10">
      <h1 className="text-center font-Bai_Jamjuree text-3xl sm:text-4xl font-bold uppercase mb-4">
        Inscrivez-vous
      </h1>
      <button className="inline-block text-xs sm:text-sm font-Montserrat text-center m-4 py-2 px-6 rounded-full text-aja-blue bg-white border border-gray-600 transition-all cursor-pointer uppercase font-semibold">
        <Link href="/login">Je possède déjà un compte</Link>
      </button>
      <InscForm />
    </div>
  );
}
