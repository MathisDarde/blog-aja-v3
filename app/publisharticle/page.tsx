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
      <div className="bg-gray-100 h-full flex flex-col justify-center items-center overflow-x-hidden">
        <h3 className="font-bold text-4xl font-Montserrat uppercase my-10">
          Publication d&apos;un article
        </h3>

        <ArticleForm />
      </div>
    </>
  );
}

export default PublishArticle;
