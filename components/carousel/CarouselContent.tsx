import Image from "next/image";
import { CarouselDots } from "./Dots";
import { Article } from "@/contexts/Interfaces";

type CarouselContentProps = {
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
  articles: Article[];
};

export const CarouselContent = ({
  currentIndex,
  setCurrentIndex,
  articles = [],
}: CarouselContentProps) => {
  const article = articles[currentIndex];

  if (!article) return null;

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="carousel-item relative">
      <Image
        width={2048}
        height={2048}
        src={article.imageUrl}
        alt={article.title}
        priority
        className="w-full h-[600px] object-cover object-top"
      />

      <div className="absolute bottom-0 left-0 w-full h-2/3 bg-gradient-to-t from-black to-transparent z-0" />

      <div className="absolute bottom-2 left-0 m-8">
        <h2 className="text-white uppercase text-2xl font-bold w-1/2">
          {article.title}
        </h2>
        <p className="text-white text-md italic w-1/2">{article.teaser}</p>

        <CarouselDots
          activeIndex={currentIndex}
          onDotClick={handleDotClick}
          totalSlides={articles.length}
        />
      </div>
    </div>
  );
};
