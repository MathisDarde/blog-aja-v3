import { OG_SIZE, renderOgImage } from "@/lib/og-image";

export const alt = "Effectif actuel – Mémoire d'Auxerrois";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return renderOgImage({
    title: "Effectif actuel",
    subtitle: "Les joueurs et le staff de l'AJ Auxerre cette saison",
  });
}
