import type { MetadataRoute } from "next";

const baseUrl = "https://golimitlessagi.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    ["", "weekly", 1],
    ["/how-we-help", "monthly", 0.9],
    ["/work", "monthly", 0.9],
    ["/about", "monthly", 0.8],
    ["/faq", "monthly", 0.8],
    ["/book", "monthly", 0.9],
    ["/privacy-security", "yearly", 0.5],
    ["/privacy", "yearly", 0.3],
    ["/terms", "yearly", 0.3],
    ["/roi", "monthly", 0.6],
  ] as const;

  return pages.map(([path, changeFrequency, priority]) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date("2026-10-01T00:00:00-05:00"),
    changeFrequency,
    priority,
  }));
}
