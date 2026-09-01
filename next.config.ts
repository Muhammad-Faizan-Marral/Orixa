import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "6mb",
    },
  },
  reactCompiler: true,

  serverExternalPackages: ["pdf-parse"],
};

export default nextConfig;