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
      <p className="text-center font-Montserrat uppercase text-lg font-semibold mb-4">
        Classement de l&apos;AJ Auxerre
      </p>
      <div className="flex flex-col gap-1">
        {classement.map((team, index) => {
          const teamInfo = getTeamInfo(team.equipe); // <-- récupère le logo correct
          const isAuxerre = team.equipe.toLowerCase().includes("auxerre");

          return (
            <div
              key={index}
              className={`flex items-center gap-3 mx-auto p-4 rounded-md border border-gray-400 ${
                isAuxerre ? "w-[450px] h-[65px]" : "w-[350px] h-[50px]"
              } `}
            >
              <p
                className={`font-Bai_Jamjuree ${
                  isAuxerre ? "text-xl" : "text-lg"
                } font-semibold`}
              >
                {team.position}.
              </p>
              <Image
                src={`/_assets/teamlogos/${teamInfo.logo}`}
                width={isAuxerre ? 38 : 30}
                height={isAuxerre ? 38 : 30}
                alt={`${teamInfo.actualName} logo`}
              />
              <p
                className={`font-Bai_Jamjuree font-semibold ${
                  isAuxerre ? "text-xl" : "text-lg"
                }`}
              >
                {teamInfo.actualName}
              </p>
              <p
                className={`ml-auto font-Bai_Jamjuree font-semibold ${
                  isAuxerre ? "text-xl" : "text-lg"
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
