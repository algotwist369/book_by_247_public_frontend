"use client";

import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { businessDetailsApi } from "@/api/public/business.details.api";

/**
 * SSR-safe query wrapper that prevents 'No QueryClient set' errors during Next.js server rendering,
 * while utilizing TanStack React Query on the client browser.
 */
function useSafeQuery<TData = any, TError = any, TSelected = TData>(
    options: UseQueryOptions<TData, TError, TSelected>
) {
    const queryResult = useQuery<TData, TError, TSelected>(options);
    if (typeof window === "undefined") {
        const rawData = options.initialData as any;
        const select = options.select;
        const selectedData = rawData && select ? select(rawData) : (rawData?.data ?? rawData);

        return {
            ...queryResult,
            data: (selectedData as TSelected) ?? queryResult.data,
            isLoading: !selectedData && queryResult.isLoading,
            isSuccess: !!selectedData || queryResult.isSuccess,
        };
    }
    return queryResult;
}

export const useBusinessDetails = (slug: string, initialData?: any) => {
    return useSafeQuery({
        queryKey: ["business-details", slug],
        queryFn: () => businessDetailsApi.getDetails(slug),
        enabled: !!slug,
        staleTime: 10 * 60 * 1000,
        initialData,
        select: (response: any) => response?.data ?? response,
    });
};

export const useBusinessContacts = (slug: string, initialData?: any) => {
    return useSafeQuery({
        queryKey: ["business-contacts", slug],
        queryFn: () => businessDetailsApi.getContacts(slug),
        enabled: !!slug,
        staleTime: 10 * 60 * 1000,
        initialData,
        select: (response: any) => response?.data ?? response,
    });
};

export const useBusinessWorkingHours = (slug: string, initialData?: any) => {
    return useSafeQuery({
        queryKey: ["business-working-hours", slug],
        queryFn: () => businessDetailsApi.getWorkingHours(slug),
        enabled: !!slug,
        staleTime: 10 * 60 * 1000,
        initialData,
        select: (response: any) => response?.data ?? response,
    });
};

export const useBusinessSocialMedia = (slug: string, initialData?: any) => {
    return useSafeQuery({
        queryKey: ["business-social-media", slug],
        queryFn: () => businessDetailsApi.getSocialMedia(slug),
        enabled: !!slug,
        staleTime: 15 * 60 * 1000,
        initialData,
        select: (response: any) => response?.data ?? response,
    });
};

export const useBusinessMedia = (slug: string, initialData?: any) => {
    return useSafeQuery({
        queryKey: ["business-media", slug],
        queryFn: () => businessDetailsApi.getMedia(slug),
        enabled: !!slug,
        staleTime: 15 * 60 * 1000,
        initialData,
        select: (response: any) => response?.data ?? response,
    });
};

export const useBusinessCategories = (slug: string, initialData?: any) => {
    return useSafeQuery({
        queryKey: ["business-categories", slug],
        queryFn: () => businessDetailsApi.getCategories(slug),
        enabled: !!slug,
        staleTime: 15 * 60 * 1000,
        initialData,
        select: (response: any) => response?.data ?? response,
    });
};

export const useBusinessCapacity = (slug: string, initialData?: any) => {
    return useSafeQuery({
        queryKey: ["business-capacity", slug],
        queryFn: () => businessDetailsApi.getCapacity(slug),
        enabled: !!slug,
        staleTime: 15 * 60 * 1000,
        initialData,
        select: (response: any) => response?.data ?? response,
    });
};

export const useBusinessServices = (slug: string, page = 1, limit = 10, initialData?: any) => {
    return useSafeQuery({
        queryKey: ["business-services", slug, page, limit],
        queryFn: () => businessDetailsApi.getServices(slug, page, limit),
        enabled: !!slug,
        staleTime: 5 * 60 * 1000,
        initialData,
        select: (response: any) => response?.data ?? response,
    });
};

export const useBusinessSeo = (slug: string, initialData?: any) => {
    return useSafeQuery({
        queryKey: ["business-seo", slug],
        queryFn: () => businessDetailsApi.getSeo(slug),
        enabled: !!slug,
        staleTime: 10 * 60 * 1000,
        initialData,
        select: (response: any) => response?.data ?? response,
    });
};

export const useBusinessReviews = (slug: string, page = 1, limit = 10, initialData?: any) => {
    return useSafeQuery({
        queryKey: ["business-reviews", slug, page, limit],
        queryFn: () => businessDetailsApi.getReviews(slug, page, limit),
        enabled: !!slug,
        staleTime: 5 * 60 * 1000,
        initialData,
        select: (response: any) => response?.data ?? response,
    });
};
