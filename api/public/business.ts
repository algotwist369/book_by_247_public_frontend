import { apiClient } from "../apiClient";

export interface PublicBusiness {
    id: string;
    name: string;
    type: string;
    branch: string;
    city: string;
    phone: string;
    images: {
        logo?: string;
        banner?: string;
        gallery?: string[];
        thumbnail?: string;
    };
    ratings: {
        average: number;
        totalReviews: number;
    };
    seo: any;
    slug: string;
    createdAt: string;
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
     * Advanced search with filters and weighted relevance
     */
    searchBusinesses: async (params: any) => {
        const queryParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                queryParams.append(key, String(value));
            }
        });
        return apiClient<any>(`/business/public/explore?${queryParams.toString()}`);
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
        return apiClient<any>(`/seo/businesses?${queryParams.toString()}`);
    },

    /**
     * Get full business details by slug for SEO landing page
     */
    getSeoBusinessBySlug: async (slug: string) => {
        return apiClient<any>(`/seo/business/${slug}`);
    },

    /**
     * Get reviews by business slug for SEO pages
     */
    getSeoReviewsBySlug: async (slug: string) => {
        return apiClient<any>(`/seo/reviews/${slug}`);
    },

    getBusinessTypes: async () => {
        return apiClient<{ success: boolean; data: { slug: string; name: string }[] }>('/seo/metadata/types');
    },

    /**
     * Get all unique cities where active businesses are located
     */
    getUniqueCities: async () => {
        return apiClient<{ success: boolean; data: string[] }>('/business/public/cities');
    },
};
