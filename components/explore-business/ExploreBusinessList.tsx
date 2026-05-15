"use client";

import React, { useRef, useEffect } from 'react';
import ExploreBusinessCard from './ExploreBusinessCard';
import { Business } from '@/components/business/businessData';

interface ExploreBusinessListProps {
    businesses: Business[];
    isFullWidth?: boolean;
    location?: string;
    category?: string | null;
    totalResults?: number;
    hasNextPage?: boolean;
    isFetchingNextPage?: boolean;
    onLoadMore?: () => void;
}

const ExploreBusinessList = ({
    businesses,
    isFullWidth = false,
    location,
    category,
    totalResults,
    hasNextPage,
    isFetchingNextPage,
    onLoadMore,
}: ExploreBusinessListProps) => {
    const sentinelRef = useRef<HTMLDivElement>(null);

    // IntersectionObserver - triggers onLoadMore when sentinel comes into view
    useEffect(() => {
        if (!onLoadMore) return;
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
                    onLoadMore();
                }
            },
            { threshold: 0.1 }
        );
        const el = sentinelRef.current;
        if (el) observer.observe(el);
        return () => { if (el) observer.unobserve(el); };
    }, [hasNextPage, isFetchingNextPage, onLoadMore]);

    return (
        <div className="flex flex-col gap-6">
            {/* Grid */}
            <div className={`grid grid-cols-1 md:grid-cols-2 ${isFullWidth ? 'lg:grid-cols-4' : 'lg:grid-cols-2'} gap-6 lg:gap-8`}>
                {businesses.map((business, index) => (
                    <div key={`${business.id}-${index}`}>
                        <ExploreBusinessCard business={business} index={index} />
                    </div>
                ))}
            </div>

            {/* Infinite scroll sentinel */}
            <div ref={sentinelRef} className="h-1" />

            {/* Loading indicator */}
            {isFetchingNextPage && (
                <div className="flex justify-center py-8">
                    <div className="flex items-center gap-3 text-zinc-500">
                        <div className="w-5 h-5 border-2 border-zinc-200 border-t-black rounded-full animate-spin" />
                        <span className="text-sm">Loading more...</span>
                    </div>
                </div>
            )}

            {/* End of results */}
            {!hasNextPage && businesses.length > 0 && (
                <p className="text-center text-sm text-zinc-400 py-6">
                    You've seen all {businesses.length} results
                </p>
            )}
        </div>
    );
};

export default ExploreBusinessList;
