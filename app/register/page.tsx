"use client";

import { useEffect } from "react";
import Link from "next/link";
import InscForm from "./_components/InscForm";

export default function Inscription() {
  useEffect(() => {
    document.title = "Je m'inscris - Mémoire d'Auxerrois";

    if (!document.getElementById("favicon")) {
      const link = document.createElement("link");
      link.id = "favicon";
      link.rel = "icon";
      link.href = "/_assets/teamlogos/logoauxerre.svg";
      document.head.appendChild(link);
    }
  }, []);

  return (
    <div className="bg-gray-100 h-full flex flex-col justify-start items-center 2xl:h-screen">
      <h2 className="font-bold text-4xl font-Montserrat uppercase mb-4 mt-10">
        Formulaire d&apos;inscription
      </h2>
      <button className="inline-block text-sm font-Montserrat text-center m-4 py-2 px-6 rounded-full text-aja-blue bg-white border border-gray-600 transition-all cursor-pointer uppercase font-semibold">
        <Link href="/login">Je possède déjà un compte</Link>
      </button>
      <InscForm />
    </div>
  );
}
