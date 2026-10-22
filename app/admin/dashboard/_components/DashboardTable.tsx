"use client";

import { ChevronLeft, ChevronRight, EllipsisVertical } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { normalizeText } from "@/lib/normalize-text";

const ITEMS_PER_PAGE = 10;
const MENU_WIDTH = 224;

export type SortOrder = "asc" | "desc";

export interface DashboardColumn<T> {
  label: string;
  // Clé de tri : propriété de la ligne (date, texte, nombre ou booléen)
  sortKey?: keyof T & string;
  className?: string;
  render: (row: T) => React.ReactNode;
}

// Valeurs vides toujours en dernier, quel que soit le sens
function compare(a: unknown, b: unknown, order: SortOrder) {
  const empty = (v: unknown) => v === null || v === undefined || v === "";
  if (empty(a) || empty(b)) return Number(empty(a)) - Number(empty(b));
  let diff = 0;
  if (a instanceof Date && b instanceof Date) diff = a.getTime() - b.getTime();
  else if (typeof a === "string" && typeof b === "string") diff = a.localeCompare(b, "fr");
  else diff = Number(a) - Number(b);
  return order === "asc" ? diff : -diff;
}

/**
 * Tableau d'une section du dashboard : tri par en-tête, menu « trois points » par ligne et
 * pagination. Le filtre (recherche, pastilles) reste à la section.
 */
