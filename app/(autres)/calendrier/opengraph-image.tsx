import { OG_SIZE, renderOgImage } from "@/lib/og-image";

export const alt = "Calendrier – Mémoire d'Auxerrois";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return renderOgImage({
    title: "Calendrier",
    subtitle: "Dates, horaires et résultats des matchs de l'AJ Auxerre",
  });
}
