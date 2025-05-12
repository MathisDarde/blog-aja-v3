"use client";

import getCommentsInfos from "@/actions/dashboard/get-comments-infos";
import { EllipsisVertical, Loader2, Star } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import ContextPopup from "./ContextPopup";

interface Comment {
  id_comment: string;
  stars: string;
  title: string;
  content: string;
  pseudo: string;
  photodeprofil: string | null;
  createdAt: Date;
  updatedAt: Date;
}

type SortKey = keyof Pick<Comment, "title" | "stars" | "pseudo" | "createdAt">;

export default function TabCommentContent() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortKey, setSortKey] = useState<SortKey>("title");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [contextPopupId, setContextPopupId] = useState<string | null>(null);
  const [popupPosition, setPopupPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const popupRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const result = await getCommentsInfos();
        if (Array.isArray(result)) {
          const parsed = result.map((u) => ({
            ...u,
            createdAt: new Date(u.createdAt),
            updatedAt: new Date(u.updatedAt),
          }));
          setComments(parsed);
        } else {
          console.error("Failed to fetch users:", result.message);
        }
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des utilisateurs :",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    getUsers();
  }, []);

  const sortedComments = [...comments].sort((a, b) => {
    const aValue = a[sortKey];
    const bValue = b[sortKey];
    if (aValue instanceof Date && bValue instanceof Date) {
      return sortOrder === "asc"
        ? aValue.getTime() - bValue.getTime()
        : bValue.getTime() - aValue.getTime();
    }
    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortOrder === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    return 0;
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
            sortedComments.map((comment) => (
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
                  onClick={(e: React.MouseEvent) =>
                    openContextPopup(comment.id_comment, e)
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
          <ContextPopup id={contextPopupId} type="comment" />
        </div>
      )}
    </div>
  );
}
