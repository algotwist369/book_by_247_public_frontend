"use client";

import React, { useState, useMemo } from 'react';
import ExploreBusinessList from '@/components/explore-business/ExploreBusinessList';
import ExploreFilters from '@/components/explore-business/ExploreFilters';
import { useSeoBusinesses } from '@/hooks/useSeo';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Search, MapPin } from 'lucide-react';
import Link from 'next/link';

interface SeoSearchContentProps {
    params: any;
    initialData: any;
    slug: string[];
}

const SeoSearchContent = ({ params, initialData, slug }: SeoSearchContentProps) => {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [locationQuery, setLocationQuery] = useState(params.city || "");

    const { data: seoData, isLoading } = useSeoBusinesses(params, initialData);

    const businesses = seoData?.businesses || [];
    const totalResults = seoData?.total || 0;

    const categories = useMemo(() => {
        return ['All', 'Spa', 'Salon', 'Massage', 'Wellness', 'Barber'];
    }, []);

    const handleSearch = (q?: string, loc?: string) => {
        // Redirect to standard explore if user modifies search manually
        const searchParams = new URLSearchParams();
        if (q || searchQuery) searchParams.set('q', q || searchQuery);
        if (loc || locationQuery) searchParams.set('location', loc || locationQuery);
        router.push(`/explore?${searchParams.toString()}`);
    };

    return (
        <div className="bg-white min-h-screen">
            {/* CSS to hide global navbar on mobile */}
            <style jsx global>{`
                @media (max-width: 1024px) {
                    nav.sticky.top-0 {
                        display: none !important;
                    }
                }
            `}</style>

            {/* SEO Page Header */}
            <header className="border-b border-zinc-100 bg-white sticky top-0 z-50">
                <div className="max-w-[1600px] mx-auto px-4 sm:px-8 py-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Link href="/explore" className="p-2 hover:bg-zinc-50 rounded-full transition-colors">
                            <ArrowLeft className="w-6 h-6 text-zinc-900" />
                        </Link>
                        <div>
                            <h1 className="text-xl md:text-2xl font-black text-zinc-900 tracking-tight capitalize">
                                {params.service || params.type || "Wellness Services"} 
                                {params.city ? ` in ${params.city}` : ""}
                            </h1>
                            <div className="flex items-center gap-2 text-zinc-500 text-xs md:text-sm font-medium">
                                <MapPin className="w-3 h-3" />
                                <span>{params.area ? `${params.area}, ` : ""}{params.city || "All India"}</span>
                                <span className="w-1 h-1 rounded-full bg-zinc-300 mx-1" />
                                <span>{totalResults} results found</span>
                            </div>
                        </div>
                    </div>

                    <div className="hidden md:block">
                        <div className="flex items-center gap-2 bg-zinc-50 px-4 py-2 rounded-xl border border-zinc-100 italic text-zinc-500 text-sm">
                            <Search className="w-4 h-4" />
                            <span>Looking for something else? Try searching...</span>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-[1600px] mx-auto px-4 sm:px-8 py-8 md:py-12">
                <div className="grid grid-cols-1 gap-8">
                    {/* Filters Section */}
                    <ExploreFilters
                        categories={categories}
                        selectedCategory={params.service === 'spa' ? 'Spa' : params.service === 'salon' ? 'Salon' : null}
                        onSelectCategory={(cat) => handleSearch(cat || "", locationQuery)}
                        minRating={0}
                        onSelectRating={() => {}}
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                        locationQuery={locationQuery}
                        onLocationChange={setLocationQuery}
                        onSearch={handleSearch}
                        onOpenFilters={() => {}}
                    />

                    {/* Results Count & SEO Description */}
                    <div className="space-y-4">
                        <div className="bg-black/5 p-6 rounded-3xl border border-black/10">
                            <h2 className="text-lg font-bold text-zinc-900 mb-2">
                                Top Rated {params.service || params.type || "Wellness Centers"} in {params.city || "your location"}
                            </h2>
                            <p className="text-zinc-600 text-sm leading-relaxed max-w-4xl">
                                Looking for the best {params.service || "spa and salon services"}? We've curated a list of top-rated businesses 
                                in {params.city} to help you find the perfect pampering session. Whether you need a relaxing massage, 
                                a trendy haircut, or professional skincare, Bookby247 connect you with verified experts.
                            </p>
                        </div>

                        {/* List Section */}
                        {isLoading ? (
                            <div className="py-24 flex flex-col items-center justify-center gap-4">
                                <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin" />
                                <p className="text-zinc-500 font-medium">Fetching best results for you...</p>
                            </div>
                        ) : (
                            <ExploreBusinessList
                                businesses={businesses}
                                isFullWidth={true}
                                location={params.city}
                                category={params.service}
                                totalResults={totalResults}
                            />
                        )}

                        {/* Empty State */}
                        {!isLoading && businesses.length === 0 && (
                            <div className="py-24 text-center border-2 border-dashed border-zinc-100 rounded-[2rem]">
                                <h3 className="text-xl font-bold text-zinc-400">No specific matches for this SEO landing page</h3>
                                <Link href="/explore">
                                    <button className="text-sm font-bold text-black uppercase tracking-wider underline underline-offset-8 mt-4">
                                        Explore all businesses
                                    </button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default SeoSearchContent;
