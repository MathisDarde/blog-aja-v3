"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Calendar1,
  ChevronLeft,
  Heart,
  MessageCircle,
  PenBox,
  PenSquare,
  Plus,
  Trash,
} from "lucide-react";
import KeywordHighlighter from "./HighlightKeywords";
import PlayerMethodeExpert from "./MethodDetails/MethodeExpertJoueur";
import SeasonMethodeExpert from "./MethodDetails/MethodeExpertSaison";
import GameMethodeExpert from "./MethodDetails/MethodeExpertMatch";
import CoachMethodeExpert from "./MethodDetails/MethodeExpertCoach";
import CommentForm from "./CommentForm";
import Button from "@/components/BlueButton";
import { toast } from "sonner";
import deleteArticleSA from "@/actions/article/delete-article";
import UpdateArticleForm from "./UpdateArticleForm";
import getAllMethodes from "@/actions/method/get-all-methodes";
import {
  Article,
  BaseMethodeData,
  MethodeCoach,
  MethodeMatch,
  MethodeJoueur,
  MethodeSaison,
  Methode,
} from "@/contexts/Interfaces";
import { useGlobalContext } from "@/contexts/GlobalContext";
import deleteCommentAction from "@/actions/comment/delete-comment";
import UpdateCommentForm from "./UpdateCommentForm";
import { ModalAction } from "@/components/ModalAction";

