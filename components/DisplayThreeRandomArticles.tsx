"use client"

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useGlobalContext } from "@/contexts/GlobalContext";
import { Article } from "@/contexts/Interfaces";

export default function DisplayRandom({ articles } : { articles: Article[] }) {
  const { getRandomArticles } = useGlobalContext();

  const randomArticles = getRandomArticles(articles, 3);

  return (
    <div>
        <div className="flex flex-col gap-3">
          {randomArticles.length === 0 ? (
            <p>Aucun article disponible.</p>
          ) : (
            randomArticles.map((article, index) => (
              <Link href={`/articles/${article.id_article}`} key={index}>
                <div className="bg-white border border-stone-200 shadow-xl rounded-xl p-4">
                  <Image
                    className="w-full object-cover rounded-md aspect-video"
                    width={512}
                    height={512}
                    src={article.imageUrl}
                    alt={article.title}
                  />
                  <h2 className="text-xs font-Montserrat font-medium mt-2">
                    {article.title}
                  </h2>
                </div>
              </Link>
            ))
          )}
        </div>
    </div>
  );
}
