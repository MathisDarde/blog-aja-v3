"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Joueur } from "@/contexts/Interfaces";
import { Drapeaux } from "@/contexts/Drapeaux";

export default function EffectifActuel() {
  const [joueurs, setJoueurs] = useState<Joueur[]>([]);

  useEffect(() => {
    document.title = "Effectif Actuel - Mémoire d'Auxerrois";

    if (!document.getElementById("favicon")) {
      const link = document.createElement("link");
      link.id = "favicon";
      link.rel = "icon";
      link.href = "/_assets/teamlogos/logoauxerre.svg";
      document.head.appendChild(link);
    }
  }, []);

  useEffect(() => {
    // Charger le JSON au montage du composant
    fetch("/data/players_data.json")
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

  return (
    <div className="bg-gray-100 h-full w-full p-0 m-0 box-border">
      <div className="text-center m-6">
        <h3 className="text-center font-Montserrat text-4xl font-bold uppercase mt-10 mb-5">
          Effectif Actuel:
        </h3>
        <div className="text-left">
          <div className="relative grid grid-cols-2 grid-rows-2 2xl:grid-cols-4 gap-10 pb-6 mx-10">
            {joueurs.map((joueur) => {
              const {
                nom,
                image_url,
                date_naissance,
                age,
                nationalite,
                poste,
                numéro,
                taille,
                poids,
                pied,
              } = joueur;

              const natFlag = Drapeaux.find((drapeau) =>
                drapeau.key.some((k) =>
                  joueur.nationalite?.toLowerCase().includes(k.toLowerCase())
                )
              )?.flagUrl;

              return (
                <div
                  key={nom}
                  className="bg-white h-[500px] my-4 box-border rounded-2xl flex mx-auto"
                >
                  <div className="w-1/2">
                    <Image
                      width={512}
                      height={512}
                      src={image_url || "/_assets/img/pdpdebase.png"}
                      alt="Image du joueur"
                      className="h-full outline-2 outline-gray-600 object-contain object-top rounded-2xl"
                    />
                  </div>
                  <div className="flex flex-col my-auto mx-2 w-1/2">
                    <p className="text-4xl font-semibold my-1 text-aja-blue font-Bai_Jamjuree">
                      {nom}
                    </p>
                    <p className="text-base my-1 font-Montserrat">{poste}</p>
                    <div className="flex items-center my-1">
                      <p className="text-base font-Montserrat">{nationalite}</p>
                      {natFlag && (
                        <Image
                          width={512}
                          height={512}
                          src={natFlag}
                          alt="Drapeau"
                          className="w-4 h-3 my-2 mx-3 border border-black"
                        />
                      )}
                    </div>
                    <p className="text-base my-1 font-Montserrat">
                      {date_naissance} ({age} ans)
                    </p>

                    <p className="text-base my-1 font-Montserrat">
                      Numéro: #{numéro}
                    </p>
                    <p className="text-base my-1 font-Montserrat">
                      Taille: {taille}
                    </p>
                    <p className="text-base my-1 font-Montserrat">
                      Poids: {poids}
                    </p>
                    <p className="text-base my-1 font-Montserrat">
                      Pied fort: {pied}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
