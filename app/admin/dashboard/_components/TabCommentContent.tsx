"use client";

import { EllipsisVertical, Star } from "lucide-react";
import React, { useState } from "react";
import ContextPopup from "./ContextPopup";
import { Comment, CommentSortKey } from "@/contexts/Interfaces";
import { useGlobalContext } from "@/contexts/GlobalContext";

export default function TabCommentContent({
  searchTerm,
  comments,
}: {
  searchTerm: string;
  comments: Comment[];
}) {
  const {
    sortElements,
    openContextPopup,
    DashboardPopupId,
    DashboardPopupPosition,
    DashboardPopupRef,
  } = useGlobalContext();

  const [sortKey, setSortKey] = useState<CommentSortKey>("title");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const sortedComments = sortElements({
    elements: comments,
    sortKey,
    sortOrder,
  });

  const filteredComments = sortedComments.filter(
    (comment) =>
      comment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.pseudo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(comment.stars).toLowerCase().includes(searchTerm.toLowerCase()) ||
      new Date(comment.createdAt)
        .toLocaleDateString("fr-FR")
        .includes(searchTerm)
  );

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
              className="p-3 text-center cursor-pointer w-[250px]"
              onClick={() => handleSort("title")}
            >
              Titre {sortKey === "title" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th className="p-3 text-center w-[350px]">Contenu</th>
            <th
              className="p-3 text-center cursor-pointer w-[150px]"
              onClick={() => handleSort("stars")}
            >
              Note {sortKey === "stars" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th
              className="p-3 text-center cursor-pointer w-[200px]"
              onClick={() => handleSort("pseudo")}
            >
              Pseudo {sortKey === "pseudo" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th
              className="p-3 text-center cursor-pointer w-[150px]"
              onClick={() => handleSort("createdAt")}
            >
              Publié le{" "}
              {sortKey === "createdAt" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th className="p-3 text-center w-[50px]">
              <></>
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredComments.length > 0 ? (
            filteredComments.map((comment) => (
              <tr
                key={comment.id_comment}
                className="bg-white border-t border-gray-200"
              >
                <td className="p-3 text-center w-[250px]">
                  <div className="truncate max-w-[250px]">{comment.title}</div>
                </td>
                <td className="p-3 text-center w-[350px]">
                  <div className="truncate max-w-[350px]">
                    {comment.content}
                  </div>
                </td>
                <td className="p-3 text-center w-[150px]">
                  <div className="flex justify-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={24}
                        fill={i < comment.stars ? "#facc15" : "none"}
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
          ) : (
            <tr>
              <td colSpan={7} className="p-3 text-center text-gray-500">
                Aucun commentaire ne correspond.
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
          <ContextPopup id={DashboardPopupId} type="comment" />
        </div>
      )}
    </div>
  );
}
