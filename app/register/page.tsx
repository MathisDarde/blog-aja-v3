"use client";

import React from "react";
import Link from "next/link";
import InscForm from "./_components/InscForm";

function Inscription() {
  return (
    <div className="bg-gray-100 h-full flex flex-col justify-start items-center">
      <h2 className="font-bold text-4xl font-Montserrat uppercase mb-4 mt-10">
        Formulaire d'inscription
      </h2>
      <button className="inline-block text-sm font-Montserrat text-center m-4 py-2 px-6 rounded-full text-aja-blue bg-white border border-gray-600 transition-all cursor-pointer uppercase font-semibold">
        <Link href="/login">Je possède déjà un compte</Link>
      </button>

      <InscForm />
    </div>
  );
}

export default Inscription;
