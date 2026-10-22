"use client";

import React, { useState } from "react";
import { CalendarRange, Swords } from "lucide-react";
import ContextPopup from "./ContextPopup";
import DashboardTable, { Badge, DashboardColumn, FilterChips, MainCell, matches, shortDateFr } from "./DashboardTable";
import type { DashboardMethode } from "@/lib/dashboard-data";
import { METHODE_TYPES, MethodeType } from "@/lib/methodes";

const LABELS = Object.fromEntries(METHODE_TYPES.map((t) => [t.type, t.label])) as Record<MethodeType, string>;

const COLUMNS: DashboardColumn<DashboardMethode>[] = [
  {
    label: "Méthode",
    sortKey: "name",
    render: (m) => (
      <MainCell
        image={m.image}
        shape={m.typemethode === "joueur" || m.typemethode === "coach" ? "round" : "square"}
        title={m.name}
        subtitle={m.details}
        fallback={m.typemethode === "match" ? <Swords size={18} /> : <CalendarRange size={18} />}
      />
    ),
  },
  {
    label: "Type",
    sortKey: "typemethode",
    render: (m) => <Badge tone="blue">{LABELS[m.typemethode]}</Badge>,
  },
  {
    label: "Modifié le",
    sortKey: "updatedAt",
    className: "whitespace-nowrap text-gray-600",
    render: (m) => shortDateFr(m.updatedAt),
  },
];

export default function MethodesSection({ methodes, search }: { methodes: DashboardMethode[]; search: string }) {
  const [filter, setFilter] = useState<MethodeType | "all">("all");

  const rows = methodes.filter(
    (m) => (filter === "all" || m.typemethode === filter) && matches(search, m.name, m.details)
  );

  return (
    <>
      <FilterChips
        options={[
          { key: "all" as const, label: "Toutes", count: methodes.length },
          ...METHODE_TYPES.map((t) => ({
            key: t.type,
            label: t.plural,
            count: methodes.filter((m) => m.typemethode === t.type).length,
          })),
        ]}
        value={filter}
        onChange={setFilter}
      />
      <DashboardTable
        rows={rows}
        columns={COLUMNS}
        getId={(m) => m.id_methode}
        emptyLabel="Aucune méthode ne correspond."
        initialSort={{ key: "updatedAt", order: "desc" }}
        resetKey={`${filter}|${search}`}
        renderMenu={(m, close) => (
          <ContextPopup
            id={m.id_methode}
            type="method"
            href={m.url}
            editHref={`/admin/dashboard/updateelement/${m.id_methode}`}
            onDone={close}
          />
        )}
      />
    </>
  );
}
