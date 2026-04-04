import { Suspense } from "react";
import dynamic from "next/dynamic";
import type { Metadata } from "next";
import HeroSection from "@/components/home/HeroSection";
import { CategorySection } from "@/components/home/CategorySection";
import { businessApi } from "@/api/public/business";

export const metadata: Metadata = {
  title: "Book Spas, Salons & Beauty Services Near You Across India | Bookby247",
  description:
    "Discover, compare, and book top-rated spas, salons & beauty services near you with Bookby247. Verified businesses, real reviews, and seamless online booking.",
  keywords: [
    "spa near me",
    "salon near me",
    "beauty parlour near me",
    "massage near me",
    "body massage near me",
    "facial near me",
    "hair salon near me",
    "spa booking online",
    "salon booking online",
    "beauty services near me",
    "best spa near me",
    "best salon near me",
    "luxury spa near me",
    "couple spa near me",
    "unisex salon near me",
    "spa near me open now",
    "salon near me open now",
    "affordable spa near me",
    "cheap salon near me",

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
    "premium salon near me",
    "best beauty salon near me",
    "top rated spa near me",
    "5 star spa near me",

    "spa in Mumbai",
    "salon in Delhi",
    "beauty parlour in Bangalore",
    "spa in Pune",
    "salon in Hyderabad",
    "massage in Navi Mumbai",
    "spa in Andheri",
    "salon in Whitefield",

    "spa near me open now",
    "salon near me open today",
    "massage near me open now",
    "beauty parlour near me open now",
    "spa near me for couples",
    "salon near me for men",
    "salon near me for women",

    "spa price near me",
    "salon price list near me",
    "body massage cost in Mumbai",
    "facial price near me",
    "cheap salon near me",
    "affordable spa near me",
  ],
  authors: [{ name: "Bookby247 Team" }],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Best Spas, Salons & Beauty Services in India | Bookby247",
    description:
      "Discover top-rated spas, salons, and beauty services near you across India. Compare prices, read real reviews, and book appointments instantly on Bookby247.",
    url: "https://bookby247.com/",
    siteName: "Bookby247",
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: "https://res.cloudinary.com/dwsv275kv/image/upload/v1774691836/555666_m75jkf.png", // create this
        width: 1200,
        height: 630,
        alt: "Book spa, salon and beauty services near you in India",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Best Spas, Salons & Beauty Services in India | Bookby247",
    description:
      "Find top-rated spas, salons & beauty services near you across India. Compare prices, read real reviews & book instantly on Bookby247.",
    images: ["https://res.cloudinary.com/dwsv275kv/image/upload/v1774691836/555666_m75jkf.png"], // must match OG image
    creator: "@bookby247", // optional but recommended
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

import { generateItemListJsonLd } from "@/lib/seo-jsonld";
import { safeJsonLdStringify } from "@/lib/utils";

export default async function Home() {
  // Fetch initial data for SSR
  const initialBusinessData = await businessApi.getPublicBusinesses({ limit: 16 }).catch((err) => {
    console.error("Home page data fetch error:", err);
    return null;
  });

  const businesses = (initialBusinessData as any)?.businesses || (initialBusinessData as any)?.data || [];
  const jsonLd = generateItemListJsonLd(businesses, "India", "Spas and Salons");

  return (
    <div className="bg-white min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(jsonLd) }}
      />
      
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

      {/* Below-fold content */}
      <PartnerSection />
      <FeatureSection />
      <AppPromoSection />
      <ForBusinesses />
      <ReviewsSection />
      <SEOFooter />
    </div>
  );
}
