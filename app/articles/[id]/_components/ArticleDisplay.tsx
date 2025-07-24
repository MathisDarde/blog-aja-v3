"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  Calendar1,
  Gem,
  Heart,
  MessageCircle,
  PenBox,
  Trash,
} from "lucide-react";
import KeywordHighlighter from "./HighlightKeywords";
import deleteArticleSA from "@/actions/article/delete-article";
import { Article, Comment, Keyword, Methodes } from "@/contexts/Interfaces";
import { useGlobalContext } from "@/contexts/GlobalContext";
import { ModalAction } from "@/components/ModalAction";
import DisplayArticleComments from "./DisplayComments";
import MethodPopup from "./MethodPopup";
import { useRouter } from "next/navigation";

export default function ArticleDisplay({ article, articles, methodes, keywords, articleComments }: { article: Article, articles: Article[], methodes: Methodes[], keywords: Keyword[], articleComments : Comment[] }) {
  const { isAdmin, isUser, modalParams, setModalParams } =
    useGlobalContext();

  const router = useRouter();

  const [activeMethode, setActiveMethode] = useState<Methodes[]>([]);
  const [isMethodOpen, setIsMethodOpen] = useState(false);

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
          if (scrollToComment()) {
            observer.disconnect();
          }
        });

        observer.observe(document.body, {
          childList: true,
          subtree: true,
        });

        // Optionnel : auto-timeout après 5s
        setTimeout(() => observer.disconnect(), 5000);
      }
    }
  }, []);

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

  const handleKeywordClick = (id_methode: string, typemethode: string) => {
    const selectedMethodes = methodes.filter(
      (m) => m.id_methode === id_methode && m.typemethode === typemethode
    );
    setActiveMethode(selectedMethodes);
    setIsMethodOpen(true);
  };

  return (
    <div
      className={`bg-gray-100 min-h-screen w-full m-0 box-border p-10 ${isMethodOpen && "overflow-hidden"
        }`}
    >
      {/* Delete element popup */}
      {modalParams && (
        <ModalAction
          object={modalParams.object}
          type={modalParams.type}
          onConfirm={modalParams.onConfirm}
          onCancel={modalParams.onCancel}
        />
      )}
      <div className="flex justify-center gap-10">
        <div className="flex flex-col gap-6 w-[1200px]">
          <div>
            <h1 className="font-Bai_Jamjuree font-extrabold text-4xl">
              {article.title}
            </h1>
            <div className="flex items-center justify-between mt-4">
              <p className="font-Montserrat flex items-center italic">
                <Calendar1 className="mr-2" />
                {new Date(article.createdAt).toLocaleDateString("fr-FR", {
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
                      onClick={() =>
                        router.push(`/articles/${article.id_article}/update`)
                      }
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


          <div className="font-Montserrat text-justify bg-white rounded-xl p-8 leading-7">
            <KeywordHighlighter
              text={article.content}
              keywords={keywords}
              onKeywordClick={handleKeywordClick}
            />
          </div>

          <DisplayArticleComments article_id={article.id_article} articleComments={articleComments}/>
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
        className="fixed bottom-10 right-10 w-24 h-24 rounded-full text-white bg-aja-blue flex items-center justify-center "
      >
        <Gem size={50} />
      </div>
    </div>
  );
}
