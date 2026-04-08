import { useQuery } from '@tanstack/react-query';
import { businessApi } from '@/api/public/business';

export const useBusinessTypes = () => {
    return useQuery({
        queryKey: ['business-types'],
        queryFn: async () => {
            try {
                const response = await businessApi.getBusinessTypes();
                if (response.success) {
                    return response.data;
                }
                return [];
            } catch (error) {
                console.error('Error fetching business types:', error);
                return []; // Return empty array instead of throwing to prevent page crash
            }
        },
        staleTime: 1000 * 60 * 60, // 1 hour
    });
};
