"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Joueur } from "@/contexts/Interfaces";
import { Drapeaux } from "@/contexts/Drapeaux";

export default function EffectifActuel() {
  const [joueurs, setJoueurs] = useState<Joueur[]>([]);
  const [hoveredJoueur, setHoveredJoueur] = useState<string | null>(null);

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
          <div className="relative grid grid-cols-5 gap-10 pb-6 mx-10">
            {joueurs.map((joueur) => {
              const {
                nom,
                image_url,
                date_naissance,
                age,
                ville,
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
                  className="bg-white h-[500px] my-4 box-border rounded-lg flex flex-col mx-auto relative transition-all duration-300 ease-in-out hover:shadow-lg"
                  onMouseEnter={() => setHoveredJoueur(nom)}
                  onMouseLeave={() => setHoveredJoueur(null)}
                >
                  <div className="h-[10%]"></div>
                  {natFlag && (
                    <Image
                      src={natFlag}
                      width={128}
                      height={128}
                      alt="Flag"
                      className="w-12 h-8 absolute top-5 left-5 border border-black object-cover"
                    />
                  )}
                  <svg
                    id="Calque_2"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 505.91 640.84"
                    className="w-auto h-16 absolute top-5 right-5"
                  >
                    <g id="Logo">
                      <path
                        className="fill-aja-blue"
                        d="m252.96,640.84c-35.81-56.17-173.3-85.02-173.3-85.02-35.23-7.66-46.98-11.49-46.98-11.49C-.77,531.31.34,507.05.34,507.05L0,.07l252.96-.07,252.96.07-.34,506.98s1.11,24.26-32.34,37.28c0,0-11.74,3.83-46.98,11.49,0,0-137.49,28.85-173.3,85.02Z"
                      />
                    </g>

                    <text
                      x="50%"
                      y="50%"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize="200"
                      fontWeight="bold"
                      fontFamily="Montserrat"
                      fill="white"
                    >
                      #{numéro}
                    </text>
                  </svg>

                  <Image
                    width={512}
                    height={512}
                    src={image_url || "/_assets/img/pdpdebase.png"}
                    alt="Image du joueur"
                    className="h-[75%] outline-2 outline-gray-600 object-contain object-top rounded-2xl overflow-hidden"
                  />

                  <div className="absolute bottom-0 bg-[url('/_assets/img/motif-aja.png')] h-auto w-full rounded-b-lg p-4 flex flex-col items-center">
                    <p className="text-4xl text-center font-semibold text-white font-Bai_Jamjuree">
                      {nom}
                    </p>
                    <p className="font-Montserrat text-md text-white text-center font-semibold">
                      {poste}
                    </p>

                    {/* Conteneur pour les informations supplémentaires avec animation */}
                    <div
                      className={`transition-all duration-500 ease-in-out transform ${
                        hoveredJoueur === nom
                          ? "opacity-100 translate-y-0 max-h-96"
                          : "opacity-0 translate-y-2 max-h-0"
                      } overflow-hidden`}
                    >
                      <div className="pt-2">
                        <div className="text-base text-white my-1 font-Montserrat flex items-center gap-2 justify-center">
                          {nationalite}{" "}
                          {natFlag && (
                            <Image
                              src={natFlag}
                              alt="Flag"
                              width={128}
                              height={128}
                              className="h-3 w-5 object-cover"
                            />
                          )}
                        </div>

                        {(date_naissance || ville) && (
                          <p className="text-base text-white my-1 font-Montserrat text-center">
                            {date_naissance}, {ville}
                          </p>
                        )}

                        {age && (
                          <p className="text-base text-white my-1 font-Montserrat text-center">
                            {age} ans
                          </p>
                        )}

                        {numéro && (
                          <p className="text-base text-white my-1 font-Montserrat text-center">
                            #{numéro}
                          </p>
                        )}

                        {taille && poids && (
                          <p className="text-base text-white my-1 font-Montserrat text-center">
                            {taille} / {poids}
                          </p>
                        )}

                        {pied && (
                          <p className="text-base text-white my-1 font-Montserrat text-center">
                            Pied fort: {pied}
                          </p>
                        )}
                      </div>
                    </div>
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
