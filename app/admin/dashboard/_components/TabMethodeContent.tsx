"use client";

import React, { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, EllipsisVertical } from "lucide-react";
import ContextPopup from "./ContextPopup";
import { MethodeSortKey, Methodes } from "@/contexts/Interfaces";
import { useGlobalContext } from "@/contexts/GlobalContext";
import { createPortal } from "react-dom";

export default function TabMethodeContent({
  searchTerm,
  methodes,
}: {
  searchTerm: string;
  methodes: Methodes[];
}) {
  const { sortElements } = useGlobalContext();

  const [sortKey, setSortKey] = useState<MethodeSortKey>("typemethode");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [selectedMethodeId, setSelectedMethodeId] = useState<string | null>(
    null
  );
  const [popupPosition, setPopupPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);

  // 👇 Pagination
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
      new Date(methode.createdAt)
        .toLocaleDateString("fr-FR")
        .includes(searchTerm)
  );

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

    setSelectedMethodeId((prev) => (prev === id ? null : id));
    setPopupPosition({ top, left });
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        setSelectedMethodeId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedMethode = methodes.find(
    (a) => a.id_methode === selectedMethodeId
  );

  // 👇 Pagination logic
  const totalPages = Math.ceil(filteredMethodes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedMethodes = filteredMethodes.slice(startIndex, endIndex);

  const handleSort = (key: MethodeSortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

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

  function getMethodeTitle(m: Methodes): string {
    switch (m.typemethode) {
      case "coach":
        return m.nomcoach ?? "Méthode coach sans nom";
      case "joueur":
        return m.joueurnom ?? "Méthode joueur sans nom";
      case "match":
        return m.titrematch ?? "Méthode match sans titre";
      case "saison":
        return m.saison ?? "Méthode saison sans titre";
      default:
        return "Méthode sans titre";
    }
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-auto table-auto border border-gray-300">
        <thead className="bg-gray-200">
          <tr>
            <th
              className="p-3 text-center cursor-pointer w-1/3"
              onClick={() => handleSort("typemethode")}
            >
              Type de méthode{" "}
              {sortKey === "typemethode" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th className="p-3 text-center cursor-pointer w-1/3">Titre</th>
            <th
              className="p-3 text-center cursor-pointer w-1/3"
              onClick={() => handleSort("createdAt")}
            >
              Date de publication{" "}
              {sortKey === "createdAt" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th
              className="p-3 text-center cursor-pointer w-1/3"
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
          {paginatedMethodes.length > 0 ? (
            paginatedMethodes.map((methode) => (
              <tr
                key={methode.id_methode}
                className="bg-white border-t border-gray-200"
              >
                <td className="p-3 text-center w-1/3">
                  <div className="truncate max-w-1/3">
                    {methode.typemethode}
                  </div>
                </td>
                <td>{getMethodeTitle(methode)}</td>
                <td className="p-3 text-center w-1/2">
                  {methode.createdAt.toLocaleDateString()}
                </td>
                <td className="p-3 text-center w-1/2">
                  {methode.updatedAt.toLocaleDateString()}
                </td>
                <td
                  className="p-3 text-center w-[50px] cursor-pointer text-gray-600"
                  onClick={(e) => handleOpenPopup(methode.id_methode, e)}
                >
                  <EllipsisVertical />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="p-3 text-center text-gray-500">
                Aucune méthode ne correspond.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* PAGINATION */}
      {filteredMethodes.length > 0 && (
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

      {/* CONTEXT POPUP */}
      {selectedMethode &&
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
            <ContextPopup id={selectedMethode.id_methode} type="method" />
          </div>,
          document.body
        )}
    </div>
  );
}
