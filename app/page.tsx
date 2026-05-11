import { Suspense } from "react";
import dynamic from "next/dynamic";
import type { Metadata } from "next";
import HeroSection from "@/components/home/HeroSection";
import { CategorySection } from "@/components/home/CategorySection";
import { businessApi } from "@/api/public/business";
import HomeSeoTags from "@/components/seo/HomeSeoTags";

export const metadata: Metadata = {
  title: "Book Top Spas, Salons & Beauty Services Near Me - Online Booking | Bookby247",
  description:
    "Bookby247 is India's leading booking platform for top-rated spas, salons, and beauty services. Users can search by location, compare prices, read verified reviews, and book instant appointments for full body massage, hair spa, facials, and more in cities like Mumbai, Delhi, and Bangalore.",
  keywords: [
    "spa near me",
    "salon near me",
    "beauty parlour near me",
    "massage near me",
    "hair salon near me",
    "spa booking online",
    "salon booking online",
    "beauty services near me",
    "best spa near me",
    "best salon near me",
    "body massage near me",
    "full body massage near me",
    "deep tissue massage near me",
    "facial near me",
    "haircut near me",
    "hair spa near me",
    "manicure pedicure near me",
    "bridal makeup near me",
    "waxing near me",
    "threading near me",
    "luxury spa near me",
    "couple spa near me",
    "unisex salon near me",
    "spa in Mumbai",
    "salon in Delhi",
    "beauty parlour in Bangalore",
    "spa in Pune",
    "salon in Hyderabad",
    "massage in Navi Mumbai",
    "book spa appointment online",
    "book salon appointment online",
    "top rated salons with reviews",
    "top rated spas with reviews",
  ],
  authors: [{ name: "Bookby247 Team" }],
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Book Top Spas, Salons & Beauty Services Online | Bookby247",
    description:
      "Discover top-rated spas, salons, and beauty services near you across India. Compare prices, read real reviews, and book appointments instantly on Bookby247.",
    url: "https://bookby247.com/",
    siteName: "Bookby247",
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: "https://res.cloudinary.com/dwsv275kv/image/upload/v1774691836/555666_m75jkf.png",
        width: 1200,
        height: 630,
        alt: "Book verified spa, salon, and beauty services near you in India",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Book Top Spas, Salons & Beauty Services Online | Bookby247",
    description:
      "Find top-rated spas, salons & beauty services near you across India. Compare prices, read real reviews & book instantly on Bookby247.",
    images: ["https://res.cloudinary.com/dwsv275kv/image/upload/v1774691836/555666_m75jkf.png"],
    creator: "@bookby247",
  },
};

const BusinessSection = dynamic(() => import("@/components/business/BusinessSection"), { ssr: true });
const PartnerSection = dynamic(() => import("@/components/home/PartnerSection").then(m => m.PartnerSection));
const FeatureSection = dynamic(() => import("@/components/home/FeatureSection"));
const AppPromoSection = dynamic(() => import("@/components/home/AppPromoSection").then(m => m.AppPromoSection));
const ForBusinesses = dynamic(() => import("@/components/home/ForBusinesses"));
const ReviewsSection = dynamic(() => import("@/components/home/ReviewsSection").then(m => m.ReviewsSection));
const SEOFooter = dynamic(() => import("@/components/home/SEOFooter"));
const PromotionBanner = dynamic(() => import("@/components/promotion/PromotionBanner").then(m => m.default));

export const revalidate = 3600;

import { generateItemListJsonLd, generateOrganizationJsonLd, generateWebSiteJsonLd, generateSeoTagsItemListJsonLd } from "@/lib/seo-jsonld";
import { safeJsonLdStringify } from "@/lib/utils";
import AiReadabilitySection from "@/components/seo/AiReadabilitySection";

export default async function Home() {
  // Fetch initial data for SSR
  const initialBusinessData = await businessApi.getPublicBusinesses({ limit: 16 }).catch((err) => {
    console.error("Home page data fetch error:", err);
    return null;
  });

  const seoTagsData = await businessApi.getSeoTags().catch((err) => {
    console.error("SEO tags data fetch error:", err);
    return null;
  });

  const businesses = (initialBusinessData as any)?.businesses || (initialBusinessData as any)?.data || [];
  const tags = seoTagsData?.data || [];
  
  const itemListJsonLd = {
    "@context": "https://schema.org",
    ...generateItemListJsonLd(businesses, "India", "Spas and Salons")
  };
  const organizationJsonLd = {
    "@context": "https://schema.org",
    ...generateOrganizationJsonLd()
  };
  const websiteJsonLd = {
    "@context": "https://schema.org",
    ...generateWebSiteJsonLd()
  };
  const seoTagsItemListJsonLd = {
    "@context": "https://schema.org",
    ...generateSeoTagsItemListJsonLd(tags)
  };

  return (
    <div className="bg-white min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(itemListJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(organizationJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(websiteJsonLd) }}
      />
      {tags.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(seoTagsItemListJsonLd) }}
        />
      )}
      
      <HeroSection />
      <CategorySection />

      {/* Featured Businesses Section with SSR initial data */}
      <Suspense
        fallback={
          <section className="w-full bg-linear-to-b from-white via-zinc-50 to-white px-4 py-20">
            <div className="mx-auto max-w-7xl px-4 flex flex-col gap-8">
              <div className="h-10 w-64 bg-zinc-100 rounded-lg animate-pulse" />
              <div className="grid grid-cols-2 gap-4 sm:gap-8 md:grid-cols-3 lg:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex flex-col gap-3 rounded-2xl border border-zinc-100 bg-white/70 p-3">
                    <div className="aspect-video w-full rounded-xl bg-zinc-100 animate-pulse" />
                    <div className="h-6 w-3/4 rounded-md bg-zinc-100 animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
          </section>
        }
      >
        <BusinessSection initialData={initialBusinessData} />
        
      </Suspense>

      {/* SEO Tags Section */}
      {tags.length > 0 && <HomeSeoTags tags={tags} />}

      {/* Below-fold content */}
      <PartnerSection />
      <FeatureSection />
      <AppPromoSection />
      <ForBusinesses />
      <ReviewsSection />
      <AiReadabilitySection />
      <SEOFooter />
    </div>
  );
}
