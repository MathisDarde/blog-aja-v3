"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  Calendar1,
  Gem,
  Heart,
  MessageCircle,
  PenBox,
  Share2Icon,
  Trash,
} from "lucide-react";
import KeywordHighlighter from "./HighlightKeywords";
import deleteArticleSA from "@/actions/article/delete-article";
import {
  Article,
  ArticleLikes,
  Comment,
  Keyword,
  Methodes,
  User,
} from "@/contexts/Interfaces";
import DisplayArticleComments from "./DisplayComments";
import MethodPopup from "./MethodPopup";
import { useRouter } from "next/navigation";
import ActionPopup from "@/components/ActionPopup";
import removeLike from "@/actions/article/remove-like";
import likeArticle from "@/actions/article/like-article";
import { toast } from "sonner";

export default function ArticleDisplay({
  article,
  articles,
  methodes,
  keywords,
  articleComments,
  articleLikes,
  user,
}: {
  article: Article;
  articles: Article[];
  methodes: Methodes[];
  keywords: Keyword[];
  articleComments: Comment[];
  articleLikes: ArticleLikes[];
  user: User | null;
}) {
  const router = useRouter();
  const isAdmin = user?.admin;

  const [activeMethode, setActiveMethode] = useState<Methodes[]>([]);
  const [isMethodOpen, setIsMethodOpen] = useState(false);
  const [deletePopupOpen, setDeletePopupOpen] = useState(false);

  // Likes
  const userLike = articleLikes.find((l) => l.userId === user?.id);
  const [liked, setLiked] = useState(!!userLike);
  const [likesCount, setLikesCount] = useState(articleLikes.length);
  const [confirmUnlike, setConfirmUnlike] = useState(false);

  const handleLikeClick = async () => {
    if (!user) return;

    if (!liked) {
      try {
        await likeArticle(article.id_article, user.id);
        setLiked(true);
        setLikesCount((prev) => prev + 1);
      } catch (err) {
        console.error("Erreur like :", err);
      }
    } else {
      setConfirmUnlike(true);
    }
  };

  const handleUnlikeConfirm = async () => {
    if (!user) return;

    try {
      await removeLike(user.id, article.id_article);
      setLiked(false);
      setLikesCount((prev) => prev - 1);
      setConfirmUnlike(false);
    } catch (err) {
      console.error("Erreur remove like :", err);
    }
  };

  // Scroll vers un commentaire via hash
  useEffect(() => {
    const hash = window.location.hash;
    if (hash.startsWith("#comment-")) {
      const scrollToComment = () => {
        const el = document.querySelector(hash);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
          return true;
        }
        return false;
      };

      if (!scrollToComment()) {
        const observer = new MutationObserver(() => {
          if (scrollToComment()) observer.disconnect();
        });
        observer.observe(document.body, { childList: true, subtree: true });
        setTimeout(() => observer.disconnect(), 5000);
      }
    }
  }, []);

  const handleKeywordClick = (id_methode: string, typemethode: string) => {
    const selectedMethodes = methodes.filter(
      (m) => m.id_methode === id_methode && m.typemethode === typemethode
    );
    setActiveMethode(selectedMethodes);
    setIsMethodOpen(true);
  };

  const handleShare = async () => {
    const url = window.location.href;

    const shareData = {
      title: article.title,
      text: article.teaser,
      url: url,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error('Partage annulé ou erreur :', err);
        toast.error('Partage annulé.')
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        toast.success("Lien copié dans le presse papiers !");
      } catch (err) {
        toast.error("Impossible de partager automatiquement. Copiez l'URL manuellement.");
      }
    }
  };

  return (
    <div
      className={`bg-gray-100 min-h-screen w-full m-0 box-border p-6 sm:p-10 ${
        isMethodOpen && "overflow-hidden"
      }`}
    >
      {/* Delete article popup */}
      {deletePopupOpen && (
        <ActionPopup
          onClose={() => setDeletePopupOpen(false)}
          title="Supprimer cet article ?"
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
                  await deleteArticleSA(article.id_article);
                  router.push("/");
                  setDeletePopupOpen(false);
                } catch (error) {
                  console.error("Erreur suppression article :", error);
                }
              },
              theme: "delete",
            },
          ]}
        />
      )}

      <div className="flex justify-center gap-10">
        <div className="flex flex-col gap-4 sm:gap-6 max-w-[1200px] w-full">
          <div>
            <h1 className="font-Bai_Jamjuree font-extrabold text-3xl sm:text-4xl">
              {article.title || "Titre de l'article"}
            </h1>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 justify-between mt-4">
              <p className="font-Montserrat flex items-center italic text-sm sm:text-base">
                <Calendar1 className="mr-2" />
                {new Date(article.createdAt).toLocaleDateString("fr-FR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}{" "}
                par {article.author || "Auteur"}
              </p>

              <div className="flex items-center gap-2">
                {/* Comment button */}
                {article.state === "published" && (
                  <div
                    className="border border-gray-300 hover:bg-gray-300 rounded-full p-2 text-gray-500 flex items-center justify-center transition-colors cursor-pointer hover:text-gray-800"
                    onClick={() => {
                      const anchor =
                        document.getElementById("commentaire-anchor");
                      anchor?.scrollIntoView({ behavior: "smooth" });
                    }}
                  >
                    <MessageCircle
                      width={20}
                      height={20}
                      className="w-4 sm:w-5 h-4 sm:h-5"
                    />
                  </div>
                )}

                {/* Like button */}
                {article.state != "pending" && (
                  <div
                    className={`border border-gray-300 rounded-full py-2 px-3 flex items-center justify-center gap-2 transition-colors group
    ${
      user
        ? "hover:bg-gray-300 hover:text-rose-600 text-gray-500 cursor-pointer"
        : "opacity-50 cursor-not-allowed text-gray-400"
    }`}
                    onClick={() => {
                      if (!user) {
                        toast.warning(
                          "Veuillez vous connecter pour liker cet article."
                        );
                        return;
                      }
                      handleLikeClick();
                    }}
                  >
                    <Heart
                      width={20}
                      height={20}
                      className={`transition-colors w-4 sm:w-5 h-4 sm:h-5 ${
                        liked
                          ? "fill-rose-600 text-rose-600"
                          : "fill-transparent group-hover:fill-current"
                      }`}
                    />
                    <p className="text-sm font-Montserrat">{likesCount}</p>
                  </div>
                )}

                {/* Popup confirmation for unlike */}
                {user && confirmUnlike && (
                  <ActionPopup
                    onClose={() => setConfirmUnlike(false)}
                    title="Retirer votre like ?"
                    description="Êtes-vous sûr de vouloir retirer votre like sur cet article ?"
                    actions={[
                      {
                        label: "Annuler",
                        onClick: () => setConfirmUnlike(false),
                        theme: "discard",
                      },
                      {
                        label: "Retirer",
                        onClick: handleUnlikeConfirm,
                        theme: "delete",
                      },
                    ]}
                  />
                )}

                {article.state === "published" && (
                  <div
                    className="border border-gray-300 hover:bg-gray-300 rounded-full p-2 text-gray-500 flex items-center justify-center transition-colors cursor-pointer hover:text-gray-800"
                    onClick={handleShare}
                  >
                    <Share2Icon
                      width={20}
                      height={20}
                      className="w-4 sm:w-5 h-4 sm:h-5"
                    />
                  </div>
                )}

                {/* Admin actions */}
                {isAdmin && (
                  <>
                    <div
                      className="border border-gray-300 hover:bg-gray-300 rounded-full p-2 text-gray-500 flex items-center justify-center transition-colors cursor-pointer hover:text-blue-500"
                      onClick={() =>
                        router.push(`/articles/${article.slug}/update`)
                      }
                    >
                      <PenBox
                        width={20}
                        height={20}
                        className="w-4 sm:w-5 h-4 sm:h-5"
                      />
                    </div>
                    <div className="border border-gray-300 rounded-full p-2 text-gray-500 flex items-center justify-center transition-colors cursor-pointer hover:bg-red-500 hover:text-white">
                      <Trash
                        onClick={() => setDeletePopupOpen(true)}
                        width={20}
                        height={20}
                        className="w-4 sm:w-5 h-4 sm:h-5"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <Image
            src={article.imageUrl || "/_assets/img/defaultarticlebanner.png"}
            width={1024}
            height={1024}
            alt="Image de bannière de l'article"
            className="aspect-video w-full object-cover object-top rounded-xl"
          />

          <div className="font-Montserrat text-justify bg-white rounded-xl p-4 sm:p-8 leading-5 sm:leading-7 md:leading-8 text-xs sm:text-sm md:text-base ">
            <KeywordHighlighter
              text={article.content}
              keywords={keywords}
              onKeywordClick={handleKeywordClick}
            />
          </div>

          {article.state !== "pending" && (
            <DisplayArticleComments
              article={article}
              articleComments={articleComments}
              user={user}
            />
          )}
        </div>
      </div>

      {isMethodOpen && (
        <MethodPopup
          onClose={() => setIsMethodOpen(false)}
          activeMethode={activeMethode}
          setActiveMethode={setActiveMethode}
          methodes={methodes}
          id_article={article.id_article}
          articles={articles}
        />
      )}

      <div
        onClick={() => setIsMethodOpen(true)}
        className="cursor-pointer fixed bottom-10 right-10 w-16 lg:w-24 h-16 lg:h-24 rounded-full text-white bg-aja-blue flex items-center justify-center"
      >
        <Gem size={50} className="size-10 lg:size-14" />
      </div>
    </div>
  );
}
