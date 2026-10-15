import Image from "next/image";
import { Trophy } from "lucide-react";
import { getQuizLeaderboard } from "@/controllers/QuizController";
import QuizGame from "./_components/QuizGame";

// Classement régénéré au plus toutes les 60 s, et dès qu'un joueur connecté termine une partie
export const revalidate = 60;

const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const rest = Math.round(seconds % 60);
  return minutes > 0 ? `${minutes} min ${String(rest).padStart(2, "0")} s` : `${rest} s`;
};

const MEDALS = ["text-yellow-500", "text-gray-400", "text-amber-700"];

export default async function QuizPage() {
  const leaderboard = await getQuizLeaderboard();

  return (
    <div className="text-center bg-gray-100 min-h-screen w-screen box-border p-6 sm:p-10">
      <h1 className="text-center font-Bai_Jamjuree text-3xl sm:text-4xl font-bold uppercase mb-4 sm:mb-10">
        Quiz AJ Auxerre
      </h1>

      <div className="max-w-[1100px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 items-start">
        <div className="bg-white p-6 rounded-md">
          <QuizGame />
        </div>

        <div className="bg-white p-6 rounded-md text-left font-Montserrat">
          <h2 className="font-Bai_Jamjuree text-xl font-bold uppercase mb-4 flex items-center gap-2">
            <Trophy className="text-aja-blue" size={22} /> Classement
          </h2>
          {leaderboard.length === 0 ? (
            <p className="text-sm text-gray-600">
              Personne n&apos;a encore terminé de partie en étant connecté : la première place est à
              prendre !
            </p>
          ) : (
            <ol className="space-y-2">
              {leaderboard.map((entry, index) => (
                <li key={entry.userId} className="flex items-center gap-3 text-sm">
                  <span className={`w-6 text-center font-bold ${MEDALS[index] ?? "text-gray-500"}`}>
                    {index + 1}
                  </span>
                  <Image
                    src={entry.image || "/_assets/img/pdpdebase.png"}
                    alt=""
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span className="flex-1 truncate font-semibold">{entry.pseudo}</span>
                  <span className="text-right">
                    <span className="font-bold text-aja-blue">
                      {entry.score}/{entry.total}
                    </span>
                    <span className="block text-xs text-gray-500">{formatDuration(entry.seconds)}</span>
                  </span>
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>
    </div>
  );
}
