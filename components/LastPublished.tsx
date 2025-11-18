import Link from "next/link";
import Image from "next/image";
import React from "react";
import { Article } from "@/contexts/Interfaces";

export default function LastArticle({ articles }: { articles: Article[] }) {
  const sortedArticles = [...articles].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  if (!articles || articles.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500 italic font-Montserrat">
        Aucun article n’a encore été publié.
      </div>
    );
  }

  const lastArticle = sortedArticles[0];

  return (
    <div>
      <Link href={`/articles/${lastArticle.slug}`}>
        <div
          className="bg-white rounded-xl text-center border border-stone-200 shadow-xl p-6"
          key={lastArticle.id_article}
        >
          <Image
            className="inline-block w-full h-auto mx-auto rounded-xl object-cover"
            width={512}
            height={512}
            src={`${lastArticle.imageUrl}`}
            alt={lastArticle.title}
          />
          <h4 className="text-justify text-black font-medium font-Montserrat w-full text-lg py-2 pr-2 mx-auto">
            {lastArticle.title}
          </h4>
          <p className="w-full text-black text-justify font-Montserrat mx-auto text-sm leading-5">
            {lastArticle.teaser}
          </p>
        </div>
      </Link>
    </div>
  );
}
