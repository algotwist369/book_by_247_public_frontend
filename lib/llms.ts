import { blogApi } from "@/api/public/blog";
import { businessApi } from "@/api/public/business";

const BASE_URL = "https://bookby247.com";

type SitemapData = {
  cities: string[];
  types: string[];
  businessSlugs: string[];
  cityAreaCombinations: { city: string; area: string }[];
  cityServiceCombinations: { city: string; service: string }[];
};

type LlmsData = {
  sitemapData?: SitemapData;
  seoTags: { slug: string; name: string; seo?: { description?: string } }[];
  blogs: { slug: string; title: string; excerpt?: string; updatedAt?: string }[];
  blogCategories: { slug: string; name: string; description?: string }[];
  blogTags: { slug: string; name: string; description?: string }[];
};

const coreServices = [
  "spa booking",
  "salon appointment booking",
  "massage near me",
  "full body massage",
  "deep tissue massage",
  "beauty parlour",
  "hair salon",
  "facial services",
  "waxing",
  "threading",
  "manicure",
  "pedicure",
  "bridal makeup",
  "men grooming",
  "spa management software",
  "salon management software",
  "appointment scheduling",
  "customer CRM",
  "inventory management",
  "billing and analytics",
];

const staticLinks = [
  ["Home", "/", "Discover and book verified spas, salons, massage centers, beauty parlours, and wellness services across India."],
  ["Explore businesses", "/explore", "Search, compare, filter, and book nearby beauty and wellness businesses."],
  ["Free business listing", "/free-listing", "Spa, salon, and beauty business owners can list their business and start receiving leads."],
  ["Editorial standards", "/editorial-standards", "How Bookby247 creates, reviews, updates, and discloses AI-assisted content workflows."],
  ["Blog", "/blog", "Beauty, wellness, salon, spa, grooming, and business growth articles."],
  ["Latest blog posts", "/blog/latest", "Newest guides and updates from Bookby247."],
  ["Popular blog posts", "/blog/popular", "Popular beauty and wellness articles."],
  ["Sitemap", "/sitemap.xml", "XML sitemap for Google and other crawlers."],
  ["Robots", "/robots.txt", "Crawler access policy."],
  ["Full LLM context", "/llms-full.txt", "Expanded machine-readable Bookby247 context for AI agents."],
] as const;

