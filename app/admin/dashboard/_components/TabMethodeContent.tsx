"use client";

import React from "react";
import ContextPopup from "./ContextPopup";
import DashboardTable, { DashboardColumn, useTableSort } from "./DashboardTable";
import { MethodeSortKey, Methodes } from "@/contexts/Interfaces";
import { useGlobalContext } from "@/contexts/GlobalContext";
import { methodeUrl } from "@/lib/methodes";

function getMethodeTitle(m: Methodes): string {
  switch (m.typemethode) {
    case "coach": return m.nomcoach ?? "Méthode coach sans nom";
    case "joueur": return m.joueurnom ?? "Méthode joueur sans nom";
    case "match": return m.titrematch ?? "Méthode match sans titre";
    case "saison": return m.saison ?? "Méthode saison sans titre";
    default: return "Méthode sans titre";
  }
}

const COLUMNS: DashboardColumn<Methodes, MethodeSortKey>[] = [
  {
    label: "Type de méthode",
    width: "w-1/4",
    sortKey: "typemethode",
    render: (methode) => methode.typemethode,
    skeleton: { width: "80%" },
  },
  {
    label: "Titre",
    width: "w-1/4",
    render: getMethodeTitle,
    skeleton: { width: "90%" },
  },
  {
    label: "Date de publication",
    width: "w-1/4",
    sortKey: "createdAt",
    render: (methode) => methode.createdAt.toLocaleDateString(),
    skeleton: { width: "80%" },
  },
  {
    label: "MAJ le",
    width: "w-1/4",
    sortKey: "updatedAt",
    render: (methode) => methode.updatedAt.toLocaleDateString(),
    skeleton: { width: "80%" },
  },
];

export default function TabMethodeContent({
  searchTerm,
  methodes,
  isLoading,
}: {
  searchTerm: string;
  methodes: Methodes[];
  isLoading: boolean;
}) {
  const { sortElements } = useGlobalContext();
  const sort = useTableSort<MethodeSortKey>("typemethode");

  const filteredMethodes = sortElements<Methodes>({
    elements: methodes,
    sortKey: sort.key as keyof Methodes,
    sortOrder: sort.order,
  }).filter(
    (methode) =>
      methode.typemethode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      new Date(methode.createdAt).toLocaleDateString("fr-FR").includes(searchTerm)
  );

  return (
    <DashboardTable
      rows={filteredMethodes}
      columns={COLUMNS}
      getId={(methode) => methode.id_methode}
      isLoading={isLoading}
      emptyLabel="Aucune méthode ne correspond."
      sort={sort}
      resetKey={searchTerm}
      renderPopup={(methode) => (
        <ContextPopup id={methode.id_methode} type="method" href={methodeUrl(methode)} />
      )}
    />
  );
}
