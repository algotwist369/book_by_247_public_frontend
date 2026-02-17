"use client";

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import ExploreBusinessList from '@/components/explore-business/ExploreBusinessList';
import ExploreMap from '@/components/explore-business/ExploreMap';
import ExploreFilters from '@/components/explore-business/ExploreFilters';
import ExploreFilterModal, { FilterState } from '@/components/explore-business/ExploreFilterModal';
import { Map, List } from 'lucide-react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useSearch } from '@/hooks/useSearch';
import { useGeolocation } from '@/hooks/useGeolocation';
import { MapPin, ArrowLeft, Search, X as CloseIcon } from 'lucide-react';
import { useLocationSuggestions } from '@/hooks/useLocationSuggestions';


interface ExplorePageContentProps {
    // No props needed
}

const ExplorePageContent = () => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Initialize state from URL
    const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || "");
    const [locationQuery, setLocationQuery] = useState(searchParams.get('location') || "");

    // Committed states for actual search execution (Scale Optimization)
    const [committedSearch, setCommittedSearch] = useState(searchParams.get('q') || "");
    const [committedLocation, setCommittedLocation] = useState(searchParams.get('location') || "");

    const [selectedCategory, setSelectedCategory] = useState<string | null>(searchParams.get('category'));
    const [minRating, setMinRating] = useState<number>(Number(searchParams.get('minRating')) || 0);
    const [radius, setRadius] = useState<number>(Number(searchParams.get('radius')) || 15000);
    const [showMap, setShowMap] = useState(searchParams.get('view') === 'map');
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

    const [activeFilters, setActiveFilters] = useState<FilterState>({
        sortBy: searchParams.get('sortBy') || 'Recommended',
        priceRange: searchParams.get('priceRange') || 'Any Price',
        rating: Number(searchParams.get('rating')) || 0,
        amenities: searchParams.get('amenities')?.split(',').filter(Boolean) || [],
        gender: searchParams.get('gender') || 'Any'
    });

    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
    const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
    const { data: suggestions, isLoading: isLoadingSuggestions } = useLocationSuggestions(locationQuery, showLocationSuggestions);

    const { getPosition, latitude, longitude, isFetching: isLocating } = useGeolocation();

    // Get initial coordinates from URL
    const urlLat = searchParams.get('lat');
    const urlLng = searchParams.get('lng');

    // Effective coordinates
    const activeLat = latitude || (urlLat ? parseFloat(urlLat) : null);
    const activeLng = longitude || (urlLng ? parseFloat(urlLng) : null);

    // No longer using debounced values for the MAIN business search to prevent auto-reloading
    // Location suggestions inside SearchBar handle their own debouncing

    // Advanced search query - TRIGGERED BY COMMITTED STATE (Intent-Driven)
    const { data: searchData } = useSearch({
        q: committedSearch,
        location: committedLocation,
        category: selectedCategory === 'All' ? null : selectedCategory,
        minRating: activeFilters.rating || minRating,
        priceRange: activeFilters.priceRange === 'Any Price' ? null : activeFilters.priceRange,
        gender: activeFilters.gender === 'Any' ? null : activeFilters.gender,
        lat: activeLat,
        lng: activeLng,
        radius: activeLat && activeLng ? radius : null,
        sort: activeFilters.sortBy === 'Recommended' ? null :
            activeFilters.sortBy === 'Rating (High to Low)' ? 'rating' :
                activeFilters.sortBy === 'Price (Low to High)' ? 'price_low' : 'price_high'
    });

    const businesses = searchData?.results || [];

    // URL sync - Syncs with COMMITTED state (what the user actually sees)
    useEffect(() => {
        const params = new URLSearchParams();
        if (committedSearch) params.set('q', committedSearch);
        if (committedLocation) params.set('location', committedLocation);
        if (selectedCategory) params.set('category', selectedCategory);
        if (minRating > 0) params.set('minRating', minRating.toString());
        if (activeFilters.priceRange !== 'Any Price') params.set('priceRange', activeFilters.priceRange);
        if (activeFilters.rating > 0) params.set('rating', activeFilters.rating.toString());
        if (activeFilters.amenities.length > 0) params.set('amenities', activeFilters.amenities.join(','));
        if (activeFilters.gender !== 'Any') params.set('gender', activeFilters.gender);
        if (activeFilters.sortBy !== 'Recommended') params.set('sortBy', activeFilters.sortBy);
        if (showMap) params.set('view', 'map');
        if (radius !== 3000) params.set('radius', radius.toString());
        if (activeLat) params.set('lat', activeLat.toString());
        if (activeLng) params.set('lng', activeLng.toString());

        const queryString = params.toString();
        router.replace(`${pathname}${queryString ? `?${queryString}` : ''}`, { scroll: false });
    }, [committedSearch, committedLocation, selectedCategory, minRating, activeFilters, showMap, router, pathname, radius, activeLat, activeLng]);

    // Sync state to URL when geolocation succeeds
    useEffect(() => {
        if (latitude && longitude && (latitude.toString() !== urlLat || longitude.toString() !== urlLng)) {
            // Geolocation succeeded, update URL
            const params = new URLSearchParams(searchParams.toString());
            params.set('lat', latitude.toString());
            params.set('lng', longitude.toString());
            router.replace(`${pathname}?${params.toString()}`, { scroll: false });
        }
    }, [latitude, longitude, router, searchParams, urlLat, urlLng, pathname]);

    // Automatically ask for location if not in URL
    useEffect(() => {
        if (!urlLat || !urlLng) {
            const timer = setTimeout(() => {
                getPosition();
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [getPosition, urlLat, urlLng]);

    const handleSearch = useCallback((q?: string, loc?: string) => {
        setCommittedSearch(q !== undefined ? q : searchQuery);
        setCommittedLocation(loc !== undefined ? loc : locationQuery);
    }, [searchQuery, locationQuery]);

    const categories = useMemo(() => {
        return ['All', 'Spa', 'Salon', 'Massage', 'Wellness', 'Barber'];
    }, []);

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

            {/* Mobile-Only Header */}
            <div className="lg:hidden flex items-center justify-between px-4 py-4 border-b border-zinc-100 sticky top-0 bg-white z-[60]">
                <button
                    onClick={() => router.back()}
                    className="p-2 -ml-2 text-zinc-600 active:bg-zinc-50 rounded-full"
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>

                <div className="flex-1 mx-4 relative flex items-center">
                    <button
                        onClick={() => setIsMobileSearchOpen(true)}
                        className="w-full h-11 bg-zinc-50 rounded-xl flex items-center px-4 gap-3 text-zinc-900 border border-zinc-100 active:bg-zinc-100 transition-colors overflow-hidden"
                    >
                        <Search className="w-4 h-4 text-zinc-400 shrink-0" />
                        <span className="text-sm font-bold truncate pr-6">
                            {searchQuery || locationQuery ? (
                                <span className="flex items-center gap-1.5">
                                    {searchQuery && <span className="truncate">{searchQuery}</span>}
                                    {searchQuery && locationQuery && <span className="text-zinc-300 font-normal">in</span>}
                                    {locationQuery && <span className="text-[#008080] truncate">{locationQuery}</span>}
                                </span>
                            ) : (
                                <span className="text-zinc-400 font-medium">Explore Business</span>
                            )}
                        </span>
                    </button>
                    {(searchQuery || locationQuery) && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleSearch('', '');
                                setSearchQuery('');
                                setLocationQuery('');
                            }}
                            className="absolute right-3 p-1 text-zinc-400 hover:text-zinc-600 active:bg-zinc-200 rounded-full bg-zinc-100/50"
                        >
                            <CloseIcon className="w-3.5 h-3.5" />
                        </button>
                    )}
                </div>

                <button
                    onClick={() => setIsFilterModalOpen(true)}
                    className="p-2 -mr-2 text-zinc-600 active:bg-zinc-50 rounded-full"
                >
                    <List className="w-6 h-6" />
                </button>
            </div>

            {/* Mobile Search Overlay */}
            {isMobileSearchOpen && (
                <div className="fixed inset-0 bg-white z-[100] flex flex-col p-4">
                    <div className="flex items-center gap-4 mb-6">
                        <button
                            onClick={() => setIsMobileSearchOpen(false)}
                            className="p-2 -ml-2 text-zinc-600"
                        >
                            <ArrowLeft className="w-6 h-6" />
                        </button>
                        <h2 className="text-xl font-bold">Search Businesses</h2>
                        <button
                            onClick={() => setIsMobileSearchOpen(false)}
                            className="ml-auto p-2"
                        >
                            <CloseIcon className="w-6 h-6 text-zinc-400" />
                        </button>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Search Query</label>
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                                <input
                                    autoFocus
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Salon, Spa, Massage..."
                                    className="w-full h-14 bg-zinc-50 border border-zinc-100 rounded-2xl pl-12 pr-12 text-zinc-900 focus:outline-none focus:border-[#008080]/30"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            handleSearch(searchQuery, locationQuery);
                                            setIsMobileSearchOpen(false);
                                        }
                                    }}
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery('')}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 text-zinc-400"
                                    >
                                        <CloseIcon className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2 relative">
                            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Location</label>
                            <div className="relative">
                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                                <input
                                    type="text"
                                    value={locationQuery}
                                    onChange={(e) => {
                                        setLocationQuery(e.target.value);
                                        setShowLocationSuggestions(true);
                                    }}
                                    onFocus={() => setShowLocationSuggestions(true)}
                                    placeholder="City or Area"
                                    className="w-full h-14 bg-zinc-50 border border-zinc-100 rounded-2xl pl-12 pr-12 text-zinc-900 focus:outline-none focus:border-[#008080]/30"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            setShowLocationSuggestions(false);
                                            handleSearch(searchQuery, locationQuery);
                                            setIsMobileSearchOpen(false);
                                        }
                                    }}
                                />
                                {locationQuery && (
                                    <button
                                        onClick={() => setLocationQuery('')}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 text-zinc-400"
                                    >
                                        <CloseIcon className="w-4 h-4" />
                                    </button>
                                )}
                            </div>

                            {/* Suggestions Dropdown */}
                            {showLocationSuggestions && (suggestions?.length > 0 || isLoadingSuggestions) && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-zinc-100 rounded-2xl z-50 overflow-hidden min-h-[50px] max-h-[300px] overflow-y-auto">
                                    {isLoadingSuggestions ? (
                                        <div className="p-4 text-sm text-zinc-400 flex items-center gap-2">
                                            <div className="w-4 h-4 border-2 border-zinc-200 border-t-[#008080] rounded-full animate-spin" />
                                            <span>Searching...</span>
                                        </div>
                                    ) : (
                                        suggestions.map((s: any) => (
                                            <button
                                                key={s.id}
                                                onClick={() => {
                                                    setLocationQuery(s.description);
                                                    setShowLocationSuggestions(false);
                                                    handleSearch(searchQuery, s.description);
                                                    setIsMobileSearchOpen(false);
                                                }}
                                                className="w-full p-4 flex items-center gap-3 hover:bg-zinc-50 border-b border-zinc-50 last:border-none text-left active:bg-zinc-100 transition-colors"
                                            >
                                                <MapPin className="w-4 h-4 text-zinc-400 shrink-0" />
                                                <div className="min-w-0">
                                                    <p className="text-sm font-bold text-zinc-900 truncate">{s.mainText}</p>
                                                    <p className="text-xs text-zinc-500 truncate">{s.secondaryText}</p>
                                                </div>
                                            </button>
                                        ))
                                    )}
                                </div>
                            )}
                        </div>

                        <button
                            onClick={() => {
                                handleSearch(searchQuery, locationQuery);
                                setIsMobileSearchOpen(false);
                            }}
                            className="w-full h-14 bg-zinc-900 text-white rounded-2xl font-bold text-lg"
                        >
                            Search
                        </button>
                    </div>
                </div>
            )}

            {/* Split Layout Container */}
            <div className="flex flex-col lg:flex-row relative">
                {/* Left Side: Content & List */}
                <div className={`w-full transition-all duration-500 ease-in-out ${showMap ? 'lg:w-[55%]' : 'lg:w-full'} px-4 sm:px-8 md:px-12 py-4 lg:py-16`}>
                    <div className={`${showMap ? 'max-w-4xl' : 'max-w-[1600px]'} mx-auto transition-all duration-500`}>
                        {/* Header & Toggle Section */}
                        <div className="flex items-center justify-between mb-0 lg:mb-10">
                            <div className="hidden lg:block">
                                <div className="flex items-center gap-3">
                                    <h1 className="text-3xl font-black text-zinc-900 tracking-tight">Explore Wellness</h1>
                                    {(activeLat && activeLng) && (
                                        <div className="flex items-center gap-1.5 px-3 py-1 bg-[#008080]/10 text-[#008080] rounded-full text-[10px] font-bold">
                                            <MapPin className="w-3 h-3" />
                                            <span>NEARBY</span>
                                        </div>
                                    )}
                                </div>
                                <p className="text-zinc-500 text-sm font-medium">Find your perfect spa or salon experience</p>
                            </div>

                            <button
                                onClick={() => setShowMap(!showMap)}
                                className="hidden lg:flex items-center gap-2 bg-zinc-900 text-white px-5 py-2.5 rounded-2xl hover:bg-zinc-800 transition-all active:scale-95 shadow-lg shadow-zinc-900/10"
                            >
                                {showMap ? (
                                    <>
                                        <List className="w-4 h-4" />
                                        <span className="text-xs font-bold uppercase tracking-wider">Hide Map</span>
                                    </>
                                ) : (
                                    <>
                                        <Map className="w-4 h-4" />
                                        <span className="text-xs font-bold uppercase tracking-wider">Show Map</span>
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Filters & Search */}
                        <ExploreFilters
                            categories={categories}
                            selectedCategory={selectedCategory}
                            onSelectCategory={(cat) => {
                                setSelectedCategory(cat);
                                setCommittedSearch(searchQuery);
                                setCommittedLocation(locationQuery);
                            }}
                            minRating={minRating}
                            onSelectRating={(rate) => {
                                setMinRating(rate);
                                setCommittedSearch(searchQuery);
                                setCommittedLocation(locationQuery);
                            }}
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

                        {/* Results List */}
                        {/* Results List */}
                        {searchData ? (
                            <>
                                <ExploreBusinessList
                                    businesses={businesses}
                                    isFullWidth={!showMap}
                                    location={committedLocation}
                                    category={selectedCategory}
                                />

                                {businesses.length === 0 && (
                                    <div className="py-24 text-center border-2 border-dashed border-zinc-100 rounded-[2rem]">
                                        <h3 className="text-xl font-bold text-zinc-400">No matches for your search</h3>
                                        <button
                                            onClick={() => {
                                                setSearchQuery('');
                                                setSelectedCategory(null);
                                                setMinRating(0);
                                                setActiveFilters({
                                                    sortBy: 'Recommended',
                                                    priceRange: 'Any Price',
                                                    rating: 0,
                                                    amenities: [],
                                                    gender: 'Any'
                                                });
                                            }}
                                            className="text-sm font-bold text-[#008080] uppercase tracking-wider underline underline-offset-8 mt-4"
                                        >
                                            Clear all filters
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="py-24 text-center">
                                <h3 className="text-xl font-bold text-zinc-400">No businesses currently available</h3>
                                <p className="text-zinc-500 mt-2">Please check back later or try refreshing the page.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Filter Modal */}
                <ExploreFilterModal
                    isOpen={isFilterModalOpen}
                    onClose={() => setIsFilterModalOpen(false)}
                    currentFilters={activeFilters}
                    onApply={(newFilters) => {
                        setActiveFilters(newFilters);
                        setCommittedSearch(searchQuery);
                        setCommittedLocation(locationQuery);
                        setIsFilterModalOpen(false);
                    }}
                />

                {/* Right Side: Sticky Map */}
                {showMap && (
                    <div className="hidden lg:block lg:w-[45%] pr-8 py-12">
                        <ExploreMap businesses={businesses} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExplorePageContent;
