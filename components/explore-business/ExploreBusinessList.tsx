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
            <div className={`grid grid-cols-1 ${isFullWidth ? 'xl:grid-cols-2' : ''} gap-4 sm:gap-5 lg:gap-8`}>
                {businesses.map((business, index) => (
                    <div key={`${business.id}-${index}`} className="min-w-0">
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

            {/* End of results or Crawlable Pagination Fallback */}
            {hasNextPage && (
                <div className="flex justify-center py-2">
                    <a href="?page=2" className="sr-only">Next page of listings</a>
                </div>
            )}
            {!hasNextPage && businesses.length > 0 && (
                <p className="text-center text-sm text-zinc-400 py-6">
                    You&apos;ve seen all {businesses.length} results
                </p>
            )}
        </div>
    );
};

export default ExploreBusinessList;
