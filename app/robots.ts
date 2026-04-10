import type { MetadataRoute } from "next";

const BASE_URL = "https://bookby247.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/_next/static/", "/_next/image"],
        disallow: [
          "/api/",
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

