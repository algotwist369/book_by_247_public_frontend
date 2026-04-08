export interface Review {
    id: string;
    author: string;
    avatar: string;
    rating: number;
    date: string;
    content: string;
}

export interface Business {
    id: string;
    name: string;
    slug: string;
    images: string[];
    image?: string;
    thumbnailImage?: string;
    logoImage?: string;
    rating: number;
    reviews: number;
    averageRating?: number;
    totalReviews?: number;
    phone?: string;
    email?: string;
    website?: string;
    address: string;
    city?: string;
    branch?: string;
    tours?: string[];
    videos?: string[];
    categories?: string[];
    tags?: string[];
    description?: string;
    price: number;
    amenities: string[];
    gender: 'Any' | 'Male' | 'Female' | 'Unisex';
    coordinates: {
        lat: number;
        lng: number;
    };
    reviewsList?: Review[];
    services?: any[];
    distanceKm?: number;
    isOpen?: boolean;
    gallery?: string[];
    googleMapsUrl?: string;
    workingHours?: {
        days: string[];
        open: string;
        close: string;
    };
    ratings?: {
        average: number;
        totalReviews: number;
    };
    seo?: {
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
}

 