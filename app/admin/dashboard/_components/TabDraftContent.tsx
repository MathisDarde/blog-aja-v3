"use client";

import Image from "next/image";
import React from "react";
import ContextPopup from "./ContextPopup";
import DashboardTable, { DashboardColumn, useTableSort } from "./DashboardTable";
import { Draft, DraftSortKey } from "@/contexts/Interfaces";
import { useGlobalContext } from "@/contexts/GlobalContext";
import { formatScheduledAt } from "@/lib/schedule-date";

// Champs vides tant que le brouillon n'est pas complet
type DraftRow = Draft & { title: string; author: string };

const COLUMNS: DashboardColumn<DraftRow, DraftSortKey>[] = [
  {
    label: "Image",
    width: "w-[75px]",
    media: true,
    render: (draft) => (
      <Image
        src={draft.imageUrl || "/_assets/img/defaultarticlebanner.png"}
        alt="Bannière du brouillon"
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
    render: (draft) => (
      <div className="truncate max-w-[500px]">
        {draft.title || <span className="italic text-gray-400">Sans titre</span>}
      </div>
    ),
    skeleton: { width: "250px" },
  },
  {
    label: "Programmé pour",
    width: "w-[350px]",
    sortKey: "scheduledAt",
    render: (draft) => (
      <div className="truncate max-w-[350px]">
        {draft.scheduledAt ? formatScheduledAt(draft.scheduledAt) : "—"}
      </div>
    ),
    skeleton: { width: "150px" },
  },
  {
    label: "Auteur",
    width: "w-[250px]",
    sortKey: "author",
    render: (draft) => draft.author || "—",
    skeleton: { width: "120px" },
  },
  {
    label: "Créé le",
    width: "w-[125px]",
    sortKey: "createdAt",
    render: (draft) => draft.createdAt.toLocaleDateString(),
    skeleton: { width: "80px" },
  },
  {
    label: "MAJ le",
    width: "w-[125px]",
    sortKey: "updatedAt",
    render: (draft) => draft.updatedAt.toLocaleDateString(),
    skeleton: { width: "80px" },
  },
];

export default function TabDraftContent({
  searchTerm,
  drafts,
  isLoading,
}: {
  searchTerm: string;
  drafts: Draft[];
  isLoading: boolean;
}) {
  const { sortElements } = useGlobalContext();
  // Programmés d'abord, du plus proche au plus lointain
  const sort = useTableSort<DraftSortKey>("scheduledAt");

  const rows: DraftRow[] = drafts.map((draft) => ({
    ...draft,
    title: draft.title ?? "",
    author: draft.author ?? "",
  }));

  // Les brouillons non programmés restent en bas, quel que soit l'ordre
  const sortedDrafts =
    sort.key === "scheduledAt"
      ? [...rows].sort((a, b) => {
          if (!a.scheduledAt || !b.scheduledAt) {
            return (a.scheduledAt ? 0 : 1) - (b.scheduledAt ? 0 : 1);
          }
          const diff = a.scheduledAt.getTime() - b.scheduledAt.getTime();
          return sort.order === "asc" ? diff : -diff;
        })
      : sortElements({ elements: rows, sortKey: sort.key, sortOrder: sort.order });

  const search = searchTerm.toLowerCase();
  const filteredDrafts = sortedDrafts.filter(
    (draft) =>
      draft.title.toLowerCase().includes(search) ||
      draft.content?.toLowerCase().includes(search) ||
      draft.author.toLowerCase().includes(search) ||
      draft.teaser?.toLowerCase().includes(search) ||
      draft.tags?.some((tag) => tag.toLowerCase().includes(search)) ||
      new Date(draft.createdAt).toLocaleDateString("fr-FR").includes(searchTerm)
  );

  return (
    <DashboardTable
      rows={filteredDrafts}
      columns={COLUMNS}
      getId={(draft) => draft.id_draft}
      isLoading={isLoading}
      emptyLabel="Aucun brouillon ne correspond."
      sort={sort}
      resetKey={searchTerm}
      renderPopup={(draft) => <ContextPopup id={draft.id_draft} type="draft" />}
    />
  );
}
