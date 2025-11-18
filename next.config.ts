import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["www.aja.fr", "lh3.googleusercontent.com", "res.cloudinary.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
