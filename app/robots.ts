import { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
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
    host: SITE_URL,
  };
}
