import type { MetadataRoute } from "next";
import { SEO_CONFIG } from "@/lib/seo-config";

const BASE_URL = SEO_CONFIG.baseUrl;

const ALLOWED_RENDER_RESOURCES = [
  "/",
  "/_next/static/",
  "/_next/image",
  "/images/",
];

const DISALLOWED_NON_PUBLIC_PATHS = [
  "/api/",
  "/admin",
  "/admin/",
  "/dashboard",
  "/dashboard/",
  "/auth",
  "/auth/",
  "/login",
  "/register",
  "/checkout",
  "/payment",
  "/booking-status",
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

