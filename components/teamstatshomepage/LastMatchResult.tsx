import { useGlobalContext } from "@/contexts/GlobalContext";
import { clubLogos } from "@/contexts/Teams";
import Image from "next/image";
import Button from "../BlueButton";
import Link from "next/link";

export default async function LastMatchResult() {
  const { getLastMatch } = useGlobalContext();

  const lastMatch = await getLastMatch();

  return (
    <div className="flex flex-col items-center">
      <p className="mb-4 text-center font-Montserrat uppercase text-lg font-semibold">
        Dernier match joué:
      </p>
      <div className="flex flex-col justify-center items-center gap-1">
        {lastMatch ? (
          <>
            <div className="flex justify-center gap-6">
              <div className="flex flex-col items-center gap-2">
                <Image
                  src={clubLogos[lastMatch.team1]}
                  alt={`Logo de ${lastMatch.team1}`}
                  width={100}
                  height={100}
                  className="size-24"
                />
                <p className="w-24 truncate font-Bai_Jamjuree font-semibold text-lg">
                  {lastMatch.team1}
                </p>
              </div>
              <div className="flex justify-center items-center rounded-md p-6">
                <p className="font-Bai_Jamjuree text-6xl font-bold">
                  <span className="w-24">{lastMatch.score?.ft?.[0]}</span>{" "}
                  <span className="mx-6">-</span>{" "}
                  <span className="w-24">{lastMatch.score?.ft?.[1]}</span>
                </p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Image
                  src={clubLogos[lastMatch.team2]}
                  alt={`Logo de ${lastMatch.team2}`}
                  width={100}
                  height={100}
                  className="size-24"
                />
                <p className="w-24 truncate font-Bai_Jamjuree font-semibold text-lg">
                  {lastMatch.team2}
                </p>
              </div>
            </div>

            <div className="flex justify-center">
              <p className="font-Bai_Jamjuree font-medium text-lg">
                {new Date(
                  `${lastMatch.date}T${lastMatch.time ?? "00:00"}`
                ).toLocaleString("fr-FR", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </>
        ) : (
          <p>Chargement...</p>
        )}
      </div>

      <Link href="/calendrier">
        <Button>
          Accéder au calendrier
        </Button>
      </Link>
    </div>
  );
}
