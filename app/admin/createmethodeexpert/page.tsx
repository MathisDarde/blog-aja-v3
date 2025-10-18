"use client";

import React, { useState, useRef } from "react";
import SaisonForm from "./_components/SaisonForm";
import MatchForm from "./_components/MatchForm";
import JoueurForm from "./_components/JoueurForm";
import CoachForm from "./_components/CoachForm";
import { ChevronDown } from "lucide-react";

export default function CreateMethodeExpert() {
  const [typeMethode, setTypeMethode] = useState("saison");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const methodes = [
    { key: "saison", label: "Méthode Saison" },
    { key: "match", label: "Méthode Match" },
    { key: "joueur", label: "Méthode Joueur" },
    { key: "coach", label: "Méthode Coach" },
  ];

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="text-center bg-gray-100 min-h-screen w-screen box-border p-6 sm:p-10">
      <h1 className="text-center font-Bai_Jamjuree text-3xl md:text-4xl font-bold uppercase mb-4 sm:mb-10">
        Formulaire de création de méthode expert
      </h1>

      {/* Version desktop : boutons */}
      <div className="hidden sm:flex flex-row items-center justify-center gap-4 my-6 font-Montserrat">
        {methodes.map((m) => (
          <button
            key={m.key}
            onClick={() => setTypeMethode(m.key)}
            className={`p-2 text-base ${
              typeMethode === m.key
                ? "border-b-2 border-aja-blue font-semibold"
                : ""
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Version mobile : dropdown */}
      <div
        ref={dropdownRef}
        className="sm:hidden relative w-[220px] mx-auto mb-8"
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex justify-between items-center border border-gray-300 rounded-md px-4 py-2 bg-white shadow-sm font-Montserrat text-sm"
        >
          <span>
            {methodes.find((m) => m.key === typeMethode)?.label ||
              "Sélectionner une méthode"}
          </span>
          <ChevronDown
            className={`w-4 h-4 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isOpen && (
          <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 shadow-md">
            {methodes.map((m) => (
              <button
                key={m.key}
                onClick={() => {
                  setTypeMethode(m.key);
                  setIsOpen(false);
                }}
                className={`block w-full text-left px-4 py-2 text-sm font-Montserrat hover:bg-gray-100 ${
                  typeMethode === m.key ? "text-aja-blue font-semibold" : ""
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        )}
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
