import { getQuizQuestions } from "@/controllers/QuizController";
import QuizAdmin from "./_components/QuizAdmin";

// Données réservées aux admins : jamais pré-rendues au build
export const dynamic = "force-dynamic";

export default async function QuizAdminPage() {
  const questions = await getQuizQuestions();
  return <QuizAdmin questions={questions} />;
}
