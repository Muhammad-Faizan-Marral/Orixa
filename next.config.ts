import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // React Compiler optimization
  reactCompiler: true,

  // Required for server-side PDF parsing
  serverExternalPackages: ["pdf-parse"],

  // Hide framework identification header
  poweredByHeader: false,

  // Disable production browser source maps
  productionBrowserSourceMaps: false,

  images: {
    // Optimized image format
    formats: ["image/webp"],

    // Allowed image quality
    qualities: [75],

    // External image hosts used by Orixa AI
    remotePatterns: [
      {
        protocol: "https",
        hostname: "encrypted-tbn0.gstatic.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "i.ibb.co",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "i.pinimg.com",
        pathname: "/**",
      },
    ],
  },

  experimental: {
    // Preserve existing resume-upload limit
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
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
    ];
  },
};

export default nextConfig;