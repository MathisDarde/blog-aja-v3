"use client";

import Link from "next/link";
import LoginForm from "./_components/LoginForm";
import SidebarResp from "@/components/SidebarResp";
import Sidebar from "@/components/Sidebar";
import { useState } from "react";

export default function Login() {
  const [sidebarState, setSidebarState] = useState(0);

  const toggleSidebar = () => {
    setSidebarState((prevState) => (prevState === 0 ? 1 : 0));
  };
  return (
    <>
      <div className="text-center bg-gray-100 h-screen flex flex-col justify-start items-center">
        {sidebarState === 0 ? (
          <SidebarResp onToggle={toggleSidebar} />
        ) : (
          <Sidebar onToggle={toggleSidebar} />
        )}
        <h2 className="font-bold text-4xl font-Montserrat uppercase mb-4 mt-10">
          Connectez-vous
        </h2>
        <button className="inline-block text-sm font-Montserrat text-center m-4 py-2 px-6 rounded-full text-aja-blue bg-white border border-gray-600 transition-all cursor-pointer uppercase font-semibold">
          <Link href="/register">Je ne possède pas de compte</Link>
        </button>

        <LoginForm />
      </div>
    </>
  );
}
