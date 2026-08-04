import type { NextConfig } from "next";

const securityHeaders = [
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
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
];

// Films, posters and brand art are content-hashed by filename (e.g.
// threads-poster-v2.jpg), so they can be cached forever. Vercel serves
// everything in public/ with `must-revalidate` by default, which meant repeat
// visitors re-validated every film on every visit.
//
// RULE: never overwrite a file under /media or /brand. Ship a new filename
// (-v3, and so on) instead, or clients will keep serving the old bytes.
const immutableCache = [
  {
    key: "Cache-Control",
    value: "public, max-age=31536000, immutable",
  },
];

const nextConfig: NextConfig = {
  // Verified against node_modules/next/dist/docs/01-app/03-api-reference/
  // 02-components/image.md for Next 16.2.6. `qualities` is required as of
  // Next 16; omitting it would fall back to [75] only.
  images: {
    formats: ["image/avif", "image/webp"], // order matters: AVIF preferred
    qualities: [50, 75, 90],
    localPatterns: [
      { pathname: "/demos/**", search: "" },
      { pathname: "/brand/**", search: "" },
    ],
    minimumCacheTTL: 2678400, // 31 days
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      {
        source: "/media/:path*",
        headers: immutableCache,
      },
      {
        source: "/brand/:path*",
        headers: immutableCache,
      },
    ];
  },
};

export default nextConfig;
