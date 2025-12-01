"use client";

import CommentForm from "./CommentForm";
import Button from "@/components/BlueButton";
import UpdateCommentForm from "./UpdateCommentForm";
import { useGlobalContext } from "@/contexts/GlobalContext";
import React, { useState } from "react";
import { ChevronLeft, LogIn, Plus } from "lucide-react";
import { Article, Comment, User } from "@/contexts/Interfaces";
import Link from "next/link";
import CommentComponent from "@/components/CommentComponent";

export default function DisplayArticleComments({
  article,
  articleComments,
  user,
}: {
  article: Article;
  articleComments: Comment[];
  user: User | null;
}) {
  const { user_id } = useGlobalContext();
  const article_id = article.id_article;

  const [selectedComment, setSelectedComment] = useState<Comment | null>(null);
  const [isUpdatingComment, setIsUpdatingComment] = useState(false);
  const [isPublishingComment, setIsPublishingComment] = useState(false);
  const [visibleComments, setVisibleComments] = useState(3);

  const numberOfComments = articleComments.length;

  const handleVoirPlus = () => {
    setVisibleComments((prev) => prev + 3);
  };

  const handleEditComment = (comment: Comment) => {
    setSelectedComment(comment);
    setIsUpdatingComment(true);
  };

  return (
    <>
      <div
        id="commentaire-anchor"
        className="relative -top-24 opacity-0 transition-opacity duration-500"
      ></div>

      <div className="max-w-[1200px] bg-white rounded-xl p-4 sm:p-8 font-Montserrat">
        {!isPublishingComment ? (
          <>
            {isUpdatingComment && selectedComment ? (
              <>
                <h2
                  className="font-bold font-Bai_Jamjuree uppercase text-xl sm:text-2xl md:text-3xl mb-4 sm:mb-10 flex items-center justify-center gap-3 cursor-pointer"
                  onClick={() => {
                    setSelectedComment(null);
                    setIsUpdatingComment(false);
                  }}
                >
                  <ChevronLeft className="size-8" /> Formulaire de modification
                  de commentaire
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
                <div className="flex justify-between items-center gap-6">
                  <h3 className="font-Bai_Jamjuree text-xl sm:text-2xl font-bold uppercase">
                    Commentaires ({numberOfComments})
                  </h3>
                  {article.state === "published" && (
                    <>
                      {user ? (
                        <Button
                          className="flex flex-row items-center gap-2 text-white bg-aja-blue px-2 md:px-6 py-2 md:py-3 rounded-full m-0"
                          onClick={() => setIsPublishingComment(true)}
                        >
                          <Plus />{" "}
                          <span className="hidden md:block">
                            Ajouter un commentaire
                          </span>
                        </Button>
                      ) : (
                        <Link href={"/login"}>
                          <Button
                            className="flex flex-row items-center gap-2 text-white bg-aja-blue px-2 lg:px-6 py-2 lg:py-3 rounded-full m-0"
                            size="slim"
                          >
                            <LogIn />{" "}
                            <span className="hidden lg:block">
                              Connectez-vous pour publier un commentaire
                            </span>
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
                          <React.Fragment key={comment.id_comment}>
                            <CommentComponent 
                                comment={comment} 
                                userId={user_id} 
                                onEdit={handleEditComment}
                            />
                          </React.Fragment>
                        ))}

                      {visibleComments < articleComments.length && (
                        <Button
                          onClick={handleVoirPlus}
                          className="mt-4 text-white bg-aja-blue px-6 py-3 rounded-full w-fit mx-auto"
                          size="slim"
                        >
                          Voir plus
                        </Button>
                      )}
                    </>
                  ) : (
                    <p className="text-sm sm:text-base">
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
              <h2 className="font-bold font-Bai_Jamjuree uppercase text-xl sm:text-2xl md:text-3xl mb-4 sm:mb-10 flex items-center justify-center gap-3 cursor-pointer">
                <ChevronLeft className="size-8" /> Formulaire de publication de
                commentaire
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