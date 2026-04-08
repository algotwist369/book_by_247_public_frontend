"use client";

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Clock } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
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
        <div className="group border-b border-zinc-100 last:border-0 hover:bg-zinc-50/50 transition-all duration-300">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between py-4 px-2 sm:px-4 text-left gap-4"
            >
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="font-bold text-zinc-900 text-sm sm:text-base truncate group-hover:text-black transition-colors">
                            {service.name}
                        </h3>
                        {service.pricingOptions.length > 1 && (
                            <span className="px-1.5 py-0.5 bg-zinc-100 text-zinc-500 text-[9px] font-bold rounded uppercase tracking-wider shrink-0">
                                {service.pricingOptions.length} Options
                            </span>
                        )}
                    </div>
                    <p className="text-[11px] sm:text-xs text-zinc-500 line-clamp-1 font-medium leading-relaxed">
                        {service.shortDescription || service.description}
                    </p>
                </div>
                
                <div className="flex items-center gap-4 sm:gap-6 shrink-0">
                    <div className="text-right">
                        <p className="text-xs text-zinc-400 font-bold uppercase tracking-tighter mb-0.5">From</p>
                        <p className="font-black text-zinc-900 text-sm sm:text-base leading-none">
                            ₹{minPrice.toLocaleString('en-IN')}
                        </p>
                    </div>
                    <div className={`p-1.5 rounded-full transition-colors ${isOpen ? 'bg-black text-white' : 'bg-zinc-100 text-zinc-400 group-hover:bg-zinc-200'}`}>
                        {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </div>
                </div>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                        className="overflow-hidden"
                    >
                        <div className="px-2 sm:px-4 pb-5 space-y-2">
                            {service.pricingOptions.map((option, idx) => (
                                <div 
                                    key={idx} 
                                    className="flex items-center justify-between p-3 rounded-xl bg-white border border-zinc-100 shadow-sm hover:border-black/20 transition-all duration-300 group/option"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-7 h-7 rounded-lg bg-zinc-50 flex items-center justify-center text-zinc-400 group-hover/option:bg-black group-hover/option:text-white transition-colors">
                                            <Clock className="w-3.5 h-3.5" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-zinc-800 text-xs sm:text-sm leading-tight">
                                                {formatDuration(option.duration)}
                                            </p>
                                            <p className="text-[10px] text-zinc-400 font-medium">Professional Service</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <p className="font-black text-zinc-900 text-sm sm:text-base leading-none">
                                                ₹{option.price.toLocaleString('en-IN')}
                                            </p>
                                            {option.originalPrice && option.originalPrice > option.price && (
                                                <p className="text-[10px] text-zinc-400 line-through mt-0.5 font-bold">
                                                    ₹{option.originalPrice.toLocaleString('en-IN')}
                                                </p>
                                            )}
                                        </div>
                                        <Button
                                            onClick={() => handleBookNow(idx)}
                                            size="sm" 
                                            className="h-8 px-4 sm:px-5 bg-black text-white hover:bg-zinc-800 rounded-lg font-bold text-[11px] sm:text-xs transition-transform active:scale-95 shadow-lg shadow-black/5"
                                        >
                                            Book Now
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const PopularServices = ({ services = [], slug }: PopularServicesProps) => {
    const [isExpanded, setIsExpanded] = useState(false);

    if (!services || services.length === 0) return null;

    const visibleServices = isExpanded ? services : services.slice(0, 5);

    return (
        <section className="bg-white rounded-lg border border-zinc-100 overflow-hidden my-2">
            <div className="p-4 sm:p-6 border-b border-zinc-50 bg-zinc-50/30 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <h2 className="text-lg sm:text-xl font-black text-zinc-900 tracking-tight uppercase">Service Menu</h2>
                </div>
                {services.length > 5 && (
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="text-black font-black text-[10px] sm:text-xs uppercase tracking-widest hover:underline whitespace-nowrap bg-white border border-zinc-200 px-3 py-1.5 rounded-lg shadow-sm active:scale-95 transition-all"
                    >
                        {isExpanded ? 'Show Less' : `View All ${services.length}`}
                    </button>
                )}
            </div>
            
            <div className="divide-y divide-zinc-50">
                {visibleServices.map((service) => (
                    <ServiceCard key={service.id || service._id} service={service} slug={slug} />
                ))}
            </div>

            {services.length > 5 && !isExpanded && (
                <div className="p-4 bg-zinc-50/50 text-center">
                    <button
                        onClick={() => setIsExpanded(true)}
                        className="text-zinc-500 font-bold text-xs hover:text-black transition-colors flex items-center justify-center gap-2 mx-auto"
                    >
                        <span>Displaying top 5 of {services.length} services</span>
                        <ChevronDown className="w-3 h-3 animate-bounce" />
                    </button>
                </div>
            )}
        </section>
    );
};

export default PopularServices;
