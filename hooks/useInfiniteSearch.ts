import { useInfiniteQuery } from "@tanstack/react-query";
import { businessApi } from "../api/public/business";

const PAGE_SIZE = 20;

function calculateHaversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return parseFloat((R * c).toFixed(1));
}

const normalizeResults = (results: any[], userLat?: number | null, userLng?: number | null) =>
    results.map((b: any) => {
        const rawImages = Array.isArray(b.images) ? b.images : [];
        const galleryImages = Array.isArray(b.gallery) ? b.gallery : [];
        const nestedGallery = Array.isArray(b.images?.gallery) ? b.images.gallery : [];

        const combinedImages = Array.from(new Set([
            b.thumbnailImage,
            b.logoImage,
            ...rawImages,
            ...galleryImages,
            ...nestedGallery,
            b.image,
            b.images?.banner,
            b.images?.logo,
            b.images?.thumbnail
        ])).filter(Boolean) as string[];

        const coords = b.location?.coordinates
            ? { lat: b.location.coordinates[1], lng: b.location.coordinates[0] }
            : b.coordinates || null;

        // Calculate actual distance in km ONLY if user location is ON
        let distanceKm: number | undefined = b.distanceKm ?? b.distance;
        if (distanceKm === undefined && userLat && userLng && coords?.lat && coords?.lng) {
            distanceKm = calculateHaversineDistance(userLat, userLng, coords.lat, coords.lng);
        }

        return {
            ...b,
            id: b.id || b._id,
            slug: b.slug,
            rating: b.averageRating ?? b.rating ?? b.ratings?.average ?? 0,
            reviews: b.totalReviews ?? b.reviews ?? b.ratings?.totalReviews ?? 0,
            images: combinedImages,
            image: b.thumbnailImage || b.image || combinedImages[0] || "",
            coordinates: coords || { lat: 13.0418, lng: 80.2341 },
            distanceKm: distanceKm,
        };
    });

export const useInfiniteSearch = (params: any) => {
    const { initialData, ...queryFilters } = params;
    
    return useInfiniteQuery({
        queryKey: ["business-search-infinite", queryFilters],
        queryFn: async ({ pageParam = 1 }) => {
            let response;
            if (queryFilters.nearMeSlug) {
                response = await businessApi.getNearMeBusinesses(queryFilters.nearMeSlug, {
                    ...queryFilters,
                    page: pageParam,
                    limit: PAGE_SIZE,
                });
            } else {
                response = await businessApi.searchBusinesses({
                    ...queryFilters,
                    page: pageParam,
                    limit: PAGE_SIZE,
                });
            }
            const data = response?.data || response?.payload?.decryptedData || response || {};
            return {
                results: normalizeResults(
                    data.results || data.businesses || [],
                    queryFilters.lat,
                    queryFilters.lng
                ),
                totalResults: data.totalResults ?? 0,
                page: pageParam as number,
            };
        },
        initialPageParam: 1,
        initialData: initialData ? {
            pages: [initialData],
            pageParams: [1],
        } : undefined,
        getNextPageParam: (lastPage) => {
            const fetched = lastPage.page * PAGE_SIZE;
            return fetched < lastPage.totalResults ? lastPage.page + 1 : undefined;
        },
        staleTime: 5 * 60 * 1000,
    });
};
