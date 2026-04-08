import { apiClient } from "../apiClient";

export interface BusinessDetails {
    name: string;
    slug: string;
    business_link: string;
    description: string;
    business_type: string;
    business_branch: string;
    avg_rating: number;
    total_reviews: number;
    is_active: boolean;
}

export interface BusinessContacts {
    phone: string;
    alternate_phone: string;
    email: string;
    website: string;
    address: string;
    city: string;
    state: string;
    country: string;
    zip_code: string;
    location: {
        type: string;
        coordinates: number[];
    };
    google_maps_url: string;
    is_active: boolean;
}

export interface BusinessWorkingHours {
    working_hours: {
        open: string;
        close: string;
        days: string[];
    };
    open: string;
    close: string;
    days: string[];
    days_off: string[];
    holidays: any[];
    is_active: boolean;
}

export interface BusinessSocialMedia {
    facebook: string;
    twitter: string;
    instagram: string;
    linkedin: string;
    youtube: string;
    whatsapp: string;
    telegram: string;
    is_active: boolean;
}

export interface BusinessMedia {
    images: string[];
    videos: string[];
    images_360: string[];
    is_active: boolean;
}

export interface BusinessCategories {
    categories: string;
    sub_categories: string;
    tags: string[];
    specialties: string[];
    languages: string[];
    is_active: boolean;
}

export interface BusinessCapacity {
    capacity: any;
    features: string[];
    amenities: string[];
    is_active: boolean;
}

export interface BusinessService {
    _id: string;
    business: string;
    name: string;
    description: string;
    shortDescription: string;
    category: string;
    tags: string[];
    price: number;
    currency: string;
    pricingType: string;
    pricingOptions: any[];
    serviceType: string;
    duration: number;
    bufferTime: number;
    isActive: boolean;
    isAvailableOnline: boolean;
    availableDays: string[];
    locationInfo: any;
    seoRouting: any;
    searchProfile: any;
    seo: any;
    ratings: {
        average: number;
        count: number;
    };
    stats: any;
    isFeatured: boolean;
    availableTimeSlots: any[];
    createdAt: string;
    updatedAt: string;
    slug: string;
    minPrice: number;
    maxPrice: number;
}

export interface BusinessServicesResponse {
    services: BusinessService[];
    is_active: boolean;
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
    };
}

export interface BusinessSeo {
    ratings: any;
    name: string;
    slug: string;
    description: string;
    seo: {
        metaTitle: string;
        metaDescription: string;
        keywords: string[];
    };
    seo_routing: any;
    seo_score: any;
    seo_flags: any;
    services_seo: any[];
    location_info: any;
    search_profile: any;
    is_active: boolean;
}

export interface BusinessReview {
    customerName: string;
    rating: number;
    comment: string;
    createdAt: string;
    reply?: string;
    images?: string[];
    isVerified?: boolean;
}

export interface BusinessReviewsResponse {
    business_name: string;
    business_slug: string;
    ratings: {
        average: number;
        total_reviews: number;
        breakdown: {
            five: number;
            four: number;
            three: number;
            two: number;
            one: number;
        };
    };
    reviews: BusinessReview[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
    };
}

export interface ApiResponse<T> {
    success: boolean;
    data_source: string;
    data: T;
    message: string;
}

export const businessDetailsApi = {
    getDetails: (slug: string) => 
        apiClient<ApiResponse<BusinessDetails>>(`/v1/business/${slug}`),
    
    getContacts: (slug: string) => 
        apiClient<ApiResponse<BusinessContacts>>(`/v1/business/${slug}/contacts`),
    
    getWorkingHours: (slug: string) => 
        apiClient<ApiResponse<BusinessWorkingHours>>(`/v1/business/${slug}/working-hours`),
    
    getSocialMedia: (slug: string) => 
        apiClient<ApiResponse<BusinessSocialMedia>>(`/v1/business/${slug}/social-media`),
    
    getMedia: (slug: string) => 
        apiClient<ApiResponse<BusinessMedia>>(`/v1/business/${slug}/media`),
    
    getCategories: (slug: string) => 
        apiClient<ApiResponse<BusinessCategories>>(`/v1/business/${slug}/categories`),
    
    getCapacity: (slug: string) => 
        apiClient<ApiResponse<BusinessCapacity>>(`/v1/business/${slug}/capacity`),
    
    getServices: (slug: string, page = 1, limit = 10) => 
        apiClient<ApiResponse<BusinessServicesResponse>>(`/v1/business/${slug}/services?page=${page}&limit=${limit}`),
    
    getSeo: (slug: string) => 
        apiClient<ApiResponse<BusinessSeo>>(`/v1/business/${slug}/seo`),
    
    getReviews: (slug: string, page = 1, limit = 10) => 
        apiClient<ApiResponse<BusinessReviewsResponse>>(`/v1/business/${slug}/reviews?page=${page}&limit=${limit}`),
};
