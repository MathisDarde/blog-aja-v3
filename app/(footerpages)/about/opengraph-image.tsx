import { OG_SIZE, renderOgImage } from "@/lib/og-image";

export const alt = "À propos – Mémoire d'Auxerrois";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return renderOgImage({
    title: "À propos",
    subtitle: "Un site de passionnés dédié à l'AJ Auxerre",
  });
}
