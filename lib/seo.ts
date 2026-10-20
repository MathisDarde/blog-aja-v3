import type { Metadata } from "next";
import articleTags from "@/public/data/articletags.json";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://memoiredauxerrois.fr";
export const SITE_NAME = "Mémoire d'Auxerrois";
export const SITE_DESCRIPTION =
  "Mémoire d'Auxerrois raconte l'histoire de l'AJ Auxerre, le club de foot d'Auxerre : légendes de l'AJA, grands matchs à l'Abbé-Deschamps, épopées européennes, palmarès, calendrier et classement.";
// Logo carré sur fond plein : Google n'affiche pas le SVG portrait de l'écusson
export const SITE_LOGO = `${SITE_URL}/icons/logo-512.png`;

// JPG et non AVIF : Facebook, LinkedIn, WhatsApp... n'affichent pas l'AVIF
export const DEFAULT_OG_IMAGE = {
  url: "/_assets/img/opengraphimage.jpg",
  width: 1200,
  height: 630,
  alt: "Image bannière - Mémoire d'Auxerrois",
};

// Le club, sujet de tout le site : relie les pages à l'entité "AJ Auxerre"
// du Knowledge Graph et ancre le site à Auxerre pour les recherches locales
export const AJA_ENTITY = {
  "@type": "SportsTeam",
  "@id": `${SITE_URL}/#aja`,
  name: "AJ Auxerre",
  alternateName: [
    "AJA",
    "Association de la jeunesse auxerroise",
    "Auxerre",
  ],
  sport: "Football",
  foundingDate: "1905",
  url: "https://www.aja.fr/",
  sameAs: [
    "https://www.aja.fr/",
    "https://fr.wikipedia.org/wiki/Association_de_la_jeunesse_auxerroise",
    "https://en.wikipedia.org/wiki/AJ_Auxerre",
  ],
  location: {
    "@type": "StadiumOrArena",
    name: "Stade de l'Abbé-Deschamps",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Route de Vaux",
      addressLocality: "Auxerre",
      postalCode: "89000",
      addressRegion: "Bourgogne-Franche-Comté",
      addressCountry: "FR",
    },
    geo: { "@type": "GeoCoordinates", latitude: 47.7869, longitude: 3.5886 },
  },
};

export const ORGANIZATION_ENTITY = {
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: SITE_NAME,
  url: SITE_URL,
  logo: {
    "@type": "ImageObject",
    url: SITE_LOGO,
    width: 512,
    height: 512,
  },
  email: "contact@memoiredauxerrois.fr",
  areaServed: { "@type": "City", name: "Auxerre" },
  knowsAbout: ["AJ Auxerre", "Football", "Histoire du football", "Auxerre"],
};

// Next ne recalcule pas og:title / og:description à partir du title de la page :
// sans ça, toutes les pages partagées affichent "Accueil".
export function pageMetadata({
  title,
  description,
  noIndex = false,
}: {
  title: string;
  description: string;
  noIndex?: boolean;
}): Metadata {
  const fullTitle = `${title} | ${SITE_NAME}`;

  return {
    title,
    description,
    openGraph: {
      title: fullTitle,
      description,
      // Résolu par Next sur le chemin de la page, comme le canonical
      url: "./",
      siteName: SITE_NAME,
      locale: "fr_FR",
      type: "website",
      // Remplacée par l'opengraph-image du segment quand il en a une
      images: [DEFAULT_OG_IMAGE],
    },
    // Sans twitter:image, X reprend og:image (la bannière propre à la page)
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
    ...(noIndex && { robots: { index: false, follow: false } }),
  };
}

// Image de partage en JPG via les transformations Cloudinary (1200x630 par défaut)
export function socialImageUrl(
  imageUrl: string | null | undefined,
  { width = 1200, height = 630 }: { width?: number; height?: number } = {},
) {
  if (!imageUrl) return DEFAULT_OG_IMAGE.url;
  if (!imageUrl.includes("res.cloudinary.com") || !imageUrl.includes("/upload/")) {
    return imageUrl;
  }
  return imageUrl
    .replace("/upload/", `/upload/c_fill,w_${width},h_${height},g_auto,f_jpg,q_auto/`)
    .replace(/\.(webp|avif|png|jpeg|gif)$/i, ".jpg");
}

// Google recommande plusieurs ratios (16:9, 4:3, 1:1) pour les résultats enrichis et Discover
export function structuredDataImages(imageUrl: string | null | undefined) {
  return [
    socialImageUrl(imageUrl, { width: 1200, height: 675 }),
    socialImageUrl(imageUrl, { width: 1200, height: 900 }),
    socialImageUrl(imageUrl, { width: 1200, height: 1200 }),
  ];
}

// Empêche la fermeture prématurée de la balise <script> dans le JSON-LD
export function jsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

// Les tags sont stockés sous forme d'identifiants ("coupedeurope") :
// on expose leurs libellés lisibles ("Coupe d'Europe") aux moteurs de recherche
export function tagLabels(tags: string[] | null | undefined) {
  return (tags ?? []).map(
    (value) => articleTags.find((t) => t.value === value)?.tag ?? value,
  );
}
