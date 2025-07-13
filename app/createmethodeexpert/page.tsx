"use client";

import React, { useEffect, useState } from "react";
import SaisonForm from "./_components/SaisonForm";
import MatchForm from "./_components/MatchForm";
import JoueurForm from "./_components/JoueurForm";
import CoachForm from "./_components/CoachForm";

export default function CreateMethodeExpert() {
  const [typeMethode, setTypeMethode] = useState("saison");

  useEffect(() => {
    document.title = "Publier une méthode expert - Mémoire d'Auxerrois";

    if (!document.getElementById("favicon")) {
      const link = document.createElement("link");
      link.id = "favicon";
      link.rel = "icon";
      link.href = "/_assets/teamlogos/logoauxerre.svg";
      document.head.appendChild(link);
    }
  }, []);

  return (
    <div className="text-center bg-gray-100 min-h-screen w-screen box-border p-10">
      <h1 className="text-center font-Bai_Jamjuree text-4xl font-bold uppercase mb-10">
        Formulaire de création de méthode expert
      </h1>
      <div className="flex items-center justify-center gap-4 my-6 font-Montserrat">
        <button
          onClick={() => setTypeMethode("saison")}
          className={`p-2 ${
            typeMethode === "saison"
              ? "border-b-2 border-aja-blue font-semibold"
              : ""
          }`}
        >
          Méthode Saison
        </button>
        <button
          onClick={() => setTypeMethode("match")}
          className={`p-2 ${
            typeMethode === "match"
              ? "border-b-2 border-aja-blue font-semibold"
              : ""
          }`}
        >
          Méthode Match
        </button>
        <button
          onClick={() => setTypeMethode("joueur")}
          className={`p-2 ${
            typeMethode === "joueur"
              ? "border-b-2 border-aja-blue font-semibold"
              : ""
          }`}
        >
          Méthode Joueur
        </button>
        <button
          onClick={() => setTypeMethode("coach")}
          className={`p-2 ${
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
