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

  // Dynamic SEO Listing Routes from database
  let dynamicSeoRoutes: MetadataRoute.Sitemap = [];
  let businessDetailRoutes: MetadataRoute.Sitemap = [];
  
  try {
    const sitemapDataResponse = await businessApi.getSeoSitemapData();
    if (sitemapDataResponse?.success && sitemapDataResponse.data) {
      const { cities, types, areas, services, businessSlugs } = sitemapDataResponse.data;

      // 0. City Landing Pages
      cities.forEach(city => {
        dynamicSeoRoutes.push({
          url: `${BASE_URL}/${city}`,
          lastModified: new Date(),
          changeFrequency: "weekly",
          priority: 0.8,
        });
      });

      // 1. Dynamic SEO Listings (City + Category + Area/Service)
      // ... (existing city/category/area/service logic)
      cities.forEach(city => {
        types.forEach(type => {
          dynamicSeoRoutes.push({
            url: `${BASE_URL}/seo/listing/${city}/${type}`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.8,
          });
        });
      });

      cities.slice(0, 10).forEach(city => {
        types.forEach(type => {
          areas.slice(0, 50).forEach(area => {
            dynamicSeoRoutes.push({
              url: `${BASE_URL}/seo/listing/${city}/${type}/${area}`,
              lastModified: new Date(),
              changeFrequency: "weekly",
              priority: 0.7,
            });
          });
        });
      });
      
      cities.slice(0, 10).forEach(city => {
        types.forEach(type => {
          services.slice(0, 50).forEach(service => {
            dynamicSeoRoutes.push({
              url: `${BASE_URL}/seo/listing/${city}/${type}/${service}`,
              lastModified: new Date(),
              changeFrequency: "weekly",
              priority: 0.7,
            });
          });
        });
      });

      // 2. Business Details Sub-pages (from business.detials.controller.js)
      // These paths match the valid subpaths in public_frontend/app/business/[slug]/[...subpath]/page.tsx
      const detailSubPaths = [
        'contacts', 'working-hours', 'social-media', 'media', 
        'categories', 'capacity', 'services', 'seo', 'reviews'
      ];

      businessSlugs.slice(0, 500).forEach(slug => {
        // Main business profile
        businessDetailRoutes.push({
          url: `${BASE_URL}/business/${slug}`,
          lastModified: new Date(),
          changeFrequency: "daily",
          priority: 0.9,
        });

        // Sub-pages for the business
        detailSubPaths.forEach(subPath => {
          businessDetailRoutes.push({
            url: `${BASE_URL}/business/${slug}/${subPath}`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.6,
          });
        });

        // Booking page
        businessDetailRoutes.push({
          url: `${BASE_URL}/business/${slug}/book-appointment`,
          lastModified: new Date(),
          changeFrequency: "weekly",
          priority: 0.5,
        });
      });
    }
  } catch (err) {
    console.error("Error fetching sitemap data:", err);
  }

  // SEO Search Routes (Top Cities + Categories)
  const topCities = ["delhi", "mumbai", "bangalore", "pune", "hyderabad", "chennai", "kolkata", "gurgaon", "noida"];
  const topCategories = ["spa", "salon", "massage", "wellness", "beauty-parlour"];

  const searchRoutes: MetadataRoute.Sitemap = topCities.flatMap((city) => 
    topCategories.map((category) => ({
      url: `${BASE_URL}/${city}/${category}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }))
  );

  // 3. Near Me SEO Routes
  const nearMeCategories = [
    'spa', 'massage', 'couple-spa', 'thai-massage', 'ayurvedic-spa',
    'salon', 'beauty-parlour', 'wellness-centre', 'gym'
  ];

  const nearMeRoutes: MetadataRoute.Sitemap = nearMeCategories.map((category) => ({
    url: `${BASE_URL}/${category}-near-me`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.9,
  }));

  return [...staticRoutes, ...dynamicSeoRoutes, ...businessDetailRoutes, ...searchRoutes, ...nearMeRoutes];
}

