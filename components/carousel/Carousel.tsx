"use client";

import { useEffect, useState } from "react";
import { CarouselContent } from "./CarouselContent";
import displayLastPublished from "@/actions/article/display-last-published";
import displayUniqueArticle from "@/actions/article/get-single-article";
import { Article } from "./CarouselContent";

export default function Carousel() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    async function fetchArticles() {
      const lastPublishedResult = await displayLastPublished();
      const myChoiceResult = await displayUniqueArticle(
        "c402e045-c67f-4967-8097-f74705dff076"
      );

      const lastPublished: (Article | null)[] = Array.isArray(
        lastPublishedResult
      )
        ? lastPublishedResult
        : lastPublishedResult
        ? [lastPublishedResult]
        : [];

      const myChoice: (Article | null)[] = Array.isArray(myChoiceResult)
        ? myChoiceResult
        : myChoiceResult
        ? [myChoiceResult]
        : [];

      const allArticles = [
        ...lastPublished.filter((a): a is Article => a !== null),
        ...myChoice.filter((a): a is Article => a !== null),
      ];

      setArticles(allArticles);
    }

    fetchArticles();
  }, []);

  return (
    <div className="relative">
      <CarouselContent
        currentIndex={currentIndex}
        setCurrentIndex={setCurrentIndex}
      />
    </div>
  );
}
