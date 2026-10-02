import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/hear-bella"],
    },
    sitemap: "https://golimitlessagi.com/sitemap.xml",
  };
}
