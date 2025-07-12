"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { CarouselDots } from "./Dots";
import { Article } from "@/contexts/Interfaces";
import { useGlobalContext } from "@/contexts/GlobalContext";

type CarouselContentProps = {
  currentIndex: number;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
  articles: Article[];
};

export const CarouselContent = ({
  currentIndex,
  setCurrentIndex,
  articles = [],
}: CarouselContentProps) => {
  const { router } = useGlobalContext();
  const article = articles[currentIndex];

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const next = () => {
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % articles.length);
      }, 300);
    };

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(next, 10000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, setCurrentIndex, articles.length]);

  if (!article) return null;

  const handleDotClick = (index: number) => {
    setTimeout(() => {
      setCurrentIndex(index);
    }, 300);
  };

  return (
    <div
      className="carousel-item relative cursor-pointer"
      onClick={() => router.push(`/articles/${article.id_article}`)}
    >
      <Image
        width={2048}
        height={2048}
        src={article.imageUrl}
        alt={article.title}
        priority
        className="w-full h-[700px] object-cover object-top"
      />

      <div className="absolute bottom-0 left-0 w-full h-2/3 bg-gradient-to-t from-black to-transparent z-0" />

      <div className="absolute bottom-2 left-0 m-8">
        <h2 className="font-Bai_Jamjuree text-white uppercase text-2xl font-bold w-1/2">
          {article.title}
        </h2>
        <p className="font-Montserrat text-white text-sm w-1/2">
          {article.teaser}
        </p>

        <CarouselDots
          activeIndex={currentIndex}
          onDotClick={handleDotClick}
          totalSlides={articles.length}
        />
      </div>
    </div>
  );
};
