"use client";

import React from 'react';
import { Filter, ChevronDown } from 'lucide-react';
import { SearchBar } from '../ui/SearchBar';

interface ExploreFiltersProps {
    categories: string[];
    selectedCategory: string | null;
    onSelectCategory: (category: string | null) => void;
    minRating: number;
    onSelectRating: (rating: number) => void;
    searchQuery: string;
    onSearchChange: (value: string) => void;
    locationQuery: string;
    onLocationChange: (value: string) => void;
    onSearch: (q?: string, loc?: string) => void;
    onOpenFilters: () => void;
    radius?: number;
    onRadiusChange?: (radius: number) => void;
    isNearby?: boolean;
}

const ExploreFilters = ({
    categories,
    selectedCategory,
    onSelectCategory,
    minRating,
    onSelectRating,
    searchQuery,
    onSearchChange,
    locationQuery,
    onLocationChange,
    onSearch,
    onOpenFilters,
    radius = 15000,
    onRadiusChange,
    isNearby = false
}: ExploreFiltersProps) => {
    return (
        <div className="flex flex-col gap-4 lg:gap-6 mb-6 lg:mb-10">
            {/* Standardized Search Bar (Hidden on Mobile, handled by custom header) */}
            <div className="hidden lg:flex justify-start pb-2 md:pb-4">
                <SearchBar
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    locationValue={locationQuery}
                    onLocationChange={onLocationChange}
                    onSearch={onSearch}
                    isCompact
                />
            </div>

            {/* Quick Filter Pills */}
            <div className="flex items-center gap-2 lg:gap-3 overflow-x-auto no-scrollbar pb-2 -mx-4 lg:mx-0 lg:px-0 lg:flex-wrap relative">
                {/* Fixed Filter Icon on Mobile - Stuck to the Left */}
                <div className="sticky left-0 z-20 bg-white pl-2 pr-2 lg:ml-0 lg:pl-0 lg:pr-0 lg:bg-transparent lg:relative lg:left-auto lg:z-0">
                    <div className="p-2.5 lg:p-3 bg-zinc-900 text-white rounded-xl flex-shrink-0">
                        <Filter className="w-3.5 h-3.5 lg:w-4 h-4" />
                    </div>
                </div>

                <div className="flex items-center gap-2 lg:gap-3">
                    {categories.map((category) => {
                        const isSelected = selectedCategory === category || (!selectedCategory && category === 'All');
                        return (
                            <button
                                key={category}
                                onClick={() => onSelectCategory(category === 'All' ? null : category)}
                                className={`h-9 lg:h-11 px-4 lg:px-6 rounded-xl font-bold text-xs lg:text-sm whitespace-nowrap border-2 transition-colors flex-shrink-0 ${isSelected
                                    ? 'bg-[#008080]/5 text-[#008080] border-[#008080]/20'
                                    : 'bg-white text-zinc-500 border-zinc-100'
                                    }`}
                            >
                                {category}
                            </button>
                        );
                    })}
                </div>

                <div className="h-5 lg:h-6 w-[1px] bg-zinc-100 mx-1 lg:mx-2 flex-shrink-0" />

                <div className="flex items-center gap-2 lg:gap-3">
                    {isNearby && (
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] lg:text-xs font-bold text-zinc-400 uppercase tracking-wider ml-1 lg:ml-2 whitespace-nowrap">Radius:</span>
                            {/* Scrollable radius options on mobile */}
                            <div className="flex items-center gap-2">
                                {[1000, 5000, 15000, 25000, 50000].map((r) => (
                                    <button
                                        key={r}
                                        onClick={() => onRadiusChange?.(r)}
                                        className={`h-9 lg:h-11 px-3 lg:px-4 rounded-xl font-bold text-xs lg:text-sm transition-colors border-2 flex-shrink-0 ${radius === r
                                            ? 'bg-[#008080] text-white border-[#008080]'
                                            : 'bg-white text-zinc-500 border-zinc-100'
                                            }`}
                                    >
                                        {r >= 1000 ? `${r / 1000}km` : `${r}m`}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {!isNearby && (
                        <button
                            onClick={onOpenFilters}
                            className="h-9 lg:h-11 px-4 lg:px-6 rounded-xl font-bold text-xs lg:text-sm bg-white text-zinc-900 border-2 border-zinc-100 transition-colors flex items-center gap-2 flex-shrink-0"
                        >
                            <span>Quick Filters</span>
                            <ChevronDown className="w-3.5 h-3.5 lg:w-4 h-4 text-zinc-400" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ExploreFilters;
