"use client";

import React, { useState } from 'react';
import { Star, ChevronDown, ChevronUp, Clock } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { CustomImage } from '@/components/ui/CustomImage';
import { motion, AnimatePresence } from 'framer-motion';

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
}

const ServiceCard = ({ service }: { service: Service }) => {
    const [isOpen, setIsOpen] = useState(false);

    const formatDuration = (mins: number) => {
        if (mins >= 60) {
            const hrs = Math.floor(mins / 60);
            const remainingMins = mins % 60;
            return remainingMins > 0 ? `${hrs}h ${remainingMins}m` : `${hrs}h`;
        }
        return `${mins} Mins`;
    };

    const minPrice = service.pricingOptions.length > 0
        ? Math.min(...service.pricingOptions.map(o => o.price))
        : 0;

    return (
        <div className="border border-zinc-100 rounded-2xl overflow-hidden bg-white hover:border-zinc-200 transition-colors group">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 text-left gap-4"
            >
                <div className="flex items-start gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400 group-hover:bg-zinc-100 group-hover:text-black transition-colors shrink-0">
                        {service.thumbnail ? (
                            <div className="relative w-full h-full rounded-full overflow-hidden">
                                <CustomImage
                                    src={service.thumbnail}
                                    alt={service.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        ) : (
                            <Star className="w-4 h-4 sm:w-5 sm:h-5" />
                        )}
                    </div>
                    <div>
                        <h3 className="font-bold text-zinc-900 text-base sm:text-lg group-hover:text-black transition-colors leading-tight">{service.name}</h3>
                        <p className="text-xs sm:text-sm text-zinc-500 mt-1">{service.shortDescription || service.description}</p>
                    </div>
                </div>
                <div className="flex items-center sm:flex-col sm:items-end justify-between sm:justify-center gap-2 pt-3 sm:pt-0 border-t sm:border-0 border-zinc-50">
                    <div className="flex flex-col sm:items-end">
                        <span className="font-bold text-zinc-900 text-base sm:text-lg">
                            ₹{minPrice.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[10px] sm:text-xs font-normal text-zinc-500 sm:mt-0.5">onwards</span>
                    </div>
                    <div className="flex items-center gap-3">
                        {isOpen ? <ChevronUp className="w-5 h-5 text-black" /> : <ChevronDown className="w-5 h-5 text-zinc-400" />}
                    </div>
                </div>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        className="overflow-hidden bg-zinc-50/50"
                    >
                        <div className="p-4 sm:p-5 pt-0 space-y-3">
                            <div className="h-px bg-zinc-100 mb-4" />
                            {service.pricingOptions.map((option, idx) => (
                                <div key={idx} className="flex flex-col xs:flex-row items-start xs:items-center justify-between p-3 rounded-xl bg-white border border-zinc-100 hover:border-black/30 transition-colors gap-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-zinc-50 flex items-center justify-center text-zinc-500">
                                            <Clock className="w-4 h-4" />
                                        </div>
                                        <span className="font-medium text-zinc-700 text-sm sm:text-base">{formatDuration(option.duration)}</span>
                                    </div>
                                    <div className="flex items-center justify-between xs:justify-end gap-4 w-full xs:w-auto pt-2 xs:pt-0 border-t xs:border-0 border-zinc-50">
                                        <div className="flex flex-col items-end">
                                            <span className="font-bold text-zinc-900 text-sm sm:text-base">₹{option.price.toLocaleString('en-IN')}</span>
                                            {option.originalPrice && option.originalPrice > option.price && (
                                                <span className="text-[10px] text-zinc-400 line-through">₹{option.originalPrice.toLocaleString('en-IN')}</span>
                                            )}
                                        </div>
                                        <Button size="sm" className="bg-zinc-900 text-white hover:bg-zinc-800 transition-colors px-5 sm:px-6 rounded-full font-bold h-8 sm:h-9 text-xs sm:text-sm">
                                            Select
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

const PopularServices = ({ services = [] }: PopularServicesProps) => {
    const [isExpanded, setIsExpanded] = useState(false);

    if (!services || services.length === 0) return null;

    const visibleServices = isExpanded ? services : services.slice(0, 4);

    return (
        <section>
            <div className="flex items-center justify-between mb-6 sm:mb-8 gap-4">
                <h2 className="text-xl sm:text-2xl font-bold text-zinc-900">Popular Services</h2>
                {services.length > 4 && (
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="text-black font-bold text-xs sm:text-sm hover:underline whitespace-nowrap bg-zinc-100 px-3 py-1.5 rounded-full"
                    >
                        {isExpanded ? 'View Less' : 'Full Menu'}
                    </button>
                )}
            </div>
            <div className="space-y-3 sm:space-y-4">
                {visibleServices.map((service) => (
                    <ServiceCard key={service.id || service._id} service={service} />
                ))}
            </div>
        </section>
    );
};

export default PopularServices;
