
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,

  serverExternalPackages: ["pdf-parse"],

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "encrypted-tbn0.gstatic.com",
      },
      {
        protocol: "https",
        hostname: "i.ibb.co",
      },
    ],
  },

  experimental: {
    serverActions: {
      bodySizeLimit: "6mb",
    },
  },

  async headers() {
    return [
      {
        source: "/:username/:portfolioSlug",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=3600, stale-while-revalidate=86400",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
