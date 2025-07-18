import { MethodeJoueur } from "@/contexts/Interfaces";
import Image from "next/image";

interface PlayerMethodeExpertProps {
  methode: MethodeJoueur;
}

export default function PlayerMethodeExpert({
  methode,
}: PlayerMethodeExpertProps) {
  return (
    <div className="bg-white rounded-lg font-Montserrat">
      {/* Image du joueur */}
      <Image
        src={methode.imagejoueur}
        width={512}
        height={512}
        alt={methode.joueurnom}
        className="aspect-video object-cover mx-auto rounded-lg"
      />

      {/* Nom du joueur */}
      <p className="text-center text-xl font-bold mt-4">{methode.joueurnom}</p>

      {/* Profil du joueur */}
      <div className="mt-4">
        <p className="font-semibold">Profil du joueur :</p>
        <p>Poste : {methode.poste}</p>
        <p>Taille : {methode.taille}</p>
        <p>Pied fort : {methode.piedfort}</p>
      </div>

      {/* Clubs du joueur */}
      <div className="mt-4">
        <p className="font-semibold">Clubs :</p>
        <ul className="mt-2">
          {methode.clubs.map((club, index) => (
            <li key={index} className="flex items-center gap-2 my-2">
              <Image
                height={512}
                width={512}
                src={club[0]}
                alt={`Logo de ${club[1]}`}
                className="w-6 h-6"
              />
              <span className="text-gray-700">
                <span className="font-semibold">{club[1]}</span> ({club[2]})
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Statistiques */}
      <div className="mt-4">
        <p className="font-semibold">Statistiques en carrière :</p>
        <p>{methode.matchs} matchs</p>
        <p>{methode.buts} buts</p>
        <p>{methode.passesd} passes décisives</p>
      </div>
    </div>
  );
}
