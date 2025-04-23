import Image from "next/image";
import { ArrowBigUp } from "lucide-react";

interface GameMethodeExpertProps {
  methode: {
    id_methode: string;
    typemethode: "match";
    keyword: string[];
    titrematch: string;
    imgterrain: string;
    couleur1equipe1: string;
    couleur2equipe1: string;
    nomequipe1: string;
    systemeequipe1: string;
    couleur1equipe2: string;
    couleur2equipe2: string;
    nomequipe2: string;
    systemeequipe2: string;
    remplacantsequipe1: [string, string, string, string?, string?][];
    remplacantsequipe2: [string, string, string, string?, string?][];
    stade: string;
    date: string;
  };
  onClose: () => void;
}

export default function GameMethodeExpert({
  methode,
  onClose,
}: GameMethodeExpertProps) {
  return (
    <div className="bg-white rounded-lg font-Montserrat">
      {/* Bouton de fermeture */}
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-600 hover:text-red-500 text-xl"
      >
        ✖
      </button>

      {/* Titre du match */}
      <h2 className="text-center text-xl font-bold mt-4">
        {methode.titrematch}
      </h2>

      {/* Équipe 1 */}
      <div className="flex items-center justify-center gap-2 mt-4">
        <div className="flex gap-0">
          <div
            className="w-6 h-6 rounded-full border border-black"
            style={{ background: methode.couleur1equipe1 }}
          ></div>
          <div
            className="w-6 h-6 rounded-full border border-black"
            style={{ background: methode.couleur2equipe1 }}
          ></div>
        </div>
        <h3 className="font-semibold">{methode.nomequipe1}</h3>
        <h3 className="text-sm">{methode.systemeequipe1}</h3>
      </div>

      {/* Image du terrain */}
      <div className="my-4 flex justify-center">
        <Image
          src={methode.imgterrain}
          width={1024}
          height={1024}
          alt="Terrain"
          className="rounded-md"
        />
      </div>

      {/* Équipe 2 */}
      <div className="flex items-center justify-center gap-2">
        <div className="flex gap-0">
          <div
            className="w-6 h-6 rounded-full border border-black"
            style={{ background: methode.couleur1equipe2 }}
          ></div>
          <div
            className="w-6 h-6 rounded-full border border-black"
            style={{ background: methode.couleur2equipe2 }}
          ></div>
        </div>
        <h3 className="font-semibold">{methode.nomequipe2}</h3>
        <h3 className="text-sm">{methode.systemeequipe2}</h3>
      </div>

      {/* Remplaçants équipe 1 */}
      <div className="mt-4">
        <p className="font-semibold text-center">Banc {methode.nomequipe1} :</p>
        <ul className="mt-2 space-y-1">
          {methode.remplacantsequipe1.map((remp, index) => (
            <li key={index} className="flex items-center gap-2">
              <p className="text-sm">
                {remp[2].slice(0, 3).toUpperCase()} - {remp[0]}
              </p>
              <Image
                width={512}
                height={512}
                src={remp[1]}
                alt=""
                className="w-4 h-[10px] border border-black object-cover"
              />
              {remp[3] && (
                <>
                  <ArrowBigUp fill="green" size={16} stroke="green" />
                  <p className="text-sm">{remp[3]}</p>
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
        <p className="font-semibold text-center">Banc {methode.nomequipe2} :</p>
        <ul className="mt-2 space-y-1">
          {methode.remplacantsequipe2.map((remp, index) => (
            <li key={index} className="flex items-center gap-2">
              <p className="text-sm">
                {remp[2].slice(0, 3).toUpperCase()} - {remp[0]}
              </p>
              <Image
                width={512}
                height={512}
                src={remp[1]}
                alt=""
                className="w-4 h-[10px] border border-black object-cover"
              />
              {remp[3] && (
                <>
                  <ArrowBigUp fill="green" size={16} stroke="green" />
                  <p className="text-sm">{remp[3]}</p>
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
        <p className="font-semibold">{methode.stade}</p>
        <p className="text-sm text-gray-500 text-medium">{methode.date}</p>
      </div>
    </div>
  );
}
