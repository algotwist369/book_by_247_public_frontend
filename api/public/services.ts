import { apiClient } from "../apiClient";

export interface SeoService {
    service_id: string;
    service_slug: string;
    service_title: string;
    service_description: string;
    service_thumbnail: string;
    service_min_price: number;
    service_max_price: number;
    service_avg_rating: number;
    service_reviews_count: number;
    service_category: string;
    business: {
        id: string;
        name: string;
        slug: string;
        type: string;
        location: string;
    };
}

export interface SeoServicesResponse {
    success: boolean;
    count: number;
    total: number;
    page: number;
    pages: number;
    data: SeoService[];
}

export const serviceApi = {
    /**
     * Get services based on SEO routing (city, area, category, type)
     */
    getSeoServices: async (params: any) => {
        const queryParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                queryParams.append(key, String(value));
            }
        });
        return apiClient<SeoServicesResponse>(`/seo/services?${queryParams.toString()}`);
    },

    /**
     * Get service details by slug for SEO landing page
     */
    getSeoServiceBySlug: async (slug: string) => {
        return apiClient<{ success: boolean; data: any }>(`/seo/service/${slug}`);
    },

    /**
     * Get distinct service categories and tags for filters
     */
    getServiceMetadata: async () => {
        return apiClient<{
            success: boolean;
            data: {
                categories: { slug: string; name: string }[];
                tags: string[];
            }
        }>('/seo/service-metadata/categories');
    }
};
