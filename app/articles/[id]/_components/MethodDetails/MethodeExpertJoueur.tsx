import { MethodeJoueur } from "@/contexts/Interfaces";
import Image from "next/image";

interface PlayerMethodeExpertProps {
  methode: MethodeJoueur;
}

export default function PlayerMethodeExpert({
  methode,
}: PlayerMethodeExpertProps) {
  return (
    <div className="flex flex-col pt-8">
        {/* Image du joueur */}
        <Image
          src={methode.imagejoueur}
          width={512}
          height={512}
          alt={methode.joueurnom}
          className="aspect-video w-full object-cover h-auto mx-auto rounded-lg"
        />

        {/* Nom du joueur */}
        <p className="text-center font-Bai_Jamjuree text-2xl font-bold mt-4">
          {methode.joueurnom}
        </p>

        {/* Profil du joueur */}
        <div className="mt-4 text-left space-y-2">
          <p className="text-lg font-semibold font-Bai_Jamjuree">
            Profil du joueur
          </p>
          <p>Poste : {methode.poste}</p>
          <p>Taille : {methode.taille}</p>
          <p>Pied fort : {methode.piedfort}</p>
        </div>

        {/* Clubs du joueur */}
        <p className="text-lg mt-4 text-left font-semibold font-Bai_Jamjuree">
          Clubs
        </p>
        <ul>
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

        {/* Statistiques */}
        <div className="mt-4 text-left space-y-2">
          <p className="text-lg font-semibold font-Bai_Jamjuree">
            Statistiques en carrière
          </p>
          <p>{methode.matchs} matchs</p>
          <p>{methode.buts} buts</p>
          <p>{methode.passesd} passes décisives</p>
        </div>
      </div>
  );
}
