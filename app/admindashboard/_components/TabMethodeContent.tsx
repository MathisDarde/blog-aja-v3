"use client";

import React, { useState } from "react";
import { EllipsisVertical, Loader2 } from "lucide-react";
import ContextPopup from "./ContextPopup";
import { Methode, MethodeSortKey } from "@/contexts/Interfaces";
import { useGlobalContext } from "@/contexts/GlobalContext";

export default function TabMethodeContent() {
  const {
    methodes,
    methodesLoading,
    sortElements,
    openContextPopup,
    DashboardPopupId,
    DashboardPopupPosition,
    DashboardPopupRef,
  } = useGlobalContext();

  const [sortKey, setSortKey] = useState<MethodeSortKey>("typemethode");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const methodesList = sortElements({ elements: methodes, sortKey, sortOrder });

  const handleSort = (key: MethodeSortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

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
          {methodesLoading ? (
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
            methodesList.map((methode) => (
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
                  onClick={(event: React.MouseEvent) =>
                    openContextPopup({ id: methode.id, event })
                  }
                >
                  <EllipsisVertical />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

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