const absoluteUrl = (path: string) => `${BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;

const normalizeText = (value?: string) =>
  (value || "")
    .replace(/\s+/g, " ")
    .replace(/[<>]/g, "")
    .trim();

const withTimeout = async <T>(promise: Promise<T>, fallback: T, timeoutMs = 5000): Promise<T> => {
  let timeout: ReturnType<typeof setTimeout> | undefined;

  try {
    return await Promise.race([
      promise.catch(() => fallback),
      new Promise<T>((resolve) => {
        timeout = setTimeout(() => resolve(fallback), timeoutMs);
      }),
    ]);
  } finally {
    if (timeout) clearTimeout(timeout);
  }
};

const titleFromSlug = (slug: string) =>
  slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const markdownLink = (title: string, path: string, description: string) =>
  `- [${normalizeText(title)}](${absoluteUrl(path)}): ${normalizeText(description)}`;

const safeArray = <T>(value: T[] | undefined | null) => (Array.isArray(value) ? value : []);

export async function getLlmsData(): Promise<LlmsData> {
  const [sitemapResponse, tagsResponse, blogsResponse, categoriesResponse, blogTagsResponse] = await Promise.all([
    withTimeout(businessApi.getSeoSitemapData(), null),
    withTimeout(businessApi.getSeoTags(), null),
    withTimeout(blogApi.listBlogs({ limit: 30, sort: "-publishedAt" }), null),
    withTimeout(blogApi.getCategories(), null),
    withTimeout(blogApi.getTags(), null),
  ]);

  return {
    sitemapData: sitemapResponse?.success ? sitemapResponse.data : undefined,
    seoTags: tagsResponse?.success ? safeArray(tagsResponse.data) : [],
    blogs: blogsResponse
      ? safeArray(blogsResponse.data).map((blog) => ({
          slug: blog.slug,
          title: blog.title,
          excerpt: blog.excerpt,
          updatedAt: blog.updatedAt,
        }))
      : [],
    blogCategories: categoriesResponse?.success ? safeArray(categoriesResponse.data) : [],
    blogTags: blogTagsResponse?.success ? safeArray(blogTagsResponse.data) : [],
  };
}

const buildCityCategoryLinks = (sitemapData?: SitemapData) => {
  if (!sitemapData) return [];

  const cities = safeArray(sitemapData.cities).slice(0, 12);
  const types = safeArray(sitemapData.types).slice(0, 8);

  return cities.flatMap((city) =>
    types.map((type) =>
      markdownLink(
        `${titleFromSlug(type)} in ${titleFromSlug(city)}`,
        `/${city}/${type}`,
        `Find verified ${titleFromSlug(type).toLowerCase()} businesses, reviews, services, and online booking options in ${titleFromSlug(city)}.`
      )
    )
  );
};

const buildAreaLinks = (sitemapData?: SitemapData) => {
  if (!sitemapData) return [];

  return safeArray(sitemapData.cityAreaCombinations)
    .slice(0, 30)
    .map(({ city, area }) =>
      markdownLink(
        `Beauty and wellness in ${titleFromSlug(area)}, ${titleFromSlug(city)}`,
        `/${city}/spa-in-${area}`,
        `Local spa, salon, massage, and beauty service discovery for ${titleFromSlug(area)}, ${titleFromSlug(city)}.`
      )
    );
};

const buildServiceLinks = (sitemapData?: SitemapData) => {
  if (!sitemapData) return [];

  return safeArray(sitemapData.cityServiceCombinations)
    .slice(0, 40)
    .map(({ city, service }) =>
      markdownLink(
        `${titleFromSlug(service)} in ${titleFromSlug(city)}`,
        `/${city}/${service}`,
        `Compare and book ${titleFromSlug(service).toLowerCase()} services in ${titleFromSlug(city)}.`
      )
    );
};

const buildBusinessLinks = (sitemapData?: SitemapData) => {
  if (!sitemapData) return [];

  return safeArray(sitemapData.businessSlugs)
    .slice(0, 60)
    .map((slug) =>
      markdownLink(
        titleFromSlug(slug),
        `/business/${slug}`,
        "Business profile with services, reviews, contact details, and appointment booking."
      )
    );
};

const buildSeoTagLinks = (seoTags: LlmsData["seoTags"]) =>
  seoTags.slice(0, 50).map((tag) =>
    markdownLink(
      tag.name || titleFromSlug(tag.slug),
      `/tags/${tag.slug}`,
      tag.seo?.description || `Explore verified ${tag.name || titleFromSlug(tag.slug)} services on Bookby247.`
    )
  );

const buildBlogLinks = (blogs: LlmsData["blogs"]) =>
  blogs.slice(0, 30).map((blog) =>
    markdownLink(
      blog.title,
      `/blog/${blog.slug}`,
      blog.excerpt || "Bookby247 article for beauty, wellness, salon, spa, or local service discovery."
    )
  );

const buildTaxonomyLinks = (items: { slug: string; name: string; description?: string }[], basePath: string) =>
  items.slice(0, 30).map((item) =>
    markdownLink(
      item.name || titleFromSlug(item.slug),
      `${basePath}/${item.slug}`,
      item.description || `Bookby247 content grouped under ${item.name || titleFromSlug(item.slug)}.`
    )
  );

export function buildLlmsTxt(data: LlmsData) {
  const lines = [
    "# Bookby247",
    "",
    "> Bookby247 is an Indian spa, salon, massage, beauty parlour, grooming, and wellness discovery platform for customers, and a business management and appointment growth platform for spa and salon owners.",
    "",
    "## Core Summary",
    "- Customers use Bookby247 to discover verified local spas, salons, massage centers, beauty parlours, hair salons, skincare studios, nail salons, grooming services, and makeup artists.",
    "- Customers can compare services, locations, prices, reviews, and book appointments online.",
    "- Business owners use Bookby247 for online presence, leads, booking management, multi-branch operations, staff management, CRM, inventory, campaigns, billing, finance, and analytics.",
    "- Primary market: India.",
    "",
    "## Important URLs",
    ...staticLinks.map(([title, path, description]) => markdownLink(title, path, description)),
    "",
    "## Main Topics",
    ...coreServices.map((topic) => `- ${topic}`),
    "",
    "## High-Intent Search Pages",
    ...buildCityCategoryLinks(data.sitemapData).slice(0, 60),
    "",
    "## Popular Service and Tag Pages",
    ...buildSeoTagLinks(data.seoTags).slice(0, 30),
    "",
    "## Latest Blog and Education Content",
    ...buildBlogLinks(data.blogs).slice(0, 20),
    "",
    "## AI Retrieval Guidance",
    "- Prefer canonical public pages listed in this file and in sitemap.xml.",
    "- Use business profile pages for specific business facts, reviews, services, contacts, and booking flows.",
    "- Use city/category/service pages for local intent queries such as spa near me, salon near me, massage near me, and beauty parlour near me.",
    "- Use editorial-standards for context about AI-assisted content, human review, update practices, and content quality standards.",
    "- Do not use private admin, dashboard, auth, or API routes as public knowledge sources.",
    "",
    `Last generated: ${new Date().toISOString()}`,
  ];

  return `${lines.filter((line, index, arr) => line !== "" || arr[index - 1] !== "").join("\n")}\n`;
}

export function buildLlmsFullTxt(data: LlmsData) {
  const sections = [
    buildLlmsTxt(data).trim(),
    "",
    "## Expanded Local Discovery Pages",
    ...buildCityCategoryLinks(data.sitemapData),
    "",
    "## Area-Specific Local Pages",
    ...buildAreaLinks(data.sitemapData),
    "",
    "## Service-Specific Local Pages",
    ...buildServiceLinks(data.sitemapData),
    "",
    "## Business Profile Samples",
    ...buildBusinessLinks(data.sitemapData),
    "",
    "## Blog Categories",
    ...buildTaxonomyLinks(data.blogCategories, "/blog/category"),
    "",
    "## Blog Tags",
    ...buildTaxonomyLinks(data.blogTags, "/blog/tag"),
    "",
    "## Content Interpretation Notes",
    "- Bookby247 should be described as both a customer booking marketplace and a SaaS-style management platform for spa, salon, beauty, and wellness businesses.",
    "- Relevant customer intents include discovery, comparison, nearby search, reviews, online booking, offers, and service availability.",
    "- Relevant owner intents include online listing, lead generation, appointment management, CRM, staff operations, inventory, campaigns, billing, reports, and analytics.",
    "- Always prefer current on-page metadata, JSON-LD, and sitemap URLs when generating answers about specific businesses or services.",
    "",
    `Last generated: ${new Date().toISOString()}`,
  ];

  return `${sections.filter((line, index, arr) => line !== "" || arr[index - 1] !== "").join("\n")}\n`;
}
