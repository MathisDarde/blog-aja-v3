"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { JsonValue } from "@prisma/client/runtime/library";
import { Calendar1 } from "lucide-react";
import KeywordHighlighter from "./HighlightKeywords";
import PlayerMethodeExpert from "./MethodDetails/MethodeExpertJoueur";
import SeasonMethodeExpert from "./MethodDetails/MethodeExpertSaison";
import GameMethodeExpert from "./MethodDetails/MethodeExpertMatch";
import CoachMethodeExpert from "./MethodDetails/MethodeExpertCoach";

interface BaseMethodeData {
  typemethode: "joueur" | "saison" | "match" | "coach";
  id: number | string;
  keyword: string | string[];
  title?: string;
  description?: string;
}

interface MethodeJoueur extends BaseMethodeData {
  typemethode: "joueur";
  imagejoueur: string;
  joueurnom: string;
  poste: string;
  taille: string;
  piedfort: string;
  clubs: [string, string, string][];
  matchs: number;
  buts: number;
  passesd: number;
}

interface MethodeSaison extends BaseMethodeData {
  typemethode: "saison";
  saison: string;
  imgterrain: string;
  coach: string;
  systeme: string;
  remplacants: [string, string, string][];
}

interface MethodeMatch extends BaseMethodeData {
  typemethode: "match";
  titrematch: string;
  imgterrain: string;
  couleur1equipe1: string;
  couleur2equipe1: string;
  nomequipe1: string;
  systemeequipe1: string;
  couleur1equipe2: string;
  couleur2equipe2: string;
  nomequipe2: string;
  systemeequipe2: string;
  remplacantsequipe1: [string, string, string, string?, string?][];
  remplacantsequipe2: [string, string, string, string?, string?][];
  stade: string;
  date: string;
}

interface MethodeCoach extends BaseMethodeData {
  typemethode: "coach";
  imagecoach: string;
  nomcoach: string;
  clubscoach: [string, string, string][];
  palmares: string[];
  statistiques: string;
}

interface ArticleProps {
  article: {
    title: string;
    teaser: string;
    imageUrl: string;
    content: string;
    author: string;
    publishedAt: Date;
    tags: JsonValue;
  };
}

type Methode = MethodeJoueur | MethodeSaison | MethodeMatch | MethodeCoach;

export default function ArticleDisplay({ article }: ArticleProps) {
  const [keywords, setKeywords] = useState<Methode[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<Methode | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    fetch("/data/methodeexpert.json")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setKeywords(data);
        } else {
          throw new Error("Invalid data format");
        }
        setIsLoading(false);
      })
      .catch((error) => {
        setError(error.message || "Failed to load keywords");
        setIsLoading(false);
      });
  }, []);

  const handleKeywordClick = (id: string, type: string) => {
    const numericId = parseInt(id, 10);
    let method = keywords.find((m) => m.id === id && m.typemethode === type);
    if (!method) {
      method = keywords.find(
        (m) => m.id === numericId && m.typemethode === type
      );
    }
    if (method) {
      setSelectedMethod(method);
    }
  };

  const closeMethodPanel = () => {
    setSelectedMethod(null);
  };

  const renderMethodComponent = () => {
    if (!selectedMethod) return null;

    switch (selectedMethod.typemethode) {
      case "joueur":
        return (
          <PlayerMethodeExpert
            methode={selectedMethod}
            onClose={closeMethodPanel}
          />
        );
      case "saison":
        return (
          <SeasonMethodeExpert
            methode={selectedMethod}
            onClose={closeMethodPanel}
          />
        );
      case "match":
        return (
          <GameMethodeExpert
            methode={selectedMethod}
            onClose={closeMethodPanel}
          />
        );
      case "coach":
        return (
          <CoachMethodeExpert
            methode={selectedMethod}
            onClose={closeMethodPanel}
          />
        );
      default:
        const method = selectedMethod as BaseMethodeData;
        return (
          <div className="method-content font-Montserrat">
            <h4 className="font-bold text-lg mb-2">
              {method.title || "Méthode"}
            </h4>
            <p className="mb-4 text-justify">
              {method.description || "Aucune description disponible."}
            </p>
            <button
              className="mt-2 bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-md text-sm font-medium transition-colors"
              onClick={closeMethodPanel}
            >
              Fermer
            </button>
          </div>
        );
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen w-full p-0 m-0 box-border">
      <div className="flex justify-center gap-10">
        <div className="w-[975px]">
          <h2 className="font-Montserrat font-extrabold text-3xl">
            {article.title}
          </h2>
          <p className="font-Montserrat flex items-center my-4 italic">
            <Calendar1 className="mr-2" />
            {new Date(article.publishedAt).toLocaleDateString("fr-FR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}{" "}
            par {article.author}
          </p>
          <Image
            src={`${article.imageUrl}`}
            width={1024}
            height={1024}
            alt="Image de bannière de l'article"
            className="aspect-video w-full object-cover object-top mb-10 rounded-xl"
          />

          {isLoading ? (
            <div className="bg-white rounded-xl p-8 text-center">
              Chargement des mots-clés...
            </div>
          ) : error ? (
            <div className="bg-white rounded-xl p-8 text-center text-red-500">
              Erreur: {error}
            </div>
          ) : (
            <div className="font-Montserrat text-justify bg-white rounded-xl p-8 leading-7">
              <KeywordHighlighter
                text={article.content}
                keywords={keywords}
                onKeywordClick={handleKeywordClick}
              />
            </div>
          )}
        </div>

        <div className="relative w-[325px]">
          <div className="fixed w-[325px] max-h-[80vh] bg-white h-fit border border-black rounded-xl px-4 py-8 overflow-y-auto">
            <h3 className="text-center font-bold font-Montserrat uppercase text-2xl mb-4">
              Méthode Expert
            </h3>

            {!selectedMethod ? (
              <p className="font-Montserrat text-justify">
                Cliquez sur les mots en surbrillance dans le texte pour accéder
                à pleins d&apos;informations supplémentaires !
              </p>
            ) : (
              <div className="method-container">{renderMethodComponent()}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
