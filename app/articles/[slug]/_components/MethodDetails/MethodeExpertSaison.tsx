import Button from "@/components/BlueButton";
import { Dispositifs } from "@/components/Dispositifs";
import { LightTituPlayerType, MethodeSaison } from "@/contexts/Interfaces";
import { authClient } from "@/lib/auth-client";
import { PenBox } from "lucide-react";
import Image from "next/image";
import { redirect } from "next/navigation";
import { useMemo, useState } from "react";

interface SeasonMethodeExpertProps {
  methode: MethodeSaison;
}

const getLastName = (fullName: string) => {
  if (!fullName) return "";
  const parts = fullName.trim().split(" ");
  return parts.length > 1 ? parts.slice(1).join(" ") : parts[0];
};

export default function SeasonMethodeExpert({
  methode,
}: SeasonMethodeExpertProps) {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const systemeDemi = Dispositifs.find((d) => d.name === methode.systeme);

  const mapPlayersToSystem = (
    rawPlayers: LightTituPlayerType[] | undefined,
    systeme: typeof systemeDemi
  ) => {
    if (!rawPlayers || !systeme) return [];

    const availablePlayers = [...rawPlayers];

    return systeme.postes.map((posteConfig) => {
      const exactMatchIndex = availablePlayers.findIndex(
        (p) => p.poste === posteConfig.name
      );

      let playerToPlace: LightTituPlayerType | undefined;

      if (exactMatchIndex !== -1) {
        playerToPlace = availablePlayers[exactMatchIndex];
        availablePlayers.splice(exactMatchIndex, 1);
      } else {
        playerToPlace = availablePlayers[0];
        if (playerToPlace) availablePlayers.splice(0, 1);
      }

      if (!playerToPlace) return null;

      return {
        playerData: playerToPlace,
        positionDom: posteConfig.positionDom,
        positionExt: posteConfig.positionExt,
        demiTerrain: posteConfig.demiTerrain,
      };
    });
  };

  const renderPlayerEntity = (
    mappedData: {
      playerData: LightTituPlayerType;
      positionDom: string;
      positionExt: string;
      demiTerrain: string;
    } | null,
    teamColor: string,
    textColor: string
  ) => {
    if (!mappedData) return null;

    const { playerData, demiTerrain } = mappedData;
    const [left, top] = demiTerrain.split(",");

    const { nom, numero } = playerData;

    return (
      <div
        key={nom}
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
        </div>

        {/* Nom du joueur */}
        <span className="mt-1 text-[9px] sm:text-xs text-white bg-black/60 px-2 py-0.5 rounded-full shadow-sm backdrop-blur-[2px] whitespace-nowrap max-w-[100px] overflow-hidden text-ellipsis flex items-center gap-1">
          {getLastName(nom)}
        </span>
      </div>
    );
  };

  const mappedTeam = useMemo(
    () => mapPlayersToSystem(methode.titulaires, systemeDemi),
    [methode.titulaires, systemeDemi]
  );

  return (
    <div className="flex flex-col pt-4">
      {/* Titre Saison */}
      <p className="text-center font-Bai_Jamjuree text-xl sm:text-2xl font-bold my-4">
        Saison {methode.saison}
      </p>

      <div
        className={`relative transition-opacity duration-500 ${isImageLoaded ? "opacity-100" : "opacity-0"}`}
      >
        <Image
          src={"/_assets/terrains/demiterrain.png"}
          width={1024}
          height={1024}
          alt="Terrain"
          priority
          className="rounded-md w-full"
          onLoad={() => setIsImageLoaded(true)}
        />

        {isImageLoaded && (
          <>
            {mappedTeam.map((mappedData) =>
              renderPlayerEntity(mappedData, "#3c77b4", "#ffffff")
            )}
          </>
        )}
      </div>

      {/* Coach et système */}
      <div className="mt-4 text-center">
        <p className="font-semibold text-base sm:text-lg text-left font-Bai_Jamjuree">
          Coach : {methode.coach}{" "}
          <span className="text-sm font-medium">({methode.systeme})</span>
        </p>
      </div>

      {/* Remplaçants */}
      <div className="mt-4">
        <p className="font-semibold font-Bai_Jamjuree text-left text-base sm:text-lg">
          Remplaçants :
        </p>
        <ul className="mt-2 space-y-1">
          {methode.remplacants.map((remp, index) => (
            <li
              key={index}
              className="flex items-center gap-2 text-sm sm:text-base text-left"
            >
              <p>
                {remp.poste} - {remp.nom}
              </p>
              <Image
                width={512}
                height={512}
                src={remp.drapeau}
                alt=""
                className="w-4 sm:w-5 h-[10px] sm:h-[12px] object-cover border border-black"
              />
            </li>
          ))}
        </ul>
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
