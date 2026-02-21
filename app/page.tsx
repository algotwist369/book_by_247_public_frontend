import { Suspense } from "react";
import { CategorySection } from "@/components/home/CategorySection";
import { ReviewsSection } from "@/components/home/ReviewsSection";
import { StatsSection } from "@/components/home/StatsSection";
import { PartnerSection } from "@/components/home/PartnerSection";
import { AppPromoSection } from "@/components/home/AppPromoSection";
import FeatureSection from "@/components/home/FeatureSection";
import SEOFooter from "@/components/home/SEOFooter";
import BusinessSection from "@/components/business/BusinessSection";
import PromotionBanner from "@/components/promotion/PromotionBanner";
import HeroSection from "@/components/home/HeroSection";

import { businessApi } from "@/api/public/business";
import ForBusinesses from "@/components/home/ForBusinesses";

export const revalidate = 3600; // Revalidate every hour

export default async function Home() {
  const businessData = await businessApi.getPublicBusinesses({ limit: 16 }).catch(() => null);

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <Suspense fallback={
        <div className="h-[500px] sm:h-[600px] md:h-[650px] lg:h-[700px] bg-zinc-900 animate-pulse" />
      }>
        <HeroSection />
      </Suspense>

      {/* Stats Section */}
      <StatsSection />
      
      {/* Promotion Banner */}
      {/* <div className="max-w-7xl mx-auto px-6 py-10">
        <PromotionBanner />
      </div> */}
      {/* Categories Section */}
      <CategorySection />

      {/* Featured Businesses Section */}
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

      {/* Partner Section */}
      <PartnerSection />

      {/* Feature Section (Professional "Big Platform" Look) */}
      <FeatureSection />

      {/* Mobile App Section */}
      <AppPromoSection />

      {/* For Businesses Section */}
      <ForBusinesses />

      {/* Reviews Section */}
      <ReviewsSection />

      {/* SEO Footer Text Section */}
      <SEOFooter />
    </div>
  );
}
