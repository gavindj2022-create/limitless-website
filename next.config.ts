import type { NextConfig } from "next";

const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "object-src 'none'",
  // React dev tooling needs eval() locally; production builds never allow it.
  `script-src 'self' 'unsafe-inline'${process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : ""} https://va.vercel-scripts.com https://www.googletagmanager.com https://connect.facebook.net`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://www.facebook.com",
  "font-src 'self' data:",
  "media-src 'self'",
  "connect-src 'self' https://vitals.vercel-insights.com https://www.google-analytics.com https://www.googletagmanager.com https://connect.facebook.net",
  "frame-src https://www.googletagmanager.com",
].join("; ");

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: contentSecurityPolicy,
  },
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
      { pathname: "/consulting/**", search: "" },
      { pathname: "/gav/**", search: "" },
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
      {
        source: "/consulting/:path*",
        headers: immutableCache,
      },
      {
        source: "/gav/:path*",
        headers: immutableCache,
      },
    ];
  },
  async redirects() {
    return [
      { source: "/build", destination: "/book", permanent: true },
      { source: "/leak-audit", destination: "/book", permanent: true },
      { source: "/dashboard/:path*", destination: "/book", permanent: true },
      { source: "/signin", destination: "/book", permanent: true },
      { source: "/sign-in", destination: "/book", permanent: true },
      { source: "/checkout", destination: "/book", permanent: true },
      { source: "/api/checkout", destination: "/book", permanent: true },
      { source: "/api/billing-portal", destination: "/book", permanent: true },
      { source: "/api/auth/:path*", destination: "/book", permanent: true },
      { source: "/demos", destination: "/work", permanent: true },
    ];
  },
};

export default nextConfig;
