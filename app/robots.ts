import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const SITE_URL =
    process.env.NEXT_PUBLIC_SITE_URL || "https://memoiredauxerrois.fr";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Sans "/" final : "/login/" ne bloquerait pas "/login"
      disallow: [
        "/admin",
        "/api",
        "/moncompte",
        "/forgot-password",
        "/reset-password",
        "/register",
        "/login",
        "/articles/*/update",
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
