import { OG_SIZE, renderOgImage } from "@/lib/og-image";

export const alt = "Quiz AJA – Mémoire d'Auxerrois";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return renderOgImage({
    title: "Quiz AJA",
    subtitle: "Êtes-vous un vrai supporter auxerrois ?",
  });
}
