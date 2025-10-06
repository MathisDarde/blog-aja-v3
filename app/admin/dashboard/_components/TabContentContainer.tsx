"use client";

import React, { useState } from "react";
import TabUserContent from "./TabUserContent";
import TabArticleContent from "./TabArticleContent";
import TabMethodeContent from "./TabMethodeContent";
import TabCommentContent from "./TabCommentContent";
import { Search } from "lucide-react";
import {
  Article,
  Comment,
  Methodes,
  TabContentContainerProps,
  User,
} from "@/contexts/Interfaces";

export default function TabContentContainer({
  searchTerm,
  setSearchTerm,
  users,
  articles,
  methodes,
  comments,
}: TabContentContainerProps) {
  const [activeMenu, setActiveMenu] = useState("users");

  return (
    <div className="bg-white p-6 rounded-xl h-full overflow-y-auto w-full">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-10">
          <p
            className={`cursor-pointer ${
              activeMenu === "users"
                ? "border-b-2 border-aja-blue font-semibold"
                : ""
            }`}
            onClick={() => setActiveMenu("users")}
          >
            Utilisateurs
          </p>
          <p
            className={`cursor-pointer ${
              activeMenu === "articles"
                ? "border-b-2 border-aja-blue font-semibold"
                : ""
            }`}
            onClick={() => setActiveMenu("articles")}
          >
            Articles
          </p>
          <p
            className={`cursor-pointer ${
              activeMenu === "methodes"
                ? "border-b-2 border-aja-blue font-semibold"
                : ""
            }`}
            onClick={() => setActiveMenu("methodes")}
          >
            Méthodes expert
          </p>
          <p
            className={`cursor-pointer ${
              activeMenu === "comments"
                ? "border-b-2 border-aja-blue font-semibold"
                : ""
            }`}
            onClick={() => setActiveMenu("comments")}
          >
            Commentaires
          </p>
        </div>

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
      {activeMenu === "users" && (
        <TabUserContent searchTerm={searchTerm} users={users as User[]} />
      )}
      {activeMenu === "articles" && (
        <TabArticleContent
          searchTerm={searchTerm}
          articles={articles as Article[]}
        />
      )}
      {activeMenu === "methodes" && (
        <TabMethodeContent
          searchTerm={searchTerm}
          methodes={methodes as Methodes[]}
        />
      )}
      {activeMenu === "comments" && (
        <TabCommentContent
          searchTerm={searchTerm}
          comments={comments as Comment[]}
        />
      )}
    </div>
  );
}
