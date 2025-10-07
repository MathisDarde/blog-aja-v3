"use client";

import { EllipsisVertical } from "lucide-react";
import Image from "next/image";
import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import ContextPopup from "./ContextPopup";
import { Article, ArticleSortKey } from "@/contexts/Interfaces";
import { useGlobalContext } from "@/contexts/GlobalContext";

export default function TabArticleContent({
  searchTerm,
  articles,
}: {
  searchTerm: string;
  articles: Article[];
}) {
  const { sortElements } = useGlobalContext();
  const [sortKey, setSortKey] = useState<ArticleSortKey>("title");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const [popupPosition, setPopupPosition] = useState<{ top: number; left: number } | null>(null);

  const popupRef = useRef<HTMLDivElement>(null);

  const sortedArticles = sortElements({
    elements: articles,
    sortKey,
    sortOrder,
  });

  const filteredArticles = sortedArticles.filter((article) =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.teaser.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.tags.some((tag) =>
      tag.toLowerCase().includes(searchTerm.toLowerCase())
    ) ||
    new Date(article.createdAt)
      .toLocaleDateString("fr-FR")
      .includes(searchTerm)
  );

  const handleSort = (key: ArticleSortKey) => {
    if (sortKey === key) setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const handleOpenPopup = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    setSelectedArticleId((prev) => (prev === id ? null : id));
    setPopupPosition({
      top: rect.bottom + window.scrollY,
      left: rect.left + window.scrollX,
    });
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setSelectedArticleId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedArticle = articles.find((a) => a.id_article === selectedArticleId);

  return (
    <div className="overflow-x-auto relative">
      <table className="w-auto table-auto border border-gray-300">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-3 text-center w-[75px]">Image</th>
            <th className="p-3 text-center cursor-pointer w-[500px]" onClick={() => handleSort("title")}>
              Titre {sortKey === "title" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th className="p-3 text-center cursor-pointer w-[350px]" onClick={() => handleSort("state")}>
              Statut {sortKey === "state" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th className="p-3 text-center cursor-pointer w-[250px]" onClick={() => handleSort("author")}>
              Auteur {sortKey === "author" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th className="p-3 text-center cursor-pointer w-[125px]" onClick={() => handleSort("createdAt")}>
              Publié le {sortKey === "createdAt" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th className="p-3 text-center w-[50px]"></th>
          </tr>
        </thead>
        <tbody>
          {filteredArticles.length > 0 ? (
            filteredArticles.map((article) => (
              <tr key={article.id_article} className="bg-white border-t border-gray-200">
                <td className="p-3 flex justify-center items-center w-[75px]">
                  <Image
                    src={article.imageUrl || "/_assets/img/pdpdebase.png"}
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
                  {article.createdAt.toLocaleDateString()}
                </td>
                <td className="p-3 text-center w-[50px] cursor-pointer text-gray-600"
                  onClick={(e) => handleOpenPopup(article.id_article, e)}>
                  <EllipsisVertical />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="p-3 text-center text-gray-500">
                Aucun article ne correspond.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {selectedArticle && popupPosition &&
        createPortal(
          <div ref={popupRef} className="absolute z-50" style={{ top: popupPosition.top, left: popupPosition.left }}>
            <ContextPopup id={selectedArticle.id_article} type="article" state={selectedArticle.state} />
          </div>,
          document.body
        )}
    </div>
  );
}
