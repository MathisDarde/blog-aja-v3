import { OG_SIZE, renderOgImage } from "@/lib/og-image";

export const alt = "Palmarès & records – Mémoire d'Auxerrois";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return renderOgImage({
    title: "Palmarès & records",
    subtitle: "Champion de France 1996, quatre Coupes de France et les records de l'AJA",
  });
}
