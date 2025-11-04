"use client";

import React, { useEffect, useRef, useState } from "react";
import TabUserContent from "./TabUserContent";
import TabArticleContent from "./TabArticleContent";
import TabMethodeContent from "./TabMethodeContent";
import TabCommentContent from "./TabCommentContent";
import { ChevronDown, Search } from "lucide-react";
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
  isLoading,
}: TabContentContainerProps) {
  const [activeMenu, setActiveMenu] = useState("users");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const menuItems = [
    { key: "users", label: "Utilisateurs" },
    { key: "articles", label: "Articles" },
    { key: "methodes", label: "Méthodes expert" },
    { key: "comments", label: "Commentaires" },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="bg-white p-6 rounded-xl h-full w-full">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-4">
        <div className="hidden lg:flex items-center gap-8">
          {menuItems.map((item) => (
            <p
              key={item.key}
              className={`cursor-pointer transition-all ${activeMenu === item.key
                  ? "border-b-2 border-aja-blue font-semibold"
                  : "border-b-2 border-transparent hover:border-aja-blue/40"
                }`}
              onClick={() => setActiveMenu(item.key)}
            >
              {item.label}
            </p>
          ))}
        </div>

        <div ref={dropdownRef} className="lg:hidden relative w-[200px]">
          <button
            className="w-full flex justify-between items-center border border-gray-300 rounded-md px-4 py-2 bg-white shadow-sm"
            onClick={() => setIsOpen(!isOpen)}
          >
            <span className="mr-2 text-sm sm:text-base">
              {menuItems.find((m) => m.key === activeMenu)?.label || "Menu"}
            </span>
            <ChevronDown
              className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""
                }`}
            />
          </button>

          {isOpen && (
            <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-200 rounded-md shadow-lg z-10">
              {menuItems.map((item) => (
                <div
                  key={item.key}
                  onClick={() => {
                    setActiveMenu(item.key);
                    setIsOpen(false);
                  }}
                  className={`px-4 py-2 cursor-pointer text-sm sm:text-base hover:bg-gray-100 ${activeMenu === item.key ? "font-semibold text-aja-blue" : ""
                    }`}
                >
                  {item.label}
                </div>
              ))}
            </div>
          )}
        </div>

          <form onSubmit={(e) => e.preventDefault()} className="md:max-w-[350px] w-full relative">
            <span>
              <Search
                size={15}
                className="absolute block left-3 top-1/2 -translate-y-1/2 text-lg text-gray-600 cursor-pointer"
              />
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-8 rounded-full pl-10 pr-4 text-xs sm:text-sm border border-gray-600 font-Montserrat"
              placeholder="Rechercher un élément..."
            />
          </form>
        </div>
      {activeMenu === "users" && (
        <TabUserContent searchTerm={searchTerm} users={users as User[]} isLoading={isLoading} />
      )}
      {activeMenu === "articles" && (
        <TabArticleContent
          searchTerm={searchTerm}
          articles={articles as Article[]}
          isLoading={isLoading}
        />
      )}
      {activeMenu === "methodes" && (
        <TabMethodeContent
          searchTerm={searchTerm}
          methodes={methodes as Methodes[]}
          isLoading={isLoading}
        />
      )}
      {activeMenu === "comments" && (
        <TabCommentContent
          searchTerm={searchTerm}
          comments={comments as Comment[]}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}
