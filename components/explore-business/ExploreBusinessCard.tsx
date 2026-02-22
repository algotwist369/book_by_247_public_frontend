"use client";

import React from 'react';
import { CustomImage } from '../ui/CustomImage';
import Link from 'next/link';
import { Star, Phone, Send } from 'lucide-react';
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
                    <button
                        className="flex items-center justify-center gap-1.5 h-11 bg-zinc-900 text-white rounded-xl hover:bg-zinc-800 transition-colors"
                        aria-label="Call business"
                    >
                        <Phone className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Call</span>
                    </button>
                    <button className="flex items-center justify-center gap-1.5 h-11 bg-white border-2 border-zinc-100 text-zinc-900 rounded-xl hover:bg-zinc-50 hover:border-zinc-200 transition-colors">
                        {/* WhatsApp icon */}
                        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-[#25D366]" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                        <span className="text-[10px] font-bold uppercase tracking-wider">WhatsApp</span>
                    </button>
                    <button
                        className="flex items-center justify-center gap-1.5 h-11 bg-white border-2 border-zinc-100 text-zinc-900 rounded-xl hover:bg-zinc-50 hover:border-zinc-200 transition-colors"
                        aria-label="Send enquiry"
                    >
                        <Send className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Enquiry</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ExploreBusinessCard;
