"use client"

import React from "react";
import TabUserContent from "./TabUserContent";
import TabArticleContent from "./TabArticleContent";
import TabMethodeContent from "./TabMethodeContent";
import TabCommentContent from "./TabCommentContent";
import { Search } from "lucide-react";
import { Article, Comment, Methodes, TabContentContainerProps, User } from "@/contexts/Interfaces";

export default function TabContentContainer({
  activeMenu,
  searchTerm,
  setSearchTerm,
  users,
  articles,
  methodes,
  comments
}: TabContentContainerProps) {

  return (
    <div className="bg-white p-6 rounded-xl h-full overflow-y-auto w-fit">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-left uppercase font-semibold">Éléments publiés</h3>

        <div className="relative">
          <form onSubmit={(e) => e.preventDefault()}>
            <span>
              <Search
                size={15}
                className="absolute hidden md:block left-3 top-1/2 -translate-y-1/2 text-lg text-gray-600 cursor-pointer"
              />
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-[350px] h-8 rounded-full pl-10 pr-4 text-sm border border-gray-600 font-Montserrat"
              placeholder="Rechercher un élément..."
            />
          </form>
        </div>
      </div>
      {activeMenu === "users" && <TabUserContent searchTerm={searchTerm} users={users as User[]} />}
      {activeMenu === "articles" && (
        <TabArticleContent searchTerm={searchTerm} articles={articles as Article[]} />
      )}
      {activeMenu === "methodeexpert" && (
        <TabMethodeContent searchTerm={searchTerm} methodes={methodes as Methodes[]} />
      )}
      {activeMenu === "comments" && (
        <TabCommentContent searchTerm={searchTerm} comments={comments as Comment[]} />
      )}
    </div>
  );
}
