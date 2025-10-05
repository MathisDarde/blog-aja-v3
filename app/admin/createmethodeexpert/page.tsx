"use client";

import React, { useState } from "react";
import SaisonForm from "./_components/SaisonForm";
import MatchForm from "./_components/MatchForm";
import JoueurForm from "./_components/JoueurForm";
import CoachForm from "./_components/CoachForm";

export default function CreateMethodeExpert() {
  const [typeMethode, setTypeMethode] = useState("saison");

  return (
    <div className="text-center bg-gray-100 min-h-screen w-screen box-border p-10">
      <h1 className="text-center font-Bai_Jamjuree text-3xl md:text-4xl font-bold uppercase mb-4 sm:mb-10">
        Formulaire de création de méthode expert
      </h1>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 my-6 font-Montserrat">
        <button
          onClick={() => setTypeMethode("saison")}
          className={`p-2 text-sm sm:text-base ${
            typeMethode === "saison"
              ? "border-b-2 border-aja-blue font-semibold"
              : ""
          }`}
        >
          Méthode Saison
        </button>
        <button
          onClick={() => setTypeMethode("match")}
          className={`p-2 text-sm sm:text-base ${
            typeMethode === "match"
              ? "border-b-2 border-aja-blue font-semibold"
              : ""
          }`}
        >
          Méthode Match
        </button>
        <button
          onClick={() => setTypeMethode("joueur")}
          className={`p-2 text-sm sm:text-base ${
            typeMethode === "joueur"
              ? "border-b-2 border-aja-blue font-semibold"
              : ""
          }`}
        >
          Méthode Joueur
        </button>
        <button
          onClick={() => setTypeMethode("coach")}
          className={`p-2 text-sm sm:text-base ${
            typeMethode === "coach"
              ? "border-b-2 border-aja-blue font-semibold"
              : ""
          }`}
        >
          Méthode Coach
        </button>
      </div>

      <div>
        {typeMethode === "saison" ? (
          <SaisonForm />
        ) : typeMethode === "match" ? (
          <MatchForm />
        ) : typeMethode === "joueur" ? (
          <JoueurForm />
        ) : (
          <CoachForm />
        )}
      </div>
    </div>
  );
}