export default function DashboardTable<T>({
  rows,
  columns,
  getId,
  emptyLabel,
  initialSort,
  renderMenu,
  rowClassName,
  resetKey,
}: {
  // Lignes déjà filtrées
  rows: T[];
  columns: DashboardColumn<T>[];
  getId: (row: T) => string;
  emptyLabel: string;
  initialSort: { key: keyof T & string; order: SortOrder };
  renderMenu: (row: T, close: () => void) => React.ReactNode;
  rowClassName?: (row: T) => string;
  // Retour à la page 1 quand il change (recherche, filtre)
  resetKey?: string;
}) {
  const [sort, setSort] = useState(initialSort);
  const [page, setPage] = useState(1);
  const [menu, setMenu] = useState<{ id: string; top: number; left: number } | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => setPage(1), [resetKey]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setMenu(null);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const onSort = (key: keyof T & string) =>
    setSort((s) => (s.key === key ? { key, order: s.order === "asc" ? "desc" : "asc" } : { key, order: "asc" }));

  const openMenu = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    if (menu?.id === id) return setMenu(null);
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const left = Math.min(Math.max(rect.right + window.scrollX - MENU_WIDTH, 8), window.innerWidth - MENU_WIDTH - 8);
    setMenu({ id, top: rect.bottom + window.scrollY + 4, left });
  };

  const sorted = [...rows].sort((a, b) => compare(a[sort.key], b[sort.key], sort.order));
  const totalPages = Math.max(1, Math.ceil(sorted.length / ITEMS_PER_PAGE));
  const current = Math.min(page, totalPages);
  const start = (current - 1) * ITEMS_PER_PAGE;
  const visible = sorted.slice(start, start + ITEMS_PER_PAGE);
  const menuRow = menu && rows.find((row) => getId(row) === menu.id);

  return (
    <>
      <div className="w-full overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
            <tr>
              {columns.map((column) => (
                <th key={column.label} className={`px-4 py-3 font-semibold whitespace-nowrap ${column.className ?? ""}`}>
                  {column.sortKey ? (
                    <button
                      type="button"
                      onClick={() => onSort(column.sortKey!)}
                      className={`uppercase tracking-wide hover:text-aja-blue ${sort.key === column.sortKey ? "text-aja-blue" : ""}`}
                    >
                      {column.label} {sort.key === column.sortKey && (sort.order === "asc" ? "↑" : "↓")}
                    </button>
                  ) : (
                    column.label
                  )}
                </th>
              ))}
              <th className="px-4 py-3 w-12" aria-label="Actions"></th>
            </tr>
          </thead>
          <tbody>
            {visible.length > 0 ? (
              visible.map((row) => (
                <tr
                  key={getId(row)}
                  className={`border-t border-gray-100 hover:bg-gray-50/80 transition-colors ${rowClassName?.(row) ?? ""}`}
                >
                  {columns.map((column) => (
                    <td key={column.label} className={`px-4 py-3 align-middle ${column.className ?? ""}`}>
                      {column.render(row)}
                    </td>
                  ))}
                  <td className="px-2 py-3 text-right">
                    <button
                      type="button"
                      aria-label="Actions"
                      onClick={(e) => openMenu(getId(row), e)}
                      className={`p-1.5 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors ${
                        menu?.id === getId(row) ? "bg-gray-100 text-gray-900" : ""
                      }`}
                    >
                      <EllipsisVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length + 1} className="px-4 py-10 text-center text-gray-500">
                  {emptyLabel}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {sorted.length > ITEMS_PER_PAGE && (
        <div className="flex items-center justify-between gap-4 px-4 py-3 border-t border-gray-100 text-sm text-gray-600">
          <p>
            {start + 1}–{start + visible.length} sur {sorted.length}
          </p>
          <div className="flex items-center gap-1">
            <button
              type="button"
              aria-label="Page précédente"
              onClick={() => setPage(current - 1)}
              disabled={current === 1}
              className="p-1.5 rounded-full hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="tabular-nums px-1">
              {current} / {totalPages}
            </span>
            <button
              type="button"
              aria-label="Page suivante"
              onClick={() => setPage(current + 1)}
              disabled={current === totalPages}
              className="p-1.5 rounded-full hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}

      {menu &&
        menuRow &&
        createPortal(
          <div ref={menuRef} className="absolute z-50" style={{ top: menu.top, left: menu.left, width: MENU_WIDTH }}>
            {renderMenu(menuRow, () => setMenu(null))}
          </div>,
          document.body
        )}
    </>
  );
}

/** Image (ou initiale), titre et sous-titre : première colonne des sections. */
export function MainCell({
  image,
  shape = "square",
  title,
  subtitle,
  fallback,
}: {
  image?: string | null;
  shape?: "round" | "square" | "wide";
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const box =
    shape === "round" ? "w-9 h-9 rounded-full" : shape === "wide" ? "w-16 h-9 rounded-md" : "w-9 h-9 rounded-md";
  return (
    <div className="flex items-center gap-3 min-w-[220px] max-w-[600px]">
      <div className={`${box} shrink-0 overflow-hidden bg-gray-100 flex items-center justify-center text-gray-400`}>
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt="" loading="lazy" className="w-full h-full object-cover object-top" />
        ) : (
          fallback
        )}
      </div>
      <div className="min-w-0">
        <p className="font-semibold text-gray-900 truncate">{title}</p>
        {subtitle && <p className="text-xs text-gray-500 truncate">{subtitle}</p>}
      </div>
    </div>
  );
}

const TONES = {
  green: "bg-green-100 text-green-800",
  gray: "bg-gray-100 text-gray-700",
  blue: "bg-aja-blue/10 text-aja-blue",
  red: "bg-red-100 text-red-700",
  orange: "bg-orange-100 text-orange-800",
};

export function Badge({ tone, children }: { tone: keyof typeof TONES; children: React.ReactNode }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap ${TONES[tone]}`}>
      {children}
    </span>
  );
}

export const shortDateFr = (date: Date) =>
  date.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });

/** Pastilles de filtre d'une section (« Tous », « Signalés »…), avec leur nombre. */
export function FilterChips<K extends string>({
  options,
  value,
  onChange,
}: {
  options: { key: K; label: string; count: number }[];
  value: K;
  onChange: (key: K) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2 px-4 pb-3 text-sm">
      {options.map((option) => (
        <button
          key={option.key}
          type="button"
          onClick={() => onChange(option.key)}
          className={`px-3 py-1 rounded-full border transition-colors ${
            value === option.key
              ? "bg-aja-blue text-white border-aja-blue"
              : "bg-white text-gray-700 border-gray-200 hover:bg-gray-100"
          }`}
        >
          {option.label} <span className={value === option.key ? "text-white/80" : "text-gray-400"}>{option.count}</span>
        </button>
      ))}
    </div>
  );
}

/** Le texte cherché apparaît-il dans l'un des champs (sans accents ni casse) ? */
export function matches(search: string, ...fields: (string | null | undefined)[]) {
  const wanted = normalizeText(search.trim());
  return !wanted || fields.some((field) => field && normalizeText(field).includes(wanted));
}
