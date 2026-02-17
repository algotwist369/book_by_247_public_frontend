"use client";

import React, { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import BusinessCard from './BusinessCard';
import { usePublicBusinesses, useNearbyBusinesses } from '@/hooks/useBusinesses';
import { useGeolocation } from '@/hooks/useGeolocation';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';

const QUERY_PARAMS = { limit: 16 };

interface BusinessSectionProps {
    initialData?: any;
}

const BusinessSection: React.FC<BusinessSectionProps> = ({ initialData }) => {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Get initial coordinates from URL if they exist
    const urlLat = searchParams.get('lat');
    const urlLng = searchParams.get('lng');

    const { getPosition, latitude, longitude, isFetching: isLocating } = useGeolocation();

    // Effective coordinates (URL takes precedence for SSR/Stability, state for freshness)
    const activeLat = latitude || (urlLat ? parseFloat(urlLat) : null);
    const activeLng = longitude || (urlLng ? parseFloat(urlLng) : null);

    // Featured Businesses (Initial/Default)
    const {
        data: featuredData,
        isLoading: isFeaturedLoading,
        error: featuredError
    } = usePublicBusinesses({ ...QUERY_PARAMS, initialData });

    // Nearby Businesses (Conditional - strictly 3km radius)
    const {
        data: nearbyData,
        isLoading: isNearbyLoading,
        error: nearbyError
    } = useNearbyBusinesses({
        lat: activeLat || 0,
        lng: activeLng || 0,
        maxDistance: 15000, // Increased default to 15km
        limit: 16
    });

    const isNearbyMode = !!(activeLat && activeLng);
    const isLoading = isLocating || (isNearbyMode ? isNearbyLoading : isFeaturedLoading);
    const businesses = (isNearbyMode ? (nearbyData as any)?.data : (featuredData as any)?.data) || [];

    // Sync state to URL when geolocation succeeds
    useEffect(() => {
        if (latitude && longitude && (latitude.toString() !== urlLat || longitude.toString() !== urlLng)) {
            const params = new URLSearchParams(searchParams.toString());
            params.set('lat', latitude.toString());
            params.set('lng', longitude.toString());
            router.replace(`/?${params.toString()}`, { scroll: false });
        }
    }, [latitude, longitude, router, searchParams, urlLat, urlLng]);

    // Automatically ask for location on homepage visit if not in URL
    useEffect(() => {
        if (!urlLat || !urlLng) {
            const timer = setTimeout(() => {
                getPosition();
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [getPosition, urlLat, urlLng]);

    if (isLoading && businesses.length === 0) {
        return (
            <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-8 max-w-[90rem] mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div className="h-10 w-64 bg-zinc-200 animate-pulse rounded-lg" />
                    <div className="h-6 w-20 bg-zinc-200 animate-pulse rounded-md" />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-8">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="flex flex-col gap-3">
                            <div className="aspect-video w-full bg-zinc-100 animate-pulse rounded-xl" />
                            <div className="h-6 w-3/4 bg-zinc-100 animate-pulse rounded-md" />
                            <div className="h-4 w-1/2 bg-zinc-100 animate-pulse rounded-md" />
                        </div>
                    ))}
                </div>
            </section>
        );
    }

    return (
        <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-8 max-w-[90rem] mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 md:mb-10 gap-4">
                <div className="flex items-center gap-3">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-zinc-900 tracking-tight">
                        {isNearbyMode ? "Nearby Businesses" : "Featured Businesses"}
                    </h2>
                    {isNearbyMode && (
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-[#008080]/10 text-[#008080] rounded-full text-xs font-bold animate-in fade-in zoom-in">
                            <MapPin className="w-3 h-3" />
                            <span>Based on your location</span>
                        </div>
                    )}
                </div>
                <button className="text-[#008080] text-sm sm:text-base font-bold hover:underline underline-offset-4 transition-all self-start sm:self-auto">
                    View all {isNearbyMode ? "nearby" : ""}
                </button>
            </div>

            <motion.div
                key={isNearbyMode ? 'nearby' : 'featured'}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6 xl:gap-8"
            >
                {businesses.map((business: any) => (
                    <BusinessCard
                        key={business.id}
                        business={business}
                    />
                ))}
            </motion.div>

            {isNearbyMode && businesses.length === 0 && !isNearbyLoading && (
                <div className="text-center py-20 bg-zinc-50 rounded-3xl border border-dashed border-zinc-200">
                    <MapPin className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-zinc-900">No businesses found nearby</h3>
                    <p className="text-zinc-500 max-w-xs mx-auto mt-2">Try increasing your search radius or exploring another category.</p>
                </div>
            )}
        </section>
    );
};

export default BusinessSection;
