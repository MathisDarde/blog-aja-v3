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

        <div className="my-10 text-center">
          <h2 className="uppercase text-2xl sm:text-3xl font-Bai_Jamjuree font-bold text-center">
            A la une sur Mémoire d&apos;Auxerrois
          </h2>
          <div className="inline-block bg-white p-6 my-10 max-w-[1300px]">
            <div className="flex items-start gap-6">
              <div className="flex-[3]">
                <h3 className="text-2xl font-semibold mb-3 font-Bai_Jamjuree uppercase text-center w-full">
                  Dernier article publié
                </h3>
                <div className="h-full">
                  <LastArticle articles={articles} />
                </div>
              </div>

              <div className="flex-[2]">
                <h3 className="text-2xl font-semibold mb-3 font-Bai_Jamjuree uppercase text-center w-full">
                  Articles que vous pourriez aimer
                </h3>
                <div className="flex items-center justify-center">
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
