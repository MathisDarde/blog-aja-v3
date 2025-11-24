"use client"

import React from "react";
import { Article } from "@/contexts/Interfaces";
import ArticleShowcase from "./ArticleComponent";

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
    <div className="h-full">
      <ArticleShowcase article={lastArticle} displayPosition="vertical" size="large" showAuthor={true} showDate={true} showTags={true} showTeaser={true} />
    </div>
  );
}
