"use client";

import {
  ChevronLeft,
  ChevronRight,
  EllipsisVertical,
  Star,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import ContextPopup from "./ContextPopup";
import { Comment, CommentSortKey } from "@/contexts/Interfaces";
import { useGlobalContext } from "@/contexts/GlobalContext";
import { createPortal } from "react-dom";

export default function TabCommentContent({
  searchTerm,
  comments,
}: {
  searchTerm: string;
  comments: Comment[];
}) {
  const { sortElements } = useGlobalContext();

  const [sortKey, setSortKey] = useState<CommentSortKey>("title");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [selectedCommentId, setSelectedCommentId] = useState<string | null>(
    null
  );
  const [popupPosition, setPopupPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageInput, setPageInput] = useState("1");
  const itemsPerPage = 10;

  const popupRef = useRef<HTMLDivElement>(null);

  const sortedComments = sortElements({
    elements: comments,
    sortKey,
    sortOrder,
  });

  const filteredComments = sortedComments.filter(
    (comment) =>
      comment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.pseudo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(comment.stars).toLowerCase().includes(searchTerm.toLowerCase()) ||
      new Date(comment.createdAt)
        .toLocaleDateString("fr-FR")
        .includes(searchTerm)
  );

  const handleSort = (key: CommentSortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const handleOpenPopup = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();

    const popupWidth = 220; // largeur estimée de la popup, ajuste selon ton design

    // Position de base : coin supérieur droit du bouton cliqué
    const top = rect.bottom + window.scrollY + 4; // petit espace (4px)
    let left = rect.right + window.scrollX - popupWidth;

    // ✅ Empêche la popup de sortir à droite
    const maxLeft = window.innerWidth - popupWidth - 8;
    if (left > maxLeft) left = maxLeft;

    // ✅ Empêche la popup de sortir à gauche
    if (left < 8) left = 8;

    setSelectedCommentId((prev) => (prev === id ? null : id));
    setPopupPosition({ top, left });
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        setSelectedCommentId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedComment = comments.find(
    (a) => a.id_comment === selectedCommentId
  );

  const totalPages = Math.ceil(filteredComments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedComments = filteredComments.slice(startIndex, endIndex);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      setPageInput(String(newPage));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPageInput(e.target.value);
  };

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
            <th
              className="p-3 text-center cursor-pointer w-[250px]"
              onClick={() => handleSort("title")}
            >
              Titre {sortKey === "title" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th className="p-3 text-center w-[350px]">Contenu</th>
            <th
              className="p-3 text-center cursor-pointer w-[150px]"
              onClick={() => handleSort("stars")}
            >
              Note {sortKey === "stars" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th
              className="p-3 text-center cursor-pointer w-[200px]"
              onClick={() => handleSort("pseudo")}
            >
              Pseudo {sortKey === "pseudo" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th
              className="p-3 text-center cursor-pointer w-[150px]"
              onClick={() => handleSort("createdAt")}
            >
              Publié le{" "}
              {sortKey === "createdAt" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th
              className="p-3 text-center cursor-pointer w-[150px]"
              onClick={() => handleSort("updatedAt")}
            >
              MAJ le{" "}
              {sortKey === "updatedAt" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th className="p-3 text-center w-[50px]">
              <></>
            </th>
          </tr>
        </thead>
        <tbody>
          {paginatedComments.length > 0 ? (
            paginatedComments.map((comment) => (
              <tr
                key={comment.id_comment}
                className="bg-white border-t border-gray-200"
              >
                <td className="p-3 text-center w-[250px]">
                  <div className="truncate max-w-[250px]">{comment.title}</div>
                </td>
                <td className="p-3 text-center w-[350px]">
                  <div className="truncate max-w-[350px]">
                    {comment.content}
                  </div>
                </td>
                <td className="p-3 text-center w-[150px]">
                  <div className="flex justify-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={24}
                        fill={i < comment.stars ? "#facc15" : "none"}
                        stroke="#facc15"
                      />
                    ))}
                  </div>
                </td>
                <td className="p-3 text-center w-[200px]">
                  <div className="truncate max-w-[200px]">{comment.pseudo}</div>
                </td>
                <td className="p-3 text-center w-[150px]">
                  {comment.createdAt.toLocaleDateString()}
                </td>
                <td className="p-3 text-center w-[150px]">
                  {comment.updatedAt.toLocaleDateString()}
                </td>
                <td
                  className="p-3 text-center w-[50px] cursor-pointer text-gray-600"
                  onClick={(e) => handleOpenPopup(comment.id_comment, e)}
                >
                  <EllipsisVertical />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="p-3 text-center text-gray-500">
                Aucun commentaire ne correspond.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* PAGINATION */}
      {filteredComments.length > 0 && (
        <div className="flex items-center justify-start md:justify-center gap-4 my-4">
          {/* Bouton précédent */}
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-2 md:px-3 py-1 rounded-md border flex items-center gap-1 ${
              currentPage === 1
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-aja-blue text-white hover:bg-orange-third transition-colors"
            }`}
          >
            <ChevronLeft />{" "}
            <span className="hidden md:block text-sm">Précédent</span>
          </button>

          {/* Input de page */}
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

          {/* Bouton suivant */}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-2 md:px-3 py-1 rounded-md border flex items-center gap-1 ${
              currentPage === totalPages
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-aja-blue text-white hover:bg-orange-third transition-colors"
            }`}
          >
            <span className="hidden md:block text-sm">Suivant</span>
            <ChevronRight />
          </button>
        </div>
      )}

      {selectedComment &&
        popupPosition &&
        createPortal(
          <div
            ref={popupRef}
            className="absolute z-50"
            style={{
              top: popupPosition.top,
              left: popupPosition.left,
              maxWidth: "calc(100vw - 16px)",
            }}
          >
            <ContextPopup id={selectedComment.id_comment} type="comment" />
          </div>,
          document.body
        )}
    </div>
  );
}
