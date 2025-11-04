"use client";

import { ChevronLeft, ChevronRight, EllipsisVertical } from "lucide-react";
import Image from "next/image";
import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import ContextPopup from "./ContextPopup";
import { Article, ArticleSortKey } from "@/contexts/Interfaces";
import { useGlobalContext } from "@/contexts/GlobalContext";
import Skeleton from "@/components/CustomSkeleton";

export default function TabArticleContent({
  searchTerm,
  articles,
  isLoading,
}: {
  searchTerm: string;
  articles: Article[];
  isLoading: boolean;
}) {
  const { sortElements } = useGlobalContext();
  const [sortKey, setSortKey] = useState<ArticleSortKey>("title");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const [popupPosition, setPopupPosition] = useState<{ top: number; left: number } | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageInput, setPageInput] = useState("1");
  const itemsPerPage = 10;

  const popupRef = useRef<HTMLDivElement>(null);

  const sortedArticles = sortElements({ elements: articles, sortKey, sortOrder });

  const filteredArticles = sortedArticles.filter(
    (article) =>
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.teaser.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
      new Date(article.createdAt).toLocaleDateString("fr-FR").includes(searchTerm)
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
    const popupWidth = 220;
    const top = rect.bottom + window.scrollY + 4;
    let left = rect.right + window.scrollX - popupWidth;
    const maxLeft = window.innerWidth - popupWidth - 8;
    if (left > maxLeft) left = maxLeft;
    if (left < 8) left = 8;

    setSelectedArticleId((prev) => (prev === id ? null : id));
    setPopupPosition({ top, left });
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

  const totalPages = Math.ceil(filteredArticles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedArticles = filteredArticles.slice(startIndex, endIndex);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      setPageInput(String(newPage));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => setPageInput(e.target.value);
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const newPage = parseInt(pageInput, 10);
      if (!isNaN(newPage)) handlePageChange(newPage);
    }
  };

  return (
    <div className="w-full overflow-x-auto">
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
            <th className="p-3 text-center cursor-pointer w-[125px]" onClick={() => handleSort("updatedAt")}>
              MAJ le {sortKey === "updatedAt" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th className="p-3 text-center w-[50px]"></th>
          </tr>
        </thead>
        <tbody>
          {isLoading
            ? Array.from({ length: 10 }).map((_, idx) => (
                <tr key={idx} className="bg-white border-t border-gray-200">
                  <td className="p-3 flex justify-center items-center w-[75px]">
                    <Skeleton height="40px" width="40px" animated />
                  </td>
                  <td className="p-3 text-center w-[500px]">
                    <Skeleton height="20px" width="250px" animated />
                  </td>
                  <td className="p-3 text-center w-[350px]">
                    <Skeleton height="20px" width="150px" animated />
                  </td>
                  <td className="p-3 text-center w-[250px]">
                    <Skeleton height="20px" width="120px" animated />
                  </td>
                  <td className="p-3 text-center w-[125px]">
                    <Skeleton height="20px" width="80px" animated />
                  </td>
                  <td className="p-3 text-center w-[125px]">
                    <Skeleton height="20px" width="80px" animated />
                  </td>
                  <td className="p-3 text-center w-[50px]">
                    <Skeleton height="20px" width="20px" animated />
                  </td>
                </tr>
              ))
            : paginatedArticles.length > 0
            ? paginatedArticles.map((article) => (
                <tr key={article.id_article} className="bg-white border-t border-gray-200">
                  <td className="p-3 flex justify-center items-center w-[75px]">
                    <Image
                      src={article.imageUrl || "/_assets/img/defaultarticlebanner.png"}
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
                  <td className="p-3 text-center w-[125px]">
                    {article.updatedAt.toLocaleDateString()}
                  </td>
                  <td
                    className="p-3 text-center w-[50px] cursor-pointer text-gray-600"
                    onClick={(e) => handleOpenPopup(article.id_article, e)}
                  >
                    <EllipsisVertical />
                  </td>
                </tr>
              ))
            : (
                <tr>
                  <td colSpan={7} className="p-3 text-center text-gray-500">
                    Aucun article ne correspond.
                  </td>
                </tr>
              )}
        </tbody>
      </table>

      {/* Pagination */}
      {!isLoading && filteredArticles.length > 0 && (
        <div className="flex items-center justify-start md:justify-center gap-4 my-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-2 md:px-3 py-1 rounded-md border flex items-center gap-1 ${
              currentPage === 1 ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-aja-blue text-white hover:bg-orange-third transition-colors"
            }`}
          >
            <ChevronLeft /> <span className="hidden md:block text-sm">Précédent</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="hidden sm:block text-sm">Page</span>
            <input
              type="number"
              min={1}
              max={totalPages}
              value={pageInput}
              onChange={handleInputChange}
              onKeyDown={handleInputKeyDown}
              className="w-12 text-center border rounded-md text-sm py-1"
            />
            <span className="text-sm">sur {totalPages}</span>
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-2 md:px-3 py-1 rounded-md border flex items-center gap-1 ${
              currentPage === totalPages ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-aja-blue text-white hover:bg-orange-third transition-colors"
            }`}
          >
            <span className="hidden md:block text-sm">Suivant</span>
            <ChevronRight />
          </button>
        </div>
      )}

      {selectedArticle && popupPosition &&
        createPortal(
          <div
            ref={popupRef}
            className="absolute z-50"
            style={{ top: popupPosition.top, left: popupPosition.left, maxWidth: "calc(100vw - 16px)" }}
          >
            <ContextPopup id={selectedArticle.id_article} type="article" state={selectedArticle.state} />
          </div>,
          document.body
        )}
    </div>
  );
}
