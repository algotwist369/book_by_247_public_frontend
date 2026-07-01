import type { MetadataRoute } from "next";
import { SEO_CONFIG } from "@/lib/seo-config";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SEO_CONFIG.brandName,
    short_name: SEO_CONFIG.brandName,
    description: SEO_CONFIG.defaultDescription,
    id: "/",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: SEO_CONFIG.themeColor,
    categories: ["beauty", "health", "lifestyle"],
    lang: "en-IN",
    icons: [
      {
        src: "/icon",
        sizes: "32x32",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
