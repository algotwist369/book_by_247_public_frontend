"use client";

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import ExploreBusinessList from '@/components/explore-business/ExploreBusinessList';
import ExploreMap from '@/components/explore-business/ExploreMap';
import ExploreFilters from '@/components/explore-business/ExploreFilters';
import ExploreFilterModal, { FilterState } from '@/components/explore-business/ExploreFilterModal';
import { Map, List, ArrowLeft, Search, X as CloseIcon, MapPin } from 'lucide-react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useInfiniteSearch } from '@/hooks/useInfiniteSearch';
import { useInfiniteServices } from '@/hooks/useInfiniteServices';
import { useBusinessTypes } from '@/hooks/useBusinessTypes';
import { useServiceMetadata } from '@/hooks/useServices';
import ExploreServiceList from '@/components/explore-services/ExploreServiceList';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useLocationSuggestions } from '@/hooks/useLocationSuggestions';

interface SeoListingViewProps {
    initialCity?: string;
    initialArea?: string;
    initialCategory?: string;
    initialNearMe?: string;
    isTop10?: boolean;
    viewType?: 'business' | 'service';
    title?: string;
    subtitle?: string;
}

const SeoListingView = ({
    initialCity,
    initialArea,
    initialCategory,
    initialNearMe,
    isTop10 = false,
    viewType = 'business',
    title,
    subtitle
}: SeoListingViewProps) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const DEFAULT_RADIUS = 15000;

    // Derived location string from props
    const propLocation = useMemo(() => {
        if (initialArea && initialCity) return `${initialArea}, ${initialCity}`;
        return initialCity || "";
    }, [initialArea, initialCity]);

    // Initialize state from URL or Props
    const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || "");
    const [locationQuery, setLocationQuery] = useState(searchParams.get('location') || propLocation);

    // Committed states for actual search execution
    const [committedSearch, setCommittedSearch] = useState(searchParams.get('q') || "");
    const [committedLocation, setCommittedLocation] = useState(searchParams.get('location') || propLocation);

    const [selectedCategory, setSelectedCategory] = useState<string | null>(searchParams.get('category') || initialCategory || "All");
    const [minRating, setMinRating] = useState<number>(Number(searchParams.get('minRating')) || (isTop10 ? 4 : 0));
    const [radius, setRadius] = useState<number>(Number(searchParams.get('radius')) || DEFAULT_RADIUS);
    const [showMap, setShowMap] = useState(searchParams.get('view') === 'map');
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

    const [activeFilters, setActiveFilters] = useState<FilterState>({
        sortBy: searchParams.get('sortBy') || (isTop10 ? 'Rating (High to Low)' : 'Recommended'),
        priceRange: searchParams.get('priceRange') || 'Any Price',
        rating: Number(searchParams.get('rating')) || (isTop10 ? 4 : 0),
        amenities: searchParams.get('amenities')?.split(',').filter(Boolean) || [],
        gender: searchParams.get('gender') || 'Any'
    });

    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
    const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
    const { data: suggestions, isLoading: isLoadingSuggestions } = useLocationSuggestions(locationQuery, showLocationSuggestions);

    const { getPosition, latitude, longitude, isFetching: isLocating } = useGeolocation();

    useEffect(() => {
        if (initialNearMe && !latitude && !longitude) {
            getPosition();
        }
    }, [initialNearMe, latitude, longitude, getPosition]);

    const urlLat = searchParams.get('lat');
    const urlLng = searchParams.get('lng');

    const activeLat = latitude || (urlLat ? parseFloat(urlLat) : null);
    const activeLng = longitude || (urlLng ? parseFloat(urlLng) : null);

    // Construct filters for the infinite query
    const searchFilters = useMemo(() => ({
        q: committedSearch,
        location: committedLocation,
        category: selectedCategory === 'All' ? null : selectedCategory,
        minRating: activeFilters.rating || minRating,
        priceRange: activeFilters.priceRange === 'Any Price' ? null : activeFilters.priceRange,
        gender: activeFilters.gender === 'Any' ? null : activeFilters.gender,
        lat: activeLat,
        lng: activeLng,
        radius: activeLat && activeLng ? radius : null,
        citySlug: initialCity?.toLowerCase(),
        areaSlug: initialArea?.toLowerCase(),
        nearMeSlug: initialNearMe,
        sort: activeFilters.sortBy === 'Recommended' ? (isTop10 ? 'rating' : null) :
            activeFilters.sortBy === 'Rating (High to Low)' ? 'rating' :
                activeFilters.sortBy === 'Price (Low to High)' ? 'price_low' : 'price_high',
        limit: isTop10 ? 10 : 20
    }), [committedSearch, committedLocation, selectedCategory, activeFilters, minRating, activeLat, activeLng, radius, initialCity, initialArea, initialNearMe, isTop10]);

    const {
        data: infiniteBusinessData,
        hasNextPage: hasNextBusinessPage,
        isFetchingNextPage: isFetchingNextBusinessPage,
        fetchNextPage: fetchNextBusinessPage,
    } = useInfiniteSearch(searchFilters);

    const {
        data: infiniteServiceData,
        hasNextPage: hasNextServicePage,
        isFetchingNextPage: isFetchingNextServicePage,
        fetchNextPage: fetchNextServicePage,
    } = useInfiniteServices(searchFilters);

    const isServiceView = viewType === 'service';
    
    const infiniteData = isServiceView ? infiniteServiceData : infiniteBusinessData;
    const hasNextPage = isServiceView ? hasNextServicePage : hasNextBusinessPage;
    const isFetchingNextPage = isServiceView ? isFetchingNextServicePage : isFetchingNextBusinessPage;
    const fetchNextPage = isServiceView ? fetchNextServicePage : fetchNextBusinessPage;

    const businesses = !isServiceView ? infiniteData?.pages.flatMap(p => p.results) ?? [] : [];
    const services = isServiceView ? infiniteData?.pages.flatMap(p => p.results) ?? [] : [];
    const totalResults = infiniteData?.pages[0]?.totalResults;

    // Sync URL
    useEffect(() => {
        const params = new URLSearchParams();
        if (committedSearch) params.set('q', committedSearch);
        if (committedLocation && committedLocation !== propLocation) params.set('location', committedLocation);
        if (selectedCategory && selectedCategory !== initialCategory) params.set('category', selectedCategory);
        if (minRating > 0 && !(isTop10 && minRating === 4)) params.set('minRating', minRating.toString());
        if (activeFilters.priceRange !== 'Any Price') params.set('priceRange', activeFilters.priceRange);
        if (activeFilters.rating > 0 && !(isTop10 && activeFilters.rating === 4)) params.set('rating', activeFilters.rating.toString());
        if (activeFilters.amenities.length > 0) params.set('amenities', activeFilters.amenities.join(','));
        if (activeFilters.gender !== 'Any') params.set('gender', activeFilters.gender);
        if (activeFilters.sortBy !== (isTop10 ? 'Rating (High to Low)' : 'Recommended')) params.set('sortBy', activeFilters.sortBy);
        if (showMap) params.set('view', 'map');

        if (activeLat && activeLng) {
            if (radius !== DEFAULT_RADIUS) params.set('radius', radius.toString());
            params.set('lat', activeLat.toString());
            params.set('lng', activeLng.toString());
        }

        const queryString = params.toString();
        // Skip updating URL if it matches the current path exactly (to avoid unnecessary history entries)
        const newUrl = `${pathname}${queryString ? `?${queryString}` : ''}`;
        if (newUrl !== window.location.pathname + window.location.search) {
            router.replace(newUrl, { scroll: false });
        }
    }, [committedSearch, committedLocation, selectedCategory, minRating, activeFilters, showMap, router, pathname, radius, activeLat, activeLng, propLocation, initialCategory, isTop10]);

    const handleSearch = useCallback((q?: string, loc?: string) => {
        setCommittedSearch(q !== undefined ? q : searchQuery);
        setCommittedLocation(loc !== undefined ? loc : locationQuery);
    }, [searchQuery, locationQuery]);

    const { data: businessTypes } = useBusinessTypes();
    const { data: serviceMetadata } = useServiceMetadata();

    const categories = useMemo(() => {
        if (isServiceView) {
            const types = serviceMetadata?.data?.categories?.map(c => c.name) || [];
            return ['All', ...types];
        }
        const types = businessTypes?.map(t => t.name) || [];
        return ['All', ...types];
    }, [businessTypes, serviceMetadata, isServiceView]);

    // Page Display logic
    const displayTitle = title || (isTop10 ? `Top 10 ${initialCategory || "Wellness Centers"}` : `Best ${initialCategory || "Wellness Centers"}`);
    const displaySubtitle = subtitle || `Find the most trusted ${initialCategory?.toLowerCase() || "wellness experiences"} in ${initialArea || initialCity || "your area"}`;

    return (
        <div className="bg-white min-h-screen">
            {/* Mobile-Only Header */}
            <div className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-zinc-100 sticky top-0 bg-white z-[60]">
                <button onClick={() => router.back()} className="p-2 -ml-2 text-zinc-600 active:bg-zinc-50 rounded-full">
                    <ArrowLeft className="w-6 h-6" />
                </button>

                <div className="flex-1 mx-4 relative flex items-center">
                    <button onClick={() => setIsMobileSearchOpen(true)} className="w-full h-11 bg-zinc-50 rounded-xl flex items-center px-4 gap-3 text-zinc-900 border border-zinc-100 active:bg-zinc-100 transition-colors overflow-hidden text-left">
                        <Search className="w-4 h-4 text-zinc-400 shrink-0" />
                        <span className="text-sm font-bold truncate pr-6">
                            {searchQuery || locationQuery ? (
                                <span className="flex items-center gap-1.5">
                                    {searchQuery && <span className="truncate">{searchQuery}</span>}
                                    {searchQuery && locationQuery && <span className="text-zinc-300 font-normal">in</span>}
                                    {locationQuery && <span className="text-black truncate">{locationQuery}</span>}
                                </span>
                            ) : (
                                <span className="text-zinc-400 font-medium">Search for anything...</span>
                            )}
                        </span>
                    </button>
                    {(searchQuery || locationQuery) && (
                        <button onClick={(e) => { e.stopPropagation(); handleSearch('', ''); setSearchQuery(''); setLocationQuery(''); }} className="absolute right-3 p-1 text-zinc-400 hover:text-zinc-600 active:bg-zinc-200 rounded-full bg-zinc-100/50">
                            <CloseIcon className="w-3.5 h-3.5" />
                        </button>
                    )}
                </div>

                <button onClick={() => setIsFilterModalOpen(true)} className="p-2 -mr-2 text-zinc-600 active:bg-zinc-50 rounded-full">
                    <List className="w-6 h-6" />
                </button>
            </div>

            {/* Split Layout Container */}
            <div className="flex flex-col lg:flex-row relative">
                <div className={`w-full transition-all duration-500 ease-in-out ${showMap ? 'lg:w-[55%]' : 'lg:w-full'} px-4 sm:px-8 md:px-12 py-4 lg:py-16`}>
                    <div className={`${showMap ? 'max-w-4xl' : 'max-w-[1600px]'} mx-auto transition-all duration-500`}>
                        {/* Header & Toggle Section */}
                        <div className="flex items-center justify-between mb-0 lg:mb-10">
                            <div className="hidden lg:block">
                                <h1 className="text-4xl font-black text-zinc-900 tracking-tight leading-tight">
                                    {displayTitle}
                                    {initialCity && <span className="text-zinc-400"> in {initialCity}</span>}
                                </h1>
                                <p className="text-zinc-500 text-lg font-medium mt-2">{displaySubtitle}</p>
                            </div>

                            <button onClick={() => setShowMap(!showMap)} className="hidden lg:flex items-center gap-2 bg-zinc-900 text-white px-5 py-2.5 rounded-2xl hover:bg-zinc-800 transition-all active:scale-95 shadow-lg shadow-zinc-900/10">
                                {showMap ? <><List className="w-4 h-4" /><span className="text-xs font-bold uppercase tracking-wider">Hide Map</span></> : <><Map className="w-4 h-4" /><span className="text-xs font-bold uppercase tracking-wider">Show Map</span></>}
                            </button>
                        </div>

                        {/* Filters & Search */}
                        <div className="sticky top-0 lg:top-0 z-30 bg-white pb-2 -mx-4 px-4 lg:-mx-0 lg:px-0">
                            <ExploreFilters
                                categories={categories}
                                selectedCategory={selectedCategory}
                                onSelectCategory={(cat) => { setSelectedCategory(cat); handleSearch(); }}
                                minRating={minRating}
                                onSelectRating={(rate) => { setMinRating(rate); handleSearch(); }}
                                searchQuery={searchQuery}
                                onSearchChange={setSearchQuery}
                                locationQuery={locationQuery}
                                onLocationChange={setLocationQuery}
                                onSearch={handleSearch}
                                onOpenFilters={() => setIsFilterModalOpen(true)}
                                radius={radius}
                                onRadiusChange={setRadius}
                                isNearby={!!(activeLat && activeLng)}
                            />
                        </div>

                        {/* Results List */}
                        {infiniteData ? (
                            <>
                                {!isServiceView ? (
                                    <ExploreBusinessList
                                        businesses={businesses}
                                        isFullWidth={!showMap}
                                        location={committedLocation}
                                        category={selectedCategory}
                                        totalResults={totalResults}
                                        hasNextPage={hasNextPage}
                                        isFetchingNextPage={isFetchingNextPage}
                                        onLoadMore={fetchNextPage}
                                    />
                                ) : (
                                    <ExploreServiceList
                                        services={services}
                                        isFullWidth={!showMap}
                                        location={committedLocation}
                                        category={selectedCategory}
                                        totalResults={totalResults}
                                        hasNextPage={hasNextPage}
                                        isFetchingNextPage={isFetchingNextPage}
                                        onLoadMore={fetchNextPage}
                                    />
                                )}
                                {(isServiceView ? services.length === 0 : businesses.length === 0) && (
                                    <div className="py-24 text-center border-2 border-dashed border-zinc-100 rounded-[2rem]">
                                        <h3 className="text-xl font-bold text-zinc-400">No matches found for this area</h3>
                                        <button onClick={() => { setSearchQuery(''); setSelectedCategory('All'); setMinRating(0); setActiveFilters({ sortBy: 'Recommended', priceRange: 'Any Price', rating: 0, amenities: [], gender: 'Any' }); handleSearch('', ''); }} className="text-sm font-bold text-black uppercase tracking-wider underline underline-offset-8 mt-4">Clear all filters</button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="py-24 text-center"><h3 className="text-xl font-bold text-zinc-400">Loading {isServiceView ? 'services' : 'businesses'}...</h3></div>
                        )}
                    </div>
                </div>

                <ExploreFilterModal isOpen={isFilterModalOpen} onClose={() => setIsFilterModalOpen(false)} currentFilters={activeFilters} onApply={(newFilters) => { setActiveFilters(newFilters); handleSearch(); setIsFilterModalOpen(false); }} />

                {showMap && <div className="hidden lg:block lg:w-[45%] pr-8 py-12 sticky top-0 h-screen"><ExploreMap businesses={businesses} /></div>}
            </div>
        </div>
    );
};

export default SeoListingView;
