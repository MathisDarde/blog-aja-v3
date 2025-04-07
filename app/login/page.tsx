"use client";

import Link from "next/link";
import LoginForm from "./_components/LoginForm";
import { useEffect } from "react";

export default function Login() {
  useEffect(() => {
    document.title = "Je me connecte - Mémoire d'Auxerrois";

    if (!document.getElementById("favicon")) {
      const link = document.createElement("link");
      link.id = "favicon";
      link.rel = "icon";
      link.href = "/_assets/teamlogos/logoauxerre.svg";
      document.head.appendChild(link);
    }
  }, []);

  return (
    <>
      <div className="text-center bg-gray-100 h-screen flex flex-col justify-start items-center">
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
