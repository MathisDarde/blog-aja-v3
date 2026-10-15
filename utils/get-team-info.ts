import { teamsNames } from "@/components/TeamsNames";
import { findLocalLogo, LOCAL_LOGOS_PATH } from "@/lib/local-club-logos";

// Sigles et articles ignorés pour abréger un club inconnu (« FC Gueugnon » → « GUE »)
const NOISE = new Set(["fc", "ac", "as", "aj", "sc", "rc", "us", "es", "sm", "ea", "ogc", "olympique", "stade", "de", "du", "la", "le", "les"]);

const fallbackAbbreviation = (name: string) => {
  const words = name.split(/[\s-]+/).filter((w) => w && !NOISE.has(w.toLowerCase()));
  return (words[0] ?? name).slice(0, 3).toUpperCase();
};

/** Nom, logo (fichier de public/_assets/teamlogos) et abréviation d'un club. */
export function getTeamInfo(name: string) {
  const team = teamsNames.find((t) =>
    t.namesList.some((n) => n.toLowerCase() === name.toLowerCase())
  );
  if (!team) {
    // Club absent de la liste (souvent un adversaire des saisons archivées) : logo retrouvé
    // par son nom dans teamlogos, sinon écusson neutre
    const logo = findLocalLogo(name)?.slice(LOCAL_LOGOS_PATH.length) ?? "logodefault.png";
    return { actualName: name, logo, abr: fallbackAbbreviation(name) };
  }
  return {
    actualName: team.actualName,
    logo: team.logo,
    abr: team.abr,
    stade: team.stade,
  };
}
