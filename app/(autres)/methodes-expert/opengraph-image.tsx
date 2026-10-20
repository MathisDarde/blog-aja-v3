import { OG_SIZE, renderOgImage } from "@/lib/og-image";

export const alt = "Méthodes expert – Mémoire d'Auxerrois";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return renderOgImage({
    title: "Méthodes expert",
    subtitle: "Joueurs, coachs, matchs et saisons de l'AJ Auxerre",
  });
}
