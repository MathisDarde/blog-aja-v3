import Image from "next/image";
import { ArrowBigDown, ArrowBigUp } from "lucide-react";
import { MethodeMatch } from "@/contexts/Interfaces";
import { Dispositifs } from "@/components/Dispositifs";

type PlayerTuple = [string, string, string, string, string, string | boolean, string | boolean];

interface GameMethodeExpertProps {
  methode: MethodeMatch;
}

const getLastName = (fullName: string) => {
  const parts = fullName.trim().split(" ");
  return parts.length > 1 ? parts.slice(1).join(" ") : parts[0];
};

export default function GameMethodeExpert({ methode }: GameMethodeExpertProps) {
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

    // Extraction des données du tuple
    const [nom, numero, , subOutMinute, nbButs, jauneStr, rougeStr] = playerData;
    const hasYellow = String(jauneStr) === "true";
    const hasRed = String(rougeStr) === "true";

    return (
      <div
        key={`${isDomicile ? "dom" : "ext"}-${index}`}
        className="absolute flex flex-col items-center transform -translate-x-1/2 -translate-y-1/2 z-10 w-20 transition-all hover:scale-110 cursor-default group"
        style={{ left, top }}
      >
        {/* Conteneur principal de la pastille */}
        <div className="relative">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-md border-2 border-white relative z-10"
            style={{ backgroundColor: teamColor, color: textColor }}
          >
            {numero}
          </div>

          {/* --- CARTONS --- */}
          {hasYellow && (
            <div className="absolute -top-1 -right-1 z-20 w-3 h-4 bg-yellow-400 border border-white rounded-sm shadow-sm" />
          )}
          {hasRed && (
            <div className={`absolute -top-1 ${(hasRed && hasYellow) ? "-right-2" : "-right-1"} z-20 w-3 h-4 bg-red-600 border border-white rounded-sm shadow-sm`} />
          )}

          {/* --- FLECHE DE SORTIE --- */}
          {subOutMinute != "" && (
            <div className="absolute -bottom-1 -left-2 z-20 drop-shadow-md">
              <ArrowBigDown size={20} fill="#f81b1b" stroke="#fff" strokeWidth={1.5} />
            </div>
          )}

          {/* --- BUTS --- */}
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

        {/* Nom du joueur */}
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

      {/* Image du terrain */}
      <div className="my-2 flex justify-center relative">
        <Image
          src={"/_assets/terrains/ajasainteterrain2260924.png"}
          width={1024}
          height={1024}
          alt="Terrain"
          className="rounded-md max-h-[400px] w-auto"
        />

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
      </div>

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
      <div className="mt-4">
        <p className="font-semibold font-Bai_Jamjuree text-base sm:text-lg text-left">
          Banc {methode.nomequipe1} :
        </p>
        <ul className="mt-2 space-y-1">
          {methode.remplacantsequipe1.map((remp, index) => (
            <li
              key={index}
              className="flex items-center gap-2 text-sm sm:text-base text-left"
            >
              <p>
                {remp[2].slice(0, 3).toUpperCase()} - {remp[0]}
              </p>
              <Image
                width={512}
                height={512}
                src={remp[1]}
                alt=""
                className="w-4 sm:w-5 h-[10px] sm:h-[12px] border border-black object-cover"
              />
              {remp[3] && (
                <>
                  <ArrowBigUp fill="green" size={16} stroke="green" />
                  <p className="text-sm sm:text-base">{remp[3]}</p>
                </>
              )}
              {Number(remp[4]) > 0 &&
                Array.from({ length: Number(remp[4]) }, (_, i) => (
                  <Image
                    key={i}
                    src={"/_assets/img/iconeballon.png"}
                    alt="Buts"
                    width={15}
                    height={15}
                  />
                ))}
            </li>
          ))}
        </ul>
      </div>

      {/* Remplaçants équipe 2 */}
      <div className="mt-4">
        <p className="font-semibold font-Bai_Jamjuree text-base sm:text-lg text-left">
          Banc {methode.nomequipe2} :
        </p>
        <ul className="mt-2 space-y-1">
          {methode.remplacantsequipe2.map((remp, index) => (
            <li
              key={index}
              className="flex items-center gap-2 text-sm sm:text-base text-left"
            >
              <p>
                {remp[2].slice(0, 3).toUpperCase()} - {remp[0]}
              </p>
              <Image
                width={512}
                height={512}
                src={remp[1]}
                alt=""
                className="w-4 sm:w-5 h-[10px] sm:h-[12px] border border-black object-cover"
              />
              {remp[3] && (
                <>
                  <ArrowBigUp fill="green" size={16} stroke="green" />
                  <p className="text-sm sm:text-base">{remp[3]}</p>
                </>
              )}
              {Number(remp[4]) > 0 &&
                Array.from({ length: Number(remp[4]) }, (_, i) => (
                  <Image
                    key={i}
                    src={"/_assets/img/iconeballon.png"}
                    alt="Buts"
                    width={15}
                    height={15}
                  />
                ))}
            </li>
          ))}
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
