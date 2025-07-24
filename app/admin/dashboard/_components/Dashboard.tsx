"use client";

import React, { useState } from "react";
import { useGlobalContext } from "@/contexts/GlobalContext";
import { Article, Comment, Methodes, User } from "@/contexts/Interfaces";
import DashboardSidebar from "./DashboardSidebar";
import TabContentContainer from "./TabContentContainer";

export default function Dashboard({ users, articles, methodes, comments } : { users: User[], articles: Article[], methodes : Methodes[], comments: Comment[]}) {
  const { activeMenu, setActiveMenu } = useGlobalContext();

const nbUsers = users.length;
const nbArticles = articles.length;

  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="text-center bg-gray-100 h-[calc(100vh-68px)] w-screen box-border overflow-y-hidden">
      <div className="flex flex-row gap-10">
        <div className="font-Montserrat w-[250px] h-[calc(100vh-68px)] bg-white flex justify-center items-center">
          <DashboardSidebar
            onMenuClick={setActiveMenu}
            activeMenu={activeMenu}
          />
        </div>
        <div className="font-Montserrat flex flex-col h-[calc(100vh-68px)]">
          <div className="flex flex-row justify-between items-center my-10">
            <div className="bg-white w-[500px] rounded-xl px-10 py-12">
              <h2 className="text-center font-bold text-2xl uppercase">
                Nombre total d&apos;articles publiés
              </h2>
              <h2 className="text-center font-extrabold text-7xl">
                {nbArticles}
              </h2>
            </div>
            <div className="bg-white w-[500px] rounded-xl py-12">
              <h2 className="text-center font-bold text-2xl uppercase">
                Nombre total d&apos;utilisateurs inscris
              </h2>
              <h2 className="text-center font-extrabold text-7xl">{nbUsers}</h2>
            </div>
          </div>

          <div className="overflow-hidden pb-10">
            <TabContentContainer activeMenu={activeMenu} searchTerm={searchTerm} setSearchTerm={setSearchTerm} users={users} articles={articles} methodes={methodes} comments={comments} />
          </div>
        </div>
      </div>
    </div>
  );
}
