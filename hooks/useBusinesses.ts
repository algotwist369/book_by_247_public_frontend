"use client";

import { useQuery } from "@tanstack/react-query";
import { businessApi } from "@/api/public/business";
import { Business } from "@/components/business/businessData";

export const usePublicBusinesses = (params: { type?: string; page?: number; limit?: number, initialData?: any } = {}) => {
    const { initialData, ...queryKeyParams } = params;
    return useQuery({
        queryKey: ["public-businesses", queryKeyParams],
        queryFn: () => businessApi.getPublicBusinesses(queryKeyParams),
        staleTime: 5 * 60 * 1000,
        initialData,
        select: (response: any) => {
            const businesses = response?.businesses || response?.data || [];
            const normalized = businesses.map((business: any) => {
                const rawImages = Array.isArray(business.images) ? business.images : [];
                const galleryImages = Array.isArray(business.gallery) ? business.gallery : [];
                const nestedGallery = Array.isArray(business.images?.gallery) ? business.images.gallery : [];

                const combinedImages = Array.from(new Set([
                    ...rawImages,
                    ...galleryImages,
                    ...nestedGallery,
                    business.image,
                    business.images?.banner,
                    business.images?.logo,
                    business.images?.thumbnail
                ])).filter(Boolean) as string[];

                return {
                    ...business,
                    id: business.id || business._id,
                    rating: business.rating ?? business.ratings?.average ?? 0,
                    reviews: business.reviews ?? business.ratings?.totalReviews ?? 0,
                    images: combinedImages,
                    image: business.image || combinedImages[0] || "",
                };
            });
            return {
                ...response,
                data: normalized
            };
        }
    });
};

export const useBusinessBySlug = (slug: string, initialData?: any) => {
    return useQuery({
        queryKey: ['business', slug],
        queryFn: () => businessApi.getBusinessBySlug(slug),
        enabled: !!slug,
        staleTime: 5 * 60 * 1000,
        initialData,
        select: (response: any): Business | null => {
            const business = response?.data;
            if (!business) return null;

            return {
                ...business,
                id: business.id || business._id,
                rating: business.rating ?? business.ratings?.average ?? 0,
                reviews: business.reviews ?? business.ratings?.totalReviews ?? 0,
                images: Array.from(new Set([
                    ...(Array.isArray(business.images) ? business.images : []),
                    ...(Array.isArray(business.gallery) ? business.gallery : []),
                    ...(Array.isArray(business.images?.gallery) ? business.images.gallery : []),
                    business.image,
                    business.images?.banner,
                    business.images?.logo,
                    business.images?.thumbnail
                ])).filter(Boolean) as string[],
                // Ensure categories and tags are arrays
                categories: business.category ? [business.category] : (Array.isArray(business.categories) ? business.categories : []),
                tags: Array.isArray(business.tags) ? business.tags : []
            };
        }
    });
};
export const useBusinessReviews = (businessId: string, page: number = 1, limit: number = 20, initialData?: any) => {
    return useQuery({
        queryKey: ['business-reviews', businessId, page, limit],
        queryFn: () => businessApi.getBusinessReviews(businessId, page, limit),
        enabled: !!businessId,
        staleTime: 5 * 60 * 1000,
        initialData,
        select: (response: any) => {
            // The backend returns { reviews: [], pagination: {} } inside the decrypted payload
            const reviews = response?.reviews || [];
            const pagination = response?.pagination || {};

            const normalized = reviews.map((r: any) => {
                const authorName = r.guestName || "Anonymous";
                return {
                    id: r._id,
                    author: authorName,
                    avatar: r.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}&background=random`,
                    rating: r.rating,
                    content: r.review, // backend field is 'review'
                    date: new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
                    helpfulPercentage: r.helpfulPercentage || 0
                };
            });

            return {
                reviews: normalized,
                pagination
            };
        }
    });
};

export const useNearbyBusinesses = (params: { lat: number; lng: number; maxDistance?: number; page?: number; limit?: number }) => {
    return useQuery({
        queryKey: ["nearby-businesses", params],
        queryFn: () => businessApi.getNearbyBusinesses(params),
        enabled: !!params.lat && !!params.lng,
        staleTime: 5 * 60 * 1000,
        select: (response: any) => {
            const businesses = response?.data || [];
            const normalized = businesses.map((business: any) => {
                const combinedImages = Array.from(new Set([
                    ...(Array.isArray(business.images) ? business.images : []),
                    ...(Array.isArray(business.gallery) ? business.gallery : []),
                    ...(Array.isArray(business.images?.gallery) ? business.images.gallery : []),
                    business.image,
                    business.images?.banner,
                    business.images?.logo,
                    business.images?.thumbnail
                ])).filter(Boolean) as string[];

                return {
                    ...business,
                    id: business.id || business._id,
                    rating: business.rating ?? business.ratings?.average ?? 0,
                    reviews: business.reviews ?? business.ratings?.totalReviews ?? 0,
                    images: combinedImages,
                    image: business.image || combinedImages[0] || "",
                };
            });
            return {
                ...response,
                data: normalized
            };
        }
    });
};
