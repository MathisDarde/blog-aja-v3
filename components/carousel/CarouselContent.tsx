import displayLastPublished from "@/actions/article/display-last-published";
import displayUniqueArticle from "@/actions/article/get-single-article";
import Image from "next/image";
import { useEffect, useState } from "react";
import { CarouselDots } from "./Dots";

export type Article = {
  id_article: string;
  imageUrl: string;
  title: string;
  teaser: string;
  content: string;
  author: string;
  tags: string[];
  state: "pending" | "published" | "archived" | null;
  userId: string;
  publishedAt: Date;
  updatedAt: Date;
};

type CarouselContentProps = {
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
};

export const CarouselContent = ({
  currentIndex,
  setCurrentIndex,
}: CarouselContentProps) => {
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    async function fetchArticles() {
      const lastPublished = await displayLastPublished();
      const myChoice = await displayUniqueArticle(
        "c402e045-c67f-4967-8097-f74705dff076"
      );

      const allArticles = [
        ...(Array.isArray(lastPublished)
          ? (lastPublished as (Article | null)[]).filter(
              (a): a is Article => a !== null
            )
          : lastPublished
          ? [lastPublished as Article]
          : []),
        ...(Array.isArray(myChoice)
          ? myChoice.filter((a) => a !== null)
          : myChoice
          ? [myChoice]
          : []),
      ];

      setArticles(allArticles);
    }

    fetchArticles();
  }, []);

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
        className="w-full h-[600px] object-cover object-top"
      />
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
