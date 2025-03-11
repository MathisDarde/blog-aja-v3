"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import SidebarResp from "@/components/SidebarResp";

interface Answer {
  text: string;
  correct: boolean;
}

interface Question {
  question: string;
  answers: Answer[];
}

export default function Home() {
  const [sidebarState, setSidebarState] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [showingQuestion, setShowingQuestion] = useState<boolean>(true);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const toggleSidebar = () => {
    setSidebarState((prevState) => (prevState === 0 ? 1 : 0));
  };

  const questions: Question[] = [
    {
      question:
        "En quelle année l'AJ Auxerre a remporté son seul titre de Champion de France de Ligue 1 ?",
      answers: [
        { text: "1994", correct: false },
        { text: "1995", correct: false },
        { text: "1996", correct: true },
        { text: "1997", correct: false },
      ],
    },
    {
      question: "A quel poste jouait Corentin Martins ?",
      answers: [
        { text: "Gardien", correct: false },
        { text: "Défenseur", correct: false },
        { text: "Milieu", correct: true },
        { text: "Attaquant", correct: false },
      ],
    },
    {
      question:
        "Quel joueur est le meilleur buteur de l'histoire de l'AJ Auxerre en Ligue des Champions ?",
      answers: [
        { text: "Thomas Deniaud", correct: true },
        { text: "Christian Henna", correct: false },
        { text: "Benjani", correct: false },
        { text: "Bonaventure Kalou", correct: false },
      ],
    },
    {
      question:
        "Qui a fini meilleur buteur de la saison 2023-2024 qui a vu l'équipe être championne de Ligue 2 ?",
      answers: [
        { text: "Gaëtan Perrin", correct: false },
        { text: "Gauthier Hein", correct: false },
        { text: "Lassine Sinayoko", correct: false },
        { text: "Ado Onaiwu", correct: true },
      ],
    },
    {
      question: "A quel poste évoluait Alain Goma ?",
      answers: [
        { text: "Gardien", correct: false },
        { text: "Défenseur", correct: true },
        { text: "Milieu", correct: false },
        { text: "Attaquant", correct: false },
      ],
    },
    {
      question:
        "Lors du match Auxerre-AJAX en 2010, Frédéric Sammaritano ouvre le score, mais qui marque le second but auxerrois ?",
      answers: [
        { text: "Roy Contout", correct: false },
        { text: "Steven Langil", correct: true },
        { text: "Dennis Oliech", correct: false },
        { text: "Julien Quercia", correct: false },
      ],
    },
    {
      question:
        "Quel joueur manque son tir au but en 1993, lors de la demi-finale contre le Borussia Dortmund ?",
      answers: [
        { text: "Frank Verlaat", correct: false },
        { text: "Stéphane Mahé", correct: true },
        { text: "Franck Silvestre", correct: false },
        { text: "William Prunier", correct: false },
      ],
    },
    {
      question: "A quel poste jouait Philippe Méxès ?",
      answers: [
        { text: "Gardien", correct: false },
        { text: "Défenseur", correct: true },
        { text: "Milieu", correct: false },
        { text: "Attaquant", correct: false },
      ],
    },
    {
      question:
        "En quelle année l'AJ Auxerre a t-elle gagné sa dernière Coupe de France ?",
      answers: [
        { text: "2002", correct: false },
        { text: "2003", correct: false },
        { text: "2004", correct: false },
        { text: "2005", correct: true },
      ],
    },
    {
      question:
        "Quel joueur finit meilleur buteur de l'AJ Auxerre lors de la saison 1995-1996 (toutes compétitions confondues) ?",
      answers: [
        { text: "Lilian Laslandes", correct: true },
        { text: "Corentin Martins", correct: false },
        { text: "Sabri Lamouchi", correct: false },
        { text: "Bernard Diomède", correct: false },
      ],
    },
  ];

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
    <div className="text-center bg-gray-100 h-screen w-screen box-border">
      {sidebarState === 0 ? (
        <SidebarResp onToggle={toggleSidebar} />
      ) : (
        <Sidebar onToggle={toggleSidebar} />
      )}

      <div className="ml-24">
        <div className="text-5xl text-center font-title italic uppercase font-bold text-aja-blue py-10 font-Bai_Jamjuree">
          <Link href={"/"}>
            <h2>Mémoire d&apos;Auxerrois</h2>
          </Link>
        </div>

        <main className="bg-white p-6 mx-auto my-10 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-bold text-center mb-6 font-Montserrat">
            Quiz AJ Auxerre
          </h2>

          <div className="quiz-container">
            {showingQuestion ? (
              <>
                <div className="question-container mb-6">
                  <h2 className="text-lg font-medium mb-4 font-Montserrat">
                    {currentQuestionIndex + 1}. {currentQuestion.question}
                  </h2>
                  <div className="flex flex-col gap-3">
                    {currentQuestion.answers.map((answer, index) => (
                      <button
                        key={index}
                        onClick={() => handleAnswerClick(answer.correct, index)}
                        className={`p-3 border rounded-md text-left transition-colors font-Montserrat ${
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
                    className="w-full p-3 bg-aja-blue border font-Montserrat text-white rounded-md transition-colors hover:bg-white hover:text-aja-blue hover: border-aja-blue"
                  >
                    {currentQuestionIndex + 1 < questions.length
                      ? "Suivant"
                      : "Voir le résultat"}
                  </button>
                )}
              </>
            ) : (
              <div className="score-container text-center">
                <h2 className="text-lg font-medium mb-4 font-Montserrat">
                  Tu as réussi {score} questions sur {questions.length} !
                </h2>
                <button
                  onClick={startQuiz}
                  className="w-full p-3 bg-aja-blue border font-Montserrat text-white rounded-md transition-colors hover:bg-white hover:text-aja-blue hover:border-aja-blue"
                >
                  Relancer le quiz
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
