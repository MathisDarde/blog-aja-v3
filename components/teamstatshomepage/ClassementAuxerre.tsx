import { useGlobalContext } from "@/contexts/GlobalContext";
import Image from "next/image";

export default function ClassementAuxerre() {
  const { getReducedClassement } = useGlobalContext();

  const classement = getReducedClassement();

  return (
    <div>
      <p className="text-center font-Montserrat uppercase text-lg font-semibold mb-4">
        Classement de l&apos;AJ Auxerre
      </p>
      <div className="flex flex-col gap-1">
        {classement.map((team, index) => (
          <div
            key={index}
            className={`flex items-center gap-3 mx-auto p-4 rounded-md border border-gray-400 ${
              team.strTeam === "Auxerre"
                ? "w-[450px] h-[65px]"
                : "w-[350px] h-[50px]"
            } `}
          >
            <p
              className={`font-Bai_Jamjuree ${
                team.strTeam === "Auxerre" ? "text-xl" : "text-lg"
              } font-semibold`}
            >
              {team.intRank}.
            </p>
            {team.strTeam === "Auxerre" ? (
              <Image
                src={`/_assets/teamlogos/logo${team.strTeam
                  .replace(/\s+/g, "")
                  .replace(/[^\w]/g, "")
                  .toLowerCase()}.svg`}
                width={38}
                height={38}
                alt="team logo"
              />
            ) : (
              <Image
                src={`/_assets/teamlogos/logo${team.strTeam
                  .replace(/\s+/g, "")
                  .replace(/[^\w]/g, "")
                  .toLowerCase()}.svg`}
                width={30}
                height={30}
                alt="logo auxerre"
              />
            )}
            <p
              className={`font-Bai_Jamjuree font-semibold ${
                team.strTeam === "Auxerre" ? "text-xl" : "text-lg"
              }`}
            >
              {team.strTeam}
            </p>
            <p
              className={`ml-auto font-Bai_Jamjuree font-semibold ${
                team.strTeam === "Auxerre" ? "text-xl" : "text-lg"
              }`}
            >
              {team.intPoints} pts
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
