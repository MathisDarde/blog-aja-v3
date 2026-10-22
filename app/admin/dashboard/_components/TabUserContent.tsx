"use client";

import Image from "next/image";
import React from "react";
import ContextPopup from "./ContextPopup";
import DashboardTable, { DashboardColumn, useTableSort } from "./DashboardTable";
import { User, UserSortKey } from "@/contexts/Interfaces";
import { useGlobalContext } from "@/contexts/GlobalContext";

const frDate = (date: Date | string | null | undefined) =>
  date ? new Date(date).toLocaleDateString("fr-FR") : "-";

const COLUMNS: DashboardColumn<User, UserSortKey>[] = [
  {
    label: "Photo",
    width: "w-[75px]",
    media: true,
    render: (user) => (
      <Image
        src={user.image || "/_assets/img/pdpdebase.png"}
        alt="Photo de profil"
        width={128}
        height={128}
        className="rounded-full object-cover size-10"
      />
    ),
    skeleton: { width: "40px", height: "40px", className: "rounded-full" },
  },
  {
    label: "Nom",
    width: "w-[250px]",
    sortKey: "name",
    render: (user) => <div className="truncate max-w-[250px]">{user.name}</div>,
    skeleton: { width: "150px" },
  },
  {
    label: "Email",
    width: "w-[250px]",
    sortKey: "email",
    render: (user) => <div className="truncate max-w-[250px]">{user.email}</div>,
    skeleton: { width: "180px" },
  },
  {
    label: "Anniversaire",
    width: "w-[200px]",
    sortKey: "birthday",
    render: (user) => frDate(user.birthday),
    skeleton: { width: "100px" },
  },
  {
    label: "Créé le",
    width: "w-[200px]",
    sortKey: "createdAt",
    render: (user) => frDate(user.createdAt),
    skeleton: { width: "100px" },
  },
  {
    label: "MAJ le",
    width: "w-[200px]",
    sortKey: "updatedAt",
    render: (user) => frDate(user.updatedAt),
    skeleton: { width: "100px" },
  },
  {
    label: "Admin",
    width: "w-[125px]",
    sortKey: "admin",
    render: (user) => (user.admin ? "Admin" : "Membre"),
    skeleton: { width: "60px" },
  },
];

export default function TabUserContent({
  searchTerm,
  users,
  isLoading,
}: {
  searchTerm: string;
  users: User[];
  isLoading: boolean;
}) {
  const { sortElements } = useGlobalContext();
  const sort = useTableSort<UserSortKey>("name");

  const search = searchTerm.toLowerCase();
  const filteredUsers = sortElements({ elements: users, sortKey: sort.key, sortOrder: sort.order }).filter(
    (user) =>
      user.email.toLowerCase().includes(search) ||
      user.name.toLowerCase().includes(search) ||
      String(user.admin).toLowerCase().includes(search) ||
      (user.birthday ? frDate(user.birthday).includes(searchTerm) : false) ||
      (user.createdAt ? frDate(user.createdAt).includes(searchTerm) : false)
  );

  return (
    <DashboardTable
      rows={filteredUsers}
      columns={COLUMNS}
      getId={(user) => user.id}
      isLoading={isLoading}
      emptyLabel="Aucun utilisateur ne correspond."
      sort={sort}
      resetKey={searchTerm}
      renderPopup={(user) => <ContextPopup id={user.id} type="user" isAdmin={user.admin} />}
    />
  );
}
