import type { MetadataRoute } from "next";
import { businessApi } from "@/api/public/business";

const BASE_URL = "https://bookby247.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${BASE_URL}/explore`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];

  let businessRoutes: MetadataRoute.Sitemap = [];

  try {
    const response = await businessApi.getPublicBusinesses({ limit: 200 }).catch(() => null);
    const businesses = (response as any)?.businesses || (response as any)?.data || [];

    businessRoutes = businesses.flatMap((b: any) => {
      const slug = b.slug;
      if (!slug) return [];

      const updatedAt = b.updatedAt || b.createdAt || new Date().toISOString();

      return [
        {
          url: `${BASE_URL}/business/${slug}`,
          lastModified: updatedAt,
          changeFrequency: "daily" as const,
          priority: 0.9,
        },
        {
          url: `${BASE_URL}/business/${slug}/reviews`,
          lastModified: updatedAt,
          changeFrequency: "weekly" as const,
          priority: 0.6,
        },
        {
          url: `${BASE_URL}/business/${slug}/book-appointment`,
          lastModified: updatedAt,
          changeFrequency: "weekly" as const,
          priority: 0.5,
        },
      ];
    });
  } catch {
    // If the API is unavailable, still serve the static sitemap entries
    businessRoutes = [];
  }

  // SEO Search Routes (Top Cities + Categories)
  const topCities = ["delhi", "mumbai", "bangalore", "pune", "hyderabad", "chennai", "kolkata", "gurgaon", "noida"];
  const topCategories = ["spa", "salon", "massage", "wellness", "beauty-parlour"];

  // Dynamic SEO Routes (City / Category / Area)
  const dynamicSeoRoutes: MetadataRoute.Sitemap = topCities.flatMap((city) => 
    topCategories.map((category) => ({
      url: `${BASE_URL}/${city}/${category}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }))
  );

  const searchRoutes: MetadataRoute.Sitemap = topCities.flatMap((city) => 
    topCategories.map((category) => ({
      url: `${BASE_URL}/search/${city}/${category}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }))
  );

  return [...staticRoutes, ...businessRoutes, ...dynamicSeoRoutes, ...searchRoutes];
}

