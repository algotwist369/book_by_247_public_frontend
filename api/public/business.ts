import { apiClient } from "../apiClient";

export interface PublicBusiness {
    id: string;
    name: string;
    slug: string;
    type: string;
    description?: string;
    branch: string;
    address?: string;
    city: string;
    state?: string;
    phone: string;
    location?: {
        type: string;
        coordinates: number[];
    };
    distance?: number;
    distanceText?: string;
    locationInfo?: any;
    category?: string;
    tags?: string[];
    image?: string;
    logoImage?: string;
    thumbnailImage?: string;
    averageRating: number;
    totalReviews: number;
    seo: {
        metaTitle?: string;
        metaDescription?: string;
        keywords?: string[];
        ogImage?: string;
    };
    seoScore?: any;
    seoFlags?: {
        isBest?: boolean;
        isPopular?: boolean;
        isTrending?: boolean;
    };
    relevanceScore?: number;
    createdAt: string;
}

export interface SearchBusinessesResponse {
    payload: any;
    success: boolean;
    message: string;
    data: {
        businesses: PublicBusiness[];
        page: number;
        limit: number;
        totalResults: number;
        results: PublicBusiness[];
        searchType: string;
    };
}

export interface PublicBusinessResponse {
    businesses: PublicBusiness[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        pages: number;
        hasMore: boolean;
    } | null;
}

export const businessApi = {
    /**
     * Fetch public businesses with randomized top-rated sorting
     */
    getPublicBusinesses: async (params: { type?: string; page?: number; limit?: number } = {}) => {
        const queryParams = new URLSearchParams();
        if (params.type) queryParams.append("type", params.type);
        if (params.page) queryParams.append("page", params.page.toString());
        if (params.limit) queryParams.append("limit", params.limit.toString());

        return apiClient<PublicBusinessResponse>(`/business/public/list?${queryParams.toString()}`);
    },

    /**
     * Fetch business details by slug
     */
    getBusinessBySlug: async (slug: string) => {
        return apiClient<any>(`/business/public/profile/${slug}`);
    },

    /**
     * Fetch paginated reviews for a business
     */
    getBusinessReviews: async (businessId: string, page: number = 1, limit: number = 20) => {
        return apiClient<any>(`/business/public/${businessId}/reviews?page=${page}&limit=${limit}`);
    },

    /**
     * Fetch "Near Me" businesses by category and location
     */
    getNearMeBusinesses: async (categoryNearMe: string, params: { lat?: number; lng?: number; page?: number; limit?: number; minRating?: number; price?: string; audience?: string } = {}) => {
        const queryParams = new URLSearchParams();
        if (params.lat) queryParams.append("lat", params.lat.toString());
        if (params.lng) queryParams.append("lng", params.lng.toString());
        if (params.page) queryParams.append("page", params.page.toString());
        if (params.limit) queryParams.append("limit", params.limit.toString());
        if (params.minRating) queryParams.append("minRating", params.minRating.toString());
        if (params.price) queryParams.append("price", params.price);
        if (params.audience) queryParams.append("audience", params.audience);

        return apiClient<any>(`/v1/seo/${categoryNearMe}?${queryParams.toString()}`);
    },

    /**
     * Advanced search with filters and weighted relevance
     */
    searchBusinesses: async (params: any) => {
        const queryParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                queryParams.append(key, String(value));
            }
        });
        return apiClient<SearchBusinessesResponse>(`/business/public/explore?${queryParams.toString()}`);
    },

    /**
     * Get location suggestions (Local cities + Google Places)
     */
    suggestLocations: async (input: string) => {
        return apiClient<any>(`/business/public/suggest-locations?input=${encodeURIComponent(input)}`);
    },

    /**
     * Fetch businesses near the user's location
     */
    getNearbyBusinesses: async (params: { lat: number; lng: number; maxDistance?: number; page?: number; limit?: number }) => {
        const queryParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined) queryParams.append(key, value.toString());
        });
        return apiClient<any>(`/business/public/nearby?${queryParams.toString()}`);
    },

    /**
     * Get businesses based on SEO routing (city, area, service, intent)
     */
    getSeoBusinesses: async (params: any) => {
        const queryParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                queryParams.append(key, String(value));
            }
        });
        return apiClient<any>(`/v1/seo/businesses?${queryParams.toString()}`);
    },

    /**
     * Fetch dynamic SEO listing using route segments
     */
    getDynamicListing: async (city: string, category: string, segment1?: string, segment2?: string, params: any = {}) => {
        const queryParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                queryParams.append(key, String(value));
            }
        });

        const segments = [segment1, segment2].filter(Boolean).join('/');
        const path = `/v1/seo/listing/${city}/${category}${segments ? `/${segments}` : ''}`;
        return apiClient<any>(`${path}?${queryParams.toString()}`);
    },

    /**
     * Get full business details by slug for SEO landing page
     */
    getSeoBusinessBySlug: async (slug: string) => {
        return apiClient<any>(`/v1/seo/business/${slug}`);
    },

    /**
     * Get reviews by business slug for SEO pages
     */
    getSeoReviewsBySlug: async (slug: string) => {
        return apiClient<any>(`/v1/seo/reviews/${slug}`);
    },

    getBusinessTypes: async () => {
        try {
            return await apiClient<{ success: boolean; data: { slug: string; name: string }[] }>('/v1/seo/metadata/types');
        } catch (error) {
            // Fallback categories if API fails
            return {
                success: true,
                data: [
                    { slug: 'spa', name: 'Spa' },
                    { slug: 'salon', name: 'Salon' },
                    { slug: 'wellness', name: 'Wellness' },
                    { slug: 'massage', name: 'Massage' }
                ]
            };
        }
    },

    /**
     * Get data for sitemap generation (cities, areas, types, services)
     */
    getSeoSitemapData: async () => {
        return apiClient<{
            success: boolean;
            data: {
                cities: string[];
                areas: string[];
                types: string[];
                services: string[];
                businessSlugs: string[];
            };
        }>('/v1/seo/sitemap-data');
    },

    /**
     * Get all unique cities where active businesses are located
     */
    getUniqueCities: async () => {
        return apiClient<{ success: boolean; data: string[] }>('/business/public/cities');
    },
};
