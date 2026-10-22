"use client";

import { ChevronLeft, ChevronRight, EllipsisVertical } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Skeleton from "@/components/CustomSkeleton";

const ITEMS_PER_PAGE = 10;
const POPUP_WIDTH = 220;

export type SortOrder = "asc" | "desc";

/** Colonne triée et sens du tri : un clic sur la même colonne inverse le sens. */
export function useTableSort<K extends string>(initialKey: K, initialOrder: SortOrder = "asc") {
  const [key, setKey] = useState<K>(initialKey);
  const [order, setOrder] = useState<SortOrder>(initialOrder);

  const onSort = (next: K) => {
    if (next === key) setOrder(order === "asc" ? "desc" : "asc");
    else {
      setKey(next);
      setOrder("asc");
    }
  };

  return { key, order, onSort };
}

export interface DashboardColumn<T, K extends string> {
  label: string;
  // Classe de largeur Tailwind (« w-[250px] », « w-1/4 »)
  width: string;
  sortKey?: K;
  // Image : centrée dans la cellule
  media?: boolean;
  render: (row: T) => React.ReactNode;
  skeleton: { width: string; height?: string; className?: string };
}

/**
 * Tableau d'un onglet du dashboard : en-têtes triables, squelettes pendant le chargement,
 * menu « trois points » par ligne et pagination. Filtre et tri des lignes restent à l'onglet.
 */
export default function DashboardTable<T, K extends string>({
  rows,
  columns,
  getId,
  isLoading,
  emptyLabel,
  sort,
  renderPopup,
  rowClassName,
  resetKey,
  toolbar,
}: {
  // Lignes déjà filtrées et triées
  rows: T[];
  columns: DashboardColumn<T, K>[];
  getId: (row: T) => string;
  isLoading: boolean;
  emptyLabel: string;
  sort: { key: K; order: SortOrder; onSort: (key: K) => void };
  renderPopup: (row: T) => React.ReactNode;
  rowClassName?: (row: T) => string;
  // Retour à la page 1 quand il change (recherche, filtre)
  resetKey?: string;
  // Au-dessus du tableau (filtres)
  toolbar?: React.ReactNode;
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [popupPosition, setPopupPosition] = useState<{ top: number; left: number } | null>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageInput, setPageInput] = useState("1");

  useEffect(() => {
    setCurrentPage(1);
    setPageInput("1");
  }, [resetKey]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setSelectedId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOpenPopup = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const top = rect.bottom + window.scrollY + 4;
    let left = rect.right + window.scrollX - POPUP_WIDTH;
    const maxLeft = window.innerWidth - POPUP_WIDTH - 8;
    if (left > maxLeft) left = maxLeft;
    if (left < 8) left = 8;

    setSelectedId((prev) => (prev === id ? null : id));
    setPopupPosition({ top, left });
  };

  const selectedRow = rows.find((row) => getId(row) === selectedId);

  const totalPages = Math.ceil(rows.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedRows = rows.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      setPageInput(String(newPage));
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const newPage = parseInt(pageInput, 10);
      if (!isNaN(newPage)) handlePageChange(newPage);
    }
  };

  const cellClass = (column: DashboardColumn<T, K>) =>
    `p-3 ${column.media ? "flex justify-center items-center" : "text-center"} ${column.width}`;

  const pageButtonClass = (disabled: boolean) =>
    `px-2 md:px-3 py-1 rounded-md border flex items-center gap-1 ${
      disabled
        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
        : "bg-aja-blue text-white hover:bg-orange-third transition-colors"
    }`;

  return (
    <div className="w-full overflow-x-auto">
      {toolbar}

      <table className="w-auto table-auto border border-gray-300">
        <thead className="bg-gray-200">
          <tr>
            {columns.map((column) => (
              <th
                key={column.label}
                className={`p-3 text-center ${column.sortKey ? "cursor-pointer" : ""} ${column.width}`}
                onClick={column.sortKey ? () => sort.onSort(column.sortKey!) : undefined}
              >
                {column.label}{" "}
                {column.sortKey && sort.key === column.sortKey && (sort.order === "asc" ? "↑" : "↓")}
              </th>
            ))}
            <th className="p-3 text-center w-[50px]"></th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
              <tr key={index} className="bg-white border-t border-gray-200">
                {columns.map((column) => (
                  <td key={column.label} className={cellClass(column)}>
                    <Skeleton
                      height={column.skeleton.height ?? "20px"}
                      width={column.skeleton.width}
                      className={column.skeleton.className}
                      animated
                    />
                  </td>
                ))}
                <td className="p-3 text-center w-[50px]">
                  <Skeleton height="20px" width="20px" animated />
                </td>
              </tr>
            ))
          ) : paginatedRows.length > 0 ? (
            paginatedRows.map((row) => (
              <tr
                key={getId(row)}
                className={`border-t border-gray-200 ${rowClassName?.(row) ?? "bg-white"}`}
              >
                {columns.map((column) => (
                  <td key={column.label} className={cellClass(column)}>
                    {column.render(row)}
                  </td>
                ))}
                <td
                  className="p-3 text-center w-[50px] cursor-pointer text-gray-600"
                  onClick={(e) => handleOpenPopup(getId(row), e)}
                >
                  <EllipsisVertical />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length + 1} className="p-3 text-center text-gray-500">
                {emptyLabel}
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {!isLoading && rows.length > 0 && (
        <div className="flex items-center justify-start md:justify-center gap-4 my-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={pageButtonClass(currentPage === 1)}
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
              onChange={(e) => setPageInput(e.target.value)}
              onKeyDown={handleInputKeyDown}
              className="w-12 text-center border rounded-md text-sm py-1"
            />
            <span className="text-sm">sur {totalPages}</span>
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={pageButtonClass(currentPage === totalPages)}
          >
            <span className="hidden md:block text-sm">Suivant</span>
            <ChevronRight />
          </button>
        </div>
      )}

      {selectedRow &&
        popupPosition &&
        createPortal(
          <div
            ref={popupRef}
            className="absolute z-50"
            style={{ top: popupPosition.top, left: popupPosition.left, maxWidth: "calc(100vw - 16px)" }}
          >
            {renderPopup(selectedRow)}
          </div>,
          document.body
        )}
    </div>
  );
}
