import Image from "next/image";
import { Team } from "@/contexts/Interfaces";
import { getTeamInfo } from "@/utils/get-team-info";

export default function ClassementAuxerre({ teams }: { teams: Team[] }) {
  function getReducedClassement() {
    const index = teams.findIndex((team) =>
      team.equipe.toLowerCase().includes("auxerre")
    );

    if (index === -1) return [];

    const start = Math.max(0, index - 2);
    const end = Math.min(teams.length, index + 3);

    return teams.slice(start, end);
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
                isAuxerre ? "w-[300px] sm:w-[400px] xl:w-[450px] h-[55px] xl:h-[65px]" : "w-[250px] sm:w-[350px] h-[40px] sm:h-[50px]"
              } `}
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
                className={`${isAuxerre ? "w-10 xl:w-12 h-10 xl:h-12" : "w-7 sm:w-8 h-7 sm:h-8"}`}
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
