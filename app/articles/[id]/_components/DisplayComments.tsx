"use client";

import CommentForm from "./CommentForm";
import Button from "@/components/BlueButton";
import UpdateCommentForm from "./UpdateCommentForm";
import { useGlobalContext } from "@/contexts/GlobalContext";
import { useState } from "react";
import deleteCommentAction from "@/actions/comment/delete-comment";
import { ChevronLeft, PenSquare, Plus, Trash } from "lucide-react";
import Image from "next/image";
import { Article, Comment, User } from "@/contexts/Interfaces";
import Link from "next/link";
import ActionPopup from "@/components/ActionPopup";

export default function DisplayArticleComments({
  article,
  articleComments,
  user
}: {
  article: Article;
  articleComments: Comment[];
  user: User | null;
}) {
  const { user_id } = useGlobalContext();
  const article_id = article.id_article;

  const [isPublishingComment, setIsPublishingComment] = useState(false);
  const [visibleComments, setVisibleComments] = useState(3);
  const [isUpdatingComment, setIsUpdatingComment] = useState(false);
  const [selectedComment, setSelectedComment] = useState<{
    id_comment: string;
    title: string;
    content: string;
    stars: number;
  } | null>(null);
  const [deletePopupOpen, setDeletePopupOpen] = useState(false);

  const numberOfComments = articleComments.length;

  const handleVoirPlus = () => {
    setVisibleComments((prev) => prev + 3);
  };

  async function deleteComment(id: string) {
    try {
      return await deleteCommentAction(id);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <div
        id="commentaire-anchor"
        className="relative -top-24 opacity-0 transition-opacity duration-500"
      ></div>

      {/* delete comment modal */}
      {deletePopupOpen &&
        <ActionPopup
          onClose={() => setDeletePopupOpen(false)}
          title="Supprimer ce commentaire ?"
          description="Cette action est irréversible. Êtes-vous sûr de vouloir continuer ?"
          actions={[
            {
              label: "Annuler",
              onClick: () => setDeletePopupOpen(false),
              theme: "discard",
            },
            {
              label: "Supprimer",
              onClick: async () => {
                try {
                  if (selectedComment) {
                    await deleteComment(selectedComment?.id_comment);
                    window.location.reload();
                    setDeletePopupOpen(false);
                  }
                } catch (e) {
                  console.error("error", e)
                }
              },
              theme: "delete",
            },
          ]}
        />
      }

      <div className="w-full bg-white rounded-xl p-8 font-Montserrat">
        {!isPublishingComment ? (
          <>
            {isUpdatingComment && selectedComment ? (
              <>
                <h2
                  className="font-bold font-Bai_Jamjuree uppercase text-3xl mb-10 flex items-center justify-center gap-3 cursor-pointer"
                  onClick={() => {
                    setSelectedComment(null);
                    setIsUpdatingComment(false);
                  }}
                >
                  <ChevronLeft /> Formulaire de modification du commentaire
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
                  <h3 className="font-Bai_Jamjuree text-2xl font-bold uppercase">
                    Commentaires ({numberOfComments})
                  </h3>
                  {article.state === "published" && (
                    <>
                      {user ? (
                        <Button
                          className="flex flex-row items-center gap-2 text-white bg-aja-blue px-6 py-3 rounded-full m-0"
                          onClick={() => setIsPublishingComment(true)}
                        >
                          <Plus /> Ajouter un commentaire
                        </Button>
                      ) : (
                        <Link href={"/login"}>
                          <Button
                            className="flex flex-row items-center gap-2 text-white bg-aja-blue px-6 py-3 rounded-full"
                          >
                            Connectez-vous pour publier un commentaire
                          </Button>
                        </Link>
                      )}
                    </>
                  )}
                </div>

                <div className="mt-6 flex flex-col gap-8">
                  {articleComments.length > 0 && isUpdatingComment === false ? (
                    <>
                      {articleComments
                        .slice(0, visibleComments)
                        .map((comment) => (
                          <div
                            key={comment.id_comment}
                            id={`comment-${comment.id_comment}`}
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
                              <p className="font-semibold">{comment.pseudo}</p>
                              <p className="font-light text-xs">
                                {comment.updatedAt.toLocaleString("fr-FR")}
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
                                      setDeletePopupOpen(true);
                                      setSelectedComment({
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
                      {visibleComments < articleComments.length && (
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
            )}
          </>
        ) : (
          <div>
            <div onClick={() => setIsPublishingComment(false)}>
              <h2 className="font-bold font-Bai_Jamjuree uppercase text-3xl mb-10 flex items-center justify-center gap-3 cursor-pointer">
                <ChevronLeft /> Formulaire de publication de commentaire
              </h2>
            </div>
            <div>
              <CommentForm id_article={article_id} />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
