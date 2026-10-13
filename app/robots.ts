import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const SITE_URL =
    process.env.NEXT_PUBLIC_SITE_URL || "https://memoiredauxerrois.fr";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin/",
        "/api/",
        "/moncompte/",
        "/forgot-password/",
        "/reset-password/",
        "/register/",
        "/login/",
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
