import type { MetadataRoute } from "next";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/seo";

// Installation en web app (écran d'accueil Android / iOS, ordinateur)
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: `${SITE_NAME} – L'histoire de l'AJ Auxerre`,
    short_name: SITE_NAME,
    description: SITE_DESCRIPTION,
    lang: "fr-FR",
    dir: "ltr",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#f3f4f6",
    theme_color: "#ffffff",
    categories: ["sports", "news", "entertainment"],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      {
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      { name: "Articles", url: "/articles", icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }] },
      { name: "Calendrier", url: "/calendrier", icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }] },
      { name: "Classement", url: "/classement-statistiques", icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }] },
      { name: "Quiz", url: "/quiz", icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }] },
    ],
  };
}
