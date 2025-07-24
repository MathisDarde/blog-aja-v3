import React from "react";
import ArticleForm from "./_components/ArticleForm";

function PublishArticle() {
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
