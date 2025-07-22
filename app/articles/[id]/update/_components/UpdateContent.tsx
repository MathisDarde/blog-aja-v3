import { useGlobalContext } from "@/contexts/GlobalContext";
import { ChevronLeft } from "lucide-react";
import UpdateArticleForm from "../../_components/UpdateArticleForm";
import { ModalAction } from "@/components/ModalAction";
import Link from "next/link";
import { getAllArticles } from "@/controllers/ArticlesController";

export default async function UpdateContent({ id_article } : { id_article : string }) {
    const { modalParams, setModalParams, getArticleById } = useGlobalContext();

    const articles = await getAllArticles();

    const article = getArticleById(articles, id_article);

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

<Link href="/articles">
      <h2
        className="font-bold font-Bai_Jamjuree uppercase text-3xl mb-10 flex items-center justify-center gap-3 cursor-pointer"
      >
        <ChevronLeft /> Formulaire de modification d&apos;article
      </h2>
      </Link>

      <UpdateArticleForm
        articleData={{
          title: article?.title ?? "",
          teaser: article?.teaser ?? "",
          content: article?.content ?? "",
          author: article?.author ?? "",
          tags: article?.tags ?? [],
          state: article?.state ?? "pending",
          imageUrl: article?.imageUrl ?? "",
        }}
      />
    </div>
    )
}