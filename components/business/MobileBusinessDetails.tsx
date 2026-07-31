"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Share2, Star, MapPin, Phone, Navigation } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa6';
import { CustomImage } from '@/components/ui/CustomImage';
import ShareModal from '@/components/business/ShareModal';

interface MobileBusinessDetailsProps {
    slug: string;
    details: any;
    contacts: any;
    workingHours: any;
    media: any;
    services: any[];
    reviewsData: any;
}

const DEFAULT_FALLBACK_IMAGES = [
    "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=800",
    "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?q=80&w=800",
    "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=800",
];

export default function MobileBusinessDetails({
    slug,
    details,
    contacts,
    workingHours,
    media,
    services = [],
    reviewsData
}: MobileBusinessDetailsProps) {
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [activePhotoIdx, setActivePhotoIdx] = useState(0);
    const [currentUrl, setCurrentUrl] = useState('');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setCurrentUrl(window.location.href);
        }
    }, []);

    const businessName = details?.name || "Luxury Spa & Wellness";
    const businessAddress = contacts?.address || (contacts?.area ? `${contacts.area}, ${contacts?.city || ''}` : contacts?.city) || "Mumbai";
    const businessPhone = contacts?.phone || details?.phone;
    const cleanPhone = businessPhone?.replace(/[^0-9]/g, "");

    // 100% Real Database Ratings & Review Counts
    const rawRating = Number(reviewsData?.ratings?.average ?? details?.avg_rating ?? details?.rating ?? 0);
    const rawReviews = Number(reviewsData?.ratings?.total_reviews ?? details?.total_reviews ?? details?.reviews ?? 0);

    const hasRating = Number.isFinite(rawRating) && rawRating > 0;
    const ratingText = hasRating ? rawRating.toFixed(1) : null;

    // Gallery images from real database
    const rawMediaImages = Array.isArray(media?.images) ? media.images : [];
    const galleryImages = rawMediaImages.length > 0 ? rawMediaImages : DEFAULT_FALLBACK_IMAGES;

    // Real Services list from database
    const realServices = (services || []).map((s: any) => {
        const option = s.pricingOptions?.[0] || {};
        return {
            name: s.name,
            duration: option.duration || s.duration || 60,
            price: option.price || s.price || s.sale_price || 0
        };
    }).filter(s => s.name && s.price > 0);

    const displayServices = realServices;
    const minStartingPrice = displayServices.length > 0 ? Math.min(...displayServices.map(s => s.price)) : 0;

    const handleShare = async () => {
        if (typeof window !== "undefined") {
            const shareUrl = window.location.href;
            if (navigator.share) {
                try {
                    await navigator.share({
                        title: businessName,
                        text: `Check out ${businessName} on BookBy247!`,
                        url: shareUrl
                    });
                    return;
                } catch (e) {
                    // Fall back to modal if user cancels or native share fails
                }
            }
            setIsShareModalOpen(true);
        }
    };

    const handleCall = () => {
        if (cleanPhone) {
            window.location.href = `tel:${cleanPhone}`;
        }
    };

    const handleWhatsApp = () => {
        if (cleanPhone) {
            const formatted = cleanPhone.startsWith("91") ? cleanPhone : `91${cleanPhone}`;
            const msg = encodeURIComponent(`Hi ${businessName}, I found your business on BookBy247 and would like to inquire about booking.`);
            window.open(`https://wa.me/${formatted}?text=${msg}`, "_blank", "noopener,noreferrer");
        }
    };

    const handleDirections = () => {
        const mapUrl = contacts?.google_maps_url || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${businessName} ${businessAddress}`)}`;
        window.open(mapUrl, "_blank", "noopener,noreferrer");
    };

    const aboutDescription = details?.description || details?.seo?.metaDescription || "Experience premium wellness treatments, relaxation therapies, and professional care.";

    return (
        <div className="lg:hidden min-h-screen bg-white pb-20 font-sans">
            {/* Top Photo Banner / Carousel */}
            <div className="relative w-full h-64 sm:h-72 bg-zinc-900 overflow-hidden">
                <CustomImage
                    src={galleryImages[activePhotoIdx] || galleryImages[0]}
                    alt={businessName}
                    fill
                    priority
                    sizes="100vw"
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none" />

                {/* Floating Back Button (Top Left) */}
                <button
                    type="button"
                    onClick={() => window.history.back()}
                    className="w-9 h-9 rounded-full bg-white/95 shadow-md backdrop-blur-md flex items-center justify-center text-zinc-900 absolute top-3.5 left-3.5 z-20 active:scale-95 transition-transform cursor-pointer"
                    aria-label="Go back"
                >
                    <ArrowLeft className="w-4 h-4 text-zinc-900" />
                </button>

                {/* Floating Share Button (Top Right) */}
                <button
                    type="button"
                    onClick={handleShare}
                    className="w-9 h-9 rounded-full bg-white/95 shadow-md backdrop-blur-md flex items-center justify-center text-zinc-900 absolute top-3.5 right-3.5 z-20 active:scale-95 transition-transform cursor-pointer hover:bg-white"
                    aria-label="Share business"
                    title="Share this business"
                >
                    <Share2 className="w-4 h-4 text-zinc-900" />
                </button>

                {/* Carousel Indicator Dots (Bottom Center) */}
                {galleryImages.length > 1 && (
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
                        {galleryImages.slice(0, 5).map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setActivePhotoIdx(idx)}
                                className={`h-1.5 rounded-full transition-all ${
                                    activePhotoIdx === idx ? 'w-4 bg-white' : 'w-1.5 bg-white/50'
                                }`}
                                aria-label={`Go to slide ${idx + 1}`}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Business Info Header Card - Exact Target Spacing & Font Styling */}
            <div className="px-4 pt-4 pb-3 space-y-2.5 bg-white">
                {/* Title (Serif Warm Tone matching Target UI) */}
                <h1 className="font-serif text-[22px] sm:text-2xl font-normal text-[#8c7453] tracking-tight leading-tight">
                    {businessName}
                </h1>

                {/* Location Line */}
                <div className="flex items-center gap-1.5 text-xs text-zinc-600 font-normal">
                    <MapPin className="w-3.5 h-3.5 text-[#8c7453] shrink-0 fill-[#8c7453]/20" />
                    <span>{businessAddress}</span>
                </div>

                {/* Badges Row */}
                <div className="flex items-center gap-2 pt-0.5">
                    {/* Rating Badge */}
                    <div className="bg-[#222222] text-white text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-2xs">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" />
                        <span>{ratingText ? ratingText : "New"}</span>
                        {rawReviews > 0 && (
                            <span className="text-zinc-300 font-normal ml-0.5">({rawReviews.toLocaleString()} Reviews)</span>
                        )}
                    </div>

                    {/* Open Status Badge */}
                    <div className="bg-[#e6f7ef] text-[#13864c] text-[11px] font-bold px-2.5 py-1 rounded-full border border-[#c3edd9] uppercase tracking-wider">
                        OPEN NOW
                    </div>
                </div>

                {/* Action Buttons Row (Call, WhatsApp, Direction) - Exact Target UI Spacing */}
                <div className="grid grid-cols-3 gap-2.5 pt-2">
                    {/* Call Button */}
                    <button
                        type="button"
                        onClick={handleCall}
                        className="h-9 border border-zinc-300 rounded-lg bg-white hover:bg-zinc-50 active:scale-95 text-zinc-800 font-medium text-xs flex items-center justify-center gap-1.5 transition-all shadow-2xs cursor-pointer"
                    >
                        <span className="shake-icon flex items-center justify-center">
                            <Phone className="w-3.5 h-3.5 text-zinc-700 shrink-0" />
                        </span>
                        <span>Call</span>
                    </button>

                    {/* WhatsApp Button */}
                    <button
                        type="button"
                        onClick={handleWhatsApp}
                        className="h-9 border border-zinc-300 rounded-lg bg-white hover:bg-emerald-50 active:scale-95 text-zinc-800 font-medium text-xs flex items-center justify-center gap-1.5 transition-all shadow-2xs cursor-pointer"
                    >
                        <span className="shake-icon flex items-center justify-center">
                            <FaWhatsapp className="w-4 h-4 text-emerald-600 shrink-0" />
                        </span>
                        <span>WhatsApp</span>
                    </button>

                    {/* Direction Button */}
                    <button
                        type="button"
                        onClick={handleDirections}
                        className="h-9 border border-zinc-300 rounded-lg bg-white hover:bg-zinc-50 active:scale-95 text-zinc-800 font-medium text-xs flex items-center justify-center gap-1.5 transition-all shadow-2xs cursor-pointer"
                    >
                        <Navigation className="w-3.5 h-3.5 text-zinc-700 shrink-0" />
                        <span>Direction</span>
                    </button>
                </div>
            </div>

            {/* About Us Section - Exact Target Spacing */}
            <div className="px-4 py-3.5 border-t border-zinc-100 space-y-1.5 bg-white">
                <h2 className="text-base font-bold text-zinc-900">About Us</h2>
                <p className="text-zinc-600 text-xs sm:text-sm leading-relaxed font-normal">
                    {aboutDescription}
                </p>
            </div>

            {/* Real Services Menu Section from DB - Exact Target Spacing */}
            {displayServices.length > 0 && (
                <div className="px-4 py-3.5 border-t border-zinc-100 space-y-2 bg-white">
                    <h2 className="text-base font-bold text-zinc-900 mb-2">Services</h2>
                    <div className="divide-y divide-zinc-100">
                        {displayServices.map((service, idx) => (
                            <div
                                key={idx}
                                className="py-2.5 flex items-center justify-between gap-3 first:pt-0 last:pb-0"
                            >
                                <span className="text-xs sm:text-sm font-medium text-zinc-900 min-w-0 truncate">
                                    {service.name}
                                </span>
                                <div className="text-right shrink-0 flex items-center gap-1.5 text-xs">
                                    <span className="text-zinc-500 font-normal">({service.duration} mins)</span>
                                    <span className="text-zinc-300">|</span>
                                    <span className="font-semibold text-zinc-900 text-xs sm:text-sm">₹{service.price.toLocaleString('en-IN')}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Sticky Bottom Booking Bar (Fixed at Bottom on Mobile) */}
            <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-zinc-200 px-4 py-2.5 flex items-center justify-between gap-3 shadow-lg">
                {minStartingPrice > 0 ? (
                    <div className="flex flex-col">
                        <span className="text-[10px] text-zinc-400 font-medium leading-none">from</span>
                        <span className="text-base sm:text-lg font-bold text-zinc-900 leading-tight">
                            ₹{minStartingPrice.toLocaleString('en-IN')}
                        </span>
                    </div>
                ) : (
                    /* When NO services available, show working Call & WhatsApp icon buttons on left */
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={handleCall}
                            className="w-10 h-10 rounded-xl border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 active:scale-95 text-zinc-900 flex items-center justify-center transition-all cursor-pointer"
                            aria-label="Call business"
                            title="Call Business"
                        >
                            <span className="shake-icon flex items-center justify-center">
                                <Phone className="w-4 h-4 text-zinc-800 shrink-0" />
                            </span>
                        </button>

                        <button
                            type="button"
                            onClick={handleWhatsApp}
                            className="w-10 h-10 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 active:scale-95 text-emerald-600 flex items-center justify-center transition-all cursor-pointer"
                            aria-label="Chat on WhatsApp"
                            title="WhatsApp Business"
                        >
                            <span className="shake-icon flex items-center justify-center">
                                <FaWhatsapp className="w-5 h-5 text-emerald-600 shrink-0" />
                            </span>
                        </button>
                    </div>
                )}

                <Link
                    href={`/business/${slug}/book-appointment`}
                    className="flex-1 max-w-[200px] h-10 sm:h-11 bg-black hover:bg-zinc-900 active:scale-95 text-white font-bold text-xs sm:text-sm rounded-lg shadow-sm flex items-center justify-center transition-all cursor-pointer"
                >
                    Book Appointment
                </Link>
            </div>

            {/* Share Modal */}
            <ShareModal
                isOpen={isShareModalOpen}
                onClose={() => setIsShareModalOpen(false)}
                url={currentUrl || (typeof window !== 'undefined' ? window.location.href : '')}
            />
        </div>
    );
}
