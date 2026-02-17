import { useQuery } from "@tanstack/react-query";
import { businessApi } from "../api/public/business";

export const useSearch = (params: any, initialData?: any) => {
    return useQuery({
        queryKey: ["business-search", params],
        queryFn: () => businessApi.searchBusinesses(params),
        placeholderData: (previousData) => previousData,
        staleTime: 5 * 60 * 1000, // 5 minutes
        select: (response: any) => {
            const data = response?.payload?.decryptedData || response || {};
            const businesses = data.results || data.businesses || [];

            // Normalize the results for UI consistency
            return {
                ...data,
                results: businesses.map((b: any) => ({
                    ...b,
                    id: b.id || b._id,
                    slug: b.slug,
                    rating: b.ratings?.average ?? 0,
                    reviews: b.ratings?.totalReviews ?? 0,
                    // Use common image picker
                    image: b.image || (Array.isArray(b.images) ? b.images[0] : (b.images?.thumbnail || b.images?.logo || b.images?.banner)),
                    // Map GeoJSON location to coordinates object for Map component
                    coordinates: b.location?.coordinates ? {
                        lat: b.location.coordinates[1],
                        lng: b.location.coordinates[0]
                    } : (b.coordinates || { lat: 13.0418, lng: 80.2341 }) // Fallback to default if missing
                }))
            };
        }
    });
};
