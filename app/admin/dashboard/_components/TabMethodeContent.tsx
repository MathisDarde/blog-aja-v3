"use client";

import React, { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, EllipsisVertical } from "lucide-react";
import ContextPopup from "./ContextPopup";
import { MethodeSortKey, Methodes } from "@/contexts/Interfaces";
import { useGlobalContext } from "@/contexts/GlobalContext";
import { createPortal } from "react-dom";
import Skeleton from "@/components/CustomSkeleton";

export default function TabMethodeContent({
  searchTerm,
  methodes,
  isLoading,
}: {
  searchTerm: string;
  methodes: Methodes[];
  isLoading: boolean;
}) {
  const { sortElements } = useGlobalContext();

  const [sortKey, setSortKey] = useState<MethodeSortKey>("typemethode");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [selectedMethodeId, setSelectedMethodeId] = useState<string | null>(null);
  const [popupPosition, setPopupPosition] = useState<{ top: number; left: number } | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageInput, setPageInput] = useState("1");
  const itemsPerPage = 10;

  const popupRef = useRef<HTMLDivElement>(null);

  const sortedMethodes = sortElements<Methodes>({
    elements: methodes,
    sortKey: sortKey as keyof Methodes,
    sortOrder,
  });

  const filteredMethodes = sortedMethodes.filter(
    (methode) =>
      methode.typemethode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      new Date(methode.createdAt).toLocaleDateString("fr-FR").includes(searchTerm)
  );

  const handleSort = (key: MethodeSortKey) => {
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

    setSelectedMethodeId((prev) => (prev === id ? null : id));
    setPopupPosition({ top, left });
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setSelectedMethodeId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedMethode = methodes.find((m) => m.id_methode === selectedMethodeId);

  const totalPages = Math.ceil(filteredMethodes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedMethodes = filteredMethodes.slice(startIndex, endIndex);

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

  function getMethodeTitle(m: Methodes): string {
    switch (m.typemethode) {
      case "coach": return m.nomcoach ?? "Méthode coach sans nom";
      case "joueur": return m.joueurnom ?? "Méthode joueur sans nom";
      case "match": return m.titrematch ?? "Méthode match sans titre";
      case "saison": return m.saison ?? "Méthode saison sans titre";
      default: return "Méthode sans titre";
    }
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-auto table-auto border border-gray-300">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-3 text-center cursor-pointer w-1/4" onClick={() => handleSort("typemethode")}>
              Type de méthode {sortKey === "typemethode" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th className="p-3 text-center w-1/4">Titre</th>
            <th className="p-3 text-center cursor-pointer w-1/4" onClick={() => handleSort("createdAt")}>
              Date de publication {sortKey === "createdAt" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th className="p-3 text-center cursor-pointer w-1/4" onClick={() => handleSort("updatedAt")}>
              MAJ le {sortKey === "updatedAt" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th className="p-3 text-center w-[50px]"></th>
          </tr>
        </thead>
        <tbody>
          {isLoading
            ? Array.from({ length: 10 }).map((_, idx) => (
                <tr key={idx} className="bg-white border-t border-gray-200">
                  <td className="p-3 text-center w-1/4"><Skeleton height="20px" width="80%" animated /></td>
                  <td className="p-3 text-center w-1/4"><Skeleton height="20px" width="90%" animated /></td>
                  <td className="p-3 text-center w-1/4"><Skeleton height="20px" width="80%" animated /></td>
                  <td className="p-3 text-center w-1/4"><Skeleton height="20px" width="80%" animated /></td>
                  <td className="p-3 text-center w-[50px]"><Skeleton height="20px" width="20px" animated /></td>
                </tr>
              ))
            : paginatedMethodes.length > 0
            ? paginatedMethodes.map((methode) => (
                <tr key={methode.id_methode} className="bg-white border-t border-gray-200">
                  <td className="p-3 text-center w-1/4">{methode.typemethode}</td>
                  <td className="p-3 text-center w-1/4">{getMethodeTitle(methode)}</td>
                  <td className="p-3 text-center w-1/4">{methode.createdAt.toLocaleDateString()}</td>
                  <td className="p-3 text-center w-1/4">{methode.updatedAt.toLocaleDateString()}</td>
                  <td
                    className="p-3 text-center w-[50px] cursor-pointer text-gray-600"
                    onClick={(e) => handleOpenPopup(methode.id_methode, e)}
                  >
                    <EllipsisVertical />
                  </td>
                </tr>
              ))
            : (
                <tr>
                  <td colSpan={5} className="p-3 text-center text-gray-500">
                    Aucune méthode ne correspond.
                  </td>
                </tr>
              )}
        </tbody>
      </table>

      {/* Pagination */}
      {!isLoading && filteredMethodes.length > 0 && (
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

      {/* Context Popup */}
      {selectedMethode && popupPosition &&
        createPortal(
          <div
            ref={popupRef}
            className="absolute z-50"
            style={{ top: popupPosition.top, left: popupPosition.left, maxWidth: "calc(100vw - 16px)" }}
          >
            <ContextPopup id={selectedMethode.id_methode} type="method" />
          </div>,
          document.body
        )}
    </div>
  );
}
