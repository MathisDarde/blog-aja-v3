import React, { useState } from "react";
import TabUserContent from "./TabUserContent";
import TabArticleContent from "./TabArticleContent";
import TabMethodeContent from "./TabMethodeContent";
import TabCommentContent from "./TabCommentContent";
import { Search } from "lucide-react";
import { TabContentContainerProps } from "@/contexts/Interfaces";

export default function TabContentContainer({
  activeMenu,
}: TabContentContainerProps) {
  const [searchTerm, setSearchTerm] = useState("");

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
      {activeMenu === "users" && <TabUserContent searchTerm={searchTerm} />}
      {activeMenu === "articles" && (
        <TabArticleContent searchTerm={searchTerm} />
      )}
      {activeMenu === "methodeexpert" && (
        <TabMethodeContent searchTerm={searchTerm} />
      )}
      {activeMenu === "comments" && (
        <TabCommentContent searchTerm={searchTerm} />
      )}
    </div>
  );
}
