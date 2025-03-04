"use client";

import "./globals.css";
import SidebarResp from "@/components/SidebarResp";
import Sidebar from "@/components/Sidebar";
import Calendrier from "@/components/Calendrier";
import LastArticle from "@/components/LastPublished";
import DisplayRandom from "@/components/DisplayThreeRandomArticles";
import DisplayCategories from "@/components/DisplayCategories";
import Footer from "@/components/Footer";
import Link from "next/link";
import React, { useState } from "react";

export default function Page() {
  const [sidebarState, setSidebarState] = useState(0);

  const toggleSidebar = () => {
    setSidebarState((prevState) => (prevState === 0 ? 1 : 0));
  };

  return (
    <div className="bg-gray-100 h-full w-full p-0 m-0 box-border ">
      {sidebarState === 0 ? (
        <SidebarResp onToggle={toggleSidebar} />
      ) : (
        <Sidebar onToggle={toggleSidebar} />
      )}

      <div className="ml-24">
        <Link href="/">
          <h1 className="text-5xl text-center font-title italic uppercase font-bold text-aja-blue py-10 font-Bai_Jamjuree">
            Mémoire d&apos;Auxerrois
          </h1>
        </Link>

        <div className="">
          <Calendrier />
        </div>

        <div className="my-10 text-center">
          <h2 className="uppercase text-3xl font-Montserrat font-bold text-center">
            A la une sur Mémoire d&apos;Auxerrois
          </h2>
          <div className="inline-block bg-white rounded-xl shadow-xl p-6 my-10">
            <div className="flex items-center">
              <h3 className="text-2xl font-bold mb-3 font-Montserrat uppercase text-center w-[750px]">
                Dernier article publié
              </h3>
              <h3 className="text-lg font-bold mb-3 font-Montserrat uppercase text-center w-[250px] ml-auto">
                Articles que vous pourriez aimer
              </h3>
            </div>
            <div className="inline-flex gap-6">
              <div className="w-[750px]">
                <LastArticle />
              </div>
              <div className="flex flex-col items-center justify-center w-[250px]">
                <DisplayRandom />
              </div>
            </div>
          </div>
        </div>

        <div>
          <h2 className="uppercase text-3xl font-Montserrat font-bold text-center">
            Catégories
          </h2>
          <div>
            <DisplayCategories />
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}
