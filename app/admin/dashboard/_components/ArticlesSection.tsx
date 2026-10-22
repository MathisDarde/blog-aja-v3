"use client";

import React, { useState } from "react";
import ContextPopup from "./ContextPopup";
import DashboardTable, { Badge, DashboardColumn, FilterChips, MainCell, matches, shortDateFr } from "./DashboardTable";
import type { DashboardArticle } from "@/lib/dashboard-data";
import type { ArticleStats } from "@/lib/article-stats";

type Row = DashboardArticle & Partial<ArticleStats>;
type Filter = "all" | "published" | "archived";

const COLUMNS: DashboardColumn<Row>[] = [
  {
    label: "Article",
    sortKey: "title",
    render: (a) => (
      <MainCell
        image={a.imageUrl || "/_assets/img/defaultarticlebanner.png"}
        shape="wide"
        title={a.title}
        subtitle={a.author}
      />
    ),
  },
  {
    label: "Statut",
    sortKey: "state",
    render: (a) =>
      a.state === "published" ? (
        <Badge tone="green">En ligne</Badge>
      ) : a.state === "archived" ? (
        <Badge tone="gray">Archivé</Badge>
      ) : (
        <Badge tone="orange">En attente</Badge>
      ),
  },
  {
    label: "Publié le",
    sortKey: "createdAt",
    className: "whitespace-nowrap text-gray-600",
    render: (a) => shortDateFr(a.createdAt),
  },
  {
    label: "Modifié le",
    sortKey: "updatedAt",
    className: "whitespace-nowrap text-gray-600",
    render: (a) => shortDateFr(a.updatedAt),
  },
];

// Vues PostHog depuis la mise en ligne, affichées quand les stats sont configurées
const STATS_COLUMNS: DashboardColumn<Row>[] = [
  {
    label: "Vues",
    sortKey: "views",
    className: "text-right tabular-nums",
    render: (a) => (a.views ?? 0).toLocaleString("fr-FR"),
  },
  {
    label: "Lecteurs",
    sortKey: "visitors",
    className: "text-right tabular-nums",
    render: (a) => (a.visitors ?? 0).toLocaleString("fr-FR"),
  },
];

export default function ArticlesSection({
  articles,
  stats,
  search,
}: {
  articles: DashboardArticle[];
  stats: Record<string, ArticleStats> | null;
  search: string;
}) {
  const [filter, setFilter] = useState<Filter>("all");
  const countOf = (state: DashboardArticle["state"]) => articles.filter((a) => a.state === state).length;

  const rows: Row[] = articles
    .filter((a) => (filter === "all" || a.state === filter) && matches(search, a.title, a.teaser, a.author, ...a.tags))
    .map((a) => ({ ...a, ...(stats ? (stats[a.slug] ?? { views: 0, visitors: 0 }) : {}) }));

  return (
    <>
      <FilterChips
        options={[
          { key: "all", label: "Tous", count: articles.length },
          { key: "published", label: "En ligne", count: countOf("published") },
          { key: "archived", label: "Archivés", count: countOf("archived") },
        ]}
        value={filter}
        onChange={setFilter}
      />
      <DashboardTable
        rows={rows}
        columns={stats ? [...COLUMNS, ...STATS_COLUMNS] : COLUMNS}
        getId={(a) => a.id_article}
        emptyLabel="Aucun article ne correspond."
        initialSort={{ key: "createdAt", order: "desc" }}
        resetKey={`${filter}|${search}`}
        rowClassName={(a) => (a.state === "archived" ? "text-gray-500" : "")}
        renderMenu={(a, close) => (
          <ContextPopup
            id={a.id_article}
            type="article"
            // Un article archivé n'a plus de page publique
            href={a.state === "published" ? `/articles/${a.slug}` : null}
            editHref={`/articles/${a.slug}/update`}
            state={a.state}
            onDone={close}
          />
        )}
      />
    </>
  );
}
