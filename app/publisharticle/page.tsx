"use client";

import React, { useEffect } from "react";
import ArticleForm from "./_components/ArticleForm";

function PublishArticle() {
  useEffect(() => {
    document.title = "Je publie un article - Mémoire d'Auxerrois";

    if (!document.getElementById("favicon")) {
      const link = document.createElement("link");
      link.id = "favicon";
      link.rel = "icon";
      link.href = "/_assets/teamlogos/logoauxerre.svg";
      document.head.appendChild(link);
    }
  }, []);
  return (
    <>
      <div className="text-center bg-gray-100 min-h-screen w-screen box-border p-10">
        <h1 className="text-center font-Bai_Jamjuree text-4xl font-bold uppercase mb-10">
          Publier un article
        </h1>

        <ArticleForm />
      </div>
    </>
  );
}

export default PublishArticle;
