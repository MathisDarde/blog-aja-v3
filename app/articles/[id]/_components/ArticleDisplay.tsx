"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { JsonValue } from "@prisma/client/runtime/library";
import { Calendar1, ChevronLeft, Plus } from "lucide-react";
import KeywordHighlighter from "./HighlightKeywords";
import PlayerMethodeExpert from "./MethodDetails/MethodeExpertJoueur";
import SeasonMethodeExpert from "./MethodDetails/MethodeExpertSaison";
import GameMethodeExpert from "./MethodDetails/MethodeExpertMatch";
import CoachMethodeExpert from "./MethodDetails/MethodeExpertCoach";
import CommentForm from "./CommentForm";
import displayCommentsbyId from "@/actions/display-comments-by-article";
import { useParams } from "next/navigation";
import Button from "@/components/BlueButton";

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

interface Comment {
  id: string;
  title: string;
  content: string;
  stars: number;
  userId: string;
  pseudo: string;
  photodeprofil: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function ArticleDisplay({ article }: ArticleProps) {
  const params = useParams();

  const [keywords, setKeywords] = useState<Methode[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<Methode | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPublishingComment, setIsPublishingComment] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [visibleComments, setVisibleComments] = useState(3);

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

  const id_article = React.useRef<string>("");

  useEffect(() => {
    if (!params?.id) return;

    const articleId = Array.isArray(params.id) ? params.id[0] : params.id;
    id_article.current = articleId;

    const fetchComments = async () => {
      try {
        const comments = await displayCommentsbyId(articleId);
        setComments(
          (comments || []).map((comment) => ({
            id: comment.id_comment,
            title: comment.title,
            content: comment.content,
            stars: parseInt(comment.stars, 10),
            userId: comment.userId,
            pseudo: comment.pseudo,
            photodeprofil: comment.photodeprofil,
            createdAt: comment.createdAt.toLocaleDateString("fr-FR"),
            updatedAt: comment.updatedAt.toLocaleDateString("fr-FR"),
          }))
        );
      } catch (error) {
        console.error("Erreur lors du chargement des commentaires", error);
      }
    };

    fetchComments();
  }, [params?.id]);

  const handleVoirPlus = () => {
    setVisibleComments((prev) => prev + 3);
  };

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
        <div className="flex flex-col gap-6 w-[975px]">
          <div>
            <h2 className="font-Montserrat font-extrabold text-3xl">
              {article.title}
            </h2>
            <p className="font-Montserrat flex items-center italic mt-2">
              <Calendar1 className="mr-2" />
              {new Date(article.publishedAt).toLocaleDateString("fr-FR", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}{" "}
              par {article.author}
            </p>
          </div>
          <Image
            src={`${article.imageUrl}`}
            width={1024}
            height={1024}
            alt="Image de bannière de l'article"
            className="aspect-video w-full object-cover object-top rounded-xl"
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

          <div className="w-full bg-white rounded-xl p-8 font-Montserrat">
            {!isPublishingComment ? (
              <>
                <div className="flex justify-between items-center">
                  <h2 className="font-bold uppercase text-xl">Commentaires</h2>
                  <Button
                    className="flex flex-row items-center gap-2 text-white bg-aja-blue px-6 py-3 rounded-full"
                    onClick={() => setIsPublishingComment(true)}
                  >
                    <Plus /> Ajouter un commentaire
                  </Button>
                </div>

                <div className="mt-6 flex flex-col gap-8">
                  {comments.length > 0 ? (
                    <>
                      {comments.slice(0, visibleComments).map((comment) => (
                        <div
                          key={comment.id}
                          className="border rounded-lg p-4 bg-gray-50 font-Montserrat"
                        >
                          <div className="flex items-center gap-4">
                            {!comment.photodeprofil ? (
                              <Image
                                src={"/_assets/img/pdpdebase.png"}
                                alt="Photo de profil"
                                width={45}
                                height={45}
                                className="rounded-full"
                              />
                            ) : (
                              <Image
                                src={comment.photodeprofil}
                                alt="Photo de profil"
                                width={35}
                                height={35}
                                className="w-15 h-15"
                              />
                            )}
                            <p className="font-semibold">{comment.pseudo}</p>
                            <p className="font-light text-xs">
                              {comment.updatedAt}
                            </p>
                          </div>
                          <div className="flex items-center gap-1 my-2">
                            {Array.from({ length: comment.stars }).map(
                              (_, idx) => (
                                <span
                                  key={idx}
                                  className="text-yellow-400 text-3xl"
                                >
                                  ★
                                </span>
                              )
                            )}
                          </div>
                          <p className="font-semibold uppercase my-2">
                            {comment.title}
                          </p>
                          <p className="text-sm text-gray-700 mb-2">
                            {comment.content}
                          </p>
                        </div>
                      ))}

                      {/* Bouton Voir plus */}
                      {visibleComments < comments.length && (
                        <Button
                          onClick={handleVoirPlus}
                          className="mt-4 text-white bg-aja-blue px-6 py-3 rounded-full w-fit mx-auto"
                        >
                          Voir plus
                        </Button>
                      )}
                    </>
                  ) : (
                    <p>
                      Aucun commentaire publié. Soyez le premier à laisser un
                      commentaire !
                    </p>
                  )}
                </div>
              </>
            ) : (
              <div>
                <div onClick={() => setIsPublishingComment(false)}>
                  <h2 className="font-bold uppercase text-xl my-4 flex items-center justify-center gap-3 cursor-pointer">
                    <ChevronLeft /> Formulaire de publication de commentaire
                  </h2>
                </div>
                <div>
                  <CommentForm />
                </div>
              </div>
            )}
          </div>
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
