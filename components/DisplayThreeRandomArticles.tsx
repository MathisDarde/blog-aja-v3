"use client"

import React from "react";
import { useGlobalContext } from "@/contexts/GlobalContext";
import { Article } from "@/contexts/Interfaces";
import ArticleShowcase from "./ArticleComponent";

export default function DisplayRandom({ articles }: { articles: Article[] }) {
  const { getRandomArticles } = useGlobalContext();

  const randomArticles = getRandomArticles(articles, 4);

  return (
    <div>
      <div className="flex flex-col gap-6">
        {randomArticles.length === 0 ? (
          <p className="font-Montserrat text-italic text-gray-500">Aucun article disponible.</p>
        ) : (
          randomArticles.map((article, index) => (
            <div key={index}>
              <ArticleShowcase article={article} displayPosition="horizontal" size="small" showAuthor={true} showDate={true} showTags={true} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
