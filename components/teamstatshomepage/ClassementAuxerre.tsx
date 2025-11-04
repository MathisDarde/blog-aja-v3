import Image from "next/image";
import { Team } from "@/contexts/Interfaces";
import { getTeamInfo } from "@/utils/get-team-info";

export default function ClassementAuxerre({ teams }: { teams: Team[] }) {
  function getReducedClassement() {
    const index = teams.findIndex((team) =>
      team.equipe.toLowerCase().includes("auxerre")
    );

    if (index === -1) return [];

    const lastIndex = teams.length - 1;
    let start = 0;
    let end = 0;

    if (index === 0) {
      // Auxerre est premier
      start = 0;
      end = Math.min(lastIndex, 4);
    } else if (index === 1) {
      // Auxerre est 2e
      start = 0;
      end = Math.min(lastIndex, 4);
    } else if (index === lastIndex - 1) {
      // Avant-dernier
      start = Math.max(0, index - 3);
      end = Math.min(lastIndex, index + 1);
    } else if (index === lastIndex) {
      // Dernier
      start = Math.max(0, index - 4);
      end = index;
    } else {
      // Cas général
      start = Math.max(0, index - 2);
      end = Math.min(lastIndex, index + 2);
    }

    return teams.slice(start, end + 1);
  }

  const classement = getReducedClassement();

  return (
    <div>
      <p className="text-center font-Montserrat uppercase text-base sm:text-lg lg:text-base xl:text-lg font-semibold mb-4">
        Classement de l&apos;AJ Auxerre
      </p>
      <div className="flex flex-col gap-1">
        {classement.map((team, index) => {
          const teamInfo = getTeamInfo(team.equipe);
          const isAuxerre = team.equipe.toLowerCase().includes("auxerre");

          return (
            <div
              key={index}
              className={`flex items-center gap-2 sm:gap-3 mx-auto p-2 sm:p-4 rounded-md border border-gray-400 ${
                isAuxerre
                  ? "w-[300px] sm:w-[400px] xl:w-[450px] h-[55px] xl:h-[65px]"
                  : "w-[250px] sm:w-[350px] h-[40px] sm:h-[50px]"
              }`}
            >
              <p
                className={`font-Bai_Jamjuree ${
                  isAuxerre ? "text-xl" : "text-base sm:text-lg"
                } font-semibold`}
              >
                {team.position}.
              </p>
              <Image
                src={`/_assets/teamlogos/${teamInfo.logo}`}
                width={120}
                height={120}
                alt={`${teamInfo.actualName} logo`}
                className={`${
                  isAuxerre
                    ? "w-10 xl:w-12 h-10 xl:h-12"
                    : "w-7 sm:w-8 h-7 sm:h-8"
                }`}
              />
              <p
                className={`font-Bai_Jamjuree font-semibold ${
                  isAuxerre ? "text-xl" : "text-base sm:text-lg"
                }`}
              >
                {teamInfo.actualName}
              </p>
              <p
                className={`ml-auto font-Bai_Jamjuree font-semibold ${
                  isAuxerre ? "text-xl" : "text-base sm:text-lg"
                }`}
              >
                {team.points} pts
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}