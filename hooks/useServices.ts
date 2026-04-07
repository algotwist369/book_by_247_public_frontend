import { useQuery } from "@tanstack/react-query";
import { serviceApi } from "@/api/public/services";

/**
 * Fetch services based on SEO routing (city, area, category, type)
 */
export const useSeoServices = (params: any) => {
    return useQuery({
        queryKey: ['seo_services', params],
        queryFn: () => serviceApi.getSeoServices(params),
        enabled: !!params,
        staleTime: 1000 * 60 * 5, // 5 minutes cache
    });
};

/**
 * Fetch service details by slug for SEO landing page
 */
export const useSeoServiceBySlug = (slug: string) => {
    return useQuery({
        queryKey: ['seo_service_detail', slug],
        queryFn: () => serviceApi.getSeoServiceBySlug(slug),
        enabled: !!slug,
        staleTime: 1000 * 60 * 10, // 10 minutes cache
    });
};

/**
 * Fetch distinct service categories and tags for filters
 */
export const useServiceMetadata = () => {
    return useQuery({
        queryKey: ['seo_service_metadata'],
        queryFn: () => serviceApi.getServiceMetadata(),
        staleTime: 1000 * 60 * 60, // 1 hour cache
    });
};
