"use client";

import React from 'react';
import { Tag } from 'lucide-react';

interface BusinessCategoriesProps {
    categories?: string[];
    tags?: string[];
}

const BusinessCategories = ({ categories = [], tags = [] }: BusinessCategoriesProps) => {
    if (categories.length === 0 && tags.length === 0) return null;

    return (
        <section className="space-y-4 sm:space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-900">Categories & Tags</h2>

            <div className="space-y-4">
                {/* Categories */}
                {categories.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {categories.map((cat, index) => (
                            <span
                                key={index}
                                className="px-3 py-1.5 sm:px-4 sm:py-2 bg-[#008080]/10 text-[#008080] font-bold rounded-full text-xs sm:text-sm hover:bg-[#008080]/20 transition-colors cursor-default"
                            >
                                {cat}
                            </span>
                        ))}
                    </div>
                )}

                {/* Tags */}
                {tags.length > 0 && (
                    <div className="flex items-start gap-2 sm:gap-3">
                        <Tag className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-400 mt-1 shrink-0" />
                        <div className="flex flex-wrap gap-1.5 sm:gap-2">
                            {tags.map((tag, index) => (
                                <span
                                    key={index}
                                    className="px-2 py-0.5 sm:px-3 sm:py-1 bg-zinc-100 text-zinc-600 rounded-md text-[10px] sm:text-xs font-medium border border-zinc-200 hover:border-zinc-300 transition-colors cursor-default"
                                >
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default BusinessCategories;
