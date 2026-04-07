import React from 'react';
import Link from 'next/link';
import { Star, MapPin, Clock, ArrowRight } from 'lucide-react';
import { CustomImage } from '@/components/ui/CustomImage';
import { Button } from '@/components/ui/Button';

interface ServiceCardProps {
    service: {
        id: string;
        slug: string;
        title: string;
        description: string;
        thumbnail: string;
        minPrice: number;
        maxPrice: number;
        rating: number;
        reviewsCount: number;
        category: string;
        business?: {
            id: string;
            name: string;
            slug: string;
            type: string;
            location: string;
        };
    };
    isFullWidth?: boolean;
}

const ServiceCard = ({ service, isFullWidth }: ServiceCardProps) => {
    const formattedPrice = service.minPrice === service.maxPrice 
        ? `₹${service.minPrice.toLocaleString('en-IN')}`
        : `₹${service.minPrice.toLocaleString('en-IN')} - ₹${service.maxPrice.toLocaleString('en-IN')}`;

    return (
        <div className={`group bg-white rounded-[2rem] border border-zinc-100 hover:border-zinc-200 transition-all duration-500 overflow-hidden flex flex-col sm:flex-row h-full sm:h-64 ${isFullWidth ? 'w-full' : ''}`}>
            {/* Image Section */}
            <div className="relative w-full sm:w-72 h-48 sm:h-full overflow-hidden shrink-0">
                <CustomImage
                    src={service.thumbnail || (service.business ? '/placeholder-service.jpg' : '')}
                    alt={service.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full border border-zinc-100 flex items-center gap-1.5 shadow-sm">
                    <Star className="w-3.5 h-3.5 text-black fill-black" />
                    <span className="text-xs font-black text-zinc-900">{service.rating.toFixed(1)}</span>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
                <div className="space-y-4">
                    <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">{service.category}</span>
                            <h3 className="text-xl sm:text-2xl font-black text-zinc-900 line-clamp-1 tracking-tight">
                                {service.title}
                            </h3>
                        </div>
                        <div className="text-right shrink-0">
                            <div className="text-lg sm:text-xl font-black text-black">{formattedPrice}</div>
                            <div className="text-[10px] font-bold text-zinc-400 uppercase">Onwards</div>
                        </div>
                    </div>

                    <p className="text-sm text-zinc-500 line-clamp-2 leading-relaxed">
                        {service.description}
                    </p>

                    {service.business && (
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-2">
                             <Link href={`/business/${service.business.slug}`} className="flex items-center gap-2 hover:text-black transition-colors group/biz">
                                <div className="w-6 h-6 rounded-full bg-zinc-100 flex items-center justify-center text-[10px] font-bold text-zinc-500 group-hover/biz:bg-black group-hover/biz:text-white transition-all">
                                    {service.business.name.charAt(0)}
                                </div>
                                <span className="text-xs font-bold text-zinc-600 group-hover/biz:text-black">
                                    at {service.business.name}
                                </span>
                            </Link>

                            <div className="flex items-center gap-1.5 text-zinc-400">
                                <MapPin className="w-3.5 h-3.5" />
                                <span className="text-xs font-medium">{service.business.location}</span>
                            </div>
                        </div>
                    )}
                </div>

                <div className="pt-6 border-t border-zinc-50 flex items-center justify-between">
                    <div className="text-xs font-bold text-zinc-400">{service.reviewsCount} verified reviews</div>
                    <Link href={`/business/${service.business?.slug || '#'}`}>
                        <Button variant="outline" className="h-10 rounded-xl px-6 gap-2 group/btn border-zinc-200 hover:border-black active:scale-95 transition-all">
                            <span className="text-sm font-bold">Book Slot</span>
                            <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ServiceCard;
