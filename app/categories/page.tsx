"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import SidebarResp from "@/components/SidebarResp";
import DisplayAllCategories from "./_components/DisplayAllCategories";
import Link from "next/link";
import Button from "@/components/BlueButton";

export default function CategoriesPage() {
  const [sidebarState, setSidebarState] = useState(0);

  const toggleSidebar = () => {
    setSidebarState((prevState) => (prevState === 0 ? 1 : 0));
  };

  return (
    <div className="bg-gray-100 h-full w-full p-0 m-0 box-border ">
      {sidebarState === 0 ? (
        <SidebarResp onToggle={toggleSidebar} />
      ) : (
        <Sidebar onToggle={toggleSidebar} />
      )}

      <div className="ml-24">
        <Link href="/">
          <h1 className="text-5xl text-center font-title italic uppercase font-bold text-aja-blue py-10 font-Bai_Jamjuree">
            Mémoire d&apos;Auxerrois
          </h1>
        </Link>

        <div>
          <h2 className="uppercase text-black font-Montserrat font-bold text-3xl text-center">
            Catégories
          </h2>
          <div>
            <DisplayAllCategories />
          </div>
          <div className="text-center">
            <Link href="/">
              <Button type="button">Je retourne à l&apos;accueil</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
