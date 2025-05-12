import getArticlesInfos from "@/actions/dashboard/get-articles-infos";
import { EllipsisVertical, Loader2 } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import ContextPopup from "./ContextPopup";

interface Article {
  id_article: string;
  imageUrl: string;
  title: string;
  teaser: string;
  content: string;
  tags: string[];
  author: string;
  publishedAt: Date;
  updatedAt: Date;
}

type SortKey = keyof Pick<Article, "title" | "author" | "publishedAt">;

export default function TabArticleContent() {
  const [articles, setArticles] = useState<Article[]>([]);
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
    const getArticles = async () => {
      try {
        const result = await getArticlesInfos();
        if (Array.isArray(result)) {
          const parsed = result.map((u) => ({
            ...u,
            publishedAt: new Date(u.publishedAt),
            updatedAt: new Date(u.updatedAt),
          }));
          setArticles(parsed);
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

    getArticles();
  }, []);

  const sortedArticles = [...articles].sort((a, b) => {
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
            <th className="p-3 text-center">Image</th>
            <th
              className="p-3 text-center cursor-pointer"
              onClick={() => handleSort("title")}
            >
              Titre de l&apos;article{" "}
              {sortKey === "title" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th className="p-3 text-center">Contenu</th>
            <th
              className="p-3 text-center cursor-pointer"
              onClick={() => handleSort("author")}
            >
              Auteur {sortKey === "author" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th
              className="p-3 text-center cursor-pointer"
              onClick={() => handleSort("publishedAt")}
            >
              Publié le{" "}
              {sortKey === "publishedAt" && (sortOrder === "asc" ? "↑" : "↓")}
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
                    Chargement des articles...
                  </span>
                </div>
              </td>
            </tr>
          ) : (
            sortedArticles.map((article) => (
              <tr
                key={article.id_article}
                className="bg-white border-t border-gray-200"
              >
                <td className="p-3 flex justify-center items-center w-[75px]">
                  <Image
                    src={article.imageUrl}
                    alt="Bannière de l'article"
                    width={128}
                    height={128}
                    className="object-cover aspect-video"
                  />
                </td>
                <td className="p-3 text-center w-[300px]">
                  <div className="truncate max-w-[300px]">{article.title}</div>
                </td>
                <td className="p-3 text-center w-[350px]">
                  <div className="truncate max-w-[350px]">
                    {article.content}
                  </div>
                </td>
                <td className="p-3 text-center w-[250px]">{article.author}</td>
                <td className="p-3 text-center w-[125px]">
                  {article.publishedAt.toLocaleDateString()}
                </td>
                <td
                  className="p-3 text-center w-[50px] cursor-pointer text-gray-600"
                  onClick={(e: React.MouseEvent) =>
                    openContextPopup(article.id_article, e)
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
          <ContextPopup id={contextPopupId} type="article" />
        </div>
      )}
    </div>
  );
}
