import { useInfiniteQuery } from "@tanstack/react-query";
import { businessApi } from "../api/public/business";

const PAGE_SIZE = 20;

const normalizeResults = (results: any[]) =>
    results.map((b: any) => ({
        ...b,
        id: b.id || b._id,
        slug: b.slug,
        rating: b.ratings?.average ?? 0,
        reviews: b.ratings?.totalReviews ?? 0,
        image:
            b.image ||
            (Array.isArray(b.images)
                ? b.images[0]
                : b.images?.thumbnail || b.images?.logo || b.images?.banner),
        coordinates: b.location?.coordinates
            ? { lat: b.location.coordinates[1], lng: b.location.coordinates[0] }
            : b.coordinates || { lat: 13.0418, lng: 80.2341 },
    }));

export const useInfiniteSearch = (params: any) => {
    return useInfiniteQuery({
        queryKey: ["business-search-infinite", params],
        queryFn: async ({ pageParam = 1 }) => {
            const response = await businessApi.searchBusinesses({
                ...params,
                page: pageParam,
                limit: PAGE_SIZE,
            });
            const data = response?.payload?.decryptedData || response || {};
            return {
                results: normalizeResults(data.results || data.businesses || []),
                totalResults: data.totalResults ?? 0,
                page: pageParam as number,
            };
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
            const fetched = lastPage.page * PAGE_SIZE;
            return fetched < lastPage.totalResults ? lastPage.page + 1 : undefined;
        },
        staleTime: 5 * 60 * 1000,
    });
};
