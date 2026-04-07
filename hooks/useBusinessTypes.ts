import { useQuery } from '@tanstack/react-query';
import { businessApi } from '@/api/public/business';

export const useBusinessTypes = () => {
    return useQuery({
        queryKey: ['business-types'],
        queryFn: async () => {
            const response = await businessApi.getBusinessTypes();
            if (response.success) {
                return response.data;
            }
            throw new Error('Failed to fetch business types');
        },
        staleTime: 1000 * 60 * 60, // 1 hour
    });
};
