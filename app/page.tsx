"use server";

import "./globals.css";
import LastArticle from "@/components/LastPublished";
import DisplayRandom from "@/components/DisplayThreeRandomArticles";
import DisplayCategories from "@/components/DisplayCategories";
import React from "react";
import Carousel from "@/components/carousel/Carousel";
import TeamStatsBlock from "@/components/teamstatshomepage/TeamStatsBlock";
import { getArticles } from "@/controllers/ArticlesController";
import categories from "@/public/data/articletags.json";
import { Category, User } from "@/contexts/Interfaces";
import Header from "@/components/header/Header";
import { isAuthenticated } from "@/actions/user/is-user-connected";
import { getUserbyId } from "@/controllers/UserController";
import Footer from "@/components/Footer";
import Timeline from "@/components/timeline/Timeline";
import { TimelineItems } from "@/components/timeline/TimelineItems";
import CitationSlider from "@/components/slidercitations/CitationSlider";
import PagesTilt from "@/components/PagesTest";

export default async function Page() {
  const articles = await getArticles();
  if (!articles) return;
  const auth = await isAuthenticated();

  let user: User | null = null;

  if (auth?.user?.id) {
    const users = await getUserbyId(auth.user.id);
    user = users?.[0] ?? null;
  }

  function getRandomCategories(
    categories: Category[],
    amount: number
  ): Category[] {
    if (!Array.isArray(categories)) return [];
    if (amount >= categories.length) return [...categories];

    const shuffled = [...categories].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, amount);
  }

  const randomCategories = getRandomCategories(categories, 7);

  return (
    <div className="bg-gray-100">
      <Header user={user || undefined} />

      <div className="pb-3 max-w-[1300px] mx-auto">
        <Carousel articles={articles} />
      </div>

      <div className="text-center min-h-screen w-screen box-border p-4 sm:p-10 pt-0">
        <div className="my-4">
          <TeamStatsBlock />
        </div>

        <div className="my-6 sm:my-10 text-center px-4 sm:px-0">
  <h2 className="uppercase text-xl sm:text-2xl md:text-3xl font-Bai_Jamjuree font-bold text-center mb-6">
    A la une sur Mémoire d&apos;Auxerrois
  </h2>
  
  {/* Conteneur principal : Empilé sur mobile, Ligne sur Desktop (lg) */}
  <div className="inline-block bg-white p-4 sm:p-6 w-full max-w-[1300px] shadow-sm">
    <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-6">
      
      {/* Partie Gauche : Dernier Article (60% sur desktop) */}
      <div className="w-full lg:w-[60%]">
        <h3 className="text-xl sm:text-2xl font-semibold mb-4 font-Bai_Jamjuree uppercase text-center lg:text-left w-full">
          Dernier article publié
        </h3>
        <div className="h-full">
          <LastArticle articles={articles} />
        </div>
      </div>

      {/* Partie Droite : Recommandations (40% sur desktop) */}
      <div className="w-full lg:w-[40%]">
        <h3 className="text-xl sm:text-2xl font-semibold mb-4 font-Bai_Jamjuree uppercase text-center lg:text-left w-full">
          Articles que vous pourriez aimer
        </h3>
        <div className="w-full">
          <DisplayRandom articles={articles} />
        </div>
      </div>

    </div>
  </div>
</div>

        <div className="my-10 text-center">
          <Timeline items={TimelineItems} />
        </div>

        <div className="my-10 text-center">
          <h2 className="uppercase text-3xl font-Bai_Jamjuree font-bold text-center">
            Dictons et anecdotes
          </h2>
          <CitationSlider />
        </div>

        <div className="text-center">
          <h2 className="uppercase text-3xl font-Bai_Jamjuree font-bold text-center">
            Découvrez l&apos;AJA
          </h2>
          <PagesTilt />
        </div>

        <div className="my-10">
          <h2 className="uppercase text-3xl font-Bai_Jamjuree font-bold text-center">
            Catégories
          </h2>
          <div>
            <DisplayCategories randomCategories={randomCategories} />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
