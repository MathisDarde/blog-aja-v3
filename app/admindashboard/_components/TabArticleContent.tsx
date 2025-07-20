import { EllipsisVertical, Loader2 } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import ContextPopup from "./ContextPopup";
import { ArticleSortKey } from "@/contexts/Interfaces";
import { useGlobalContext } from "@/contexts/GlobalContext";
import { useGettersContext } from "@/contexts/DataGettersContext";

export default function TabArticleContent({
  searchTerm,
}: {
  searchTerm: string;
}) {
  const {
    sortElements,
    openContextPopup,
    DashboardPopupId,
    DashboardPopupPosition,
    DashboardPopupRef,
  } = useGlobalContext();

  const { articles, articlesLoading } = useGettersContext();

  const [sortKey, setSortKey] = useState<ArticleSortKey>("title");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const sortedArticles = sortElements({
    elements: articles,
    sortKey,
    sortOrder,
  });

  const filteredArticles = sortedArticles.filter(
    (article) =>
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.teaser.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      ) ||
      new Date(article.publishedAt)
        .toLocaleDateString("fr-FR")
        .includes(searchTerm)
  );

  const handleSort = (key: ArticleSortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-auto table-auto border border-gray-300">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-3 text-center">Image</th>
            <th
              className="p-3 text-center cursor-pointer"
              onClick={() => handleSort("title")}
            >
              Titre de l&apos;article{" "}
              {sortKey === "title" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th
              className="p-3 text-center cursor-pointer"
              onClick={() => handleSort("state")}
            >
              Statut
              {sortKey === "state" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th
              className="p-3 text-center cursor-pointer"
              onClick={() => handleSort("author")}
            >
              Auteur {sortKey === "author" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th
              className="p-3 text-center cursor-pointer"
              onClick={() => handleSort("publishedAt")}
            >
              Publié le{" "}
              {sortKey === "publishedAt" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th className="p-3 text-center">
              <></>
            </th>
          </tr>
        </thead>
        <tbody>
          {articlesLoading ? (
            <tr>
              <td colSpan={3} className="h-64">
                <div className="flex justify-center items-center h-full">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                  <span className="ml-2 text-gray-600">
                    Chargement des articles...
                  </span>
                </div>
              </td>
            </tr>
          ) : (
            filteredArticles.map((article) => (
              <tr
                key={article.id_article}
                className="bg-white border-t border-gray-200"
              >
                <td className="p-3 flex justify-center items-center w-[75px]">
                  <Image
                    src={article.imageUrl}
                    alt="Bannière de l'article"
                    width={128}
                    height={128}
                    className="object-cover aspect-video"
                  />
                </td>
                <td className="p-3 text-center w-[500px]">
                  <div className="truncate max-w-[500px]">{article.title}</div>
                </td>
                <td className="p-3 text-center w-[350px]">
                  <div className="truncate max-w-[350px]">{article.state}</div>
                </td>
                <td className="p-3 text-center w-[250px]">{article.author}</td>
                <td className="p-3 text-center w-[125px]">
                  {article.publishedAt.toLocaleDateString()}
                </td>
                <td
                  className="p-3 text-center w-[50px] cursor-pointer text-gray-600"
                  onClick={(event: React.MouseEvent) =>
                    openContextPopup({ id: article.id_article, event })
                  }
                >
                  <EllipsisVertical />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {DashboardPopupId && DashboardPopupPosition && (
        <div
          className="absolute z-50"
          style={{
            top: DashboardPopupPosition.top,
            left: DashboardPopupPosition.left,
          }}
          ref={DashboardPopupRef}
        >
          <ContextPopup id={DashboardPopupId} type="article" />
        </div>
      )}
    </div>
  );
}
