"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ArrowBigDown, ArrowBigUp, Loader2 } from "lucide-react";
import { MethodeMatch } from "@/contexts/Interfaces";
import { Dispositifs } from "@/components/Dispositifs";

type PlayerTuple = [
  string,
  string,
  string,
  string,
  string,
  string | boolean,
  string | boolean
];

interface GameMethodeExpertProps {
  methode: MethodeMatch;
}

const getLastName = (fullName: string) => {
  const parts = fullName.trim().split(" ");
  return parts.length > 1 ? parts.slice(1).join(" ") : parts[0];
};

export default function GameMethodeExpert({ methode }: GameMethodeExpertProps) {
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const systemeDom = Dispositifs.find((d) => d.name === methode.systemeequipe1);
  const systemeExt = Dispositifs.find((d) => d.name === methode.systemeequipe2);

  const renderPlayerOnPitch = (
    playerData: PlayerTuple,
    index: number,
    systeme: typeof systemeDom,
    isDomicile: boolean,
    teamColor: string,
    textColor: string
  ) => {
    if (!systeme || !systeme.postes[index]) return null;

    const positionString = isDomicile
      ? systeme.postes[index].positionDom
      : systeme.postes[index].positionExt;

    const [left, top] = positionString.split(",");

    const [nom, numero, , subOutMinute, nbButs, jauneStr, rougeStr] = playerData;
    const hasYellow = String(jauneStr) === "true";
    const hasRed = String(rougeStr) === "true";

    return (
      <div
        key={`${isDomicile ? "dom" : "ext"}-${index}`}
        className="absolute flex flex-col items-center transform -translate-x-1/2 -translate-y-1/2 z-10 w-20 transition-all hover:scale-110 cursor-default group animate-in fade-in duration-500"
        style={{ left, top }}
      >
        <div className="relative">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-md border-2 relative z-10"
            style={{ backgroundColor: teamColor, color: textColor, borderColor: textColor }}
          >
            {numero}
          </div>

          {hasYellow && (
            <div className="absolute -top-1 -right-1 z-20 w-3 h-4 bg-yellow-400 border border-white rounded-sm shadow-sm" />
          )}
          {hasRed && (
            <div
              className={`absolute -top-1 ${hasRed && hasYellow ? "-right-2" : "-right-1"
                } z-20 w-3 h-4 bg-red-600 border border-white rounded-sm shadow-sm`}
            />
          )}

          {subOutMinute != "" && (
            <div className="absolute -bottom-1 -left-2 z-20 drop-shadow-md">
              <ArrowBigDown
                size={20}
                fill="#f81b1b"
                stroke="#fff"
                strokeWidth={1.5}
              />
            </div>
          )}

          {Number(nbButs) > 0 && (
            <div className="absolute -bottom-0 -right-1 z-20">
              <div className="relative bg-white rounded-full shadow-sm border border-gray-200 w-[14px] h-[14px] flex items-center justify-center">
                <Image
                  src={"/_assets/img/iconeballon.png"}
                  alt="But"
                  width={12}
                  height={12}
                  className="object-contain"
                />

                {Number(nbButs) > 1 && (
                  <div className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[8px] font-bold w-[11px] h-[11px] flex items-center justify-center rounded-full border border-white shadow-sm">
                    {nbButs}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <span className="mt-1 text-[10px] sm:text-xs font-bold text-white bg-black/60 px-2 py-0.5 rounded-full shadow-sm backdrop-blur-[2px] whitespace-nowrap max-w-[100px] overflow-hidden text-ellipsis flex items-center gap-1">
          {getLastName(nom)}
        </span>
      </div>
    );
  };

  return (
    <div className="flex flex-col pt-4">
      {/* Titre du match */}
      <p className="text-center font-Bai_Jamjuree text-xl sm:text-2xl font-bold mt-4">
        {methode.titrematch}
      </p>

      {/* Équipe 1 */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 mt-4">
        <div className="flex gap-1">
          <div
            className="w-6 h-6 rounded-full border border-black"
            style={{ background: methode.couleur1equipe1 }}
          ></div>
          <div
            className="w-6 h-6 rounded-full border border-black"
            style={{ background: methode.couleur2equipe1 }}
          ></div>
        </div>
        <div className="flex gap-2 items-center text-left">
          <h3 className="font-semibold font-Bai_Jamjuree text-lg">
            {methode.nomequipe1}
          </h3>
          <h3 className="text-sm">{methode.systemeequipe1}</h3>
        </div>
      </div>

      {/* --- ZONE TERRAIN --- */}
      <div className="my-2 flex justify-center relative min-h-[300px] items-center">

        {!isImageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center z-0">
            <Loader2 className="w-10 h-10 text-gray-400 animate-spin" />
          </div>
        )}

        {/* Image du terrain */}
        <div className={`relative transition-opacity duration-500 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}>
          <Image
            src={"/_assets/terrains/ajasainteterrain2260924.png"}
            width={1024}
            height={1024}
            alt="Terrain"
            priority
            className="rounded-md max-h-[400px] w-auto"
            onLoad={() => setIsImageLoaded(true)}
          />

          {/* On n'affiche les joueurs que si isImageLoaded est true */}
          {isImageLoaded && (
            <>
              {methode.titulairesequipe1 &&
                methode.titulairesequipe1.map((player, index) =>
                  renderPlayerOnPitch(
                    player as PlayerTuple,
                    index,
                    systemeDom,
                    true,
                    methode.couleur1equipe1,
                    methode.couleur2equipe1
                  )
                )}

              {/* Joueurs Équipe 2 (Extérieur / Bas) */}
              {methode.titulairesequipe2 &&
                methode.titulairesequipe2.map((player, index) =>
                  renderPlayerOnPitch(
                    player as PlayerTuple,
                    index,
                    systemeExt,
                    false,
                    methode.couleur1equipe2,
                    methode.couleur2equipe2
                  )
                )}
            </>
          )}
        </div>
      </div>
      {/* --- FIN ZONE TERRAIN --- */}

      {/* Équipe 2 */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 mt-2">
        <div className="flex gap-1">
          <div
            className="w-6 h-6 rounded-full border border-black"
            style={{ background: methode.couleur1equipe2 }}
          ></div>
          <div
            className="w-6 h-6 rounded-full border border-black"
            style={{ background: methode.couleur2equipe2 }}
          ></div>
        </div>
        <div className="flex gap-2 items-center text-left">
          <h3 className="font-semibold font-Bai_Jamjuree text-lg">
            {methode.nomequipe2}
          </h3>
          <h3 className="text-sm">{methode.systemeequipe2}</h3>
        </div>
      </div>

      {/* Remplaçants équipe 1 */}
      <div className="mt-4 w-full">
        <p className="font-semibold font-Bai_Jamjuree text-base sm:text-lg text-left mb-2">
          Banc {methode.nomequipe1} :
        </p>
        <ul className="flex flex-col gap-1.5 mt-2">
          {methode.remplacantsequipe1.map((remp, index) => {
            // Sécurisation des données
            const hasYellow = String(remp[5]) === "true";
            const hasRed = String(remp[6]) === "true";
            const nbButs = Number(remp[4]);
            const minute = remp[3];

            return (
              <li
                key={index}
                className="flex items-center justify-between p-1.5 rounded hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
              >
                {/* GAUCHE : Identité du joueur (Poste - Drapeau - Nom) */}
                <div className="flex items-center gap-2 overflow-hidden mr-2">
                  {/* Poste */}
                  <span className="font-Montserrat text-xs font-bold text-gray-500 w-[35px] shrink-0">
                    {remp[2] ? remp[2].slice(0, 3).toUpperCase() : "-"}
                  </span>

                  {/* Drapeau */}
                  <div className="relative w-5 h-3 shrink-0 border border-black shadow-sm">
                    {remp[1] && (
                      <Image
                        src={remp[1]}
                        alt="flag"
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>

                  {/* Nom */}
                  <p className="text-sm font-medium text-gray-800 truncate">
                    {remp[0]}
                  </p>
                </div>

                {/* DROITE : Événements (Buts -> Changement -> Cartons) */}
                <div className="flex items-center gap-3 shrink-0">

                  {/* 1. Buts */}
                  {nbButs > 0 && (
                    <div className="flex gap-0.5">
                      {Array.from({ length: nbButs }, (_, i) => (
                        <Image
                          key={i}
                          src={"/_assets/img/iconeballon.png"}
                          alt="But"
                          width={14}
                          height={14}
                          className="drop-shadow-sm"
                        />
                      ))}
                    </div>
                  )}

                  {/* 2. Changement (Flèche + Minute) */}
                  {minute && (
                    <div className="flex items-center gap-0.5 text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full border border-green-100">
                      <ArrowBigUp className="w-4 h-4 fill-green-600 stroke-none" />
                      <span className="text-xs font-bold font-Montserrat pt-[1px]">
                        {minute}
                      </span>
                    </div>
                  )}

                  {/* 3. Cartons (Superposition) */}
                  {(hasYellow || hasRed) && (
                    <div className="relative h-5 w-6 flex items-center">
                      {/* Carton Jaune */}
                      {hasYellow && (
                        <div
                          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-3 h-4 bg-yellow-400 border border-white rounded-[1px] shadow-sm transform -rotate-3"
                          title="Carton Jaune"
                        />
                      )}

                      {/* Carton Rouge (Décalé si jaune présent, sinon position standard) */}
                      {hasRed && (
                        <div
                          className={`absolute top-1/2 -translate-y-1/2 w-3 h-4 bg-red-600 border border-white rounded-[1px] shadow-sm transform rotate-6 ${hasYellow ? "left-2 z-20" : "left-0 z-10"
                            }`}
                          title="Carton Rouge"
                        />
                      )}
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Remplaçants équipe 2 */}
      <div className="mt-4 w-full">
        <p className="font-semibold font-Bai_Jamjuree text-base sm:text-lg text-left mb-2">
          Banc {methode.nomequipe2} :
        </p>
        <ul className="flex flex-col gap-1.5 mt-2">
          {methode.remplacantsequipe2.map((remp, index) => {
            // Sécurisation des données
            const hasYellow = String(remp[5]) === "true";
            const hasRed = String(remp[6]) === "true";
            const nbButs = Number(remp[4]);
            const minute = remp[3];

            return (
              <li
                key={index}
                className="flex items-center justify-between py-1.5 rounded hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
              >
                {/* GAUCHE : Identité du joueur (Poste - Drapeau - Nom) */}
                <div className="flex items-center gap-2 overflow-hidden mr-2">
                  {/* Poste */}
                  <span className="font-Montserrat text-xs font-bold text-gray-500 w-[35px] shrink-0">
                    {remp[2] ? remp[2].slice(0, 3).toUpperCase() : "-"}
                  </span>

                  {/* Drapeau */}
                  <div className="relative w-5 h-3 shrink-0 border border-black shadow-sm">
                    {remp[1] && (
                      <Image
                        src={remp[1]}
                        alt="flag"
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>

                  {/* Nom */}
                  <p className="text-sm font-medium text-gray-800 truncate" title={remp[0]}>
                    {remp[0]}
                  </p>
                </div>

                {/* DROITE : Événements (Buts -> Changement -> Cartons) */}
                <div className="flex items-center gap-3 shrink-0">

                  {/* 1. Buts */}
                  {nbButs > 0 && (
                    <div className="flex gap-0.5">
                      {Array.from({ length: nbButs }, (_, i) => (
                        <Image
                          key={i}
                          src={"/_assets/img/iconeballon.png"}
                          alt="But"
                          width={14}
                          height={14}
                          className="drop-shadow-sm"
                        />
                      ))}
                    </div>
                  )}

                  {/* 2. Changement (Flèche + Minute) */}
                  {minute && (
                    <div className="flex items-center gap-0.5 text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full border border-green-100">
                      <ArrowBigUp className="w-4 h-4 fill-green-600 stroke-none" />
                      <span className="text-xs font-bold font-Montserrat pt-[1px]">
                        {minute}
                      </span>
                    </div>
                  )}

                  {/* 3. Cartons (Superposition) */}
                  {(hasYellow || hasRed) && (
                    <div className="relative h-5 w-6 flex items-center">
                      {/* Carton Jaune */}
                      {hasYellow && (
                        <div
                          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-3 h-4 bg-yellow-400 border border-white rounded-[1px] shadow-sm transform -rotate-3"
                          title="Carton Jaune"
                        />
                      )}

                      {/* Carton Rouge (Décalé si jaune présent, sinon position standard) */}
                      {hasRed && (
                        <div
                          className={`absolute top-1/2 -translate-y-1/2 w-3 h-4 bg-red-600 border border-white rounded-[1px] shadow-sm transform rotate-6 ${hasYellow ? "left-2 z-20" : "left-0 z-10"
                            }`}
                          title="Carton Rouge"
                        />
                      )}
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Lieu et date */}
      <div className="mt-4 text-center">
        <p className="font-semibold font-Bai_Jamjuree text-base sm:text-lg">
          {methode.stade}
        </p>
        <p className="text-sm sm:text-base text-black">{methode.date}</p>
      </div>
    </div>
  );
}