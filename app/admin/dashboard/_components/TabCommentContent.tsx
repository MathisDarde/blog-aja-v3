"use client";

import { EyeOff, Flag, Star } from "lucide-react";
import React, { useState } from "react";
import ContextPopup from "./ContextPopup";
import DashboardTable, { DashboardColumn, useTableSort } from "./DashboardTable";
import { Comment, CommentSortKey } from "@/contexts/Interfaces";
import { useGlobalContext } from "@/contexts/GlobalContext";
import type { CommentReportReason } from "@/db/schema";

const REASON_LABELS: Record<CommentReportReason, string> = {
  spam: "spam",
  insulte: "insultes",
  "hors-sujet": "hors sujet",
  autre: "autre",
};

type ModerationFilter = "all" | "reported" | "hidden";

const reasons = (comment: Comment) => comment.reportReasons?.map((r) => REASON_LABELS[r]).join(", ");

const COLUMNS: DashboardColumn<Comment, CommentSortKey>[] = [
  {
    label: "Titre",
    width: "w-[250px]",
    sortKey: "title",
    render: (comment) => <div className="truncate max-w-[250px]">{comment.title}</div>,
    skeleton: { width: "200px" },
  },
  {
    label: "Contenu",
    width: "w-[350px]",
    render: (comment) => <div className="truncate max-w-[350px]">{comment.content}</div>,
    skeleton: { width: "300px" },
  },
  {
    label: "Note",
    width: "w-[150px]",
    sortKey: "stars",
    render: (comment) => (
      <div className="flex justify-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star key={i} size={24} fill={i < comment.stars ? "#facc15" : "none"} stroke="#facc15" />
        ))}
      </div>
    ),
    skeleton: { width: "100px" },
  },
  {
    label: "Pseudo",
    width: "w-[200px]",
    sortKey: "pseudo",
    render: (comment) => <div className="truncate max-w-[200px]">{comment.pseudo}</div>,
    skeleton: { width: "150px" },
  },
  {
    label: "Modération",
    width: "w-[180px]",
    sortKey: "reportsCount",
    render: (comment) => (
      <div className="flex flex-col items-center gap-1 text-xs">
        {comment.hidden && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-200 text-gray-700">
            <EyeOff size={12} /> Masqué
          </span>
        )}
        {(comment.reportsCount ?? 0) > 0 ? (
          <span
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-100 text-red-700"
            title={reasons(comment)}
          >
            <Flag size={12} /> {comment.reportsCount} · {reasons(comment)}
          </span>
        ) : (
          !comment.hidden && <span className="text-gray-400">—</span>
        )}
      </div>
    ),
    skeleton: { width: "120px" },
  },
  {
    label: "Publié le",
    width: "w-[150px]",
    sortKey: "createdAt",
    render: (comment) => comment.createdAt.toLocaleDateString(),
    skeleton: { width: "80px" },
  },
  {
    label: "MAJ le",
    width: "w-[150px]",
    sortKey: "updatedAt",
    render: (comment) => comment.updatedAt.toLocaleDateString(),
    skeleton: { width: "80px" },
  },
];

export default function TabCommentContent({
  searchTerm,
  comments,
  isLoading,
}: {
  searchTerm: string;
  comments: Comment[];
  isLoading: boolean;
}) {
  const { sortElements } = useGlobalContext();
  // Les commentaires signalés remontent en premier
  const sort = useTableSort<CommentSortKey>("reportsCount", "desc");
  const [moderationFilter, setModerationFilter] = useState<ModerationFilter>("all");

  const reportedCount = comments.filter((c) => (c.reportsCount ?? 0) > 0).length;
  const hiddenCount = comments.filter((c) => c.hidden).length;

  const search = searchTerm.toLowerCase();
  const filteredComments = sortElements({ elements: comments, sortKey: sort.key, sortOrder: sort.order }).filter(
    (comment) =>
      (moderationFilter === "all" ||
        (moderationFilter === "reported" && (comment.reportsCount ?? 0) > 0) ||
        (moderationFilter === "hidden" && comment.hidden)) &&
      (comment.title.toLowerCase().includes(search) ||
        comment.content?.toLowerCase().includes(search) ||
        comment.pseudo.toLowerCase().includes(search) ||
        String(comment.stars).toLowerCase().includes(search) ||
        new Date(comment.createdAt).toLocaleDateString("fr-FR").includes(searchTerm))
  );

  const filters = (
    <div className="flex flex-wrap gap-2 mb-4 text-sm">
      {(
        [
          ["all", `Tous (${comments.length})`],
          ["reported", `Signalés (${reportedCount})`],
          ["hidden", `Masqués (${hiddenCount})`],
        ] as const
      ).map(([filter, label]) => (
        <button
          key={filter}
          type="button"
          onClick={() => setModerationFilter(filter)}
          className={`px-3 py-1 rounded-full border transition-colors ${
            moderationFilter === filter
              ? "bg-aja-blue text-white border-aja-blue"
              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );

  return (
    <DashboardTable
      rows={filteredComments}
      columns={COLUMNS}
      getId={(comment) => comment.id_comment}
      isLoading={isLoading}
      emptyLabel="Aucun commentaire ne correspond."
      sort={sort}
      resetKey={`${moderationFilter}|${searchTerm}`}
      toolbar={filters}
      rowClassName={(comment) => (comment.hidden ? "bg-gray-50 text-gray-500" : "bg-white")}
      renderPopup={(comment) => (
        <ContextPopup
          id={comment.id_comment}
          type="comment"
          hidden={comment.hidden}
          reportsCount={comment.reportsCount}
        />
      )}
    />
  );
}
