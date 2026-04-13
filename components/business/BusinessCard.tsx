"use client";

import React from 'react';
import Link from 'next/link';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Business } from './businessData';
import { CustomImage } from '../ui/CustomImage';
import { FaLocationArrow } from "react-icons/fa6";

interface BusinessCardProps {
    business: Business;
    className?: string;
    priority?: boolean;
}

const BusinessCard: React.FC<BusinessCardProps> = ({ business, className, priority = false }) => {
    return (
        <div className={cn("flex flex-col gap-3 group cursor-pointer", className)}>
            <Link href={`/business/${business.slug}`} className="block h-full">
                {/* Image Container */}
                <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-zinc-100 mb-3">
                    <CustomImage
                        src={business.image || business.images?.[0] || business.gallery?.[0] || ''} // Priority: primary image -> first image array -> gallery
                        alt={`${business.name} thumbnail`}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        priority={priority}
                    />
                    {/* Distance Badge */}
                    {business.distanceKm !== undefined && (
                        <div className="absolute top-3 right-3 z-10 flex items-center bg-white/80 backdrop-blur-md px-1 rounded-full">
                            <FaLocationArrow className="w-3 h-3 text-black" />
                            <span className="text-[11px] font-black text-black">
                                {business.distanceKm} km
                            </span>
                        </div>
                    )}
                </div>


                {/* Content Section */}
                <div className="flex flex-col gap-0.5 sm:gap-1">
                    <div className="flex items-center justify-between gap-2">
                        <div className="flex-1 min-w-0">
                            <h3 className="text-sm sm:text-base font-bold text-zinc-900 leading-tight line-clamp-1 group-hover:text-black transition-colors">
                                {business.name}
                            </h3>
                            <div className="flex items-center gap-2 mt-0.5">
                                {business.isOpen !== undefined && (
                                    <span className={cn(
                                        "text-[10px] sm:text-xs font-medium px-1.5 py-0.5 rounded-md",
                                        business.isOpen ? "text-black bg-zinc-100" : "text-zinc-400 bg-zinc-50"
                                    )}>
                                        {business.isOpen ? "Open" : "Closed"}
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center gap-0.5 sm:gap-1 shrink-0 bg-zinc-50 px-2 py-1 rounded-lg">
                            <span className="text-xs sm:text-sm font-black text-zinc-900">{Number(business.rating || 0).toFixed(1)}</span>
                            <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-zinc-900 text-zinc-900" />
                            <span className="text-zinc-500 text-[10px] sm:text-xs">({business.reviews || 0})</span>
                        </div>
                    </div>

                    <div>
                        <p className="text-zinc-500 text-xs sm:text-sm line-clamp-1">
                            {business.branch && business.city
                                ? `${business.branch}, ${business.city}`
                                : business.branch || business.city || business.address}
                        </p>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default BusinessCard;
