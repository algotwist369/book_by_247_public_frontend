"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Business } from './businessData';
import { CustomImage } from '../ui/CustomImage';

interface BusinessCardProps {
    business: Business;
    className?: string;
}

const BusinessCard: React.FC<BusinessCardProps> = ({ business, className }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (!business.images || business.images.length <= 1) return;

        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % business.images.length);
        }, 3000); // 3 seconds interval

        return () => clearInterval(timer);
    }, [business.images.length]);

    return (
        <div className={cn("flex flex-col gap-3 group cursor-pointer", className)}>
            <Link href={`/business/${business.slug}`} className="block h-full">
                {/* Image Container */}
                <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-zinc-100 mb-3">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.4, ease: "easeInOut" }}
                            className="absolute inset-0"
                        >
                            <CustomImage
                                src={business.images[currentIndex]}
                                alt={`${business.name} image ${currentIndex + 1}`}
                                fill
                                className="object-cover"
                                priority={currentIndex === 0}
                            />
                        </motion.div>
                    </AnimatePresence>

                    {/* Indicator Dots */}
                    {business.images.length > 1 && (
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                            {business.images.map((_, idx) => (
                                <div
                                    key={idx}
                                    className={cn(
                                        "w-1.5 h-1.5 rounded-full transition-all duration-300",
                                        idx === currentIndex ? "bg-white w-3" : "bg-white/50"
                                    )}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Content Section */}
                <div className="flex flex-col gap-0.5 sm:gap-1">
                    <div className="flex items-center justify-between gap-2">
                        <div className="flex-1 min-w-0">
                            <h3 className="text-sm sm:text-base font-bold text-zinc-900 leading-tight line-clamp-1 group-hover:text-[#008080] transition-colors">
                                {business.name}
                            </h3>
                            <div className="flex items-center gap-2 mt-0.5">
                                {business.distanceKm !== undefined && (
                                    <span className="text-[10px] sm:text-xs font-bold text-[#008080] bg-[#008080]/10 px-1.5 py-0.5 rounded-md">
                                        {business.distanceKm} km away
                                    </span>
                                )}
                                {business.isOpen !== undefined && (
                                    <span className={cn(
                                        "text-[10px] sm:text-xs font-medium px-1.5 py-0.5 rounded-md",
                                        business.isOpen ? "text-emerald-600 bg-emerald-50" : "text-rose-600 bg-rose-50"
                                    )}>
                                        {business.isOpen ? "Open Now" : "Closed"}
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center gap-0.5 sm:gap-1 shrink-0 bg-zinc-50 px-2 py-1 rounded-lg">
                            <span className="text-xs sm:text-sm font-black text-zinc-900">{Number(business.rating || 0).toFixed(1)}</span>
                            <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-yellow-400 text-yellow-400" />
                            <span className="text-zinc-400 text-[10px] sm:text-xs">({business.reviews || 0})</span>
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
