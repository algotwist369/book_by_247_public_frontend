"use client";

import React from 'react';
import { Tag } from 'lucide-react';

interface BusinessCategoriesProps {
    categories?: string[];
    subCategories?: string[];
    tags?: string[];
    specialties?: string[];
    languages?: string[];
}

const BusinessCategories = ({ 
    categories = [], 
    subCategories = [], 
    tags = [], 
    specialties = [], 
    languages = [] 
}: BusinessCategoriesProps) => {
    if (categories.length === 0 && subCategories.length === 0 && tags.length === 0 && specialties.length === 0 && languages.length === 0) return null;

    return (
        <section className="space-y-4 sm:space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-900">Expertise & Categories</h2>

            <div className="space-y-6">
                {/* Categories & Subcategories */}
                {(categories.length > 0 || subCategories.length > 0) && (
                    <div className="space-y-3">
                        <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Business Categories</h3>
                        <div className="flex flex-wrap gap-2">
                            {categories.map((cat, index) => (
                                <span
                                    key={`cat-${index}`}
                                    className="px-3 py-1.5 sm:px-4 sm:py-2 bg-black text-white font-bold rounded-full text-xs sm:text-sm transition-colors cursor-default"
                                >
                                    {cat}
                                </span>
                            ))}
                            {subCategories.map((sub, index) => (
                                <span
                                    key={`sub-${index}`}
                                    className="px-3 py-1.5 sm:px-4 sm:py-2 bg-zinc-100 text-zinc-900 font-bold rounded-full text-xs sm:text-sm border border-zinc-200 transition-colors cursor-default"
                                >
                                    {sub}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Specialties */}
                {specialties.length > 0 && (
                    <div className="space-y-3">
                        <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Specialties</h3>
                        <div className="flex flex-wrap gap-2">
                            {specialties.map((specialty, index) => (
                                <span
                                    key={`spec-${index}`}
                                    className="px-3 py-1.5 bg-zinc-50 text-zinc-800 font-medium rounded-xl text-xs sm:text-sm border border-zinc-100 shadow-sm transition-colors cursor-default"
                                >
                                    {specialty}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Languages */}
                {languages.length > 0 && (
                    <div className="space-y-3">
                        <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Languages Spoken</h3>
                        <div className="flex flex-wrap gap-2">
                            {languages.map((lang, index) => (
                                <span
                                    key={`lang-${index}`}
                                    className="px-3 py-1 bg-white text-zinc-600 font-medium rounded-lg text-xs sm:text-sm border border-zinc-200 transition-colors cursor-default"
                                >
                                    {lang}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Tags */}
                {tags.length > 0 && (
                    <div className="space-y-3">
                        <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Tags</h3>
                        <div className="flex items-start gap-2 sm:gap-3">
                            <Tag className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-400 mt-1 shrink-0" />
                            <div className="flex flex-wrap gap-1.5 sm:gap-2">
                                {tags.map((tag, index) => (
                                    <span
                                        key={`tag-${index}`}
                                        className="px-2 py-0.5 sm:px-3 sm:py-1 bg-zinc-100 text-zinc-600 rounded-md text-[10px] sm:text-xs font-medium border border-zinc-200 hover:border-zinc-300 transition-colors cursor-default"
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default BusinessCategories;
