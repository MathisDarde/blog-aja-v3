"use client";

import getUsersInfos from "@/actions/dashboard/get-users-infos";
import { EllipsisVertical, Loader2 } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import ContextPopup from "./ContextPopup";

interface User {
  id: string;
  name: string;
  email: string;
  birthday: Date;
  photodeprofil: string | null;
  createdAt: Date;
  updatedAt: Date;
  admin: boolean;
}

type SortKey = keyof Pick<
  User,
  "name" | "email" | "birthday" | "createdAt" | "admin"
>;

export default function TabUserContent() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [contextPopupId, setContextPopupId] = useState<string | null>(null);
  const [popupPosition, setPopupPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const popupRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const result = await getUsersInfos();
        if (Array.isArray(result)) {
          const parsed = result.map((u) => ({
            ...u,
            birthday: new Date(u.birthday),
            createdAt: new Date(u.createdAt),
            updatedAt: new Date(u.updatedAt),
            admin: u.admin === null ? false : u.admin,
          }));
          setUsers(parsed);
        } else {
          console.error("Failed to fetch users:", result.message);
        }
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des utilisateurs :",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    getUsers();
  }, []);

  const sortedUsers = [...users].sort((a, b) => {
    const aValue = a[sortKey];
    const bValue = b[sortKey];

    if (aValue instanceof Date && bValue instanceof Date) {
      return sortOrder === "asc"
        ? aValue.getTime() - bValue.getTime()
        : bValue.getTime() - aValue.getTime();
    }

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortOrder === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    if (typeof aValue === "boolean" && typeof bValue === "boolean") {
      return sortOrder === "asc"
        ? Number(aValue) - Number(bValue)
        : Number(bValue) - Number(aValue);
    }

    return 0;
  });

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const openContextPopup = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    setPopupPosition({
      top: rect.bottom + window.scrollY,
      left: rect.left + window.scrollX,
    });
    setContextPopupId((prev) => (prev === id ? null : id));
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        setContextPopupId(null);
        setPopupPosition(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
          {loading ? (
            <tr>
              <td colSpan={3} className="h-64 w-[1150px]">
                <div className="flex justify-center items-center h-full">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                  <span className="ml-2 text-gray-600">
                    Chargement des utilisateurs...
                  </span>
                </div>
              </td>
            </tr>
          ) : (
            sortedUsers.map((user) => (
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
                  {user.birthday.toLocaleDateString()}
                </td>
                <td className="p-3 text-center w-[200px]">
                  {user.createdAt.toLocaleDateString()}
                </td>
                <td className="p-3 text-center w-[125px]">
                  {user.admin ? "Admin" : "Membre"}
                </td>
                <td
                  className="p-3 text-center w-[50px] cursor-pointer text-gray-600"
                  onClick={(e: React.MouseEvent) =>
                    openContextPopup(user.id, e)
                  }
                >
                  <EllipsisVertical />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {contextPopupId && popupPosition && (
        <div
          className="absolute z-50"
          style={{ top: popupPosition.top, left: popupPosition.left }}
          ref={popupRef}
        >
          <ContextPopup id={contextPopupId} type="user" />
        </div>
      )}
    </div>
  );
}
