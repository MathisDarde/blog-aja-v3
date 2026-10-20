import { OG_SIZE, renderOgImage } from "@/lib/og-image";

export const alt = "Articles – Mémoire d'Auxerrois";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return renderOgImage({
    title: "Articles",
    subtitle: "Les grandes histoires de l'AJ Auxerre, racontées par des passionnés",
  });
}
