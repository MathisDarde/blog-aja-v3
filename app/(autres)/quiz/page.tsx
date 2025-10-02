"use client";

import { useState, useEffect } from "react";
import { questions } from "./_components/Questions";

export default function Home() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [showingQuestion, setShowingQuestion] = useState<boolean>(true);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const startQuiz = (): void => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setShowingQuestion(true);
    setSelectedAnswer(null);
  };

  useEffect(() => {
    startQuiz();
  }, []);

  const handleAnswerClick = (isCorrect: boolean, index: number): void => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(index);

    if (isCorrect) {
      setScore((prevScore) => prevScore + 1);
    }
  };

  const handleNextButton = (): void => {
    setSelectedAnswer(null);

    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    } else {
      setShowingQuestion(false);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="text-center bg-gray-100 min-h-screen w-screen box-border p-10">
      <h1 className="text-center font-Bai_Jamjuree text-3xl sm:text-4xl font-bold uppercase mb-6 sm:mb-10">
        Quiz AJ Auxerre
      </h1>
      <div className="bg-white max-w-[700px] p-6 rounded-md mx-auto">
        <div className="quiz-container">
          {showingQuestion ? (
            <>
              <div className="question-container mb-6">
                <h2 className="text-sm sm:text-lg font-medium mb-4 font-Montserrat">
                  {currentQuestionIndex + 1}. {currentQuestion.question}
                </h2>
                <div className="flex flex-col gap-3">
                  {currentQuestion.answers.map((answer, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswerClick(answer.correct, index)}
                      className={`p-3 border rounded-md text-left transition-colors font-Montserrat text-sm sm:text-base ${
                        selectedAnswer === null
                          ? "hover:bg-gray-100"
                          : selectedAnswer === index
                          ? answer.correct
                            ? "bg-green-200 border-green-500"
                            : "bg-red-200 border-red-500"
                          : answer.correct && selectedAnswer !== null
                          ? "bg-green-200 border-green-500"
                          : "opacity-70"
                      }`}
                      disabled={selectedAnswer !== null}
                    >
                      {answer.text}
                    </button>
                  ))}
                </div>
              </div>

              {selectedAnswer !== null && (
                <button
                  onClick={handleNextButton}
                  className="w-full p-3 bg-aja-blue border font-Montserrat text-sm sm:text-base text-white rounded-md transition-colors hover:bg-white hover:text-aja-blue hover: border-aja-blue"
                >
                  {currentQuestionIndex + 1 < questions.length
                    ? "Suivant"
                    : "Voir le résultat"}
                </button>
              )}
            </>
          ) : (
            <div className="score-container text-center">
              <h2 className="text-sm sm:text-lg font-medium mb-4 font-Montserrat">
                Tu as réussi {score} questions sur {questions.length} !
              </h2>
              <button
                onClick={startQuiz}
                className="w-full p-3 bg-aja-blue border font-Montserrat text-sm sm:text-base text-white rounded-md transition-colors hover:bg-white hover:text-aja-blue hover:border-aja-blue"
              >
                Relancer le quiz
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
