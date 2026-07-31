import type { MetadataRoute } from "next";

const BASE = "https://golimitlessagi.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // /hear-bella is a private sales demo (already noindex in its own
        // metadata); /dashboard is authenticated; /api is not for crawlers.
        disallow: ["/dashboard", "/hear-bella", "/api/"],
      },
    ],
    sitemap: `${BASE}/sitemap.xml`,
  };
}
