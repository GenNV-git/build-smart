import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";
// @ts-expect-error — plain .mjs helper without type declarations
import { writeImageVersions, watchImageVersions } from "./scripts/image-versions.mjs";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
];

export default function config(phase: string): NextConfig {
  // Fingerprint every photo so a replaced photo is never served from an old cache.
  writeImageVersions();
  if (phase === PHASE_DEVELOPMENT_SERVER) watchImageVersions();

  return {
    poweredByHeader: false,
    images: {
      // WebP only: AVIF is a little smaller but many times slower to create, which made pages feel laggy.
      formats: ["image/webp"],
      // Local photos carry a "?v=<fingerprint>" so updates show immediately; cache them for a long time.
      localPatterns: [{ pathname: "/images/**" }],
      minimumCacheTTL: 2678400, // 31 days — safe because the address changes whenever the photo changes
      // YouTube thumbnails are loaded automatically for configured YouTube videos.
      remotePatterns: [{ protocol: "https", hostname: "i.ytimg.com" }],
    },
    async headers() {
      return [{ source: "/:path*", headers: securityHeaders }];
    },
  };
}
