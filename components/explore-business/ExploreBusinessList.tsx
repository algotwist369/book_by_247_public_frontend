"use client";

import React from 'react';
import ExploreBusinessCard from './ExploreBusinessCard';
import { Business } from '@/components/business/businessData';
import { motion, AnimatePresence } from 'framer-motion';

interface ExploreBusinessListProps {
    businesses: Business[];
    isFullWidth?: boolean;
    location?: string;
    category?: string | null;
}

const ExploreBusinessList = ({ businesses, isFullWidth = false, location, category }: ExploreBusinessListProps) => {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-bold text-zinc-900">
                    Found <span className="text-[#008080]">{businesses.length}</span>
                    {category && category !== 'All' ? ` ${category}s` : ' businesses'}
                    {location ? <span> in <span className="text-zinc-900 underline decoration-[#008080]/30 underline-offset-4">{location}</span></span> : ''}
                </h2>
                <div className="h-[2px] flex-1 bg-zinc-50 ml-6" />
            </div>

            <div className={`grid grid-cols-1 md:grid-cols-2 ${isFullWidth ? 'lg:grid-cols-4' : 'lg:grid-cols-2'} gap-6 lg:gap-8`}>
                {businesses.map((business, index) => (
                    <div key={business.id}>
                        <ExploreBusinessCard business={business} index={index} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ExploreBusinessList;
