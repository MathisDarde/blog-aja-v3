"use client";

import { EllipsisVertical, Loader2, Star } from "lucide-react";
import React, { useState } from "react";
import ContextPopup from "./ContextPopup";
import { CommentSortKey } from "@/contexts/Interfaces";
import { useGlobalContext } from "@/contexts/GlobalContext";

export default function TabCommentContent() {
  const {
    comments,
    loading,
    sortElements,
    openContextPopup,
    DashboardPopupId,
    DashboardPopupPosition,
    DashboardPopupRef,
  } = useGlobalContext();

  const [sortKey, setSortKey] = useState<CommentSortKey>("title");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const commentsList = sortElements({ elements: comments, sortKey, sortOrder });

  const handleSort = (key: CommentSortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-auto table-auto border border-gray-300">
        <thead className="bg-gray-200">
          <tr>
            <th
              className="p-3 text-center cursor-pointer"
              onClick={() => handleSort("title")}
            >
              Titre {sortKey === "title" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th className="p-3 text-center">Contenu</th>
            <th
              className="p-3 text-center cursor-pointer"
              onClick={() => handleSort("stars")}
            >
              Note {sortKey === "stars" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th
              className="p-3 text-center cursor-pointer"
              onClick={() => handleSort("pseudo")}
            >
              Pseudo {sortKey === "pseudo" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th
              className="p-3 text-center cursor-pointer"
              onClick={() => handleSort("createdAt")}
            >
              Publié le{" "}
              {sortKey === "createdAt" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th className="p-3 text-center">
              <></>
            </th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={5} className="h-64">
                <div className="flex justify-center items-center h-full">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                  <span className="ml-2 text-gray-600">
                    Chargement des commentaires...
                  </span>
                </div>
              </td>
            </tr>
          ) : (
            commentsList.map((comment) => (
              <tr
                key={comment.id_comment}
                className="bg-white border-t border-gray-200"
              >
                <td className="p-3 text-center w-[250px]">
                  <div className="truncate max-w-[250px]">{comment.title}</div>
                </td>
                <td className="p-3 text-center w-[300px]">
                  <div className="truncate max-w-[300px]">
                    {comment.content}
                  </div>
                </td>
                <td className="p-3 text-center w-[150px]">
                  <div className="flex justify-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={24}
                        fill={
                          i < parseInt(comment.stars, 10) ? "#facc15" : "none"
                        }
                        stroke="#facc15"
                      />
                    ))}
                  </div>
                </td>
                <td className="p-3 text-center w-[200px]">
                  <div className="truncate max-w-[200px]">{comment.pseudo}</div>
                </td>
                <td className="p-3 text-center w-[150px]">
                  {comment.createdAt.toLocaleDateString()}
                </td>
                <td
                  className="p-3 text-center w-[50px] cursor-pointer text-gray-600"
                  onClick={(event: React.MouseEvent) =>
                    openContextPopup({ id: comment.id_comment, event })
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
          <ContextPopup id={DashboardPopupId} type="comment" />
        </div>
      )}
    </div>
  );
}
