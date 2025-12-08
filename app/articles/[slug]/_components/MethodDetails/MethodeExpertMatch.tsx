"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { ArrowBigDown, ArrowBigUp, Loader2, PenBox } from "lucide-react";
import { Dispositifs } from "@/components/Dispositifs";
import { redirect } from "next/navigation";
import Button from "@/components/BlueButton";
import { authClient } from "@/lib/auth-client";

// On définit les interfaces ici pour être sûr (ou on utilise celles de l'import si elles sont identiques)
export interface TituPlayerType {
  nom: string;
  poste: string;
  numero: string;
  sortie?: string;
  buts?: string;
  cartonJaune?: boolean;
  cartonRouge?: boolean;
}

export interface RempPlayerType {
  nom: string;
  poste: string;
  drapeau: string;
  entree?: string;
  buts?: string;
  cartonJaune?: boolean;
  cartonRouge?: boolean;
}

// On redéfinit partiellement MethodeMatch pour s'assurer que les tableaux sont bien typés
// Si votre import @/contexts/Interfaces est déjà à jour, vous pouvez retirer cette partie et utiliser l'import.
interface MethodeMatch {
  id_methode: string;
  titrematch: string;
  date: string;
  stade: string;
  nomequipe1: string;
  nomequipe2: string;
  systemeequipe1: string;
  systemeequipe2: string;
  couleur1equipe1: string;
  couleur2equipe1: string;
  couleur1equipe2: string;
  couleur2equipe2: string;
  titulairesequipe1: TituPlayerType[];
  titulairesequipe2: TituPlayerType[];
  remplacantsequipe1: RempPlayerType[];
  remplacantsequipe2: RempPlayerType[];
}

interface GameMethodeExpertProps {
  methode: MethodeMatch;
}

// --- UTILITAIRES ---

const getLastName = (fullName: string) => {
  if (!fullName) return "";
  const parts = fullName.trim().split(" ");
  return parts.length > 1 ? parts.slice(1).join(" ") : parts[0];
};

