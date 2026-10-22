"use client";

import Image from "next/image";
import React from "react";
import ContextPopup from "./ContextPopup";
import DashboardTable, { DashboardColumn, useTableSort } from "./DashboardTable";
import { Article, ArticleSortKey } from "@/contexts/Interfaces";
import { useGlobalContext } from "@/contexts/GlobalContext";
import type { ArticleStats } from "@/lib/article-stats";

type ArticleRow = Article & ArticleStats;
type ArticleRowSortKey = ArticleSortKey | keyof ArticleStats;

const COLUMNS: DashboardColumn<ArticleRow, ArticleRowSortKey>[] = [
  {
    label: "Image",
    width: "w-[75px]",
    media: true,
    render: (article) => (
      <Image
        src={article.imageUrl || "/_assets/img/defaultarticlebanner.png"}
        alt="Bannière de l'article"
        width={128}
        height={128}
        className="object-cover aspect-video"
      />
    ),
    skeleton: { width: "40px", height: "40px" },
  },
  {
    label: "Titre",
    width: "w-[500px]",
    sortKey: "title",
    render: (article) => <div className="truncate max-w-[500px]">{article.title}</div>,
    skeleton: { width: "250px" },
  },
  {
    label: "Statut",
    width: "w-[350px]",
    sortKey: "state",
    render: (article) => <div className="truncate max-w-[350px]">{article.state}</div>,
    skeleton: { width: "150px" },
  },
  {
    label: "Auteur",
    width: "w-[250px]",
    sortKey: "author",
    render: (article) => article.author,
    skeleton: { width: "120px" },
  },
  {
    label: "Publié le",
    width: "w-[125px]",
    sortKey: "createdAt",
    render: (article) => article.createdAt.toLocaleDateString(),
    skeleton: { width: "80px" },
  },
  {
    label: "MAJ le",
    width: "w-[125px]",
    sortKey: "updatedAt",
    render: (article) => article.updatedAt.toLocaleDateString(),
    skeleton: { width: "80px" },
  },
];

// Vues PostHog depuis la mise en ligne, affichées quand les stats sont configurées
const STATS_COLUMNS: DashboardColumn<ArticleRow, ArticleRowSortKey>[] = [
  {
    label: "Vues",
    width: "w-[100px]",
    sortKey: "views",
    render: (article) => article.views.toLocaleString("fr-FR"),
    skeleton: { width: "50px" },
  },
  {
    label: "Lecteurs",
    width: "w-[100px]",
    sortKey: "visitors",
    render: (article) => article.visitors.toLocaleString("fr-FR"),
    skeleton: { width: "50px" },
  },
];

export default function TabArticleContent({
  searchTerm,
  articles,
  stats,
  isLoading,
}: {
  searchTerm: string;
  articles: Article[];
  stats: Record<string, ArticleStats> | null;
  isLoading: boolean;
}) {
  const { sortElements } = useGlobalContext();
  const sort = useTableSort<ArticleRowSortKey>("title");

  const rows: ArticleRow[] = articles.map((article) => ({
    ...article,
    ...(stats?.[article.slug] ?? { views: 0, visitors: 0 }),
  }));

  const search = searchTerm.toLowerCase();
  const filteredArticles = sortElements({ elements: rows, sortKey: sort.key, sortOrder: sort.order }).filter(
    (article) =>
      article.title.toLowerCase().includes(search) ||
      article.content?.toLowerCase().includes(search) ||
      article.state.toLowerCase().includes(search) ||
      article.author.toLowerCase().includes(search) ||
      article.teaser.toLowerCase().includes(search) ||
      article.tags.some((tag) => tag.toLowerCase().includes(search)) ||
      new Date(article.createdAt).toLocaleDateString("fr-FR").includes(searchTerm)
  );

  return (
    <DashboardTable
      rows={filteredArticles}
      columns={stats ? [...COLUMNS, ...STATS_COLUMNS] : COLUMNS}
      getId={(article) => article.id_article}
      isLoading={isLoading}
      emptyLabel="Aucun article ne correspond."
      sort={sort}
      resetKey={searchTerm}
      renderPopup={(article) => (
        <ContextPopup id={article.id_article} type="article" state={article.state} slug={article.slug} />
      )}
    />
  );
}
