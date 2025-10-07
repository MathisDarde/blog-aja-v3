"use client";

import { EllipsisVertical } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import ContextPopup from "./ContextPopup";
import { User, UserSortKey } from "@/contexts/Interfaces";
import { useGlobalContext } from "@/contexts/GlobalContext";
import { createPortal } from "react-dom";

export default function TabUserContent({
  searchTerm,
  users,
}: {
  searchTerm: string;
  users: User[];
}) {
  const {
    sortElements,
  } = useGlobalContext();

  const [sortKey, setSortKey] = useState<UserSortKey>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [popupPosition, setPopupPosition] = useState<{ top: number; left: number } | null>(null);

  const popupRef = useRef<HTMLDivElement>(null);

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

  const handleOpenPopup = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    setSelectedUserId((prev) => (prev === id ? null : id));
    setPopupPosition({
      top: rect.bottom + window.scrollY,
      left: rect.left + window.scrollX,
    });
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setSelectedUserId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedUser = users.find((a) => a.id === selectedUserId);

  return (
    <div className="overflow-x-auto w-fit">
      <table className="w-auto table-auto border border-gray-300">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-3 text-center w-[75px]">Photo</th>
            <th
              className="p-3 text-center cursor-pointer w-[250px]"
              onClick={() => handleSort("name")}
            >
              Nom {sortKey === "name" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th
              className="p-3 text-center cursor-pointer w-[250px]"
              onClick={() => handleSort("email")}
            >
              Email {sortKey === "email" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th
              className="p-3 text-center cursor-pointer w-[200px]"
              onClick={() => handleSort("birthday")}
            >
              Anniversaire{" "}
              {sortKey === "birthday" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th
              className="p-3 text-center cursor-pointer w-[200px]"
              onClick={() => handleSort("createdAt")}
            >
              Créé le{" "}
              {sortKey === "createdAt" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th
              className="p-3 text-center cursor-pointer  w-[125px]"
              onClick={() => handleSort("admin")}
            >
              Admin {sortKey === "admin" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th className="p-3 text-center w-[75px]">
              <></>
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
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
                <td className="p-3 text-center w-[50px] cursor-pointer text-gray-600"
                  onClick={(e) => handleOpenPopup(user.id, e)}>
                  <EllipsisVertical />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="p-3 text-center text-gray-500">
                Aucun utilisateur ne correspond.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {selectedUser && popupPosition &&
        createPortal(
          <div ref={popupRef} className="absolute z-50" style={{ top: popupPosition.top, left: popupPosition.left }}>
            <ContextPopup id={selectedUser.id} type="user" isAdmin={selectedUser.admin} />
          </div>,
          document.body
        )}
    </div>
  );
}
