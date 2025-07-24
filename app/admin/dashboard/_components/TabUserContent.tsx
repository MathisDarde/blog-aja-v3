"use client";

import { EllipsisVertical } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import ContextPopup from "./ContextPopup";
import { User, UserSortKey } from "@/contexts/Interfaces";
import { useGlobalContext } from "@/contexts/GlobalContext";

export default function TabUserContent({
  searchTerm,
  users,
}: {
  searchTerm: string;
  users: User[];
}) {
  const {
    sortElements,
    openContextPopup,
    DashboardPopupId,
    DashboardPopupPosition,
    DashboardPopupRef,
  } = useGlobalContext();

  const [sortKey, setSortKey] = useState<UserSortKey>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const sortedUsers = sortElements({ elements: users, sortKey, sortOrder });

  const filteredUsers = sortedUsers.filter(
    (user) =>
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(user.admin).toLowerCase().includes(searchTerm.toLowerCase()) ||
      new Date(user.birthday)
        .toLocaleDateString("fr-FR")
        .includes(searchTerm) ||
      new Date(user.createdAt).toLocaleDateString("fr-FR").includes(searchTerm)
  );

  const handleSort = (key: UserSortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  return (
    <div className="overflow-x-auto w-fit">
      <table className="w-auto table-auto border border-gray-300">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-3 text-center">Photo</th>
            <th
              className="p-3 text-center cursor-pointer"
              onClick={() => handleSort("name")}
            >
              Nom {sortKey === "name" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th
              className="p-3 text-center cursor-pointer"
              onClick={() => handleSort("email")}
            >
              Email {sortKey === "email" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th
              className="p-3 text-center cursor-pointer"
              onClick={() => handleSort("birthday")}
            >
              Anniversaire{" "}
              {sortKey === "birthday" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th
              className="p-3 text-center cursor-pointer"
              onClick={() => handleSort("createdAt")}
            >
              Créé le{" "}
              {sortKey === "createdAt" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th
              className="p-3 text-center cursor-pointer"
              onClick={() => handleSort("admin")}
            >
              Admin {sortKey === "admin" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th className="p-3 text-center">
              <></>
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id} className="bg-white border-t border-gray-200">
              <td className="p-3 flex justify-center items-center w-[75px]">
                <Image
                  src={user.photodeprofil || "/_assets/img/pdpdebase.png"}
                  alt="Photo de profil"
                  width={128}
                  height={128}
                  className="rounded-full object-cover size-10"
                />
              </td>
              <td className="p-3 text-center w-[250px]">
                <div className="truncate max-w-[250px]">{user.name}</div>
              </td>
              <td className="p-3 text-center w-[250px]">
                <div className="truncate max-w-[250px]">{user.email}</div>
              </td>
              <td className="p-3 text-center w-[200px]">
                {new Date(user.birthday).toLocaleDateString("fr-FR", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </td>
              <td className="p-3 text-center w-[200px]">
                {new Date(user.createdAt).toLocaleDateString("fr-FR", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </td>

              <td className="p-3 text-center w-[125px]">
                {user.admin ? "Admin" : "Membre"}
              </td>
              <td
                className="p-3 text-center w-[50px] cursor-pointer text-gray-600"
                onClick={(event: React.MouseEvent) =>
                  openContextPopup({ id: user.id, event })
                }
              >
                <EllipsisVertical />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {DashboardPopupId && DashboardPopupPosition && (
        <div
          className="absolute z-50"
          style={{
            top: DashboardPopupPosition.top,
            left: DashboardPopupPosition.left,
          }}
          ref={DashboardPopupRef}
        >
          <ContextPopup id={DashboardPopupId} type="user" />
        </div>
      )}
    </div>
  );
}
