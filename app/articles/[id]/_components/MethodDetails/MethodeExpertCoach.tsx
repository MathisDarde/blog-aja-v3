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
    <div className="bg-white rounded-lg font-Montserrat">
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
      <p className="text-center text-xl font-bold mt-2">{methode.nomcoach}</p>

      {/* Clubs entraînés */}
      <div className="mt-4">
        <p className="text-lg font-semibold">Clubs :</p>
        <ul className="space-y-2">
          {formattedClubs.map((club, index) =>
            club.logo && club.name && club.years ? (
              <li key={index} className="flex items-center gap-2">
                <Image
                  src={club.logo}
                  alt={`Logo de ${club.name}`}
                  width={30}
                  height={30}
                  className="rounded"
                />
                <span className="text-gray-700">
                  <span className="font-semibold">{club.name}</span> (
                  {club.years})
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

      {/* Palmarès */}
      <div className="mt-4">
        <p className="text-lg font-semibold">Palmarès :</p>
        <ul className="list-disc pl-5">
          {methode.palmares?.map((item, index) => (
            <li key={index} className="text-gray-700">
              {item[0]} ({item[1]})
            </li>
          ))}
        </ul>
      </div>

      {/* Statistiques */}
      <div className="mt-4">
        <p className="text-lg font-semibold">Statistiques :</p>
        <p className="text-gray-700">{methode.statistiques}</p>
      </div>
    </div>
  );
}
