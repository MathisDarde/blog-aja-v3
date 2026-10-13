import type { Metadata } from "next";
import articleTags from "@/public/data/articletags.json";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://memoiredauxerrois.fr";
export const SITE_NAME = "Mémoire d'Auxerrois";

// JPG et non AVIF : Facebook, LinkedIn, WhatsApp... n'affichent pas l'AVIF
export const DEFAULT_OG_IMAGE = {
  url: "/_assets/img/opengraphimage.jpg",
  width: 1200,
  height: 630,
  alt: "Image bannière - Mémoire d'Auxerrois",
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
      siteName: SITE_NAME,
      locale: "fr_FR",
      type: "website",
      images: [DEFAULT_OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [DEFAULT_OG_IMAGE.url],
    },
    ...(noIndex && { robots: { index: false, follow: false } }),
  };
}

// Image de partage 1200x630 en JPG via les transformations Cloudinary
export function socialImageUrl(imageUrl: string | null | undefined) {
  if (!imageUrl) return DEFAULT_OG_IMAGE.url;
  if (!imageUrl.includes("res.cloudinary.com") || !imageUrl.includes("/upload/")) {
    return imageUrl;
  }
  return imageUrl
    .replace("/upload/", "/upload/c_fill,w_1200,h_630,g_auto,f_jpg,q_auto/")
    .replace(/\.(webp|avif|png|jpeg|gif)$/i, ".jpg");
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
