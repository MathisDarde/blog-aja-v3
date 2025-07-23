"use client";

import { useState } from "react";
import { CarouselContent } from "./CarouselContent";
import { Article } from "@/contexts/Interfaces";
import { useGlobalContext } from "@/contexts/GlobalContext";

export default function Carousel({ articles } : { articles : Article[]}) {
  const { getRandomArticles } = useGlobalContext();

  const [currentIndex, setCurrentIndex] = useState(0);

  const randomArticles = getRandomArticles(articles, 3);

  return (
    <div className="relative mx-auto max-w-[2000px]">
      <CarouselContent
        currentIndex={currentIndex}
        setCurrentIndex={setCurrentIndex}
        articles={randomArticles}
      />
    </div>
  );
}
