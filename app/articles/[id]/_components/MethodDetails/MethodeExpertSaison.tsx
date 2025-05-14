import Image from "next/image";

interface SeasonMethodeExpertProps {
  methode: {
    id_methode: string;
    typemethode: "saison";
    keywords: string[];
    saison: string;
    imgterrain: string;
    coach: string;
    systeme: string;
    remplacants: [string, string, string][];
  };
  onClose: () => void;
}

export default function SeasonMethodeExpert({
  methode,
  onClose,
}: SeasonMethodeExpertProps) {
  return (
    <div className="bg-white rounded-lg font-Montserrat">
      {/* Bouton de fermeture */}
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-600 hover:text-red-500 text-xl"
      >
        ✖
      </button>

      {/* Titre Saison */}
      <h2 className="text-center text-xl font-bold mt-4">
        Saison {methode.saison}
      </h2>

      {/* Image du terrain */}
      <div className="my-4 flex justify-center">
        <Image
          src={methode.imgterrain}
          width={300}
          height={200}
          alt="Terrain"
          className="rounded-md"
        />
      </div>

      {/* Coach et système */}
      <div className="mt-4 text-center">
        <p className="font-semibold">Coach : {methode.coach}</p>
        <p className="text-sm">{methode.systeme}</p>
      </div>

      {/* Remplaçants */}
      <div className="mt-4">
        <p className="font-semibold">Remplaçants :</p>
        <ul className="mt-2 space-y-1">
          {methode.remplacants.map((remp, index) => (
            <li key={index} className="flex items-center gap-2">
              <p className="text-sm">
                {remp[2]} - {remp[0]}
              </p>
              <Image
                width={512}
                height={512}
                src={remp[1]}
                alt=""
                className="w-4 h-[10px] border border-black"
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
