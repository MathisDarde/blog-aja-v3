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
  // Polices et images lues par les bannières de partage générées à la demande
  // (matchs, saisons) : chemins construits dans lib/og-image, non détectés seuls
  outputFileTracingIncludes: {
    "/**": ["./assets/fonts/**/*", "./public/icons/icon-192.png", "./public/_assets/img/motif-aja.png"],
  },
  // Aucune image optimisée par Vercel (quota gratuit limité) : Cloudinary redimensionne les
  // siennes, les autres sont servies telles quelles (lib/image-loader)
  images: {
    loader: "custom",
    loaderFile: "./lib/image-loader.ts",
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
