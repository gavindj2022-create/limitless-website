import type { MetadataRoute } from "next";

const BASE = "https://golimitlessagi.com";

// Public, indexable routes only. /hear-bella (private demo) and /dashboard
// (authenticated) are deliberately excluded.
const ROUTES: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { path: "", priority: 1.0, changeFrequency: "weekly" },
  { path: "/demos", priority: 0.9, changeFrequency: "weekly" },
  { path: "/build", priority: 0.8, changeFrequency: "monthly" },
  { path: "/book", priority: 0.8, changeFrequency: "monthly" },
  { path: "/leak-audit", priority: 0.7, changeFrequency: "monthly" },
  { path: "/roi", priority: 0.6, changeFrequency: "monthly" },
  { path: "/privacy", priority: 0.3, changeFrequency: "yearly" },
  { path: "/terms", priority: 0.3, changeFrequency: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return ROUTES.map(({ path, priority, changeFrequency }) => ({
    url: `${BASE}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }));
}
