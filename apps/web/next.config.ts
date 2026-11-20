import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingRoot: process.cwd(),
  outputFileTracingIncludes: {
    "/**/*": ["../node_modules/next/dist/compiled/source-map/**/*"],
  },
  transpilePackages: ["@dts/shared"],
  images: {
    formats: ["image/webp"],
    remotePatterns: [
      { protocol: "http", hostname: "localhost", port: "3000", pathname: "/backend/fichiers/**" },
      { protocol: "http", hostname: "127.0.0.1", port: "3000", pathname: "/backend/fichiers/**" },
    ],
  },
  async headers() {
    return [
      {
        source: "/monde/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
          { key: "Accept-Ranges", value: "bytes" },
        ],
      },
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
        ],
      },
    ];
  },
};

export default nextConfig;