export default function ArticleDisplay({ article }: { article: Article }) {
  const {
    router,
    methode,
    setMethode,
    methodes,
    setMethodes,
    comments,
    isAdmin,
    isUser,
    user_id,
    modalParams,
    setModalParams,
  } = useGlobalContext();

  const [loading, setLoading] = useState(false);
  const [keywords, setKeywords] = useState<BaseMethodeData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isPublishingComment, setIsPublishingComment] = useState(false);
  const [visibleComments, setVisibleComments] = useState(3);
  const [isUpdatingArticle, setIsUpdatingArticle] = useState(false);
  const [isUpdatingComment, setIsUpdatingComment] = useState(false);
  const [selectedComment, setSelectedComment] = useState<{
    id_comment: string;
    title: string;
    content: string;
    stars: number;
  } | null>(null);

  useEffect(() => {
    setLoading(true);

    getAllMethodes()
      .then((data) => {
        if (data) {
          const typedMethodes = data.map((item) => {
            switch (item.typemethode) {
              case "joueur":
                return item as unknown as Methode;
              case "saison":
                return item as unknown as Methode;
              case "match":
                return item as unknown as Methode;
              case "coach":
                return item as unknown as Methode;
              default:
                throw new Error(
                  `Type de méthode inconnu : ${item.typemethode}`
                );
            }
          });

          setMethodes(typedMethodes);

          const allKeywords = typedMethodes.flatMap((item) =>
            item.keywords.map((kw) => ({
              id_methode: item.id,
              typemethode: item.typemethode,
              keywords: [kw],
            }))
          );

          setKeywords(allKeywords);
        } else {
          setKeywords([]);
        }
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message || "Failed to load keywords");
        setLoading(false);
      });
  }, []);

  const handleVoirPlus = () => {
    setVisibleComments((prev) => prev + 3);
  };

  const openLeaveChangesArticleModal = () => {
    setModalParams({
      object: "article",
      type: "leaveChanges",
      onConfirm: async () => {
        window.location.reload();
        setModalParams(null);
      },
      onCancel: () => setModalParams(null),
    });
  };

  const openDeleteArticleModal = () => {
    setModalParams({
      object: "article",
      type: "delete",
      onConfirm: async () => {
        try {
          await deleteArticleSA(article.id_article);
          router.push("/");
          setModalParams(null);
        } catch (error) {
          console.error("Erreur suppression article :", error);
        }
      },
      onCancel: () => setModalParams(null),
    });
  };

  const openDeleteCommentModal = (comment: {
    id_comment: string;
    title: string;
    content: string;
    stars: number;
  }) => {
    setModalParams({
      object: "comment",
      type: "delete",
      onConfirm: async () => {
        await deleteComment(comment.id_comment);
        window.location.reload();
        setModalParams(null);
      },
      onCancel: () => setModalParams(null),
    });
  };

  const handleKeywordClick = (id: string, type: string) => {
    const method = methodes.find((m) => m.id === id && m.typemethode === type);

    if (method) {
      setMethode(method);
    } else {
      toast.error("Méthode non trouvée.");
    }
  };

  const closeMethodPanel = () => {
    setMethode(null);
  };

  async function deleteComment(id: string) {
    try {
      return await deleteCommentAction(id);
    } catch (error) {
      console.error(error);
    }
  }

  const renderMethodComponent = () => {
    if (!methode) return null;

    switch (methode.typemethode) {
      case "joueur":
        return (
          <PlayerMethodeExpert
            methode={methode as unknown as MethodeJoueur}
            onClose={closeMethodPanel}
          />
        );
      case "saison":
        return (
          <SeasonMethodeExpert
            methode={methode as unknown as MethodeSaison}
            onClose={closeMethodPanel}
          />
        );
      case "match":
        return (
          <GameMethodeExpert
            methode={methode as unknown as MethodeMatch}
            onClose={closeMethodPanel}
          />
        );
      case "coach":
        return (
          <CoachMethodeExpert
            methode={methode as unknown as MethodeCoach}
            onClose={closeMethodPanel}
          />
        );
      default:
        return (
          <div className="method-content font-Montserrat">
            <h4 className="font-bold text-lg mb-2">Méthode</h4>
            <p className="mb-4 text-justify">Aucune description disponible.</p>
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
      {/* Delete element popup */}
      {modalParams && (
        <ModalAction
          object={modalParams.object}
          type={modalParams.type}
          onConfirm={modalParams.onConfirm}
          onCancel={modalParams.onCancel}
        />
      )}

      {isUpdatingArticle ? (
        <div>
          <h2
            className="font-bold font-Montserrat uppercase text-3xl my-10  flex items-center justify-center gap-3 cursor-pointer"
            onClick={() => openLeaveChangesArticleModal()}
          >
            <ChevronLeft /> Formulaire de modification d&apos;article
          </h2>

          <UpdateArticleForm
            articleData={{
              ...article,
              tags: Array.isArray(article.tags)
                ? (article.tags as string[])
                : [],
            }}
          />
        </div>
      ) : (
        <>
          <div className="flex justify-center gap-10">
            <div className="flex flex-col gap-6 w-[975px]">
              <div>
                <h2 className="font-Montserrat font-extrabold text-3xl">
                  {article.title}
                </h2>
                <div className="flex items-center justify-between mt-4">
                  <p className="font-Montserrat flex items-center italic">
                    <Calendar1 className="mr-2" />
                    {new Date(article.publishedAt).toLocaleDateString("fr-FR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}{" "}
                    par {article.author}
                  </p>
                  <div className="flex items-center gap-2">
                    {/* Message */}
                    <div
                      className="border border-gray-300 hover:bg-gray-300 rounded-full p-2 text-gray-500 flex items-center justify-center transition-colors cursor-pointer hover:text-gray-800"
                      onClick={() => {
                        const anchorElement =
                          document.getElementById("commentaire-anchor");
                        if (anchorElement) {
                          anchorElement.scrollIntoView({ behavior: "smooth" });
                        }
                      }}
                    >
                      <MessageCircle width={20} height={20} />
                    </div>

                    {/* Heart pour user */}
                    {isUser && (
                      <div className="border border-gray-300 hover:bg-gray-300 rounded-full p-2 text-gray-500 flex items-center justify-center transition-colors cursor-pointer hover:text-rose-600 group">
                        <Heart
                          width={20}
                          height={20}
                          className="transition-colors fill-transparent group-hover:fill-current"
                        />
                      </div>
                    )}

                    {/* Admin actions */}
                    {isAdmin && (
                      <>
                        {/* Edit */}
                        <div
                          className="border border-gray-300 hover:bg-gray-300 rounded-full p-2 text-gray-500 flex items-center justify-center transition-colors cursor-pointer hover:text-blue-500"
                          onClick={() => setIsUpdatingArticle(true)}
                        >
                          <PenBox width={20} height={20} />
                        </div>
                        {/* Delete */}
                        <div className="border border-gray-300 rounded-full p-2 text-gray-500 flex items-center justify-center transition-colors cursor-pointer hover:bg-red-500 hover:text-white">
                          <Trash
                            onClick={() => openDeleteArticleModal()}
                            width={20}
                            height={20}
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <Image
                src={`${article.imageUrl}`}
                width={1024}
                height={1024}
                alt="Image de bannière de l'article"
                className="aspect-video w-full object-cover object-top rounded-xl"
              />

              {loading ? (
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

              <div
                id="commentaire-anchor"
                className="relative -top-24 opacity-0 transition-opacity duration-500"
              ></div>

              <div className="w-full bg-white rounded-xl p-8 font-Montserrat">
                {!isPublishingComment ? (
                  <>
                    {isUpdatingComment && selectedComment ? (
                      <>
                        <h2
                          className="font-bold font-Montserrat uppercase text-3xl my-10 flex items-center justify-center gap-3 cursor-pointer"
                          onClick={() => {
                            setSelectedComment(null);
                            setIsUpdatingComment(false);
                          }}
                        >
                          <ChevronLeft /> Formulaire de modification du
                          commentaire
                        </h2>

                        <UpdateCommentForm
                          commentId={selectedComment.id_comment}
                          commentData={{
                            title: selectedComment.title,
                            content: selectedComment.content,
                            stars: selectedComment.stars,
                          }}
                        />
                      </>
                    ) : (
                      <>
                        <div className="flex justify-between items-center">
                          <h2 className="font-bold uppercase text-xl">
                            Commentaires
                          </h2>
                          {isUser ? (
                            <Button
                              className="flex flex-row items-center gap-2 text-white bg-aja-blue px-6 py-3 rounded-full m-0"
                              onClick={() => setIsPublishingComment(true)}
                            >
                              <Plus /> Ajouter un commentaire
                            </Button>
                          ) : (
                            <Button
                              className="flex flex-row items-center gap-2 text-white bg-aja-blue px-6 py-3 rounded-full"
                              onClick={() => router.push("/login")}
                            >
                              Connectez-vous pour publier un commentaire
                            </Button>
                          )}
                        </div>

                        <div className="mt-6 flex flex-col gap-8">
                          {comments.length > 0 &&
                          isUpdatingComment === false ? (
                            <>
                              {comments
                                .slice(0, visibleComments)
                                .map((comment) => (
                                  <div
                                    key={comment.id_comment}
                                    id={comment.id_comment}
                                    className="border rounded-lg p-4 bg-gray-50 font-Montserrat"
                                  >
                                    <div className="flex items-center gap-4">
                                      {!comment.photodeprofil ? (
                                        <Image
                                          src={"/_assets/img/pdpdebase.png"}
                                          alt="Photo de profil"
                                          width={128}
                                          height={128}
                                          className="w-11 h-11 rounded-full"
                                        />
                                      ) : (
                                        <Image
                                          src={comment.photodeprofil}
                                          alt="Photo de profil"
                                          width={128}
                                          height={128}
                                          className="w-11 h-11 rounded-full object-cover"
                                        />
                                      )}
                                      <p className="font-semibold">
                                        {comment.pseudo}
                                      </p>
                                      <p className="font-light text-xs">
                                        {comment.updatedAt.toLocaleString(
                                          "fr-FR"
                                        )}
                                      </p>
                                      <div className="flex items-center gap-1 my-2">
                                        {Array.from({
                                          length: Number(comment.stars),
                                        }).map((_, idx) => (
                                          <span
                                            key={idx}
                                            className="text-yellow-400 text-3xl"
                                          >
                                            ★
                                          </span>
                                        ))}
                                      </div>
                                      {comment.userId === user_id && (
                                        <div className="flex items-center gap-2 ml-auto">
                                          <button
                                            className="rounded-full border border-gray-300 p-2"
                                            onClick={() => {
                                              setSelectedComment({
                                                id_comment: comment.id_comment,
                                                title: comment.title,
                                                content: comment.content,
                                                stars: comment.stars,
                                              });
                                              setIsUpdatingComment(true);
                                            }}
                                          >
                                            <PenSquare size={20} />
                                          </button>
                                          <button
                                            className="rounded-full border bg-red-500 text-white border-gray-300 p-2"
                                            onClick={() => {
                                              openDeleteCommentModal({
                                                id_comment: comment.id_comment,
                                                title: comment.title,
                                                content: comment.content,
                                                stars: comment.stars,
                                              });
                                            }}
                                          >
                                            <Trash size={20} />
                                          </button>
                                        </div>
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
                              Aucun commentaire publié. Soyez le premier à
                              laisser un commentaire !
                            </p>
                          )}
                        </div>
                      </>
                    )}
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

                {!methode ? (
                  <p className="font-Montserrat text-justify">
                    Cliquez sur les mots en surbrillance dans le texte pour
                    accéder à pleins d&apos;informations supplémentaires !
                  </p>
                ) : (
                  <div className="method-container">
                    {renderMethodComponent()}
                  </div>
                )}
              </div>
            </div>
          </div>{" "}
        </>
      )}
    </div>
  );
}