export default function GameMethodeExpert({ methode }: GameMethodeExpertProps) {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const systemeDom = Dispositifs.find((d) => d.name === methode.systemeequipe1);
  const systemeExt = Dispositifs.find((d) => d.name === methode.systemeequipe2);

  // --- LOGIQUE DE PLACEMENT ---
  const mapPlayersToSystem = (
    rawPlayers: TituPlayerType[] | undefined,
    systeme: typeof systemeDom
  ) => {
    if (!rawPlayers || !systeme) return [];

    // On fait une copie pour pouvoir manipuler la liste sans muter les props
    const availablePlayers = [...rawPlayers];

    // Distribution sur le terrain
    return systeme.postes.map((posteConfig) => {
      // Cherche correspondance exacte du poste
      const exactMatchIndex = availablePlayers.findIndex(
        (p) => p.poste === posteConfig.name
      );

      let playerToPlace: TituPlayerType | undefined;

      if (exactMatchIndex !== -1) {
        playerToPlace = availablePlayers[exactMatchIndex];
        availablePlayers.splice(exactMatchIndex, 1);
      } else {
        // Fallback : prend le premier dispo
        playerToPlace = availablePlayers[0];
        if (playerToPlace) availablePlayers.splice(0, 1);
      }

      if (!playerToPlace) return null;

      return {
        playerData: playerToPlace,
        positionDom: posteConfig.positionDom,
        positionExt: posteConfig.positionExt,
      };
    });
  };

  const mappedTeam1 = useMemo(
    () => mapPlayersToSystem(methode.titulairesequipe1, systemeDom),
    [methode.titulairesequipe1, systemeDom]
  );
  const mappedTeam2 = useMemo(
    () => mapPlayersToSystem(methode.titulairesequipe2, systemeExt),
    [methode.titulairesequipe2, systemeExt]
  );

  const renderPlayerEntity = (
    mappedData: {
      playerData: TituPlayerType;
      positionDom: string;
      positionExt: string;
    } | null,
    index: number,
    isDomicile: boolean,
    teamColor: string,
    textColor: string
  ) => {
    if (!mappedData) return null;

    const { playerData, positionDom, positionExt } = mappedData;
    const positionString = isDomicile ? positionDom : positionExt;
    const [left, top] = positionString.split(",");

    const { nom, numero, sortie, buts, cartonJaune, cartonRouge } = playerData;

    return (
      <div
        key={`${isDomicile ? "dom" : "ext"}-${index}`}
        className="absolute flex flex-col items-center transform -translate-x-1/2 -translate-y-1/2 z-10 w-20 transition-all hover:scale-110 cursor-default group animate-in fade-in duration-500"
        style={{ left, top }}
      >
        <div className="relative">
          {/* Cercle Numéro */}
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

          {/* Cartons */}
          {cartonJaune && (
            <div className="absolute -top-1 -right-1 z-20 w-3 h-4 bg-yellow-400 border border-white rounded-sm shadow-sm" />
          )}
          {cartonRouge && (
            <div
              className={`absolute -top-1 ${
                cartonRouge && cartonJaune ? "-right-2" : "-right-1"
              } z-20 w-3 h-4 bg-red-600 border border-white rounded-sm shadow-sm`}
            />
          )}

          {/* Flèche Sortie */}
          {sortie && (
            <div className="absolute -bottom-1 -left-2 z-20 drop-shadow-md">
              <ArrowBigDown
                size={20}
                fill="#f81b1b"
                stroke="#fff"
                strokeWidth={1.5}
              />
            </div>
          )}

          {/* Ballon Buts */}
          {Number(buts) > 0 && (
            <div className="absolute -bottom-0 -right-1 z-20">
              <div className="relative bg-white rounded-full shadow-sm border border-gray-200 w-[14px] h-[14px] flex items-center justify-center">
                <Image
                  src={"/_assets/img/iconeballon.png"}
                  alt="But"
                  width={12}
                  height={12}
                  className="object-contain"
                />
                {Number(buts) > 1 && (
                  <div className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[8px] font-bold w-[11px] h-[11px] flex items-center justify-center rounded-full border border-white shadow-sm">
                    {buts}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Nom du joueur */}
        <span className="mt-1 text-[9px] sm:text-xs text-white bg-black/60 px-2 py-0.5 rounded-full shadow-sm backdrop-blur-[2px] whitespace-nowrap max-w-[100px] overflow-hidden text-ellipsis flex items-center gap-1">
          {getLastName(nom)}
        </span>
      </div>
    );
  };

  // Helper pour afficher une liste de remplaçants
  const renderSubstitutesList = (
    teamName: string,
    players: RempPlayerType[]
  ) => {
    if (!players || players.length === 0) return null;

    return (
      <div className="mt-4 w-full">
        <p className="font-semibold font-Bai_Jamjuree text-base sm:text-lg text-left mb-2">
          Banc {teamName} :
        </p>
        <ul className="flex flex-col gap-1.5 mt-2">
          {players.map((remp, index) => {
            const nbButs = Number(remp.buts);

            return (
              <li
                key={index}
                className="flex items-center justify-between p-1.5 rounded hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
              >
                <div className="flex items-center gap-2 overflow-hidden mr-2">
                  <span className="font-Montserrat text-xs font-bold text-gray-500 w-[35px] shrink-0">
                    {remp.poste ? remp.poste.slice(0, 3).toUpperCase() : "-"}
                  </span>
                  <div className="relative w-5 h-3 shrink-0 border border-black shadow-sm bg-gray-200">
                    {remp.drapeau && (
                      <Image
                        src={remp.drapeau}
                        alt="flag"
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                  <p className="text-sm font-medium text-gray-800 truncate">
                    {remp.nom}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  {nbButs > 0 && <span className="text-xs">⚽ x{nbButs}</span>}
                  {remp.entree && (
                    <span className="text-xs font-bold text-green-600 flex items-center gap-1">
                      <ArrowBigUp fill="#16a34a" size={14} /> {remp.entree}
                    </span>
                  )}
                  {(remp.cartonJaune || remp.cartonRouge) && (
                    <div className="flex gap-1">
                      {remp.cartonJaune && (
                        <div className="w-2 h-3 bg-yellow-400 border border-gray-400"></div>
                      )}
                      {remp.cartonRouge && (
                        <div className="w-2 h-3 bg-red-600 border border-gray-400"></div>
                      )}
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
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
              {/* Rendu Equipe 1 (Domicile) */}
              {mappedTeam1.map((mappedData, index) =>
                renderPlayerEntity(
                  mappedData,
                  index,
                  true,
                  methode.couleur1equipe1,
                  methode.couleur2equipe1
                )
              )}

              {/* Rendu Equipe 2 (Extérieur) */}
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

      {/* REMPLAÇANTS */}
      {renderSubstitutesList(methode.nomequipe1, methode.remplacantsequipe1)}
      {renderSubstitutesList(methode.nomequipe2, methode.remplacantsequipe2)}

      <div className="mt-4 text-center">
        <p className="font-semibold font-Bai_Jamjuree text-base sm:text-lg">
          {methode.stade}
        </p>
        <p className="text-sm sm:text-base text-black">{methode.date}</p>
      </div>

      {user?.admin && (
        <Button
          onClick={() =>
            redirect(`/admin/dashboard/updateelement/${methode.id_methode}`)
          }
          size="slim"
          type="button"
          className="flex items-center gap-2 w-fit mx-auto mt-4"
        >
          <PenBox />
          Modifier cette méthode
        </Button>
      )}
    </div>
  );
}
