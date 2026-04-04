"use client";

import { useQuery } from "@tanstack/react-query";
import { businessApi } from "@/api/public/business";

/**
 * Hook to fetch businesses for SEO landing pages
 */
export const useSeoBusinesses = (params: any, initialData?: any) => {
    return useQuery({
        queryKey: ["seo-businesses", params],
        queryFn: () => businessApi.getSeoBusinesses(params),
        staleTime: 10 * 60 * 1000, // 10 minutes cache
        initialData,
        select: (response: any) => {
            const businesses = response?.data || [];
            
            // Normalize for UI components that expect certain fields
            const normalized = businesses.map((b: any) => ({
                ...b,
                id: b.business_id,
                name: b.business_title,
                slug: b.bussiness_slug,
                image: b.business_thumbnail_url,
                address: b.business_location,
                phone: b.business_contacts,
                description: b.business_dec,
                rating: b.business_avg_tating,
                reviews: b.business_reviws_len,
                type: b.business_type,
                priceCategory: b.business_price_category
            }));

            return {
                ...response,
                businesses: normalized
            };
        }
    });
};

/**
 * Hook to fetch specific business details by slug (SEO optimized)
 */
export const useSeoBusinessBySlug = (slug: string, initialData?: any) => {
    return useQuery({
        queryKey: ["seo-business", slug],
        queryFn: () => businessApi.getSeoBusinessBySlug(slug),
        enabled: !!slug,
        staleTime: 10 * 60 * 1000,
        initialData,
        select: (response: any) => response?.data
    });
};

/**
 * Hook to fetch reviews for a business by slug (SEO optimized)
 */
export const useSeoReviewsBySlug = (slug: string, initialData?: any) => {
    return useQuery({
        queryKey: ["seo-reviews", slug],
        queryFn: () => businessApi.getSeoReviewsBySlug(slug),
        enabled: !!slug,
        staleTime: 10 * 60 * 1000,
        initialData,
        select: (response: any) => response?.data || []
    });
};
