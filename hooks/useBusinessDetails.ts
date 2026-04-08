"use client";

import { useQuery } from "@tanstack/react-query";
import { businessDetailsApi } from "@/api/public/business.details.api";

export const useBusinessDetails = (slug: string, initialData?: any) => {
    return useQuery({
        queryKey: ["business-details", slug],
        queryFn: () => businessDetailsApi.getDetails(slug),
        enabled: !!slug,
        staleTime: 10 * 60 * 1000,
        initialData,
        select: (response) => response.data,
    });
};

export const useBusinessContacts = (slug: string, initialData?: any) => {
    return useQuery({
        queryKey: ["business-contacts", slug],
        queryFn: () => businessDetailsApi.getContacts(slug),
        enabled: !!slug,
        staleTime: 10 * 60 * 1000,
        initialData,
        select: (response) => response.data,
    });
};

export const useBusinessWorkingHours = (slug: string, initialData?: any) => {
    return useQuery({
        queryKey: ["business-working-hours", slug],
        queryFn: () => businessDetailsApi.getWorkingHours(slug),
        enabled: !!slug,
        staleTime: 10 * 60 * 1000,
        initialData,
        select: (response) => response.data,
    });
};

export const useBusinessSocialMedia = (slug: string, initialData?: any) => {
    return useQuery({
        queryKey: ["business-social-media", slug],
        queryFn: () => businessDetailsApi.getSocialMedia(slug),
        enabled: !!slug,
        staleTime: 15 * 60 * 1000,
        initialData,
        select: (response) => response.data,
    });
};

export const useBusinessMedia = (slug: string, initialData?: any) => {
    return useQuery({
        queryKey: ["business-media", slug],
        queryFn: () => businessDetailsApi.getMedia(slug),
        enabled: !!slug,
        staleTime: 15 * 60 * 1000,
        initialData,
        select: (response) => response.data,
    });
};

export const useBusinessCategories = (slug: string, initialData?: any) => {
    return useQuery({
        queryKey: ["business-categories", slug],
        queryFn: () => businessDetailsApi.getCategories(slug),
        enabled: !!slug,
        staleTime: 15 * 60 * 1000,
        initialData,
        select: (response) => response.data,
    });
};

export const useBusinessCapacity = (slug: string, initialData?: any) => {
    return useQuery({
        queryKey: ["business-capacity", slug],
        queryFn: () => businessDetailsApi.getCapacity(slug),
        enabled: !!slug,
        staleTime: 15 * 60 * 1000,
        initialData,
        select: (response) => response.data,
    });
};

export const useBusinessServices = (slug: string, page = 1, limit = 10, initialData?: any) => {
    return useQuery({
        queryKey: ["business-services", slug, page, limit],
        queryFn: () => businessDetailsApi.getServices(slug, page, limit),
        enabled: !!slug,
        staleTime: 5 * 60 * 1000,
        initialData,
        select: (response) => response.data,
    });
};

export const useBusinessSeo = (slug: string, initialData?: any) => {
    return useQuery({
        queryKey: ["business-seo", slug],
        queryFn: () => businessDetailsApi.getSeo(slug),
        enabled: !!slug,
        staleTime: 10 * 60 * 1000,
        initialData,
        select: (response) => response.data,
    });
};

export const useBusinessReviews = (slug: string, page = 1, limit = 10, initialData?: any) => {
    return useQuery({
        queryKey: ["business-reviews", slug, page, limit],
        queryFn: () => businessDetailsApi.getReviews(slug, page, limit),
        enabled: !!slug,
        staleTime: 5 * 60 * 1000,
        initialData,
        select: (response) => response.data,
    });
};
