import Image from "next/image";
import { ArrowBigUp } from "lucide-react";
import { MethodeMatch } from "@/contexts/Interfaces";

interface GameMethodeExpertProps {
  methode: MethodeMatch;
}

export default function GameMethodeExpert({ methode }: GameMethodeExpertProps) {
  return (
    <div className="flex flex-col pt-4">
      {/* Titre du match */}
      <p className="text-center font-Bai_Jamjuree text-xl text-2xl font-bold mt-4">
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
        <h3 className="font-semibold font-Bai_Jamjuree text-lg">{methode.nomequipe1}</h3>
        <h3 className="text-sm">{methode.systemeequipe1}</h3>
        </div>
      </div>

      {/* Image du terrain */}
      <div className="my-2 flex justify-center">
        <Image
          src={methode.imgterrain}
          width={1024}
          height={1024}
          alt="Terrain"
          className="rounded-md max-h-[400px] w-auto"
        />
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
        <h3 className="font-semibold font-Bai_Jamjuree text-lg">{methode.nomequipe2}</h3>
        <h3 className="text-sm">{methode.systemeequipe2}</h3>
        </div>
      </div>

      {/* Remplaçants équipe 1 */}
      <div className="mt-4">
        <p className="font-semibold font-Bai_Jamjuree text-base sm:text-lg text-left">Banc {methode.nomequipe1} :</p>
        <ul className="mt-2 space-y-1">
          {methode.remplacantsequipe1.map((remp, index) => (
            <li key={index} className="flex items-center gap-2 text-sm sm:text-base text-left">
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
        <p className="font-semibold font-Bai_Jamjuree text-base sm:text-lg text-left">Banc {methode.nomequipe2} :</p>
        <ul className="mt-2 space-y-1">
          {methode.remplacantsequipe2.map((remp, index) => (
            <li key={index} className="flex items-center gap-2 text-sm sm:text-base text-left">
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
        <p className="font-semibold font-Bai_Jamjuree text-base sm:text-lg">{methode.stade}</p>
        <p className="text-sm sm:text-base text-black">{methode.date}</p>
      </div>
    </div>
  );
}
