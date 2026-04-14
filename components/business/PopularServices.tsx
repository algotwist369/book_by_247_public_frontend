"use client";

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Clock } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useRouter } from "next/navigation";

interface ServiceOption {
    name?: string;
    duration: number;
    price: number;
    originalPrice?: number;
}

interface Service {
    id?: string;
    _id?: string;
    name: string;
    description: string;
    shortDescription?: string;
    ratings?: { average: number; count: number };
    images?: string[];
    thumbnail?: string;
    pricingOptions: ServiceOption[];
}

interface PopularServicesProps {
    services: Service[];
    businessName?: string;
    slug: string;
}

const ServiceCard = ({ service, slug }: { service: Service; slug: string }) => {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);

    const handleBookNow = (idx: number) => {
        const serviceId = service._id || service.id;
        if (!serviceId) return;

        // Pre-select service in localStorage for the booking page
        const bookingData = {
            businessSlug: slug,
            selectedServices: [{ serviceId, optionIdx: idx }],
            step: 'schedule' // Skip the service selection step
        };
        
        localStorage.setItem('appointment_booking_data', JSON.stringify(bookingData));
        router.push(`/business/${slug}/book-appointment`);
    };

    const formatDuration = (mins: number) => {
        if (mins >= 60) {
            const hrs = Math.floor(mins / 60);
            const remainingMins = mins % 60;
            return remainingMins > 0 ? `${hrs}h ${remainingMins}m` : `${hrs}h`;
        }
        return `${mins} min`;
    };

    const minPrice = service.pricingOptions.length > 0
        ? Math.min(...service.pricingOptions.map(o => o.price))
        : 0;

    return (
        <div className="border-b border-zinc-100 last:border-0">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between gap-3 px-3 sm:px-5 py-4 text-left"
            >
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-zinc-900 text-sm sm:text-base truncate">
                            {service.name}
                        </h3>
                        {service.pricingOptions.length > 1 && (
                            <span className="px-2 py-0.5 bg-zinc-100 text-zinc-600 text-[10px] font-medium rounded-full shrink-0">
                                {service.pricingOptions.length} Options
                            </span>
                        )}
                    </div>
                    <p className="text-xs sm:text-sm text-zinc-500 line-clamp-1">
                        {service.shortDescription || service.description}
                    </p>
                </div>

                <div className="flex items-center gap-3 sm:gap-5 shrink-0">
                    <div className="text-right">
                        <p className="text-[11px] text-zinc-500 mb-0.5">From</p>
                        <p className="font-semibold text-zinc-900 text-sm sm:text-base leading-none">
                            ₹{minPrice.toLocaleString('en-IN')}
                        </p>
                    </div>
                    <div className="p-1 text-zinc-500">
                        {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </div>
                </div>
            </button>

            {isOpen && (
                <div className="overflow-hidden">
                    <div className="px-3 sm:px-5 pb-4 space-y-2">
                        {service.pricingOptions.map((option, idx) => (
                            <div
                                key={idx}
                                className="flex items-center justify-between gap-3 p-3 border border-zinc-100 rounded-lg bg-white"
                            >
                                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                                    <div className="w-7 h-7 rounded-md bg-zinc-100 flex items-center justify-center text-zinc-500 shrink-0">
                                        <Clock className="w-3.5 h-3.5" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-medium text-zinc-900 text-xs sm:text-sm leading-tight">
                                            {formatDuration(option.duration)}
                                        </p>
                                        <p className="text-[11px] text-zinc-500">Professional Service</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 sm:gap-4 shrink-0">
                                    <div className="text-right">
                                        <p className="font-semibold text-zinc-900 text-sm sm:text-base leading-none">
                                            ₹{option.price.toLocaleString('en-IN')}
                                        </p>
                                        {option.originalPrice && option.originalPrice > option.price && (
                                            <p className="text-[10px] text-zinc-400 line-through mt-1">
                                                ₹{option.originalPrice.toLocaleString('en-IN')}
                                            </p>
                                        )}
                                    </div>
                                    <Button
                                        onClick={() => handleBookNow(idx)}
                                        size="sm"
                                        className="h-8 px-3 sm:px-4 rounded-md font-medium text-xs"
                                    >
                                        Book Now
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

const PopularServices = ({ services = [], slug }: PopularServicesProps) => {
    const [isExpanded, setIsExpanded] = useState(false);

    if (!services || services.length === 0) return null;

    const visibleServices = isExpanded ? services : services.slice(0, 5);

    return (
        <section className="bg-white rounded-xl border border-zinc-200 overflow-hidden my-3">
            <div className="p-4 sm:p-5 border-b border-zinc-100 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                    <h2 className="text-base sm:text-lg font-semibold text-zinc-900 truncate">Service Menu</h2>
                </div>
                {services.length > 5 && (
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="text-zinc-700 font-medium text-xs sm:text-sm whitespace-nowrap border border-zinc-200 px-3 py-1.5 rounded-md"
                    >
                        {isExpanded ? 'Show Less' : `View All ${services.length}`}
                    </button>
                )}
            </div>

            <div className="divide-y divide-zinc-100">
                {visibleServices.map((service) => (
                    <ServiceCard key={service.id || service._id} service={service} slug={slug} />
                ))}
            </div>

            {services.length > 5 && !isExpanded && (
                <div className="p-3 bg-zinc-50 text-center">
                    <button
                        onClick={() => setIsExpanded(true)}
                        className="text-zinc-600 font-medium text-xs flex items-center justify-center gap-1.5 mx-auto"
                    >
                        <span>Displaying top 5 of {services.length} services</span>
                        <ChevronDown className="w-3 h-3" />
                    </button>
                </div>
            )}
        </section>
    );
};

export default PopularServices;
