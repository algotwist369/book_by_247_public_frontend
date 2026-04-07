"use client";

import { useQuery } from "@tanstack/react-query";
import { businessApi } from "@/api/public/business";

export const useCities = () => {
    return useQuery({
        queryKey: ["public-cities"],
        queryFn: () => businessApi.getUniqueCities(),
        staleTime: 30 * 60 * 1000, // 30 minutes
        select: (response: any) => {
            const cities = response?.data || [];
            // "All Cities" is added by the component if needed, 
            // or we can add it here. The user said "show all cities which show in backend databases"
            // and the image showed "All Cities" at the end.
            return [...cities, "All Cities"];
        }
    });
};
