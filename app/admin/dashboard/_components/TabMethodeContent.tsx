"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight, EllipsisVertical } from "lucide-react";
import ContextPopup from "./ContextPopup";
import { MethodeSortKey, Methodes } from "@/contexts/Interfaces";
import { useGlobalContext } from "@/contexts/GlobalContext";

export default function TabMethodeContent({
  searchTerm,
  methodes,
}: {
  searchTerm: string;
  methodes: Methodes[];
}) {
  const {
    sortElements,
    openContextPopup,
    DashboardPopupId,
    DashboardPopupPosition,
    DashboardPopupRef,
  } = useGlobalContext();

  const [sortKey, setSortKey] = useState<MethodeSortKey>("typemethode");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // 👇 Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageInput, setPageInput] = useState("1");
  const itemsPerPage = 10;

  const sortedMethodes = sortElements({
    elements: methodes,
    sortKey,
    sortOrder,
  });

  const filteredMethodes = sortedMethodes.filter(
    (methode) =>
      methode.typemethode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      new Date(methode.createdAt)
        .toLocaleDateString("fr-FR")
        .includes(searchTerm)
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

  return (
    <div className="w-full">
      <table className="w-auto table-auto border border-gray-300">
        <thead className="bg-gray-200">
          <tr>
            <th
              className="p-3 text-center cursor-pointer w-1/2"
              onClick={() => handleSort("typemethode")}
            >
              Type de méthode{" "}
              {sortKey === "typemethode" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th
              className="p-3 text-center cursor-pointer w-1/2"
              onClick={() => handleSort("createdAt")}
            >
              Date de publication{" "}
              {sortKey === "createdAt" && (sortOrder === "asc" ? "↑" : "↓")}
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
                <td className="p-3 text-center w-1/2">
                  <div className="truncate max-w-1/2">
                    {methode.typemethode}
                  </div>
                </td>
                <td className="p-3 text-center w-1/2">
                  {methode.createdAt.toLocaleDateString()}
                </td>
                <td
                  className="p-3 text-center w-[50px] cursor-pointer text-gray-600"
                  onClick={(event: React.MouseEvent) =>
                    openContextPopup({ id: methode.id_methode, event })
                  }
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
        <div className="flex items-center justify-start md:justify-center gap-4 mt-4">
          {/* Bouton précédent */}
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-2 md:px-3 py-1 rounded-md border flex items-center gap-1 ${currentPage === 1
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-aja-blue text-white"
              }`}
          >
            <ChevronLeft /> <span className="hidden md:block text-sm">Précédent</span>
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
            className={`px-2 md:px-3 py-1 rounded-md border flex items-center gap-1 ${currentPage === totalPages
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-aja-blue text-white"
              }`}
          >
            <span className="hidden md:block text-sm">Suivant</span><ChevronRight />
          </button>
        </div>
      )}

      {/* CONTEXT POPUP */}
      {DashboardPopupId && DashboardPopupPosition && (
        <div
          className="absolute z-50"
          style={{
            top: DashboardPopupPosition.top,
            left: DashboardPopupPosition.left,
          }}
          ref={DashboardPopupRef}
        >
          <ContextPopup id={DashboardPopupId} type="method" />
        </div>
      )}
    </div>
  );
}
