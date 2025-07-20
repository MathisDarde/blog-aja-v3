"use client";

import { useGlobalContext } from "@/contexts/GlobalContext";
import { ChevronLeft } from "lucide-react";
import UpdateArticleForm from "../_components/UpdateArticleForm";
import { ModalAction } from "@/components/ModalAction";
import { useGettersContext } from "@/contexts/DataGettersContext";
import { useEffect, useState } from "react";
import { Article } from "@/contexts/Interfaces";

export default function UpdateArticle() {
  const { router, params, modalParams, setModalParams } = useGlobalContext();
  const { getArticleById } = useGettersContext();

  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  useEffect(() => {
    function getArticleByParam() {
      const articleId = params.id as string;
      if (!articleId) {
        router.push("/");
        return null;
      }

      const article = getArticleById(articleId);
      if (article) {
        setSelectedArticle(article);
      }
    }
    getArticleByParam();
  }, [params.id, getArticleById, router]);

  const openLeaveChangesArticleModal = () => {
    setModalParams({
      object: "article",
      type: "leaveChanges",
      onConfirm: async () => {
        setModalParams(null);
        if (selectedArticle) {
          router.push(`/articles/${selectedArticle.id_article}`);
        }
      },
      onCancel: () => setModalParams(null),
    });
  };

  return (
    <div className="text-center bg-gray-100 min-h-screen w-screen box-border p-10">
      {modalParams && (
        <ModalAction
          object={modalParams.object}
          type={modalParams.type}
          onConfirm={modalParams.onConfirm}
          onCancel={modalParams.onCancel}
        />
      )}

      <h2
        className="font-bold font-Bai_Jamjuree uppercase text-3xl mb-10 flex items-center justify-center gap-3 cursor-pointer"
        onClick={() => openLeaveChangesArticleModal()}
      >
        <ChevronLeft /> Formulaire de modification d&apos;article
      </h2>

      <UpdateArticleForm
        articleData={{
          title: selectedArticle?.title ?? "",
          teaser: selectedArticle?.teaser ?? "",
          content: selectedArticle?.content ?? "",
          author: selectedArticle?.author ?? "",
          tags: selectedArticle?.tags ?? [],
          state: selectedArticle?.state ?? "pending",
          imageUrl: selectedArticle?.imageUrl ?? "",
        }}
      />
    </div>
  );
}
