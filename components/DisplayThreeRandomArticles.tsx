"use client"

import React from "react";
import { ArticleCard } from "@/contexts/Interfaces";
import ArticleShowcase from "./ArticleComponent";

// Articles déjà tirés au hasard côté serveur (app/page.tsx)
export default function DisplayRandom({ articles: randomArticles }: { articles: ArticleCard[] }) {
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
