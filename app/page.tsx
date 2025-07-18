"use client";

import "./globals.css";
import LastArticle from "@/components/LastPublished";
import DisplayRandom from "@/components/DisplayThreeRandomArticles";
import DisplayCategories from "@/components/DisplayCategories";
import Footer from "@/components/Footer";
import React, { useEffect } from "react";
import Classement from "@/components/Classement";
import Carousel from "@/components/carousel/Carousel";
import TeamStatsBlock from "@/components/teamstatshomepage/TeamStatsBlock";

export default function Page() {
  useEffect(() => {
    document.title = "Accueil - Mémoire d'Auxerrois";

    if (!document.getElementById("favicon")) {
      const link = document.createElement("link");
      link.id = "favicon";
      link.rel = "icon";
      link.href = "/_assets/teamlogos/logoauxerre.svg";
      document.head.appendChild(link);
    }
  }, []);

  return (
    <div className="bg-gray-100 h-full w-full p-0 m-0 box-border ">
      <div className="pb-3">
        <Carousel />
      </div>

      <div className="my-4">
        <TeamStatsBlock />
      </div>

      <div className="my-10 text-center">
        <h2 className="uppercase text-3xl font-Bai_Jamjuree font-bold text-center">
          A la une sur Mémoire d&apos;Auxerrois
        </h2>
        <div className="inline-block bg-white rounded-xl shadow-xl p-6 my-10 w-[1300px]">
          <div className="flex items-center">
            <h3 className="text-2xl font-semibold mb-3 font-Bai_Jamjuree uppercase text-center w-[75%]">
              Dernier article publié
            </h3>
            <h3 className="text-xl font-semibold mb-3 font-Bai_Jamjuree uppercase text-center w-[25%] ml-auto">
              Articles que vous pourriez aimer
            </h3>
          </div>
          <div className="inline-flex gap-6">
            <div className="w-[75%]">
              <LastArticle />
            </div>
            <div className="flex flex-col items-center justify-center w-[25%]">
              <DisplayRandom />
            </div>
          </div>
        </div>
      </div>

      <div className="my-10">
        <h2 className="uppercase text-3xl font-Bai_Jamjuree font-bold text-center">
          Catégories
        </h2>
        <div>
          <DisplayCategories />
        </div>
      </div>

      <div className="my-10">
        <h2 className="uppercase text-3xl font-Bai_Jamjuree font-bold text-center">
          Classement Ligue 1
        </h2>
        <div>
          <Classement />
        </div>
      </div>

      <Footer />
    </div>
  );
}
