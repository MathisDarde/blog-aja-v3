"use client";

import { useState } from "react";
import { CarouselContent } from "./CarouselContent";
import { Article } from "@/contexts/Interfaces";

export default function Carousel({ articles }: { articles: Article[] }) {
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
