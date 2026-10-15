"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { answerQuizQuestion, startQuiz } from "@/controllers/QuizController";
import type { QuizQuestionToPlay } from "@/controllers/QuizController";

type Correction = { chosen: number; correctIndex: number; explanation: string | null };

const buttonClass =
  "w-full p-3 bg-aja-blue border border-aja-blue font-Montserrat text-sm sm:text-base text-white rounded-md transition-colors hover:bg-white hover:text-aja-blue disabled:opacity-60";

function resultMessage(score: number, total: number) {
  const ratio = score / total;
  if (ratio === 1) return "Sans faute, digne de Guy Roux !";
  if (ratio >= 0.7) return "Très belle performance, tu connais ton AJA !";
  if (ratio >= 0.4) return "Pas mal, mais l'Abbé-Deschamps attend mieux.";
  return "Il va falloir réviser les grandes heures du club !";
}

export default function QuizGame() {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<QuizQuestionToPlay[]>([]);
  const [position, setPosition] = useState(0);
  const [correction, setCorrection] = useState<Correction | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [loading, setLoading] = useState(false);

  async function start() {
    setLoading(true);
    const result = await startQuiz();
    setLoading(false);
    if ("error" in result) {
      toast.error(result.error);
      return;
    }
    setAttemptId(result.attemptId);
    setQuestions(result.questions);
    setPosition(0);
    setCorrection(null);
    setScore(0);
    setFinished(false);
  }

  async function answer(index: number) {
    if (!attemptId || correction || loading) return;
    setLoading(true);
    const result = await answerQuizQuestion(attemptId, position, index);
    setLoading(false);
    if ("error" in result) {
      toast.error(result.error);
      return;
    }
    setCorrection({ chosen: index, correctIndex: result.correctIndex, explanation: result.explanation });
    setScore(result.score);
    // Le classement de la page est régénéré côté serveur quand un joueur connecté termine
    if (result.finished && session?.user) router.refresh();
  }

  function next() {
    if (position + 1 < questions.length) {
      setPosition(position + 1);
      setCorrection(null);
    } else {
      setFinished(true);
    }
  }

  // Écran d'accueil
  if (!attemptId) {
    return (
      <div className="text-center font-Montserrat">
        <p className="text-sm sm:text-base mb-2">
          10 questions tirées au hasard sur l&apos;histoire de l&apos;AJ Auxerre.
        </p>
        <p className="text-xs sm:text-sm text-gray-600 mb-6">
          {session?.user ? (
            "Ta meilleure partie compte pour le classement."
          ) : (
            <>
              <Link href="/login" className="underline text-aja-blue">
                Connecte-toi
              </Link>{" "}
              pour que ton score entre au classement.
            </>
          )}
        </p>
        <button type="button" onClick={start} disabled={loading} className={buttonClass}>
          {loading ? <Loader2 className="mx-auto animate-spin" /> : "Commencer le quiz"}
        </button>
      </div>
    );
  }

  // Résultat
  if (finished) {
    return (
      <div className="text-center font-Montserrat">
        <p className="font-Bai_Jamjuree text-5xl font-bold text-aja-blue mb-2">
          {score}/{questions.length}
        </p>
        <p className="text-sm sm:text-lg font-medium mb-6">{resultMessage(score, questions.length)}</p>
        <button type="button" onClick={start} disabled={loading} className={buttonClass}>
          {loading ? <Loader2 className="mx-auto animate-spin" /> : "Rejouer avec de nouvelles questions"}
        </button>
      </div>
    );
  }

  const question = questions[position];

  return (
    <div className="font-Montserrat text-left">
      <div className="flex justify-between items-center text-xs sm:text-sm text-gray-500 mb-2">
        <span>
          Question {position + 1}/{questions.length}
        </span>
        <span>Score : {score}</span>
      </div>
      <div className="h-1.5 bg-gray-200 rounded-full mb-6 overflow-hidden">
        <div
          className="h-full bg-aja-blue transition-all duration-300"
          style={{ width: `${((position + (correction ? 1 : 0)) / questions.length) * 100}%` }}
        />
      </div>

      <h2 className="text-sm sm:text-lg font-medium mb-4">{question.question}</h2>
      <div className="flex flex-col gap-3">
        {question.answers.map((text, index) => {
          let state = "hover:bg-gray-100";
          if (correction) {
            if (index === correction.correctIndex) state = "bg-green-200 border-green-500";
            else if (index === correction.chosen) state = "bg-red-200 border-red-500";
            else state = "opacity-70";
          }
          return (
            <button
              key={index}
              type="button"
              onClick={() => answer(index)}
              disabled={!!correction || loading}
              className={`p-3 border rounded-md text-left transition-colors text-sm sm:text-base ${state}`}
            >
              {text}
            </button>
          );
        })}
      </div>

      {correction && (
        <div className="mt-6 space-y-4">
          <p
            className={`text-sm sm:text-base font-semibold ${
              correction.chosen === correction.correctIndex ? "text-green-700" : "text-red-700"
            }`}
          >
            {correction.chosen === correction.correctIndex ? "Bonne réponse !" : "Raté !"}
            {correction.explanation && (
              <span className="block font-normal text-gray-700 mt-1">{correction.explanation}</span>
            )}
          </p>
          <button type="button" onClick={next} className={buttonClass}>
            {position + 1 < questions.length ? "Question suivante" : "Voir le résultat"}
          </button>
        </div>
      )}
    </div>
  );
}
