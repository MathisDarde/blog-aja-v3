import React from "react";
import TabUserContent from "./TabUserContent";
import TabArticleContent from "./TabArticleContent";
import TabMethodeContent from "./TabMethodeContent";
import TabCommentContent from "./TabCommentContent";

interface TabContentContainerProps {
  activeMenu: string;
}

export default function TabContentContainer({
  activeMenu,
}: TabContentContainerProps) {
  return (
    <div className="bg-white p-6 rounded-xl h-full overflow-y-auto w-fit">
      <h3 className="text-left uppercase font-semibold mb-4">
        Éléments publiés
      </h3>
      {activeMenu === "users" && <TabUserContent />}
      {activeMenu === "articles" && <TabArticleContent />}
      {activeMenu === "methodeexpert" && <TabMethodeContent />}
      {activeMenu === "comments" && <TabCommentContent />}
    </div>
  );
}
