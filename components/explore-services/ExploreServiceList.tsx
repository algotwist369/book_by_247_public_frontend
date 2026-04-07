import React from 'react';
import ServiceCard from './ServiceCard';
import { Button } from '@/components/ui/Button';

interface ExploreServiceListProps {
    services: any[];
    isFullWidth?: boolean;
    location?: string;
    category?: string | null;
    totalResults?: number;
    hasNextPage?: boolean;
    isFetchingNextPage?: boolean;
    onLoadMore?: () => void;
}

const ExploreServiceList = ({
    services,
    isFullWidth,
    location,
    category,
    totalResults,
    hasNextPage,
    isFetchingNextPage,
    onLoadMore
}: ExploreServiceListProps) => {
    return (
        <section className="space-y-12">
            {/* Results Info */}
            <div className="flex items-center justify-between border-b border-zinc-100 pb-6">
                <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-zinc-900">{totalResults || 0}</span>
                    <span className="text-lg font-bold text-zinc-400 capitalize">
                        {category && category !== 'All' ? `${category}s` : 'Services'} available in {location || 'India'}
                    </span>
                </div>
                <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-zinc-50 rounded-full border border-zinc-100">
                    <div className="w-2 h-2 rounded-full bg-black animate-pulse" />
                    <span className="text-xs font-black text-black uppercase tracking-wider">Live Availability</span>
                </div>
            </div>

            {/* Grid/List */}
            <div className={`grid gap-6 sm:gap-10 ${isFullWidth ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
                {services.map((service, idx) => (
                    <ServiceCard 
                        key={service.id || idx} 
                        service={service} 
                        isFullWidth={isFullWidth}
                    />
                ))}
            </div>

            {/* Loading More */}
            {hasNextPage && (
                <div className="pt-16 pb-12 flex justify-center">
                    <Button
                        variant="outline"
                        onClick={() => onLoadMore?.()}
                        disabled={isFetchingNextPage}
                        className="h-14 px-12 rounded-[2rem] border-2 border-zinc-200 text-lg font-black hover:border-black active:scale-95 transition-all disabled:opacity-50"
                    >
                        {isFetchingNextPage ? (
                            <div className="flex items-center gap-3">
                                <div className="w-5 h-5 border-3 border-zinc-200 border-t-black rounded-full animate-spin" />
                                <span>Loading More...</span>
                            </div>
                        ) : (
                            'Load More Results'
                        )}
                    </Button>
                </div>
            )}
        </section>
    );
};

export default ExploreServiceList;
