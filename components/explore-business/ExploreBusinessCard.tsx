"use client";

import React from 'react';
import { CustomImage } from '../ui/CustomImage';
import Link from 'next/link';
import { Star, Phone, Send } from 'lucide-react';
import { FaWhatsapp } from "react-icons/fa";
import { Business } from '@/components/business/businessData';
import { cn } from '@/lib/utils';
import { MapPin } from 'lucide-react';

interface ExploreBusinessCardProps {
    business: Business;
    index: number;
}

const ExploreBusinessCard = ({ business, index }: ExploreBusinessCardProps) => {
    // Mock promotion data for demonstration as seen in source image
    const hasPromotion = business.id === "1" || business.name.includes("Serenity");

    return (
        <div className="group bg-white border border-zinc-100 rounded-3xl overflow-hidden transition-colors flex flex-col h-full">
            {/* Promotion Banner */}
            {hasPromotion && (
                <div className="bg-zinc-900 py-3 px-6">
                    <p className="text-white text-[10px] font-bold uppercase tracking-widest">
                        Found 26 businesses • <span className="text-[#00CCCC]">Limited Offer Available</span>
                    </p>
                </div>
            )}

            {/* Main Image */}
            <Link href={`/business/${business.slug}`} className="relative aspect-[16/10] overflow-hidden block">
                <CustomImage
                    src={business.image || (business.images && business.images.length > 0 ? business.images[0] : "")}
                    alt={business.name}
                    fill
                    priority={index < 3} // Prioritize first few images for LCP
                    className="object-cover transition-transform"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </Link>

            {/* Content Section */}
            <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                    <Link href={`/business/${business.slug}`} className="flex-1 mr-2">
                        <h3 className="text-lg font-bold text-zinc-900 leading-tight group-hover:text-[#008080] transition-colors line-clamp-1">
                            {business.name}
                        </h3>
                    </Link>
                    <div className="flex items-center gap-1 bg-[#FFFBEB] px-2 py-1 rounded-lg border border-yellow-100">
                        <span className="text-sm font-bold text-zinc-900">{Number(business.rating).toFixed(1)}</span>
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-zinc-400 text-[10px]">({business.reviews})</span>
                    </div>
                </div>

                <div className="flex items-center gap-2 mb-3">
                    {business.distanceKm !== undefined && (
                        <div className="flex items-center gap-1 px-2 py-0.5 bg-[#008080]/10 text-[#008080] rounded-md text-[10px] font-bold">
                            <MapPin className="w-3 h-3" />
                            <span>{business.distanceKm} km away</span>
                        </div>
                    )}
                    {business.isOpen !== undefined && (
                        <div className={cn(
                            "px-2 py-0.5 rounded-md text-[10px] font-bold",
                            business.isOpen ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                        )}>
                            {business.isOpen ? "OPEN NOW" : "CLOSED"}
                        </div>
                    )}
                </div>

                <p className="text-zinc-400 text-xs font-bold uppercase tracking-wider mb-2 line-clamp-1">
                    {business.address}
                </p>

                <Link href={`/business/${business.slug}`} className="block group/desc">
                    <p className="text-zinc-500 text-xs font-medium leading-relaxed mb-6 line-clamp-2 group-hover/desc:text-zinc-900 transition-colors">
                        {business.description || "Experience premium wellness treatments and relaxation therapies verified for quality and excellence."}
                    </p>
                </Link>

                {/* Action Buttons */}
                <div className="mt-auto grid grid-cols-3 gap-2">
                    <button className="flex items-center justify-center gap-1.5 h-11 bg-zinc-900 text-white rounded-xl hover:bg-zinc-800 transition-colors">
                        <Phone className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Call</span>
                    </button>
                    <button className="flex items-center justify-center gap-1.5 h-11 bg-white border-2 border-zinc-100 text-zinc-900 rounded-xl hover:bg-zinc-50 hover:border-zinc-200 transition-colors">
                        <FaWhatsapp className="w-4 h-4 text-[#25D366]" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">WhatsApp</span>
                    </button>
                    <button className="flex items-center justify-center gap-1.5 h-11 bg-white border-2 border-zinc-100 text-zinc-900 rounded-xl hover:bg-zinc-50 hover:border-zinc-200 transition-colors">
                        <Send className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Enquiry</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ExploreBusinessCard;
