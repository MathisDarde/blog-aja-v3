import { OG_SIZE, renderOgImage } from "@/lib/og-image";

export const alt = "Chants – Mémoire d'Auxerrois";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return renderOgImage({
    title: "Chants",
    subtitle: "Les hymnes des supporters de l'AJ Auxerre",
  });
}
