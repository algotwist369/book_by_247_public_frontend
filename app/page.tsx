import { Suspense } from "react";
import dynamic from "next/dynamic";
import HeroSection from "@/components/home/HeroSection";
import { StatsSection } from "@/components/home/StatsSection";
import { CategorySection } from "@/components/home/CategorySection";
import { businessApi } from "@/api/public/business";

// Dynamically import all below-fold sections to split the JS bundle.
// Named exports need .then(m => m.ComponentName) for dynamic() to work correctly.
const BusinessSection = dynamic(() => import("@/components/business/BusinessSection"), { ssr: true });
const PartnerSection = dynamic(() => import("@/components/home/PartnerSection").then(m => m.PartnerSection));
const FeatureSection = dynamic(() => import("@/components/home/FeatureSection"));
const AppPromoSection = dynamic(() => import("@/components/home/AppPromoSection").then(m => m.AppPromoSection));
const ForBusinesses = dynamic(() => import("@/components/home/ForBusinesses"));
const ReviewsSection = dynamic(() => import("@/components/home/ReviewsSection").then(m => m.ReviewsSection));
const SEOFooter = dynamic(() => import("@/components/home/SEOFooter"));

export const revalidate = 3600;

export default async function Home() {
  const businessData = await businessApi.getPublicBusinesses({ limit: 16 }).catch(() => null);

  return (
    <div className="bg-white min-h-screen">
      {/* Hero — critical, eager-loaded for LCP */}
      <HeroSection />

      {/* Stats and Categories — lightweight, above-fold */}
      <StatsSection />
      
      <CategorySection />

      {/* Featured Businesses */}
      <Suspense fallback={
        <div className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-8 max-w-[90rem] mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex flex-col gap-3">
                <div className="aspect-video w-full bg-zinc-100 animate-pulse rounded-xl" />
                <div className="h-6 w-3/4 bg-zinc-100 animate-pulse rounded-md" />
              </div>
            ))}
          </div>
        </div>
      }>
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
