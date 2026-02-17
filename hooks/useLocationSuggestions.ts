import { useQuery } from "@tanstack/react-query";
import { businessApi } from "../api/public/business";

/**
 * Hook for fetching location suggestions (cities + Google Places)
 * @param input The user input text
 * @param enabled Whether the query should be active
 */
export const useLocationSuggestions = (input: string, enabled: boolean = true) => {
    return useQuery({
        queryKey: ["location-suggestions", input],
        queryFn: () => businessApi.suggestLocations(input),
        enabled: enabled && input.trim().length >= 2,
        staleTime: 10 * 60 * 1000, // 10 minutes
        gcTime: 15 * 60 * 1000, // 15 minutes
        select: (response: any) => {
            const suggestions = response?.payload?.decryptedData?.suggestions || response?.suggestions || [];
            return suggestions.map((s: any) => ({
                id: s.place_id || s.description,
                description: s.description,
                mainText: s.main_text,
                secondaryText: s.secondary_text,
                type: s.type || 'place',
                source: s.source || 'google'
            }));
        }
    });
};
