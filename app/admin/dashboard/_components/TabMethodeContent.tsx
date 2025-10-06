"use client";

import React, { useState } from "react";
import { EllipsisVertical } from "lucide-react";
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

  const handleSort = (key: MethodeSortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  return (
    <div className="overflow-y-auto">
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
          {filteredMethodes.length > 0 ? (
            filteredMethodes.map((methode) => (
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
