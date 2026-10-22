"use client";

import React, { useState } from "react";
import ContextPopup from "./ContextPopup";
import DashboardTable, { Badge, DashboardColumn, FilterChips, MainCell, matches, shortDateFr } from "./DashboardTable";
import type { DashboardUser } from "@/lib/dashboard-data";

type Filter = "all" | "admins";

const COLUMNS: DashboardColumn<DashboardUser>[] = [
  {
    label: "Utilisateur",
    sortKey: "name",
    render: (u) => (
      <MainCell
        image={u.image || "/_assets/img/pdpdebase.png"}
        shape="round"
        title={u.name}
        subtitle={u.email}
      />
    ),
  },
  {
    label: "Rôle",
    sortKey: "admin",
    render: (u) => (u.admin ? <Badge tone="blue">Admin</Badge> : <Badge tone="gray">Membre</Badge>),
  },
  {
    label: "Inscrit le",
    sortKey: "createdAt",
    className: "whitespace-nowrap text-gray-600",
    render: (u) => shortDateFr(u.createdAt),
  },
];

export default function UsersSection({ users, search }: { users: DashboardUser[]; search: string }) {
  const [filter, setFilter] = useState<Filter>("all");
  const admins = users.filter((u) => u.admin).length;

  const rows = users.filter((u) => (filter === "all" || u.admin) && matches(search, u.name, u.email));

  return (
    <>
      <FilterChips
        options={[
          { key: "all", label: "Tous", count: users.length },
          { key: "admins", label: "Admins", count: admins },
        ]}
        value={filter}
        onChange={setFilter}
      />
      <DashboardTable
        rows={rows}
        columns={COLUMNS}
        getId={(u) => u.id}
        emptyLabel="Aucun utilisateur ne correspond."
        initialSort={{ key: "createdAt", order: "desc" }}
        resetKey={`${filter}|${search}`}
        renderMenu={(u, close) => (
          <ContextPopup
            id={u.id}
            type="user"
            href={`/admin/dashboard/previewelement/${u.id}`}
            isAdmin={u.admin}
            onDone={close}
          />
        )}
      />
    </>
  );
}
