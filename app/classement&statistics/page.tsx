import Classement from "@/components/Classement";

export default function ClassementStatsPage() {
    return (
        <div className="text-center bg-gray-100 min-h-screen w-screen box-border p-10">
            <h1 className="text-center font-Bai_Jamjuree text-4xl font-bold uppercase mb-10">
                Classement Ligue 1
            </h1>
            <div className="mb-10">
                <Classement />
            </div>
            <h1 className="text-center font-Bai_Jamjuree text-4xl font-bold uppercase mb-10">
                Statistiques
            </h1>
        </div>
    )
}