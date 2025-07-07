"use client";

import { useEffect, useState } from "react";
import { CarouselContent } from "./CarouselContent";
import displayLastPublished from "@/actions/article/display-last-published";
import displayUniqueArticle from "@/actions/article/get-single-article";
import { Article } from "@/contexts/Interfaces";

export default function Carousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedArticles, setSelectedArticles] = useState<Article[]>([]);

  useEffect(() => {
    async function fetchArticles() {
      const lastPublishedResult = await displayLastPublished();
      const myChoiceResult = await displayUniqueArticle(
        "c402e045-c67f-4967-8097-f74705dff076"
      );

      const lastPublished: Article[] = Array.isArray(lastPublishedResult)
        ? lastPublishedResult
        : lastPublishedResult
        ? [lastPublishedResult]
        : [];

      const myChoice: Article[] = Array.isArray(myChoiceResult)
        ? myChoiceResult
        : myChoiceResult
        ? [myChoiceResult]
        : [];

      setSelectedArticles([...lastPublished, ...myChoice]);
    }

    fetchArticles();
  }, []);

  return (
    <div className="relative mx-auto max-w-[2000px]">
      <CarouselContent
        currentIndex={currentIndex}
        setCurrentIndex={setCurrentIndex}
        articles={selectedArticles}
      />
    </div>
  );
}
