"use client";

import React, { useState } from "react";
import { EyeOff, Flag, Star } from "lucide-react";
import ContextPopup from "./ContextPopup";
import DashboardTable, { Badge, DashboardColumn, FilterChips, matches, shortDateFr } from "./DashboardTable";
import type { DashboardComment } from "@/lib/dashboard-data";
import type { CommentReportReason } from "@/db/schema";

const REASON_LABELS: Record<CommentReportReason, string> = {
  spam: "spam",
  insulte: "insultes",
  "hors-sujet": "hors sujet",
  autre: "autre",
};

type Filter = "all" | "reported" | "hidden";

const COLUMNS: DashboardColumn<DashboardComment>[] = [
  {
    label: "Commentaire",
    sortKey: "title",
    render: (c) => (
      <div className="min-w-[240px] max-w-[420px]">
        <p className="font-semibold text-gray-900 truncate">{c.title}</p>
        <p className="text-xs text-gray-500 line-clamp-2">{c.content}</p>
      </div>
    ),
  },
  {
    label: "Auteur",
    sortKey: "pseudo",
    render: (c) => (
      <div className="min-w-[120px]">
        <p className="truncate max-w-[180px]">{c.pseudo}</p>
        <div className="flex gap-0.5" aria-label={`${c.stars} sur 5`}>
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={12} fill={i < c.stars ? "#facc15" : "none"} stroke="#facc15" />
          ))}
        </div>
      </div>
    ),
  },
  {
    label: "Article",
    sortKey: "articleTitle",
    render: (c) => <p className="text-gray-600 truncate max-w-[220px]">{c.articleTitle}</p>,
  },
  {
    label: "Modération",
    sortKey: "reportsCount",
    render: (c) => (
      <div className="flex flex-col items-start gap-1">
        {c.hidden && (
          <Badge tone="gray">
            <EyeOff size={12} /> Masqué
          </Badge>
        )}
        {c.reportsCount > 0 ? (
          <Badge tone="red">
            <Flag size={12} /> {c.reportsCount} · {c.reportReasons.map((r) => REASON_LABELS[r]).join(", ")}
          </Badge>
        ) : (
          !c.hidden && <span className="text-gray-400">—</span>
        )}
      </div>
    ),
  },
  {
    label: "Publié le",
    sortKey: "createdAt",
    className: "whitespace-nowrap text-gray-600",
    render: (c) => shortDateFr(c.createdAt),
  },
];

export default function CommentsSection({ comments, search }: { comments: DashboardComment[]; search: string }) {
  const [filter, setFilter] = useState<Filter>("all");

  const rows = comments.filter(
    (c) =>
      (filter === "all" || (filter === "reported" && c.reportsCount > 0) || (filter === "hidden" && c.hidden)) &&
      matches(search, c.title, c.content, c.pseudo, c.articleTitle)
  );

  return (
    <>
      <FilterChips
        options={[
          { key: "all", label: "Tous", count: comments.length },
          { key: "reported", label: "Signalés", count: comments.filter((c) => c.reportsCount > 0).length },
          { key: "hidden", label: "Masqués", count: comments.filter((c) => c.hidden).length },
        ]}
        value={filter}
        onChange={setFilter}
      />
      <DashboardTable
        rows={rows}
        columns={COLUMNS}
        getId={(c) => c.id_comment}
        emptyLabel="Aucun commentaire ne correspond."
        // Les commentaires signalés remontent en premier
        initialSort={{ key: "reportsCount", order: "desc" }}
        resetKey={`${filter}|${search}`}
        rowClassName={(c) => (c.hidden ? "bg-gray-50 text-gray-500" : "")}
        renderMenu={(c, close) => (
          <ContextPopup
            id={c.id_comment}
            type="comment"
            href={`/articles/${c.articleSlug}#comment-${c.id_comment}`}
            hidden={c.hidden}
            reportsCount={c.reportsCount}
            onDone={close}
          />
        )}
      />
    </>
  );
}
