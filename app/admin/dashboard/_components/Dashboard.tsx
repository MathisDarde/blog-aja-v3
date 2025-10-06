"use client";

import React, { useState } from "react";
import { Article, Comment, Methodes, User } from "@/contexts/Interfaces";
import TabContentContainer from "./TabContentContainer";

export default function Dashboard({
  users,
  articles,
  methodes,
  comments,
}: {
  users: User[];
  articles: Article[];
  methodes: Methodes[];
  comments: Comment[];
}) {
  const nbUsers = users.length;
  const nbArticles = articles.length;

  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="font-Montserrat flex max-w-[1300px] mx-auto flex-col h-[calc(100vh-68px)] p-10">
      <div className="flex flex-row justify-between items-center mb-10">
        <div className="bg-white w-[500px] rounded-xl px-10 py-12">
          <h2 className="text-center font-bold text-2xl uppercase">
            Nombre total d&apos;articles publiés
          </h2>
          <h2 className="text-center font-extrabold text-7xl">{nbArticles}</h2>
        </div>
        <div className="bg-white w-[500px] rounded-xl py-12">
          <h2 className="text-center font-bold text-2xl uppercase">
            Nombre total d&apos;utilisateurs inscris
          </h2>
          <h2 className="text-center font-extrabold text-7xl">{nbUsers}</h2>
        </div>
      </div>

      <div className="overflow-hidden w-full pb-10">
        <TabContentContainer
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          users={users}
          articles={articles}
          methodes={methodes}
          comments={comments}
        />
      </div>
    </div>
  );
}
