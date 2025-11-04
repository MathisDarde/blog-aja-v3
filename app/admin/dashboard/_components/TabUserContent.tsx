"use client";

import { ChevronLeft, ChevronRight, EllipsisVertical } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import ContextPopup from "./ContextPopup";
import { User, UserSortKey } from "@/contexts/Interfaces";
import { useGlobalContext } from "@/contexts/GlobalContext";
import { createPortal } from "react-dom";
import Skeleton from "@/components/CustomSkeleton";

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

  const [sortKey, setSortKey] = useState<UserSortKey>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [popupPosition, setPopupPosition] = useState<{ top: number; left: number } | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageInput, setPageInput] = useState("1");
  const itemsPerPage = 10;

  const popupRef = useRef<HTMLDivElement>(null);

  const sortedUsers = sortElements({ elements: users, sortKey, sortOrder });

  const filteredUsers = sortedUsers.filter(
    (user) =>
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(user.admin).toLowerCase().includes(searchTerm.toLowerCase()) ||
      new Date(user.birthday).toLocaleDateString("fr-FR").includes(searchTerm) ||
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
    const popupWidth = 220;
    const top = rect.bottom + window.scrollY + 4;
    let left = rect.right + window.scrollX - popupWidth;
    const maxLeft = window.innerWidth - popupWidth - 8;
    if (left > maxLeft) left = maxLeft;
    if (left < 8) left = 8;

    setSelectedUserId((prev) => (prev === id ? null : id));
    setPopupPosition({ top, left });
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

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      setPageInput(String(newPage));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => setPageInput(e.target.value);
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const newPage = parseInt(pageInput, 10);
      if (!isNaN(newPage)) handlePageChange(newPage);
    }
  };

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-auto table-auto border border-gray-300">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-3 text-center w-[75px]">Photo</th>
            <th className="p-3 text-center cursor-pointer w-[250px]" onClick={() => handleSort("name")}>
              Nom {sortKey === "name" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th className="p-3 text-center cursor-pointer w-[250px]" onClick={() => handleSort("email")}>
              Email {sortKey === "email" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th className="p-3 text-center cursor-pointer w-[200px]" onClick={() => handleSort("birthday")}>
              Anniversaire {sortKey === "birthday" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th className="p-3 text-center cursor-pointer w-[200px]" onClick={() => handleSort("createdAt")}>
              Créé le {sortKey === "createdAt" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th className="p-3 text-center cursor-pointer w-[200px]" onClick={() => handleSort("updatedAt")}>
              MAJ le {sortKey === "updatedAt" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th className="p-3 text-center cursor-pointer w-[125px]" onClick={() => handleSort("admin")}>
              Admin {sortKey === "admin" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th className="p-3 text-center w-[50px]"></th>
          </tr>
        </thead>
        <tbody>
          {isLoading
            ? Array.from({ length: 10 }).map((_, index) => (
                <tr key={index} className="bg-white border-t border-gray-200">
                  <td className="p-3 flex justify-center items-center w-[75px]">
                    <Skeleton height="40px" width="40px" className="rounded-full" animated />
                  </td>
                  <td className="p-3 text-center w-[250px]">
                    <Skeleton height="20px" width="150px" animated />
                  </td>
                  <td className="p-3 text-center w-[250px]">
                    <Skeleton height="20px" width="180px" animated />
                  </td>
                  <td className="p-3 text-center w-[200px]">
                    <Skeleton height="20px" width="100px" animated />
                  </td>
                  <td className="p-3 text-center w-[200px]">
                    <Skeleton height="20px" width="100px" animated />
                  </td>
                  <td className="p-3 text-center w-[200px]">
                    <Skeleton height="20px" width="100px" animated />
                  </td>
                  <td className="p-3 text-center w-[125px]">
                    <Skeleton height="20px" width="60px" animated />
                  </td>
                  <td className="p-3 text-center w-[50px]">
                    <Skeleton height="20px" width="20px" animated />
                  </td>
                </tr>
              ))
            : filteredUsers.length > 0
            ? paginatedUsers.map((user) => (
                <tr key={user.id} className="bg-white border-t border-gray-200">
                  <td className="p-3 flex justify-center items-center w-[75px]">
                    <Image
                      src={user.image || "/_assets/img/pdpdebase.png"}
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
                    {new Date(user.birthday).toLocaleDateString("fr-FR")}
                  </td>
                  <td className="p-3 text-center w-[200px]">
                    {new Date(user.createdAt).toLocaleDateString("fr-FR")}
                  </td>
                  <td className="p-3 text-center w-[200px]">
                    {new Date(user.updatedAt).toLocaleDateString("fr-FR")}
                  </td>
                  <td className="p-3 text-center w-[125px]">{user.admin ? "Admin" : "Membre"}</td>
                  <td
                    className="p-3 text-center w-[50px] cursor-pointer text-gray-600"
                    onClick={(e) => handleOpenPopup(user.id, e)}
                  >
                    <EllipsisVertical />
                  </td>
                </tr>
              ))
            : (
                <tr>
                  <td colSpan={8} className="p-3 text-center text-gray-500">
                    Aucun utilisateur ne correspond.
                  </td>
                </tr>
              )}
        </tbody>
      </table>

      {/* Pagination */}
      {!isLoading && filteredUsers.length > 0 && (
        <div className="flex items-center justify-start md:justify-center gap-4 my-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-2 md:px-3 py-1 rounded-md border flex items-center gap-1 ${
              currentPage === 1
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-aja-blue text-white hover:bg-orange-third transition-colors"
            }`}
          >
            <ChevronLeft /> <span className="hidden md:block text-sm">Précédent</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="hidden sm:block text-sm">Page</span>
            <input
              type="number"
              min={1}
              max={totalPages}
              value={pageInput}
              onChange={handleInputChange}
              onKeyDown={handleInputKeyDown}
              className="w-12 text-center border rounded-md text-sm py-1"
            />
            <span className="text-sm">sur {totalPages}</span>
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-2 md:px-3 py-1 rounded-md border flex items-center gap-1 ${
              currentPage === totalPages
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-aja-blue text-white hover:bg-orange-third transition-colors"
            }`}
          >
            <span className="hidden md:block text-sm">Suivant</span>
            <ChevronRight />
          </button>
        </div>
      )}

      {selectedUser && popupPosition &&
        createPortal(
          <div
            ref={popupRef}
            className="absolute z-50"
            style={{ top: popupPosition.top, left: popupPosition.left }}
            onClick={(e) => e.stopPropagation()}
          >
            <ContextPopup id={selectedUser.id} type="user" isAdmin={selectedUser.admin} />
          </div>,
          document.body
        )}
    </div>
  );
}
