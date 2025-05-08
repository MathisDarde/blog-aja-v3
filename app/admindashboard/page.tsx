"use client";

import React, { useEffect, useState } from "react";
import DashboardSidebar from "./_components/DashboardSidebar";
import TabContentContainer from "./_components/TabContentContainer";
import getUsersInfos from "@/actions/dashboard/get-users-infos";
import getArticlesInfos from "@/actions/dashboard/get-articles-infos";

export default function Dashboard() {
  const [activeMenu, setActiveMenu] = useState("users");
  const [nbUsers, setNbUsers] = useState(0);
  const [nbArticles, setNbArticles] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const users = await getUsersInfos();
      const articles = await getArticlesInfos();

      if (Array.isArray(users)) {
        setNbUsers(users.length);
      }

      if (Array.isArray(articles)) {
        setNbArticles(articles.length);
      }
    };

    fetchData();
  }, []);

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
            <TabContentContainer activeMenu={activeMenu} />
          </div>
        </div>
      </div>
    </div>
  );
}
