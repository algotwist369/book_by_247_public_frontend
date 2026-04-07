import { useInfiniteQuery } from "@tanstack/react-query";
import { serviceApi } from "@/api/public/services";

const PAGE_SIZE = 20;

const normalizeServiceResults = (results: any[]) =>
    results.map((s: any) => ({
        ...s,
        id: s.service_id,
        slug: s.service_slug,
        title: s.service_title,
        description: s.service_description,
        thumbnail: s.service_thumbnail,
        minPrice: s.service_min_price || 0,
        maxPrice: s.service_max_price || 0,
        rating: s.service_avg_rating || 0,
        reviewsCount: s.service_reviews_count || 0,
        category: s.service_category,
        business: s.business ? {
            id: s.business.id,
            name: s.business.name,
            slug: s.business.slug,
            type: s.business.type,
            location: s.business.location
        } : null
    }));

export const useInfiniteServices = (params: any) => {
    return useInfiniteQuery({
        queryKey: ["service-search-infinite", params],
        queryFn: async ({ pageParam = 1 }) => {
            const response = await serviceApi.getSeoServices({
                ...params,
                page: pageParam,
                limit: PAGE_SIZE,
            });
            
            const data = response || {};
            const results = data.data || [];
            
            return {
                results: normalizeServiceResults(results),
                totalResults: data.total ?? 0,
                page: pageParam as number,
            };
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
            const fetched = lastPage.page * PAGE_SIZE;
            return fetched < lastPage.totalResults ? lastPage.page + 1 : undefined;
        },
        staleTime: 5 * 60 * 1000,
        enabled: !!params,
    });
};
