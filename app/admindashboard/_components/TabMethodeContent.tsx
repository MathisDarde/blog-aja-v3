"use client";

import getAllMethodes from "@/actions/dashboard/get-methodes-infos";
import React, { useEffect, useRef, useState } from "react";
import { EllipsisVertical, Loader2 } from "lucide-react";
import ContextPopup from "./ContextPopup";

interface Methode {
  id: string;
  typemethode: string;
  keywords: string;
  nomcoach: string | null;
  joueurnom: string | null;
  titrematch: string | null;
  saison: string | null;
  created_at: Date;
  updated_at: Date;
}

type SortKey = keyof Pick<
  Methode,
  | "typemethode"
  | "nomcoach"
  | "joueurnom"
  | "titrematch"
  | "saison"
  | "created_at"
>;

export default function TabMethodeContent() {
  const [methodes, setMethodes] = useState<Methode[]>([]);
  const [loading, setLoading] = useState(true); // Commence avec loading à true
  const [sortKey, setSortKey] = useState<SortKey>("typemethode");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [contextPopupId, setContextPopupId] = useState<string | null>(null);
  const [popupPosition, setPopupPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const popupRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Déclaration de la fonction fetchData en dehors pour éviter les problèmes de portée
    const fetchData = async () => {
      try {
        const result = await getAllMethodes();
        if (Array.isArray(result)) {
          const parsed = result.map((u) => ({
            id: u.id_methode,
            typemethode: u.typemethode,
            keywords: u.keywords.join(", "),
            nomcoach: "nomcoach" in u ? u.nomcoach : null,
            joueurnom: "joueurnom" in u ? u.joueurnom : null,
            titrematch: "titrematch" in u ? u.titrematch : null,
            saison: "saison" in u ? u.saison : null,
            created_at: new Date(u.created_at),
            updated_at: new Date(u.updated_at),
          }));
          setMethodes(parsed);
        } else {
          console.error(
            "Failed to fetch methods:",
            result &&
              typeof result === "object" &&
              result !== null &&
              "message" in result
              ? (result as { message: string }).message
              : result
          );
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des méthodes :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getTitre = (methode: Methode): string => {
    switch (methode.typemethode.toLowerCase()) {
      case "coach":
        return methode.nomcoach || "N/A";
      case "joueur":
        return methode.joueurnom || "N/A";
      case "match":
        return methode.titrematch || "N/A";
      case "season":
        return methode.saison || "N/A";
      default:
        return (
          methode.nomcoach ||
          methode.joueurnom ||
          methode.titrematch ||
          `saison ${methode.saison}` ||
          "N/A"
        );
    }
  };

  const getSortValue = (
    methode: Methode,
    key: SortKey
  ): string | Date | null => {
    if (
      key === "nomcoach" ||
      key === "joueurnom" ||
      key === "titrematch" ||
      key === "saison"
    ) {
      return getTitre(methode);
    }
    return methode[key];
  };

  const sortedMethodes = [...methodes].sort((a, b) => {
    const aValue = getSortValue(a, sortKey);
    const bValue = getSortValue(b, sortKey);

    if (aValue instanceof Date && bValue instanceof Date) {
      return sortOrder === "asc"
        ? aValue.getTime() - bValue.getTime()
        : bValue.getTime() - aValue.getTime();
    }

    const aString = aValue?.toString() || "";
    const bString = bValue?.toString() || "";

    return sortOrder === "asc"
      ? aString.localeCompare(bString)
      : bString.localeCompare(aString);
  });

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const openContextPopup = (id: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Pour éviter des comportements inattendus
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    setPopupPosition({
      top: rect.bottom + window.scrollY,
      left: rect.left + window.scrollX,
    });
    setContextPopupId((prev) => (prev === id ? null : id));
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        setContextPopupId(null);
        setPopupPosition(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="overflow-y-auto">
      <table className="w-auto table-auto border border-gray-300">
        <thead className="bg-gray-200">
          <tr>
            <th
              className="p-3 text-center cursor-pointer"
              onClick={() => handleSort("typemethode")}
            >
              Type de la méthode{" "}
              {sortKey === "typemethode" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th
              className="p-3 text-center cursor-pointer"
              onClick={() => handleSort("nomcoach")}
            >
              Titre de la méthode{" "}
              {(sortKey === "nomcoach" ||
                sortKey === "joueurnom" ||
                sortKey === "titrematch" ||
                sortKey === "saison") &&
                (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th
              className="p-3 text-center cursor-pointer"
              onClick={() => handleSort("created_at")}
            >
              Date de publication{" "}
              {sortKey === "created_at" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th className="p-3 text-center">
              <></>
            </th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={3} className="h-64">
                <div className="flex justify-center items-center h-full">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                  <span className="ml-2 text-gray-600">
                    Chargement des méthodes...
                  </span>
                </div>
              </td>
            </tr>
          ) : (
            sortedMethodes.map((methode) => (
              <tr
                key={methode.id}
                className="bg-white border-t border-gray-200"
              >
                <td className="p-3 text-center w-[250px]">
                  <div className="truncate max-w-[250px]">
                    {methode.typemethode}
                  </div>
                </td>
                <td className="p-3 text-center w-[600px]">
                  <div className="truncate max-w-[600px]">
                    {getTitre(methode)}
                  </div>
                </td>
                <td className="p-3 text-center w-[250px]">
                  {methode.created_at.toLocaleDateString()}
                </td>
                <td
                  className="p-3 text-center w-[50px] cursor-pointer text-gray-600"
                  onClick={(e: React.MouseEvent) =>
                    openContextPopup(methode.id, e)
                  }
                >
                  <EllipsisVertical />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {contextPopupId && popupPosition && (
        <div
          className="absolute z-50"
          style={{ top: popupPosition.top, left: popupPosition.left }}
          ref={popupRef}
        >
          <ContextPopup id={contextPopupId} type="method" />
        </div>
      )}
    </div>
  );
}
