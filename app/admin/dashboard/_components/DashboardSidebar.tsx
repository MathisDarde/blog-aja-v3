"use client";

import React from "react";

type Props = {
  onMenuClick: (menu: string) => void;
  activeMenu: string;
};

export default function DashboardSidebar({ onMenuClick, activeMenu }: Props) {
  const items = [
    {
      title: "Utilisateurs",
      key: "users",
    },
    {
      title: "Articles",
      key: "articles",
    },
    {
      title: "Méthodes expert",
      key: "methodeexpert",
    },
    {
      title: "Commentaires",
      key: "comments",
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      {items.map((item) => (
        <button
          key={item.key}
          onClick={() => onMenuClick(item.key)}
          className={`block w-full text-left px-4 py-2 rounded ${
            activeMenu === item.key
              ? "bg-aja-blue text-white"
              : "hover:bg-gray-300"
          }`}
        >
          {item.title}
        </button>
      ))}
    </div>
  );
}
