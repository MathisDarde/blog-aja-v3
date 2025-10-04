import { teamsNames } from "@/components/TeamsNames";

export function getTeamInfo(name: string) {
  const team = teamsNames.find((t) =>
    t.namesList.some((n) => n.toLowerCase() === name.toLowerCase())
  );
  if (!team) return { actualName: name, logo: "logoligue1.svg" }; // fallback
  return { actualName: team.actualName, logo: team.logo, abr: team.abr };
}
