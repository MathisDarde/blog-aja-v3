"use client";

import { ChevronLeft, ChevronRight, EllipsisVertical, EyeOff, Flag, Star } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import ContextPopup from "./ContextPopup";
import { Comment, CommentSortKey } from "@/contexts/Interfaces";
import { useGlobalContext } from "@/contexts/GlobalContext";
import { createPortal } from "react-dom";
import Skeleton from "@/components/CustomSkeleton";
import type { CommentReportReason } from "@/db/schema";

const REASON_LABELS: Record<CommentReportReason, string> = {
  spam: "spam",
  insulte: "insultes",
  "hors-sujet": "hors sujet",
  autre: "autre",
};

type ModerationFilter = "all" | "reported" | "hidden";

export default function TabCommentContent({
  searchTerm,
  comments,
  isLoading,
}: {
  searchTerm: string;
  comments: Comment[];
  isLoading: boolean;
}) {
  const { sortElements } = useGlobalContext();
  // Les commentaires signalés remontent en premier
  const [sortKey, setSortKey] = useState<CommentSortKey>("reportsCount");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [moderationFilter, setModerationFilter] = useState<ModerationFilter>("all");
  const [selectedCommentId, setSelectedCommentId] = useState<string | null>(null);
  const [popupPosition, setPopupPosition] = useState<{ top: number; left: number } | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageInput, setPageInput] = useState("1");
  const itemsPerPage = 10;

  const popupRef = useRef<HTMLDivElement>(null);

  const sortedComments = sortElements({ elements: comments, sortKey, sortOrder });

  const reportedCount = comments.filter((c) => (c.reportsCount ?? 0) > 0).length;
  const hiddenCount = comments.filter((c) => c.hidden).length;

  const filteredComments = sortedComments.filter(
    (comment) =>
      (moderationFilter === "all" ||
        (moderationFilter === "reported" && (comment.reportsCount ?? 0) > 0) ||
        (moderationFilter === "hidden" && comment.hidden)) &&
      (comment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.pseudo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(comment.stars).toLowerCase().includes(searchTerm.toLowerCase()) ||
      new Date(comment.createdAt).toLocaleDateString("fr-FR").includes(searchTerm))
  );

  const changeModerationFilter = (filter: ModerationFilter) => {
    setModerationFilter(filter);
    setCurrentPage(1);
    setPageInput("1");
  };

  const handleSort = (key: CommentSortKey) => {
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

    setSelectedCommentId((prev) => (prev === id ? null : id));
    setPopupPosition({ top, left });
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setSelectedCommentId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedComment = comments.find((c) => c.id_comment === selectedCommentId);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => setPageInput(e.target.value);
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const newPage = parseInt(pageInput, 10);
      if (!isNaN(newPage)) handlePageChange(newPage);
    }
  };

  return (
    <div className="w-full overflow-x-auto">
      <div className="flex flex-wrap gap-2 mb-4 text-sm">
        {(
          [
            ["all", `Tous (${comments.length})`],
            ["reported", `Signalés (${reportedCount})`],
            ["hidden", `Masqués (${hiddenCount})`],
          ] as const
        ).map(([filter, label]) => (
          <button
            key={filter}
            type="button"
            onClick={() => changeModerationFilter(filter)}
            className={`px-3 py-1 rounded-full border transition-colors ${
              moderationFilter === filter
                ? "bg-aja-blue text-white border-aja-blue"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <table className="w-auto table-auto border border-gray-300">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-3 text-center cursor-pointer w-[250px]" onClick={() => handleSort("title")}>
              Titre {sortKey === "title" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th className="p-3 text-center w-[350px]">Contenu</th>
            <th className="p-3 text-center cursor-pointer w-[150px]" onClick={() => handleSort("stars")}>
              Note {sortKey === "stars" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th className="p-3 text-center cursor-pointer w-[200px]" onClick={() => handleSort("pseudo")}>
              Pseudo {sortKey === "pseudo" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th className="p-3 text-center cursor-pointer w-[180px]" onClick={() => handleSort("reportsCount")}>
              Modération {sortKey === "reportsCount" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th className="p-3 text-center cursor-pointer w-[150px]" onClick={() => handleSort("createdAt")}>
              Publié le {sortKey === "createdAt" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th className="p-3 text-center cursor-pointer w-[150px]" onClick={() => handleSort("updatedAt")}>
              MAJ le {sortKey === "updatedAt" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th className="p-3 text-center w-[50px]"></th>
          </tr>
        </thead>
        <tbody>
          {isLoading
            ? Array.from({ length: 10 }).map((_, idx) => (
                <tr key={idx} className="bg-white border-t border-gray-200">
                  <td className="p-3 text-center w-[250px]">
                    <Skeleton height="20px" width="200px" animated />
                  </td>
                  <td className="p-3 text-center w-[350px]">
                    <Skeleton height="20px" width="300px" animated />
                  </td>
                  <td className="p-3 text-center w-[150px]">
                    <Skeleton height="20px" width="100px" animated />
                  </td>
                  <td className="p-3 text-center w-[200px]">
                    <Skeleton height="20px" width="150px" animated />
                  </td>
                  <td className="p-3 text-center w-[180px]">
                    <Skeleton height="20px" width="120px" animated />
                  </td>
                  <td className="p-3 text-center w-[150px]">
                    <Skeleton height="20px" width="80px" animated />
                  </td>
                  <td className="p-3 text-center w-[150px]">
                    <Skeleton height="20px" width="80px" animated />
                  </td>
                  <td className="p-3 text-center w-[50px]">
                    <Skeleton height="20px" width="20px" animated />
                  </td>
                </tr>
              ))
            : paginatedComments.length > 0
            ? paginatedComments.map((comment) => (
                <tr
                  key={comment.id_comment}
                  className={`border-t border-gray-200 ${comment.hidden ? "bg-gray-50 text-gray-500" : "bg-white"}`}
                >
                  <td className="p-3 text-center w-[250px]">
                    <div className="truncate max-w-[250px]">{comment.title}</div>
                  </td>
                  <td className="p-3 text-center w-[350px]">
                    <div className="truncate max-w-[350px]">{comment.content}</div>
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
                  <td className="p-3 text-center w-[180px]">
                    <div className="flex flex-col items-center gap-1 text-xs">
                      {comment.hidden && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-200 text-gray-700">
                          <EyeOff size={12} /> Masqué
                        </span>
                      )}
                      {(comment.reportsCount ?? 0) > 0 ? (
                        <span
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-100 text-red-700"
                          title={comment.reportReasons?.map((r) => REASON_LABELS[r]).join(", ")}
                        >
                          <Flag size={12} /> {comment.reportsCount} ·{" "}
                          {comment.reportReasons?.map((r) => REASON_LABELS[r]).join(", ")}
                        </span>
                      ) : (
                        !comment.hidden && <span className="text-gray-400">—</span>
                      )}
                    </div>
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
            : (
                <tr>
                  <td colSpan={8} className="p-3 text-center text-gray-500">
                    Aucun commentaire ne correspond.
                  </td>
                </tr>
              )}
        </tbody>
      </table>

      {/* Pagination */}
      {!isLoading && filteredComments.length > 0 && (
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

      {selectedComment && popupPosition &&
        createPortal(
          <div
            ref={popupRef}
            className="absolute z-50"
            style={{ top: popupPosition.top, left: popupPosition.left, maxWidth: "calc(100vw - 16px)" }}
          >
            <ContextPopup
              id={selectedComment.id_comment}
              type="comment"
              hidden={selectedComment.hidden}
              reportsCount={selectedComment.reportsCount}
            />
          </div>,
          document.body
        )}
    </div>
  );
}
