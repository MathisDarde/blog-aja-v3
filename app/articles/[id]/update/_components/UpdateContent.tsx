"use server"

import { ChevronLeft } from "lucide-react";
import UpdateArticleForm from "../../_components/UpdateArticleForm";
import Link from "next/link";
import { getAllArticles } from "@/controllers/ArticlesController";
import { Article } from "@/contexts/Interfaces";

export default async function UpdateContent({ id_article, getArticleById } : { id_article : string, getArticleById: (articles: Article[], id: string) => Article | null; }) {
    const articles = await getAllArticles();

    const article = getArticleById(articles, id_article);

    return (
        <div className="text-center bg-gray-100 min-h-screen w-screen box-border p-10">
<Link href="/articles">
      <h2
        className="font-bold font-Bai_Jamjuree uppercase text-3xl mb-10 flex items-center justify-center gap-3 cursor-pointer"
      >
        <ChevronLeft /> Formulaire de modification d&apos;article
      </h2>
      </Link>

      <UpdateArticleForm
      id_article={id_article}
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