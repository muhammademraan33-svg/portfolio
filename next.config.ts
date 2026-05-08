import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  // pg is used server-side only
  serverExternalPackages: ["pg", "pg-native"],
};

export default nextConfig;
