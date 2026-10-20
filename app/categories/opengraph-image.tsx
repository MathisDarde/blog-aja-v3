import { OG_SIZE, renderOgImage } from "@/lib/og-image";

export const alt = "Catégories – Mémoire d'Auxerrois";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return renderOgImage({
    title: "Catégories",
    subtitle: "L'histoire de l'AJA par époque, par joueur et par compétition",
  });
}
