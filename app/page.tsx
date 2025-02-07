"use client";

import "./globals.css";
import SidebarResp from "@/components/SidebarResp";
import Sidebar from "@/components/Sidebar";
import Calendrier from "@/components/Calendrier";
import Link from "next/link";
import React, { useState } from "react";

export default function Page() {
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
          <p className="text-5xl text-center font-title italic uppercase font-bold text-aja-blue py-10 font-Bai_Jamjuree">
            Mémoire d'Auxerrois
          </p>
        </Link>

        <div className="">
          <Calendrier />
        </div>

        <div className="my-10">
          <h1 className="uppercase text-3xl font-Montserrat font-bold text-center">
            A la une sur Mémoire d'Auxerrois
          </h1>
        </div>
      </div>
    </div>
  );
}
