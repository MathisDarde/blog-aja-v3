import { OG_SIZE, renderOgImage } from "@/lib/og-image";

export const alt = "Historique – Mémoire d'Auxerrois";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return renderOgImage({
    title: "Historique",
    subtitle: "Le parcours de l'AJ Auxerre saison par saison depuis 1974",
  });
}
