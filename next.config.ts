import type { NextConfig } from "next";

const nextConfig: NextConfig = {

  reactCompiler: true,

  serverExternalPackages: ["pdf-parse"],

  experimental: {
    serverActions: {
      bodySizeLimit: "6mb",
    },
  },
};

export default nextConfig;