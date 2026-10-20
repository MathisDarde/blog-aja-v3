"use client";

import { useState } from "react";
import { CarouselContent } from "./CarouselContent";
import { ArticleCard } from "@/contexts/Interfaces";

export default function Carousel({ articles }: { articles: ArticleCard[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <div className="relative mx-auto max-w-[1300px]">
      <CarouselContent
        currentIndex={currentIndex}
        setCurrentIndex={setCurrentIndex}
        articles={articles}
      />
    </div>
  );
}
