import { MethodeCoach } from "@/contexts/Interfaces";
import Image from "next/image";

interface CoachMethodeExpertProps {
  methode: MethodeCoach;
}

export default function CoachMethodeExpert({
  methode,
}: CoachMethodeExpertProps) {
  const formattedClubs = methode.clubscoach.map(([logo, name, years]) => ({
    logo,
    name,
    years,
  }));

  return (
    <div className="flex gap-10">
      <div className="w-1/2">
        {/* Image du coach */}
        {methode.imagecoach && (
          <Image
            src={methode.imagecoach}
            alt={methode.nomcoach}
            width={512}
            height={512}
            className="aspect-video object-cover mx-auto rounded-lg"
          />
        )}

        {/* Nom du coach */}
        <p className="text-center font-Bai_Jamjuree text-2xl font-bold mt-2">
          {methode.nomcoach}
        </p>

        {/* Palmarès */}
        <div className="mt-6">
          <p className="text-lg font-semibold font-Bai_Jamjuree">Palmarès :</p>
          <ul className="">
            {methode.palmares?.map((item, index) => (
              <li key={index} className="text-gray-700">
                {item[0]} ({item[1]})
              </li>
            ))}
          </ul>
        </div>

        {/* Statistiques */}
        <div className="mt-4">
          <p className="text-lg font-semibold font-Bai_Jamjuree">
            Statistiques :
          </p>
          <p className="text-gray-700">{methode.statistiques}</p>
        </div>
      </div>

      <div className="w-1/2">
        {/* Clubs entraînés */}
        <p className="font-Bai_Jamjuree text-lg font-semibold text-left mb-4">
          Clubs
        </p>
        <ul className="space-y-2">
          {formattedClubs.map((club, index) =>
            club.logo && club.name && club.years ? (
              <li key={index} className="flex items-center gap-2">
                <Image
                  height={512}
                  width={512}
                  src={club.logo}
                  alt={`Logo de ${club.name}`}
                  className="w-6 h-6"
                />
                <span className="text-gray-700">
                  <span className="font-semibold font-Montserrat">
                    {club.name}
                  </span>{" "}
                  ({club.years})
                </span>
              </li>
            ) : (
              <li key={index} className="text-gray-700">
                Club invalide
              </li>
            )
          )}
        </ul>
      </div>
    </div>
  );
}
