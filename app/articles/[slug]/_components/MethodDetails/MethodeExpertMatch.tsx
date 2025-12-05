"use client";

import React, { useState, useMemo } from "react";
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
  boolean,
  boolean,
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

  // --- LOGIQUE INTELLIGENTE DE PLACEMENT ---
  // Cette fonction associe chaque joueur à la bonne coordonnée sur le terrain
  // en se basant sur le NOM du poste, et non juste l'ordre dans la liste.
  const mapPlayersToSystem = (
    players: PlayerTuple[] | undefined,
    systeme: typeof systemeDom
  ) => {
    if (!players || !systeme) return [];

    // On fait une copie des joueurs disponibles pour les distribuer
    const availablePlayers = players.map((p, originalIndex) => ({ ...p, originalIndex }));
    
    // On parcourt chaque poste du système (ex: Gardien, Def Droit...)
    return systeme.postes.map((posteConfig, index) => {
      // 1. On cherche un joueur qui a EXACTEMENT ce nom de poste
      const exactMatchIndex = availablePlayers.findIndex(
        (p) => p[2] === posteConfig.name
      );

      let playerToPlace;

      if (exactMatchIndex !== -1) {
        // Si trouvé, on le prend et on l'enlève de la liste des dispos
        playerToPlace = availablePlayers[exactMatchIndex];
        availablePlayers.splice(exactMatchIndex, 1);
      } else {
        // 2. Si pas de correspondance exacte (ex: erreur de nom), on prend le premier dispo (Fallback)
        // Cela évite qu'un joueur disparaisse
        playerToPlace = availablePlayers[0];
        if (playerToPlace) availablePlayers.splice(0, 1);
      }

      // Si vraiment plus de joueur (cas rare où < 11 joueurs), on renvoie null
      if (!playerToPlace) return null;

      // On renvoie la config complète : coordonnées + infos joueur
      return {
        playerData: playerToPlace,
        positionDom: posteConfig.positionDom,
        positionExt: posteConfig.positionExt,
        posteName: posteConfig.name,
      };
    });
  };

  // On calcule le mapping une fois pour toutes au rendu
  const mappedTeam1 = useMemo(() => mapPlayersToSystem(methode.titulairesequipe1 as unknown as PlayerTuple[], systemeDom), [methode.titulairesequipe1, systemeDom]);
  const mappedTeam2 = useMemo(() => mapPlayersToSystem(methode.titulairesequipe2 as unknown as PlayerTuple[], systemeExt), [methode.titulairesequipe2, systemeExt]);


  const renderPlayerEntity = (
    mappedData: any, // Le résultat de notre fonction mapPlayersToSystem
    index: number,
    isDomicile: boolean,
    teamColor: string,
    textColor: string
  ) => {
    if (!mappedData) return null;

    const { playerData, positionDom, positionExt } = mappedData;
    const positionString = isDomicile ? positionDom : positionExt;
    const [left, top] = positionString.split(",");

    // Extraction des données du joueur (attention, playerData est notre objet enrichi, on accède aux index du tuple)
    const nom = playerData[0];
    const numero = playerData[1];
    // playerData[2] est le poste
    const subOutMinute = playerData[3];
    const nbButs = playerData[4];
    const jauneStr = playerData[5];
    const rougeStr = playerData[6];

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
            className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] shadow-md border relative z-10 font-bold"
            style={{
              backgroundColor: teamColor,
              color: textColor,
              borderColor: textColor,
            }}
          >
            {numero}
          </div>

          {hasYellow && (
            <div className="absolute -top-1 -right-1 z-20 w-3 h-4 bg-yellow-400 border border-white rounded-sm shadow-sm" />
          )}
          {hasRed && (
            <div
              className={`absolute -top-1 ${
                hasRed && hasYellow ? "-right-2" : "-right-1"
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

        <span className="mt-1 text-[9px] sm:text-xs text-white bg-black/60 px-2 py-0.5 rounded-full shadow-sm backdrop-blur-[2px] whitespace-nowrap max-w-[100px] overflow-hidden text-ellipsis flex items-center gap-1">
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

      {/* Équipe 1 (Infos) */}
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

        <div
          className={`relative transition-opacity duration-500 ${isImageLoaded ? "opacity-100" : "opacity-0"}`}
        >
          <Image
            src={"/_assets/terrains/terraincompletv2.jpg"}
            width={1024}
            height={1024}
            alt="Terrain"
            priority
            className="rounded-md max-w-[350px] w-full"
            onLoad={() => setIsImageLoaded(true)}
          />

          {isImageLoaded && (
            <>
              {/* Rendu Equipe 1 avec Smart Mapping */}
              {mappedTeam1.map((mappedData, index) =>
                  renderPlayerEntity(
                    mappedData,
                    index,
                    true,
                    methode.couleur1equipe1,
                    methode.couleur2equipe1
                  )
                )}

              {/* Rendu Equipe 2 avec Smart Mapping */}
              {mappedTeam2.map((mappedData, index) =>
                  renderPlayerEntity(
                    mappedData,
                    index,
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

      {/* Équipe 2 (Infos) */}
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

      {/* (Le reste du code des remplaçants ne change pas...) */}
      <div className="mt-4 w-full">
         {/* ... Code des remplaçants équipe 1 identique à votre version ... */}
           <p className="font-semibold font-Bai_Jamjuree text-base sm:text-lg text-left mb-2">
          Banc {methode.nomequipe1} :
        </p>
        <ul className="flex flex-col gap-1.5 mt-2">
          {methode.remplacantsequipe1.map((remp, index) => {
             // ... VOS LI REMPLACANTS ICI (copiez collez votre code actuel pour les remplaçants) ...
             // Pour ne pas surcharger la réponse, je remets la logique simplifiée
             const hasYellow = String(remp[5]) === "true";
             const hasRed = String(remp[6]) === "true";
             const nbButs = Number(remp[4]);
             const minute = remp[3];

            return (
              <li
                key={index}
                className="flex items-center justify-between p-1.5 rounded hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
              >
                  <div className="flex items-center gap-2 overflow-hidden mr-2">
                  <span className="font-Montserrat text-xs font-bold text-gray-500 w-[35px] shrink-0">
                    {remp[2] ? remp[2].slice(0, 3).toUpperCase() : "-"}
                  </span>
                  <div className="relative w-5 h-3 shrink-0 border border-black shadow-sm">
                    {remp[1] && <Image src={remp[1]} alt="flag" fill className="object-cover" />}
                  </div>
                  <p className="text-sm font-medium text-gray-800 truncate">{remp[0]}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  {nbButs > 0 && <span className="text-xs">⚽ x{nbButs}</span>}
                  {minute && <span className="text-xs font-bold text-green-600">⬆ {minute}</span>}
                  {(hasYellow || hasRed) && (
                     <div className="flex gap-1">
                        {hasYellow && <div className="w-2 h-3 bg-yellow-400 border border-gray-400"></div>}
                        {hasRed && <div className="w-2 h-3 bg-red-600 border border-gray-400"></div>}
                     </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>

       <div className="mt-4 w-full">
        <p className="font-semibold font-Bai_Jamjuree text-base sm:text-lg text-left mb-2">
          Banc {methode.nomequipe2} :
        </p>
        <ul className="flex flex-col gap-1.5 mt-2">
           {/* ... MEME LOGIQUE POUR EQUIPE 2 ... */}
             {methode.remplacantsequipe2.map((remp, index) => {
             const hasYellow = String(remp[5]) === "true";
             const hasRed = String(remp[6]) === "true";
             const nbButs = Number(remp[4]);
             const minute = remp[3];

            return (
              <li key={index} className="flex items-center justify-between p-1.5 border-b border-gray-100">
                  <div className="flex items-center gap-2 overflow-hidden mr-2">
                  <span className="font-Montserrat text-xs font-bold text-gray-500 w-[35px] shrink-0">
                    {remp[2] ? remp[2].slice(0, 3).toUpperCase() : "-"}
                  </span>
                  <div className="relative w-5 h-3 shrink-0 border border-black shadow-sm">
                    {remp[1] && <Image src={remp[1]} alt="flag" fill className="object-cover" />}
                  </div>
                  <p className="text-sm font-medium text-gray-800 truncate">{remp[0]}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                   {nbButs > 0 && <span className="text-xs">⚽ x{nbButs}</span>}
                   {minute && <span className="text-xs font-bold text-green-600">⬆ {minute}</span>}
                   {(hasYellow || hasRed) && (
                     <div className="flex gap-1">
                        {hasYellow && <div className="w-2 h-3 bg-yellow-400 border border-gray-400"></div>}
                        {hasRed && <div className="w-2 h-3 bg-red-600 border border-gray-400"></div>}
                     </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="mt-4 text-center">
        <p className="font-semibold font-Bai_Jamjuree text-base sm:text-lg">
          {methode.stade}
        </p>
        <p className="text-sm sm:text-base text-black">{methode.date}</p>
      </div>
    </div>
  );
}