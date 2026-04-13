"use client";

import React, { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import BusinessCard from './BusinessCard';
import { usePublicBusinesses, useNearbyBusinesses } from '@/hooks/useBusinesses';
import { useGeolocation } from '@/hooks/useGeolocation';
import { MapPin } from 'lucide-react';
import Link from 'next/link';

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
            <section className="w-full bg-linear-to-b from-white via-zinc-50/80 to-white px-4 py-12 sm:px-6 sm:py-16 md:px-8 md:py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                    <div className="mb-8 flex items-center justify-between gap-4">
                        <div className="h-10 w-64 rounded-lg bg-zinc-100" />
                        <div className="h-6 w-20 rounded-md bg-zinc-100" />
                    </div>
                    <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
                        {[...Array(8)].map((_, i) => (
                            <div
                                key={i}
                                className="flex flex-col gap-3 rounded-2xl border border-zinc-100 bg-white/70 p-3"
                            >
                                <div className="aspect-video w-full rounded-xl bg-zinc-100" />
                                <div className="h-6 w-3/4 rounded-md bg-zinc-100" />
                                <div className="h-4 w-1/2 rounded-md bg-zinc-100" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section
            aria-label="Business listings"
            className="w-full bg-linear-to-b from-white via-zinc-50/80 to-white px-4 py-12 sm:px-6 sm:py-16 md:px-8 md:py-20"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-0">
                <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between md:mb-10">
                    <div className="flex items-center gap-3">
                        <h2 className="hidden text-2xl font-black tracking-tight text-zinc-900 sm:text-3xl md:block md:text-4xl">
                            {isNearbyMode ? "Nearby Businesses" : "Featured Businesses"}
                        </h2>
                        {isNearbyMode && (
                            <div className="hidden items-center gap-1.5 rounded-full bg-zinc-100 px-3 py-1 text-xs font-bold text-zinc-900 md:flex">
                                <MapPin className="h-3 w-3" />
                                <span>Based on your location</span>
                            </div>
                        )}
                    </div>
                    <Link
                        href="/explore"
                        className="self-start text-sm font-bold text-zinc-900 sm:self-auto sm:text-base"
                    >
                        View all {isNearbyMode ? "nearby" : ""}
                    </Link>
                </div>

                <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 md:gap-6 lg:grid-cols-4 xl:gap-8">
                    {businesses.map((business: any, index: number) => (
                        <BusinessCard
                            key={business.id}
                            business={business}
                            priority={index < 2}
                        />
                    ))}
                </div>

                {isNearbyMode && businesses.length === 0 && !isNearbyLoading && (
                    <div className="mt-10 rounded-3xl border border-dashed border-zinc-200 bg-zinc-50 px-6 py-16 text-center sm:px-10">
                        <MapPin className="mx-auto mb-4 h-12 w-12 text-zinc-300" />
                        <h3 className="text-lg font-bold text-zinc-900">No businesses found nearby</h3>
                        <p className="mx-auto mt-2 max-w-xs text-sm text-zinc-500">
                            Try increasing your search radius or exploring another category.
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default BusinessSection;
