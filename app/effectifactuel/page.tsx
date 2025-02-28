"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import SidebarResp from "@/components/SidebarResp";

// Type pour un joueur
type Joueur = {
  nom: string;
  age: number;
  poste: string;
  nationalite: string;
  natflag: string;
  number: number;
  imagejoueur: string;
};

export default function EffectifActuel() {
  const [joueurs, setJoueurs] = useState<Joueur[]>([]);

  useEffect(() => {
    // Charger le JSON au montage du composant
    fetch("/data/effectifactuel.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erreur lors du chargement du fichier JSON");
        }
        return response.json();
      })
      .then((data: Joueur[]) => setJoueurs(data))
      .catch((error) =>
        console.error("Erreur lors du chargement JSON :", error)
      );
  }, []);

  const [sidebarState, setSidebarState] = useState(0);

  const toggleSidebar = () => {
    setSidebarState((prevState) => (prevState === 0 ? 1 : 0));
  };

  return (
    <div className="bg-gray-100 h-full w-full p-0 m-0 box-border">
      {sidebarState === 0 ? (
        <SidebarResp onToggle={toggleSidebar} />
      ) : (
        <Sidebar onToggle={toggleSidebar} />
      )}
      <div className="ml-24">
        <div className="text-center">
          <Link href={"/"}>
            <p className="text-5xl text-center font-title italic uppercase font-bold text-aja-blue py-10">
              Mémoire d'Auxerrois
            </p>
          </Link>
        </div>

        <div className="text-center m-6">
          <h3 className="text-center font-Montserrat text-4xl font-bold uppercase mt-10 mb-5">
            Effectif Actuel:
          </h3>
          <div className="text-left">
            {["Gardien", "Défenseur", "Milieu", "Attaquant", "Staff"].map(
              (category) => (
                <div key={category}>
                  <h4 className="text-2xl my-2 ml-28 underline font-semibold font-Montserrat">
                    {category} :
                  </h4>
                  <div className="relative grid grid-cols-2 grid-rows-2 justify-around content-start pb-6 mx-10">
                    {joueurs
                      .filter((joueur) => joueur.poste === category)
                      .map((joueur) => (
                        <div
                          key={joueur.nom}
                          className="bg-white w-4/5 h-48 my-4 box-border flex-shrink-0 rounded-2xl flex mx-auto"
                        >
                          <div className="flex items-center justify-center">
                            <img
                              src={joueur.imagejoueur}
                              alt="Image du joueur"
                              className="w-44 h-44 m-2 outline-2 outline-gray-600 object-cover object-top rounded-2xl"
                            />
                          </div>
                          <div className="flex flex-col my-auto mx-2">
                            <p className="text-xl font-semibold my-1 text-aja-blue font-Montserrat">
                              {joueur.nom}
                            </p>
                            <p className="text-base my-1 font-Montserrat">
                              {joueur.age} ans
                            </p>
                            <div className="flex items-center my-1">
                              <p className="text-base font-Montserrat">
                                {joueur.nationalite}
                              </p>
                              <img
                                src={joueur.natflag}
                                alt="Drapeau"
                                className="w-4 h-3 my-2 mx-3 border border-black"
                              />
                            </div>
                            <p className="text-base my-1 font-Montserrat">
                              {joueur.poste}
                            </p>
                            <p className="text-base my-1 font-Montserrat">
                              {joueur.poste !== "Staff" && `# ${joueur.number}`}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
