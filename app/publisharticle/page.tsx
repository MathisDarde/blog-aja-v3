"use client";

import React, { useEffect, useState } from "react";
import ArticleForm from "./_components/ArticleForm";
import Sidebar from "@/components/Sidebar";
import SidebarResp from "@/components/SidebarResp";

function PublishArticle() {
  useEffect(() => {
    document.title = "Mémoire d'Auxerrois";

    if (!document.getElementById("favicon")) {
      const link = document.createElement("link");
      link.id = "favicon";
      link.rel = "icon";
      link.href = "/assets/teamlogos/logoauxerre.svg";
      document.head.appendChild(link);
    }
  }, []);

  const [sidebarState, setSidebarState] = useState(0);

  const toggleSidebar = () => {
    setSidebarState((prevState) => (prevState === 0 ? 1 : 0));
  };
  return (
    <>
      <div className="bg-gray-100 h-full flex flex-col justify-center items-center">
        {sidebarState === 0 ? (
          <SidebarResp onToggle={toggleSidebar} />
        ) : (
          <Sidebar onToggle={toggleSidebar} />
        )}

        <div className="ml-24">
          <h3 className="font-bold text-4xl font-Montserrat uppercase my-10">
            Publication d'un article
          </h3>

          <ArticleForm />
        </div>
      </div>
    </>
  );
}

export default PublishArticle;
