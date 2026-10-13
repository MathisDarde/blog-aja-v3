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
    <>
      <UpdateArticleGuard />
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
    </>
  );
}
