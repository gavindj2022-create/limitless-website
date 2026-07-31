import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Limitless",
    short_name: "Limitless",
    description:
      "AI agents that answer your calls, book appointments, and follow up with every lead.",
    start_url: "/",
    display: "standalone",
    background_color: "#F6F4F1",
    theme_color: "#0B0B0A",
    icons: [
      // Served by the app/icon.png and app/apple-icon.png metadata routes.
      { src: "/icon.png", sizes: "512x512", type: "image/png" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
