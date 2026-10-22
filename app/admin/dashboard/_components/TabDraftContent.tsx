"use client";

import { ChevronLeft, ChevronRight, EllipsisVertical } from "lucide-react";
import Image from "next/image";
import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import ContextPopup from "./ContextPopup";
import { Draft, DraftSortKey } from "@/contexts/Interfaces";
import { useGlobalContext } from "@/contexts/GlobalContext";
import Skeleton from "@/components/CustomSkeleton";
import { formatScheduledAt } from "@/lib/schedule-date";

export default function TabDraftContent({
  searchTerm,
  drafts,
  isLoading,
}: {
  searchTerm: string;
  drafts: Draft[];
  isLoading: boolean;
}) {
  const { sortElements } = useGlobalContext();
  // Programmés d'abord, du plus proche au plus lointain
  const [sortKey, setSortKey] = useState<DraftSortKey>("scheduledAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [selectedDraftId, setSelectedDraftId] = useState<string | null>(null);
  const [popupPosition, setPopupPosition] = useState<{ top: number; left: number } | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageInput, setPageInput] = useState("1");
  const itemsPerPage = 10;

  const popupRef = useRef<HTMLDivElement>(null);

  // Champs vides tant que le brouillon n'est pas complet
  const rows = drafts.map((draft) => ({
    ...draft,
    title: draft.title ?? "",
    author: draft.author ?? "",
  }));

  // Les brouillons non programmés restent en bas, quel que soit l'ordre
  const sortedDrafts =
    sortKey === "scheduledAt"
      ? [...rows].sort((a, b) => {
          if (!a.scheduledAt || !b.scheduledAt) {
            return (a.scheduledAt ? 0 : 1) - (b.scheduledAt ? 0 : 1);
          }
          const diff = a.scheduledAt.getTime() - b.scheduledAt.getTime();
          return sortOrder === "asc" ? diff : -diff;
        })
      : sortElements({ elements: rows, sortKey, sortOrder });

  const search = searchTerm.toLowerCase();
  const filteredDrafts = sortedDrafts.filter(
    (draft) =>
      draft.title.toLowerCase().includes(search) ||
      draft.content?.toLowerCase().includes(search) ||
      draft.author.toLowerCase().includes(search) ||
      draft.teaser?.toLowerCase().includes(search) ||
      draft.tags?.some((tag) => tag.toLowerCase().includes(search)) ||
      new Date(draft.createdAt).toLocaleDateString("fr-FR").includes(searchTerm)
  );

  const handleSort = (key: DraftSortKey) => {
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

    setSelectedDraftId((prev) => (prev === id ? null : id));
    setPopupPosition({ top, left });
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setSelectedDraftId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedDraft = drafts.find((d) => d.id_draft === selectedDraftId);

  const totalPages = Math.ceil(filteredDrafts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedDrafts = filteredDrafts.slice(startIndex, endIndex);

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
            <th className="p-3 text-center cursor-pointer w-[350px]" onClick={() => handleSort("scheduledAt")}>
              Programmé pour {sortKey === "scheduledAt" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th className="p-3 text-center cursor-pointer w-[250px]" onClick={() => handleSort("author")}>
              Auteur {sortKey === "author" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th className="p-3 text-center cursor-pointer w-[125px]" onClick={() => handleSort("createdAt")}>
              Créé le {sortKey === "createdAt" && (sortOrder === "asc" ? "↑" : "↓")}
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
            : paginatedDrafts.length > 0
            ? paginatedDrafts.map((draft) => (
                <tr key={draft.id_draft} className="bg-white border-t border-gray-200">
                  <td className="p-3 flex justify-center items-center w-[75px]">
                    <Image
                      src={draft.imageUrl || "/_assets/img/defaultarticlebanner.png"}
                      alt="Bannière du brouillon"
                      width={128}
                      height={128}
                      className="object-cover aspect-video"
                    />
                  </td>
                  <td className="p-3 text-center w-[500px]">
                    <div className="truncate max-w-[500px]">
                      {draft.title || <span className="italic text-gray-400">Sans titre</span>}
                    </div>
                  </td>
                  <td className="p-3 text-center w-[350px]">
                    <div className="truncate max-w-[350px]">
                      {draft.scheduledAt ? formatScheduledAt(draft.scheduledAt) : "—"}
                    </div>
                  </td>
                  <td className="p-3 text-center w-[250px]">{draft.author || "—"}</td>
                  <td className="p-3 text-center w-[125px]">
                    {draft.createdAt.toLocaleDateString()}
                  </td>
                  <td className="p-3 text-center w-[125px]">
                    {draft.updatedAt.toLocaleDateString()}
                  </td>
                  <td
                    className="p-3 text-center w-[50px] cursor-pointer text-gray-600"
                    onClick={(e) => handleOpenPopup(draft.id_draft, e)}
                  >
                    <EllipsisVertical />
                  </td>
                </tr>
              ))
            : (
                <tr>
                  <td colSpan={7} className="p-3 text-center text-gray-500">
                    Aucun brouillon ne correspond.
                  </td>
                </tr>
              )}
        </tbody>
      </table>

      {/* Pagination */}
      {!isLoading && filteredDrafts.length > 0 && (
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

      {selectedDraft && popupPosition &&
        createPortal(
          <div
            ref={popupRef}
            className="absolute z-50"
            style={{ top: popupPosition.top, left: popupPosition.left, maxWidth: "calc(100vw - 16px)" }}
          >
            <ContextPopup id={selectedDraft.id_draft} type="draft" />
          </div>,
          document.body
        )}
    </div>
  );
}
