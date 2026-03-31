import { Suspense } from "react";
import dynamic from "next/dynamic";
import type { Metadata } from "next";
import HeroSection from "@/components/home/HeroSection";
import { CategorySection } from "@/components/home/CategorySection";
import { businessApi } from "@/api/public/business";

export const metadata: Metadata = {
  title: "Book Spas & Salons Near You",
  description:
    "Discover, compare, and book top-rated spas and salons near you with Bookby247. Verified businesses, real reviews, and seamless online booking.",
  keywords: [
    "book spa",
    "book salon",
    "spa near me",
    "salon near me",
    "massage booking",
    "beauty services",
  ],
  authors: [{ name: "Bookby247 Team" }],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Book Spas & Salons Near You | Bookby247",
    description:
      "Find verified spas and salons near you, explore reviews, and book appointments in minutes.",
    url: "https://bookby247.com/",
    siteName: "Bookby247",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Book Spas & Salons Near You | Bookby247",
    description:
      "Discover and book premium spa and salon services near you with Bookby247.",
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

export default async function Home() {
  const businessData = await businessApi.getPublicBusinesses({ limit: 16 }).catch(() => null);

  return (
    <div className="bg-white min-h-screen">
      <HeroSection />
      {/* <br />
      <br />
      <PromotionBanner />
      <br />
      <br />
      <PromotionBanner /> */}
      <CategorySection />

      {/* Featured Businesses */}
      <Suspense
        fallback={
          <section className="w-full bg-linear-to-b from-white via-zinc-50 to-white">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 md:px-8 md:py-20">
              <div className="grid grid-cols-2 gap-4 sm:gap-8 md:grid-cols-3 lg:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex flex-col gap-3 rounded-2xl border border-zinc-100 bg-white/70 p-3">
                    <div className="aspect-video w-full rounded-xl bg-zinc-100" />
                    <div className="h-6 w-3/4 rounded-md bg-zinc-100" />
                  </div>
                ))}
              </div>
            </div>
          </section>
        }
      >
        <BusinessSection initialData={businessData} />
      </Suspense>

      {/* Below-fold — dynamically chunked */}
      <PartnerSection />
      <FeatureSection />
      <AppPromoSection />
      <ForBusinesses />
      <ReviewsSection />
      <SEOFooter />
    </div>
  );
}
