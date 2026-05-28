import type { MetadataRoute } from "next";

const BASE_URL = "https://bookby247.com";

const ALLOWED_RENDER_RESOURCES = [
  "/",
  "/_next/static/",
  "/_next/image",
  "/images/",
];

const DISALLOWED_NON_PUBLIC_PATHS = [
  "/api/",
  "/admin",
  "/dashboard",
  "/auth",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ALLOWED_RENDER_RESOURCES,
        disallow: DISALLOWED_NON_PUBLIC_PATHS,
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}

