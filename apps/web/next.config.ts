import type { NextConfig } from "next";
import path from "path";
import { createRequire } from "module";

const require = createRequire(path.join(process.cwd(), "package.json"));
const nextRoot = path.dirname(require.resolve("next/package.json"));
const compiled = path.join(nextRoot, "dist", "compiled");
const trace = (name: string) => path.join(compiled, name).replace(/\\/g, "/");

const nextConfig: NextConfig = {
  outputFileTracingRoot: process.cwd(),
  outputFileTracingIncludes: {
    "/**": [
      `${trace("source-map")}/**/*`,
      `${trace("stacktrace-parser")}/**/*`,
      `${trace("ws")}/**/*`,
      `${trace("babel")}/code-frame.js`,
    ],
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
