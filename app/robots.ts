import type { MetadataRoute } from "next";

const BASE_URL = "https://bookby247.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/"],
        disallow: [
          "/api/",
          "/_next/",
          "/admin",
          "/admin/*",
          "/dashboard",
          "/dashboard/*",
          "/auth",
          "/auth/*",
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}

