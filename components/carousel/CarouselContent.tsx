"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import Image from "next/image";
import { CarouselDots } from "./Dots";
import { Article } from "@/contexts/Interfaces";
import { useRouter } from "next/navigation";

type CarouselContentProps = {
  currentIndex: number;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>; // Utilisé pour mettre à jour les Dots
  articles: Article[];
};

export const CarouselContent = ({
  currentIndex,
  setCurrentIndex,
  articles = [],
}: CarouselContentProps) => {
  const router = useRouter();
  
  const extendedArticles = useMemo(() => {
    if (articles.length < 2) return articles;
    return [
      articles[articles.length - 1],
      ...articles,
      articles[0],
    ];
  }, [articles]);

  const [internalIndex, setInternalIndex] = useState(1);
  
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const isAnimating = useRef(false);

  useEffect(() => {
    if (!isAnimating.current) {
        setInternalIndex(currentIndex + 1);
    }
  }, [currentIndex]);

  const handleSlideChange = (newIndex: number) => {
    if (isAnimating.current) return;
    isAnimating.current = true;
    setIsTransitioning(true);
    setInternalIndex(newIndex);
  };

  const nextSlide = () => {
    handleSlideChange(internalIndex + 1);
  };

  const prevSlide = () => {
    handleSlideChange(internalIndex - 1);
  };

  const handleTransitionEnd = () => {
    isAnimating.current = false;
    setIsTransitioning(false);

    if (internalIndex === extendedArticles.length - 1) {
      setInternalIndex(1);
      setCurrentIndex(0);
    } 
    else if (internalIndex === 0) {
      setInternalIndex(articles.length);
      setCurrentIndex(articles.length - 1);
    } 
    else {
      setCurrentIndex(internalIndex - 1);
    }
  };

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => nextSlide(), 8000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [internalIndex]);

  // Swipe Mobile
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const minSwipeDistance = 50;

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance) nextSlide();
    else if (distance < -minSwipeDistance) prevSlide();
    setTouchEnd(null);
    setTouchStart(null);
  };

  if (articles.length === 0) return null;

  return (
    <div 
      className="relative w-full h-full overflow-hidden group select-none"
      onTouchStart={(e) => setTouchStart(e.targetTouches[0].clientX)}
      onTouchMove={(e) => setTouchEnd(e.targetTouches[0].clientX)}
      onTouchEnd={onTouchEnd}
    >
      {/* RAIL COULISSANT */}
      <div 
        className="flex h-full will-change-transform"
        onTransitionEnd={handleTransitionEnd}
        style={{ 
          transform: `translateX(-${internalIndex * 100}%)`,
          transitionDuration: isTransitioning ? "700ms" : "0ms",
          transitionProperty: "transform",
          transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)"
        }}
      >
        {extendedArticles.map((article, index) => (
          <div 
            key={`${article.id_article}-${index}`} 
            className="min-w-full h-full relative cursor-pointer"
            onClick={() => {
                if(!isAnimating.current) router.push(`/articles/${article.slug}`);
            }}
          >
            <Image
              width={2048}
              height={2048}
              src={article.imageUrl}
              alt={article.title}
              priority={index === 1} 
              className="w-full h-[500px] md:h-[700px] object-cover object-top"
            />
            
            <div className="absolute bottom-0 left-0 w-full h-2/3 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-0" />
            
            <div className="absolute bottom-6 left-0 m-4 md:m-8 z-10 pointer-events-none">
                <h2 className="font-Bai_Jamjuree text-white uppercase text-xl sm:text-2xl md:text-3xl font-bold w-full sm:w-2/3 leading-tight mb-2 drop-shadow-lg">
                  {article.title}
                </h2>
                <p className="font-Montserrat text-gray-200 text-xs md:text-sm w-full sm:w-2/3 line-clamp-2 md:line-clamp-none drop-shadow-md">
                  {article.teaser}
                </p>
            </div>
          </div>
        ))}
      </div>

      {/* --- FLÈCHES --- */}
      <button
        onClick={(e) => { e.stopPropagation(); prevSlide(); }}
        className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 
                   bg-white/10 hover:bg-white/20 backdrop-blur-md text-white 
                   p-3 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>

      <button
        onClick={(e) => { e.stopPropagation(); nextSlide(); }}
        className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 
                   bg-white/10 hover:bg-white/20 backdrop-blur-md text-white 
                   p-3 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </button>

      <div className="absolute bottom-6 md:bottom-10 right-4 md:right-8 z-20">
         <CarouselDots
            activeIndex={currentIndex}
            onDotClick={(idx) => {
                if(isAnimating.current) return;
                setIsTransitioning(true);
                setInternalIndex(idx + 1);
            }}
            totalSlides={articles.length}
          />
      </div>
    </div>
  );
};