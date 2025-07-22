"use client";

import { useState } from "react";
import { CarouselContent } from "./CarouselContent";
import { Article } from "@/contexts/Interfaces";

export default function Carousel({ randomArticles } : { randomArticles : Article[]}) {
  const [currentIndex, setCurrentIndex] = useState(0);

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
