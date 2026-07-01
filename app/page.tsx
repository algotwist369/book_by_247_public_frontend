import { Suspense } from "react";
import dynamic from "next/dynamic";
import type { Metadata } from "next";
import HeroSection from "@/components/home/HeroSection";
import { CategorySection } from "@/components/home/CategorySection";
import { businessApi } from "@/api/public/business";
import HomeSeoTags from "@/components/seo/HomeSeoTags";
import { defaultOpenGraph, defaultTwitter, indexFollowRobots, SEO_CONFIG } from "@/lib/seo-config";

export const metadata: Metadata = {
  title: {
    absolute: SEO_CONFIG.defaultTitle,
  },
  description: SEO_CONFIG.defaultDescription,
  keywords: [...SEO_CONFIG.defaultKeywords],
  authors: [{ name: `${SEO_CONFIG.brandName} Team` }],
  alternates: {
    canonical: "/",
  },
  robots: indexFollowRobots,
  openGraph: defaultOpenGraph,
  twitter: defaultTwitter,
};

const BusinessSection = dynamic(() => import("@/components/business/BusinessSection"), { ssr: true });
const PartnerSection = dynamic(() => import("@/components/home/PartnerSection").then(m => m.PartnerSection));
const FeatureSection = dynamic(() => import("@/components/home/FeatureSection"));
const AppPromoSection = dynamic(() => import("@/components/home/AppPromoSection").then(m => m.AppPromoSection));
const ForBusinesses = dynamic(() => import("@/components/home/ForBusinesses"));
const ReviewsSection = dynamic(() => import("@/components/home/ReviewsSection").then(m => m.ReviewsSection));
const PlatformOverviewSection = dynamic(() => import("@/components/home/PlatformOverviewSection"));
const SEOFooter = dynamic(() => import("@/components/home/SEOFooter"));

export const revalidate = 3600;

import { generateItemListJsonLd, generateOrganizationJsonLd, generateWebSiteJsonLd, generateSeoTagsItemListJsonLd } from "@/lib/seo-jsonld";
import { safeJsonLdStringify } from "@/lib/utils";
import AiReadabilitySection from "@/components/seo/AiReadabilitySection";

type HomeBusinessResponse = {
  businesses?: Record<string, unknown>[];
  data?: Record<string, unknown>[];
};

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

  const homeBusinessResponse = initialBusinessData as HomeBusinessResponse | null;
  const businesses = homeBusinessResponse?.businesses || homeBusinessResponse?.data || [];
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
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is BookBy247 Salon and Spa Booking App?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "BookBy247 is a wellness discovery, online appointment booking and business management platform for spas, salons, beauty parlours, massage centers and beauty businesses in India."
        }
      },
      {
        "@type": "Question",
        "name": "How does BookBy247 help customers?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Customers can search nearby verified spas and salons, compare services and prices, read reviews and book appointments online without creating an account."
        }
      },
      {
        "@type": "Question",
        "name": "How does BookBy247 help spa and salon owners?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Business owners can manage multiple branches, appointments, customers, staff, inventory, enquiries, leads, campaigns, billing, finance, reports and analytics from one dashboard."
        }
      }
    ]
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(faqJsonLd) }}
      />

      <HeroSection />
      <CategorySection />

      {/* Top-Rated Featured Salons & Spas Section with SSR initial data */}
      <Suspense
        fallback={
          <section className="w-full bg-linear-to-b from-white via-zinc-50 to-white py-20">
            <div className="mx-auto max-w-7xl flex flex-col gap-8">
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
      <PlatformOverviewSection />
      <PartnerSection />

      {/* Below-fold content */}
      <FeatureSection />
      <AppPromoSection />
      <ForBusinesses />
      <ReviewsSection />
      {/* SEO Tags Section */}
      {tags.length > 0 && <HomeSeoTags tags={tags} />}
      <AiReadabilitySection />
      <SEOFooter />
    </div>
  );
}

