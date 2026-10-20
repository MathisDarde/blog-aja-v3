import { OG_SIZE, renderOgImage } from "@/lib/og-image";

export const alt = "Classement & statistiques – Mémoire d'Auxerrois";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return renderOgImage({
    title: "Classement & statistiques",
    subtitle: "L'AJ Auxerre au fil de la saison",
  });
}
