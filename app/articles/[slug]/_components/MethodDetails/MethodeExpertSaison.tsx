import { MethodeSaison } from "@/contexts/Interfaces";
import Image from "next/image";

interface SeasonMethodeExpertProps {
  methode: MethodeSaison;
}

export default function SeasonMethodeExpert({
  methode,
}: SeasonMethodeExpertProps) {
  return (
    <div className="flex flex-col pt-4">
      {/* Titre Saison */}
      <p className="text-center font-Bai_Jamjuree text-xl sm:text-2xl font-bold mt-4">
        Saison {methode.saison}
      </p>

      {/* Image du terrain */}
      <div className="mt-4 flex justify-center">
        <Image
          src={methode.imgterrain}
          width={300}
          height={200}
          alt="Terrain"
          className="rounded-md w-full h-auto"
        />
      </div>

      {/* Coach et système */}
      <div className="mt-4 text-center">
        <p className="font-semibold text-base sm:text-lg text-left font-Bai_Jamjuree">Coach : {methode.coach} <span className="text-sm font-medium">({methode.systeme})</span></p>
      </div>

      {/* Remplaçants */}
      <div className="mt-4">
        <p className="font-semibold font-Bai_Jamjuree text-left text-base sm:text-lg">Remplaçants :</p>
        <ul className="mt-2 space-y-1">
          {methode.remplacants.map((remp, index) => (
            <li key={index} className="flex items-center gap-2 text-sm sm:text-base text-left">
              <p>
                {remp[2]} - {remp[0]}
              </p>
              <Image
                width={512}
                height={512}
                src={remp[1]}
                alt=""
                className="w-4 sm:w-5 h-[10px] sm:h-[12px] object-cover border border-black"
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
