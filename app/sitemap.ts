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
      const { cities, types, businessSlugs, cityAreaCombinations, cityServiceCombinations } = sitemapDataResponse.data;

      // 0. City Landing Pages
      cities.forEach(city => {
        dynamicSeoRoutes.push({
          url: `${BASE_URL}/${city}`,
          lastModified: new Date(),
          changeFrequency: "weekly",
          priority: 0.8,
        });
      });

      // 1. Dynamic SEO Listings (City + Category)
      cities.forEach(city => {
        types.forEach(type => {
          dynamicSeoRoutes.push({
            url: `${BASE_URL}/${city}/${type}`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.8,
          });

          // Add Top-10 listings: /[city]/top-10-[category]
          dynamicSeoRoutes.push({
            url: `${BASE_URL}/${city}/top-10-${type}`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.7,
          });

          // Add Best listings: /[city]/best-[category]
          dynamicSeoRoutes.push({
            url: `${BASE_URL}/${city}/best-${type}`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.7,
          });

          // Add Affordable listings: /[city]/affordable-[category]
          dynamicSeoRoutes.push({
            url: `${BASE_URL}/${city}/affordable-${type}`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.7,
          });

          // Add Luxury listings: /[city]/luxury-[category]
          dynamicSeoRoutes.push({
            url: `${BASE_URL}/${city}/luxury-${type}`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.7,
          });
        });
      });

      // 2. City + Category + Area Listings (Valid combinations only)
      cityAreaCombinations.forEach(({ city, area }) => {
        types.forEach(type => {
          // Add Area-specific listings: /[city]/[category]-in-[area]
          dynamicSeoRoutes.push({
            url: `${BASE_URL}/${city}/${type}-in-${area}`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.7,
          });
        });
      });

      // 3. City + Service Listings (Valid combinations only)
      cityServiceCombinations.forEach(({ city, service }) => {
        // Add Service-specific listings: /[city]/[service]
        dynamicSeoRoutes.push({
          url: `${BASE_URL}/${city}/${service}`,
          lastModified: new Date(),
          changeFrequency: "weekly",
          priority: 0.7,
        });
      });

      // 4. Business Profiles (ALL active businesses)
      businessSlugs.forEach(slug => {
        // Main business profile
        businessDetailRoutes.push({
          url: `${BASE_URL}/business/${slug}`,
          lastModified: new Date(),
          changeFrequency: "daily",
          priority: 0.9,
        });

        // Key sub-pages that are good for SEO
        const seoSubPaths = ['reviews', 'services', 'contacts', 'book-appointment'];
        seoSubPaths.forEach(subPath => {
          businessDetailRoutes.push({
            url: `${BASE_URL}/business/${slug}/${subPath}`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.6,
          });
        });
      });
    }
  } catch (err) {
    console.error("Error fetching sitemap data:", err);
  }

  // 3. Near Me SEO Routes
  const nearMeCategories = [
    // 🔹 Core Services
    "spa", "massage", "body-massage", "full-body-massage",
    "couple-spa", "couple-massage", "wellness-centre",

    // 🔹 Massage Types (VERY HIGH SEARCH)
    "thai-massage", "swedish-massage", "deep-tissue-massage",
    "aromatherapy-massage", "balinese-massage", "hot-stone-massage",
    "foot-massage", "head-massage", "back-massage",

    // 🔹 Ayurvedic / Indian
    "ayurvedic-spa", "kerala-massage", "panchakarma",
    "herbal-massage", "abhyanga-massage",

    // 🔹 Salon Services
    "salon", "hair-salon", "unisex-salon",
    "ladies-salon", "mens-salon",

    // 🔹 Beauty Services
    "beauty-parlour", "facial", "cleanup",
    "manicure", "pedicure", "waxing",
    "threading", "bleach", "detan",

    // 🔹 Hair Services
    "hair-cut", "hair-spa", "hair-color",
    "keratin-treatment", "smoothening",
    "rebonding", "hair-fall-treatment",

    // 🔹 Bridal / Premium
    "bridal-makeup", "party-makeup",
    "makeup-artist", "pre-bridal-packages",

    // 🔹 Problem-Based Searches (UNDERRATED GOLD)
    "stress-relief-massage", "pain-relief-massage",
    "relaxation-spa", "body-pain-massage",

    // 🔹 Luxury / Niche
    "luxury-spa", "premium-salon", "russian-spa",
    "thai-spa", "24-hours-spa",

    // 🔹 Home Services (TRENDING)
    "home-massage", "spa-home-service",
    "salon-at-home", "beauty-services-at-home",

    // 🔹 Gender-Based
    "spa-for-men", "spa-for-women",
    "massage-for-men", "massage-for-women"
  ];

  const nearMeRoutes: MetadataRoute.Sitemap = nearMeCategories.map((category) => ({
    url: `${BASE_URL}/${category}-near-me`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.9,
  }));

  // 4. Popular SEO Search Queries (Pan-India coverage)
  const popularSearches = [
    // 🔹 Tier 1 Cities
    "Best spa in Mumbai", "Best spa in Delhi", "Best spa in Bangalore",
    "Best spa in Hyderabad", "Best spa in Chennai", "Best spa in Kolkata",
    "Best spa in Pune", "Best spa in Ahmedabad",

    // 🔹 Tier 2 Cities
    "Best spa in Jaipur", "Best spa in Chandigarh", "Best spa in Lucknow",
    "Best spa in Indore", "Best spa in Bhopal", "Best spa in Kochi",
    "Best spa in Surat", "Best spa in Nagpur", "Best spa in Patna",
    "Best spa in Coimbatore", "Best spa in Vadodara", "Best spa in Nashik",

    // 🔹 Local Intent
    "Spa near me", "Massage near me", "Salon near me", "Beauty parlour near me",

    // 🔹 Service-Based Searches
    "Couple spa near me", "Couple massage spa",
    "Full body massage near me", "Body massage spa",
    "Thai massage spa", "Deep tissue massage", "Swedish massage spa",
    "Aromatherapy massage spa", "Hot stone massage spa",
    "Balinese massage spa", "Foot massage near me",

    // 🔹 Salon & Beauty
    "Best salon near me", "Hair salon near me",
    "Beauty parlour near me for ladies",
    "Unisex salon near me", "Bridal makeup artist near me",
    "Hair spa near me", "Facial near me", "Manicure pedicure near me",

    // 🔹 Price & Offers (High Conversion)
    "Spa offers near me", "Massage spa price near me",
    "Couple spa offers", "Affordable spa near me",
    "Cheap massage near me", "Best spa deals near me",

    // 🔹 Location + Service Combo (SEO Gold)
    "Full body massage in Mumbai", "Couple spa in Delhi",
    "Thai massage in Bangalore", "Body massage in Pune",
    "Spa in Navi Mumbai", "Massage in Hyderabad",
    "Salon in Chennai", "Beauty parlour in Kolkata",

    // 🔹 Luxury / Premium Intent
    "Luxury spa near me", "5 star spa in Mumbai",
    "Premium salon near me", "Luxury massage spa",

    // 🔹 Gender Specific
    "Spa for men near me", "Spa for women near me",
    "Massage for men near me", "Ladies beauty parlour near me",

    // 🔹 Trending / Niche
    "Home service massage", "Spa home service",
    "Ayurvedic massage near me", "Kerala massage near me",
    "Russian spa near me", "24 hours spa near me"
  ];

  const popularSearchRoutes: MetadataRoute.Sitemap = popularSearches.map(query => ({
    url: `${BASE_URL}/explore?q=${encodeURIComponent(query)}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...dynamicSeoRoutes, ...businessDetailRoutes, ...nearMeRoutes, ...popularSearchRoutes];
}

