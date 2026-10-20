import { OG_SIZE, renderOgImage } from "@/lib/og-image";

// Bannière de l'accueil, reprise par les pages qui n'ont pas la leur
export const alt = "Mémoire d'Auxerrois – L'histoire de l'AJ Auxerre";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return renderOgImage({
    title: "L'histoire de l'AJ Auxerre",
    subtitle: "Légendes, grands matchs, palmarès, calendrier et classement de l'AJA",
  });
}
