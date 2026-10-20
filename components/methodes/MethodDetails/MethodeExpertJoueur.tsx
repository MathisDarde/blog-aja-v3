import Button from "@/components/BlueButton";
import { MethodeJoueur } from "@/contexts/Interfaces";
import { authClient } from "@/lib/auth-client";
import { PenBox } from "lucide-react";
import Image from "next/image";
import { redirect } from "next/navigation";

const isKnownStat = (value: string | null | undefined) => !/^\s*(-+|0+)?\s*$/.test(value ?? "");

interface PlayerMethodeExpertProps {
  methode: MethodeJoueur;
}

export default function PlayerMethodeExpert({
  methode,
}: PlayerMethodeExpertProps) {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const stats = (
    [
      [methode.matchs, "matchs"],
      [methode.buts, "buts"],
      [methode.passesd, "passes décisives"],
    ] as const
  ).filter(([value]) => isKnownStat(value));

  return (
    <div className="flex flex-col pt-8">
      {/* Image du joueur */}
      <Image
        src={methode.imagejoueur || "/_assets/img/pdpdebase.png"}
        width={512}
        height={512}
        alt={methode.joueurnom}
        className="aspect-video w-full object-cover h-auto mx-auto rounded-lg"
      />

      {/* Nom du joueur */}
      <p className="text-center font-Bai_Jamjuree text-xl sm:text-2xl font-bold mt-4">
        {methode.joueurnom}
      </p>

      {/* Profil du joueur */}
      <div className="mt-4 text-left space-y-2">
        <p className="text-base sm:text-lg font-semibold font-Bai_Jamjuree">
          Profil du joueur
        </p>
        <p className="text-sm sm:text-base">Poste : {methode.poste}</p>
        <p className="text-sm sm:text-base">Taille : {methode.taille}</p>
        <p className="text-sm sm:text-base">Pied fort : {methode.piedfort}</p>
      </div>

      {/* Clubs du joueur */}
      <p className="text-base sm:text-lg mt-4 text-left font-semibold font-Bai_Jamjuree">
        Clubs
      </p>
      <ul>
        {methode.clubs.map((club, index) => (
          <li key={index} className="flex items-center gap-2 my-2">
            <Image
              height={512}
              width={512}
              src={club[0] || "/_assets/img/defaultlogoimage.png"}
              alt={`Logo de ${club[1]}`}
              className="w-5 sm:w-6 h-5 sm:h-6 object-contain shrink-0"
            />
            <span className="text-gray-700 text-sm sm:text-base text-left">
              <span className="font-semibold">{club[1]}</span> ({club[2]})
            </span>
          </li>
        ))}
      </ul>

      {/* Statistiques : « - », « 0 » ou « 000 » signifient « inconnu », pas « zéro » */}
      {stats.length > 0 && (
        <div className="mt-4 text-left space-y-2">
          <p className="text-base sm:text-lg font-semibold font-Bai_Jamjuree">
            Statistiques en carrière
          </p>
          {stats.map(([value, label]) => (
            <p key={label} className="text-sm sm:text-base">
              {value} {label}
            </p>
          ))}
        </div>
      )}

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
