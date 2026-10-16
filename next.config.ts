import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    domains: ["www.aja.fr", "lh3.googleusercontent.com", "res.cloudinary.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      // Logos des clubs publiés par les scrapers (actuels et d'époque)
      {
        protocol: "https",
        hostname: "mathisdarde.github.io",
        pathname: "/AJA-Website-Scrapers/**",
      },
      // Logos d'époque des clubs lus sur Wikipédia, affichés depuis Wikimedia (lib/club-logo-sync)
      { protocol: "https", hostname: "upload.wikimedia.org", pathname: "/**" },
      { protocol: "https", hostname: "thumb.wikimedia.org", pathname: "/**" },
      // Mêmes données servies en local pour les tests (SCRAPERS_URL=http://localhost:8765)
      ...(process.env.NODE_ENV === "development"
        ? [{ protocol: "http" as const, hostname: "localhost", port: "8765" }]
        : []),
    ],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  // Ancienne page boutique (retirée, elle était dans le sitemap)
  async redirects() {
    return [{ source: "/boutique", destination: "/", permanent: true }];
  },
};

export default nextConfig;
