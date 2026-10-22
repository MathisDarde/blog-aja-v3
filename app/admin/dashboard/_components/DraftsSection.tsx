"use client";

import React from "react";
import { CalendarClock } from "lucide-react";
import ContextPopup from "./ContextPopup";
import DashboardTable, { Badge, DashboardColumn, MainCell, matches, shortDateFr } from "./DashboardTable";
import type { DashboardDraft } from "@/lib/dashboard-data";
import { formatScheduledAt } from "@/lib/schedule-date";

const COLUMNS: DashboardColumn<DashboardDraft>[] = [
  {
    label: "Brouillon",
    sortKey: "title",
    render: (d) => (
      <MainCell
        image={d.imageUrl || "/_assets/img/defaultarticlebanner.png"}
        shape="wide"
        title={d.title || <span className="italic text-gray-400 font-normal">Sans titre</span>}
        subtitle={d.author || "Auteur à renseigner"}
      />
    ),
  },
  {
    label: "Programmation",
    sortKey: "scheduledAt",
    render: (d) =>
      d.scheduledAt ? (
        <Badge tone="blue">
          <CalendarClock size={12} />
          <span className="first-letter:uppercase">{formatScheduledAt(d.scheduledAt)}</span>
        </Badge>
      ) : (
        <span className="text-gray-400">—</span>
      ),
  },
  {
    label: "Modifié le",
    sortKey: "updatedAt",
    className: "whitespace-nowrap text-gray-600",
    render: (d) => shortDateFr(d.updatedAt),
  },
];

export default function DraftsSection({ drafts, search }: { drafts: DashboardDraft[]; search: string }) {
  const rows = drafts.filter((d) => matches(search, d.title, d.teaser, d.author, ...d.tags));

  return (
    <DashboardTable
      rows={rows}
      columns={COLUMNS}
      getId={(d) => d.id_draft}
      emptyLabel="Aucun brouillon ne correspond."
      // Programmés d'abord, du plus proche au plus lointain
      initialSort={{ key: "scheduledAt", order: "asc" }}
      resetKey={search}
      renderMenu={(d, close) => (
        <ContextPopup
          id={d.id_draft}
          type="draft"
          href={`/admin/brouillons/${d.id_draft}/apercu`}
          editHref={`/admin/brouillons/${d.id_draft}`}
          onDone={close}
        />
      )}
    />
  );
}
