"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  Calendar1,
  CalendarClock,
  Clock,
  Eye,
  Gem,
  Heart,
  MessageCircle,
  PenBox,
  Share2Icon,
  Trash,
} from "lucide-react";
import ArticleContent from "./ArticleContent";
import deleteArticleSA from "@/actions/article/delete-article";
import deleteDraftArticle from "@/actions/article/delete-draft";
import { formatScheduledAt } from "@/lib/schedule-date";
import {
  Article,
  ArticleCard,
  ArticleLikes,
  Comment,
  User,
} from "@/contexts/Interfaces";
import type { CitedMethodes } from "@/lib/methode-pages";
import DisplayArticleComments from "./DisplayComments";
import CitedMethodesPanel from "./CitedMethodesPanel";
import ArticleToc from "./ArticleToc";
import ArticleShowcase from "@/components/ArticleComponent";
import { MIN_TOC_ENTRIES, TocEntry } from "@/lib/article-toc";
import { readingMinutes } from "@/lib/reading-time";
import { useRouter } from "next/navigation";
import ActionPopup from "@/components/ActionPopup";
import removeLike from "@/actions/article/remove-like";
import likeArticle from "@/actions/article/like-article";
import { toast } from "sonner";

export default function ArticleDisplay({
  article,
  cited,
  articleComments,
  articleLikes,
  user,
  draft,
  toc,
  related,
}: {
  article: Article;
  cited: CitedMethodes;
  articleComments: Comment[];
  articleLikes: ArticleLikes[];
  user: User | null;
  // Aperçu d'un brouillon (admin) : modifier et supprimer agissent sur le brouillon
  draft?: { id: string; scheduledAt: Date | null };
  // Intertitres de l'article (lib/article-toc)
  toc: TocEntry[];
  // Articles qui citent les mêmes méthodes ou tags (lib/related-articles)
  related: ArticleCard[];
}) {
  const router = useRouter();
  const isAdmin = user?.admin;

  const [isMethodOpen, setIsMethodOpen] = useState(false);
  const citedCount = Object.values(cited).reduce((total, list) => total + list.length, 0);
  const [deletePopupOpen, setDeletePopupOpen] = useState(false);
  const readingTime = useMemo(() => readingMinutes(article.content), [article.content]);

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
      } catch (err: unknown) {
        console.error("Partage annulé ou erreur :", err);
        toast.error("Partage annulé.");
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        toast.success("Lien copié dans le presse papiers !");
      } catch (err) {
        console.error("Impossible de partager automatiquement", err);
        toast.error(
          "Impossible de partager automatiquement. Copiez l'URL manuellement.",
        );
      }
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen w-full m-0 box-border p-6 sm:p-10">
      {draft && (
        <div className="max-w-[1200px] mx-auto mb-6 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 rounded-xl bg-aja-blue text-white px-4 py-3 font-Montserrat text-sm">
          <p className="flex items-center gap-2 font-semibold">
            <Eye size={18} /> Aperçu du brouillon, non publié
          </p>
          {draft.scheduledAt && (
            <p className="flex items-center gap-2">
              <CalendarClock size={18} /> Programmé pour le{" "}
              {formatScheduledAt(draft.scheduledAt)}
            </p>
          )}
        </div>
      )}

      {/* Delete article popup */}
      {deletePopupOpen && (
        <ActionPopup
          onClose={() => setDeletePopupOpen(false)}
          title={draft ? "Supprimer ce brouillon ?" : "Supprimer cet article ?"}
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
                  if (draft) {
                    const result = await deleteDraftArticle(draft.id);
                    if (!result.success) {
                      toast.error(result.message);
                      return;
                    }
                    router.push("/admin/brouillons");
                  } else {
                    await deleteArticleSA(article.id_article);
                    router.push("/");
                  }
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
                <span className="mx-2 text-gray-400">·</span>
                <Clock className="mr-1.5 w-4 h-4" />
                {readingTime} min de lecture
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
                          "Veuillez vous connecter pour liker cet article.",
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
                        router.push(
                          draft
                            ? `/admin/brouillons/${draft.id}`
                            : `/articles/${article.slug}/update`
                        )
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
            width={1200}
            height={675}
            // Image LCP de la page : chargée en priorité, à la largeur réellement affichée
            priority
            sizes="(min-width: 1280px) 1200px, 100vw"
            alt={article.title}
            className="aspect-video w-full object-cover object-top rounded-xl"
          />

          {toc.length >= MIN_TOC_ENTRIES && <ArticleToc toc={toc} />}

          <div className="font-Montserrat text-justify bg-white rounded-xl p-4 sm:p-8 leading-5 sm:leading-7 md:leading-8 text-xs sm:text-sm md:text-base ">
            <ArticleContent text={article.content} />
          </div>

          {related.length > 0 && (
            <section className="mt-2 sm:mt-4">
              <h2 className="font-Bai_Jamjuree text-2xl sm:text-3xl font-bold uppercase mb-4">À lire aussi</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                {related.map((card) => (
                  <div key={card.id_article} className="bg-white rounded-xl p-4">
                    <ArticleShowcase
                      article={card}
                      displayPosition="vertical"
                      size="small"
                      showTags={false}
                      showTeaser={true}
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

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
        <CitedMethodesPanel cited={cited} onClose={() => setIsMethodOpen(false)} />
      )}

      {/* Méthodes expert citées dans l'article */}
      {citedCount > 0 && (
        <button
          type="button"
          onClick={() => setIsMethodOpen(true)}
          aria-label={`Méthodes expert de l'article (${citedCount})`}
          className="fixed bottom-6 right-6 sm:bottom-10 sm:right-10 z-40 w-16 lg:w-24 h-16 lg:h-24 rounded-full text-white bg-aja-blue shadow-lg hover:bg-orange-third transition-colors flex items-center justify-center"
        >
          <Gem size={50} className="size-10 lg:size-14" />
          <span className="absolute -top-1 -right-1 min-w-6 h-6 px-1.5 rounded-full bg-orange-third text-xs font-bold leading-6 ring-2 ring-white">
            {citedCount}
          </span>
        </button>
      )}
    </div>
  );
}
