"use server";

import { getArticlebyId } from "@/controllers/ArticlesController";
import UpdateArticleForm from "./UpdateArticleForm";
import UpdateArticleGuard from "./UpdateArticleGuard";

export default async function UpdateContent({
  id_article,
}: {
  id_article: string;
}) {
  const article = await getArticlebyId(id_article);

  return (
    <div className="text-center bg-gray-100 min-h-screen w-screen box-border p-6 sm:p-10">
      <UpdateArticleGuard />

      <h2 className="font-bold font-Bai_Jamjuree uppercase text-2xl sm:text-3xl mb-4 sm:mb-10 flex items-center justify-center gap-3 cursor-pointer">
        Formulaire de modification d&apos;article
      </h2>

      <UpdateArticleForm
        id_article={id_article}
        articleData={{
          title: article?.title ?? "",
          slug: article?.slug ?? "",
          teaser: article?.teaser ?? "",
          content: article?.content ?? "",
          author: article?.author ?? "",
          tags: article?.tags ?? [],
          state: article?.state ?? "pending",
          imageUrl: article?.imageUrl ?? "",
        }}
      />
    </div>
  );
}
