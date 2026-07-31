"use client";

import React from 'react';
import { Filter, ChevronDown, Scissors, Sparkles, HeartHandshake } from 'lucide-react';

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

const DEFAULT_CATEGORIES = ['All', 'Salon', 'Spa', 'Massage'];

const getCategoryIcon = (categoryName: string) => {
    const lower = categoryName.toLowerCase();
    if (lower.includes('salon')) return <Scissors className="w-3.5 h-3.5 text-zinc-600 shrink-0" />;
    if (lower.includes('spa')) return <Sparkles className="w-3.5 h-3.5 text-zinc-600 shrink-0" />;
    if (lower.includes('massage')) return <HeartHandshake className="w-3.5 h-3.5 text-zinc-600 shrink-0" />;
    return null;
};

const ExploreFilters = ({
    categories = DEFAULT_CATEGORIES,
    selectedCategory,
    onSelectCategory,
    onOpenFilters,
    radius = 15000,
    onRadiusChange,
    isNearby = false,
    sortBy,
    onSortChange
}: ExploreFiltersProps) => {

    const categoryList = Array.from(
        new Set([
            'All',
            ...DEFAULT_CATEGORIES.slice(1),
            ...(categories || []).filter(c => Boolean(c) && c !== 'All')
        ])
    );

    return (
        <div className="flex flex-col gap-4 mb-6 lg:mb-8 w-full">
            {/* Quick Filter Pills Bar - Solid Black Active State */}
            <div className="flex items-center gap-2 lg:gap-3 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4 lg:mx-0 lg:px-0 lg:flex-wrap relative w-full">
                
                {/* Filters Icon Button */}
                <button
                    type="button"
                    onClick={onOpenFilters}
                    className="flex items-center gap-1.5 h-10 px-4 bg-white border border-zinc-300 hover:border-zinc-400 active:scale-95 text-zinc-800 rounded-full font-bold text-xs lg:text-sm whitespace-nowrap transition-all shadow-2xs shrink-0 cursor-pointer"
                >
                    <Filter className="w-3.5 h-3.5 text-zinc-600" />
                    <span>Filters</span>
                </button>

                {/* Category Pills with Solid Black Active State */}
                <div className="flex items-center gap-2 lg:gap-2.5">
                    {categoryList.map((category) => {
                        const isAll = category === 'All';
                        const isSelected = isAll ? !selectedCategory : selectedCategory === category;
                        const icon = getCategoryIcon(category);

                        return (
                            <button
                                key={category}
                                type="button"
                                onClick={() => onSelectCategory(isAll ? null : category)}
                                style={{
                                    backgroundColor: isSelected ? '#09090b' : '#ffffff',
                                    color: isSelected ? '#ffffff' : '#27272a',
                                    borderColor: isSelected ? '#09090b' : '#d4d4d8'
                                }}
                                className={`h-10 px-5 rounded-full font-bold text-xs lg:text-sm whitespace-nowrap border transition-all active:scale-95 shrink-0 flex items-center gap-1.5 cursor-pointer ${
                                    isSelected
                                        ? 'bg-zinc-950 text-white border-zinc-950 shadow-xs'
                                        : 'bg-white text-zinc-800 border-zinc-300 hover:border-zinc-400 hover:bg-zinc-50'
                                }`}
                            >
                                {!isSelected && icon}
                                <span>{category}</span>
                            </button>
                        );
                    })}
                </div>

                <div className="h-5 lg:h-6 w-[1px] bg-zinc-200 mx-1 shrink-0" />

                <div className="flex items-center gap-2 lg:gap-3">
                    {isNearby && (
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] lg:text-xs font-bold text-zinc-400 uppercase tracking-wider ml-1 whitespace-nowrap">Radius:</span>
                            <div className="flex items-center gap-1.5">
                                {[1000, 5000, 15000, 25000, 50000].map((r) => (
                                    <button
                                        key={r}
                                        type="button"
                                        onClick={() => onRadiusChange?.(r)}
                                        className={`h-9 px-3 rounded-full font-bold text-xs transition-all border shrink-0 cursor-pointer ${
                                            radius === r
                                                ? 'bg-zinc-950 text-white border-zinc-950'
                                                : 'bg-white text-zinc-600 border-zinc-200 hover:border-zinc-300'
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
                            type="button"
                            onClick={onOpenFilters}
                            className="h-10 px-4 rounded-full font-bold text-xs lg:text-sm bg-white text-zinc-800 border border-zinc-300 hover:border-zinc-400 transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
                        >
                            <span>More Filters</span>
                            <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
                        </button>
                    )}
                </div>

                {/* Sort By Dropdown (Desktop Only) */}
                {sortBy && onSortChange && (
                    <div className="ml-auto hidden lg:flex items-center gap-2">
                        <span className="text-xs text-zinc-400 font-bold uppercase tracking-wider whitespace-nowrap">SORT BY</span>
                        <div className="relative">
                            <select
                                value={sortBy}
                                onChange={(e) => onSortChange(e.target.value)}
                                className="appearance-none h-10 pl-4 pr-9 bg-white border border-zinc-300 hover:border-zinc-400 rounded-full font-bold text-xs text-zinc-800 focus:outline-none cursor-pointer"
                            >
                                <option value="Recommended">Recommended</option>
                                <option value="Rating (High to Low)">Highest Rated</option>
                                <option value="Price (Low to High)">Price (Low to High)</option>
                                <option value="Price (High to Low)">Price (High to Low)</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 pointer-events-none" />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExploreFilters;
