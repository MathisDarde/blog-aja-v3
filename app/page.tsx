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

export default async function Page() {
  const articles = await getArticles();
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

  const randomCategories = getRandomCategories(categories, 4);

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
          <div className="inline-block bg-white rounded-xl shadow-xl p-6 my-10 max-w-[1000px]">
            <h3 className="text-2xl font-semibold mb-3 font-Bai_Jamjuree uppercase text-center w-full">
              Dernier article publié
            </h3>
            <div className="w-full">
              <LastArticle articles={articles} />
            </div>

            {/* Responsive bloc duplicated to move place */}
            <div className="flex items-center justify-center mt-4">
              <h3 className="block lg:hidden text-2xl font-semibold mb-3 font-Bai_Jamjuree uppercase text-center w-full">
                Articles que vous pourriez aimer
              </h3>
            </div>
            <div className="flex gap-6 w-full">
              <div className="flex lg:hidden items-center justify-center">
                <DisplayRandom articles={articles} />
              </div>
            </div>
          </div>
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
