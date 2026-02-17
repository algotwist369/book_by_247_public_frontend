import Link from "next/link";
import { SearchBar } from "@/components/ui/SearchBar";
import {
  Sparkles,
  ShieldCheck,
  Clock,
  MapPin,
  Star
} from "lucide-react";

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

export const revalidate = 3600; // Revalidate every hour

export default async function Home() {
  const businessData = await businessApi.getPublicBusinesses({ limit: 16 }).catch(() => null);

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* Stats Section */}
      <StatsSection />

      {/* Categories Section */}
      <CategorySection />

      {/* Promotion Banner */}
      {/* <div className="max-w-7xl mx-auto px-6 py-10">
        <PromotionBanner />
      </div> */}

      {/* Featured Businesses Section */}
      <BusinessSection initialData={businessData} />

      {/* Reviews Section */}
      <ReviewsSection />

      {/* Partner Section */}
      <PartnerSection />

      {/* Feature Section (Professional "Big Platform" Look) */}
      <FeatureSection />

      {/* Mobile App Section */}
      <AppPromoSection />

      {/* SEO Footer Text Section */}
      <SEOFooter />
    </div>
  );
}
