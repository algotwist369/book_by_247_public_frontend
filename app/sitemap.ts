import type { MetadataRoute } from "next";
import { businessApi } from "@/api/public/business";
import { blogApi } from "@/api/public/blog";
import { publicRoutes, toAbsoluteUrl } from "@/lib/seo-config";

export const dynamic = "force-dynamic";
export const revalidate = 60;

type SitemapBusiness = {
  slug: string;
  updatedAt?: string;
  image?: string;
  thumbnailImage?: string;
  logoImage?: string;
  images?: string[];
};

type SitemapEntry = MetadataRoute.Sitemap[number] & {
  images?: string[];
};

const toDate = (value?: string) => {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
};

const unique = <T,>(items: T[]) => Array.from(new Set(items.filter(Boolean)));

const isString = (value: unknown): value is string => typeof value === "string" && value.length > 0;

const normalizeBusiness = (item: string | SitemapBusiness): SitemapBusiness =>
  typeof item === "string" ? { slug: item } : item;

const createRoute = (
  path: string,
  options: Omit<SitemapEntry, "url"> = {}
): SitemapEntry => ({
  url: toAbsoluteUrl(path),
  ...options,
});

const getBusinessImages = (business: SitemapBusiness) =>
  unique([
    business.image,
    business.thumbnailImage,
    business.logoImage,
    ...(Array.isArray(business.images) ? business.images : []),
  ].filter(isString)).slice(0, 5);

const fetchWithTimeout = <T,>(promise: Promise<T>, timeoutMs = 4000): Promise<T | null> => {
  return Promise.race([
    promise,
    new Promise<null>((resolve) => setTimeout(() => resolve(null), timeoutMs)),
  ]);
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: SitemapEntry[] = [
    ...publicRoutes.map((route) =>
      createRoute(route.path, {
        changeFrequency: route.changeFrequency,
        priority: route.priority,
      })
    ),
  ];

  let dynamicSeoRoutes: SitemapEntry[] = [];
  let businessDetailRoutes: SitemapEntry[] = [];
  let blogRoutes: SitemapEntry[] = [];

  try {
    const sitemapDataResponse = await fetchWithTimeout(businessApi.getSeoSitemapData(), 4000);

    if (sitemapDataResponse?.success && sitemapDataResponse.data) {
      const { cities, types, businessSlugs, cityAreaCombinations, cityServiceCombinations } = sitemapDataResponse.data;
      const uniqueCities = unique(cities);
      const uniqueTypes = unique(types);

      dynamicSeoRoutes = [
        ...uniqueCities.map((city) =>
          createRoute(`/${city}`, { changeFrequency: "weekly", priority: 0.8 })
        ),
        ...uniqueCities.flatMap((city) =>
          uniqueTypes.flatMap((type) => [
            createRoute(`/${city}/${type}`, { changeFrequency: "weekly", priority: 0.8 }),
            createRoute(`/${city}/top-10-${type}`, { changeFrequency: "weekly", priority: 0.7 }),
            createRoute(`/${city}/best-${type}`, { changeFrequency: "weekly", priority: 0.7 }),
            createRoute(`/${city}/affordable-${type}`, { changeFrequency: "weekly", priority: 0.7 }),
            createRoute(`/${city}/luxury-${type}`, { changeFrequency: "weekly", priority: 0.7 }),
          ])
        ),
        ...cityAreaCombinations.flatMap(({ city, area }) =>
          uniqueTypes.map((type) =>
            createRoute(`/${city}/${type}-in-${area}`, { changeFrequency: "weekly", priority: 0.7 })
          )
        ),
        ...cityServiceCombinations.map(({ city, service }) =>
          createRoute(`/${city}/${service}`, { changeFrequency: "weekly", priority: 0.7 })
        ),
      ];

      const businesses = (businessSlugs as Array<string | SitemapBusiness>).map(normalizeBusiness);

      businessDetailRoutes = businesses.map((business) => {
        const lastModified = toDate(business.updatedAt);
        const images = getBusinessImages(business);
        return createRoute(`/business/${business.slug}`, {
          lastModified,
          changeFrequency: "daily",
          priority: 0.9,
          ...(images.length > 0 ? { images } : {}),
        });
      });
    }
  } catch (err) {
    console.error("Error fetching sitemap data:", err);
  }

  try {
    const blogData = await fetchWithTimeout(
      Promise.all([
        blogApi.listBlogs({ limit: 100, sort: "-publishedAt" }),
        blogApi.getCategories(),
      ]),
      4000
    );

    if (blogData) {
      const [blogListing, categoriesResponse] = blogData;
      blogRoutes = [
        ...(blogListing?.data || []).map((blog) =>
          createRoute(`/blog/${blog.slug}`, {
            lastModified: toDate(blog.updatedAt),
            changeFrequency: "weekly",
            priority: 0.8,
            ...(blog.featuredImage?.url ? { images: [blog.featuredImage.url] } : {}),
          })
        ),
        ...(categoriesResponse?.data || []).map((category) =>
          createRoute(`/blog/category/${category.slug}`, {
            changeFrequency: "weekly",
            priority: 0.7,
          })
        ),
      ];
    }
  } catch (error) {
    console.error("Error fetching blog sitemap data:", error);
  }

  const nearMeCategories = unique([
    "spa",
    "massage",
    "salon",
    "beauty-parlour",
    "hair-salon",
    "unisex-salon",
    "ladies-salon",
    "mens-salon",
    "body-massage",
    "full-body-massage",
    "couple-spa",
    "couple-massage",
    "wellness-centre",
    "thai-massage",
    "swedish-massage",
    "deep-tissue-massage",
    "aromatherapy-massage",
    "balinese-massage",
    "hot-stone-massage",
    "foot-massage",
    "head-massage",
    "back-massage",
    "ayurvedic-spa",
    "kerala-massage",
    "panchakarma",
    "herbal-massage",
    "abhyanga-massage",
    "facial",
    "cleanup",
    "manicure",
    "pedicure",
    "waxing",
    "threading",
    "bleach",
    "detan",
    "hair-cut",
    "hair-spa",
    "hair-color",
    "keratin-treatment",
    "smoothening",
    "rebonding",
    "hair-fall-treatment",
    "bridal-makeup",
    "party-makeup",
    "makeup-artist",
    "pre-bridal-packages",
    "stress-relief-massage",
    "pain-relief-massage",
    "relaxation-spa",
    "body-pain-massage",
    "luxury-spa",
    "premium-salon",
    "russian-spa",
    "thai-spa",
    "24-hours-spa",
    "home-massage",
    "spa-home-service",
    "salon-at-home",
    "beauty-services-at-home",
    "spa-for-men",
    "spa-for-women",
    "massage-for-men",
    "massage-for-women",
  ]);

  const nearMeRoutes: SitemapEntry[] = nearMeCategories.map((category) =>
    createRoute(`/${category}-near-me`, {
      changeFrequency: "daily",
      priority: 0.9,
    })
  );

  return [
    ...staticRoutes,
    ...dynamicSeoRoutes,
    ...businessDetailRoutes,
    ...blogRoutes,
    ...nearMeRoutes,
  ];
}
