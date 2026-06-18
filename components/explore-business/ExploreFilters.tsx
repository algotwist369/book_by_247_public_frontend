"use client";

import React from 'react';
import { Filter, ChevronDown } from 'lucide-react';

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
    sortBy?: string;
    onSortChange?: (sortBy: string) => void;
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
    isNearby = false,
    sortBy,
    onSortChange
}: ExploreFiltersProps) => {
    return (
        <div className="flex flex-col gap-4 lg:gap-6 mb-6 lg:mb-10 w-full">
            {/* Quick Filter Pills */}
            <div className="flex items-center gap-2 lg:gap-3 overflow-x-auto no-scrollbar pb-2 -mx-4 lg:mx-0 lg:px-0 lg:flex-wrap relative w-full">
                {/* Filters Icon Button */}
                <div className="sticky left-0 z-20 bg-white pl-2 pr-2 lg:ml-0 lg:pl-0 lg:pr-0 lg:bg-transparent lg:relative lg:left-auto lg:z-0">
                    <button
                        onClick={onOpenFilters}
                        className="flex items-center gap-1.5 h-9 lg:h-11 px-3.5 lg:px-5 bg-white border border-zinc-200 hover:border-zinc-300 text-zinc-700 rounded-full font-bold text-xs lg:text-sm whitespace-nowrap transition-colors flex-shrink-0"
                    >
                        <Filter className="w-3.5 h-3.5" />
                        <span>Filters</span>
                    </button>
                </div>

                <div className="flex items-center gap-2 lg:gap-3">
                    {categories.map((category) => {
                        const isSelected = selectedCategory === category || (!selectedCategory && category === 'All');
                        return (
                            <button
                                key={category}
                                onClick={() => onSelectCategory(category === 'All' ? null : category)}
                                className={`h-9 lg:h-11 px-4 lg:px-6 rounded-full font-bold text-xs lg:text-sm whitespace-nowrap border transition-colors flex-shrink-0 ${
                                    isSelected
                                        ? 'bg-zinc-950 text-white border-zinc-950'
                                        : 'bg-white text-zinc-700 border-zinc-200 hover:border-zinc-300'
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
                            <div className="flex items-center gap-2">
                                {[1000, 5000, 15000, 25000, 50000].map((r) => (
                                    <button
                                        key={r}
                                        onClick={() => onRadiusChange?.(r)}
                                        className={`h-9 lg:h-11 px-3 lg:px-4 rounded-full font-bold text-xs lg:text-sm transition-colors border flex-shrink-0 ${
                                            radius === r
                                                ? 'bg-zinc-950 text-white border-zinc-950'
                                                : 'bg-white text-zinc-700 border-zinc-200 hover:border-zinc-300'
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
                            className="h-9 lg:h-11 px-4 lg:px-6 rounded-full font-bold text-xs lg:text-sm bg-white text-zinc-700 border border-zinc-200 hover:border-zinc-300 transition-colors flex items-center gap-2 flex-shrink-0"
                        >
                            <span>More Filters</span>
                            <ChevronDown className="w-3.5 h-3.5 lg:w-4 h-4 text-zinc-400" />
                        </button>
                    )}
                </div>

                {/* Sort By Dropdown (Desktop Only) */}
                {sortBy && onSortChange && (
                    <div className="ml-auto hidden lg:flex items-center gap-2">
                        <span className="text-xs text-zinc-400 font-bold uppercase tracking-wider whitespace-nowrap">Sort by</span>
                        <div className="relative">
                            <select
                                value={sortBy}
                                onChange={(e) => onSortChange(e.target.value)}
                                className="appearance-none h-11 pl-5 pr-10 bg-white border border-zinc-200 hover:border-zinc-300 rounded-full font-bold text-sm text-zinc-700 focus:outline-none cursor-pointer"
                            >
                                <option value="Recommended">Recommended</option>
                                <option value="Rating (High to Low)">Highest Rated</option>
                                <option value="Price (Low to High)">Price (Low to High)</option>
                                <option value="Price (High to Low)">Price (High to Low)</option>
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
export default ExploreFilters;
