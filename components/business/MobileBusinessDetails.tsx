"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    ArrowLeft,
    Share2,
    Star,
    MapPin,
    Phone,
    Navigation,
    Wifi,
    Car,
    Wind,
    Coffee,
    CreditCard,
    CalendarCheck,
    ShieldCheck,
    Clock,
    ChevronDown,
    ChevronUp,
    Facebook,
    Instagram,
    Twitter,
    Linkedin,
    Youtube,
    Send,
    PhoneCall
} from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa6';
import { CustomImage } from '@/components/ui/CustomImage';
import ShareModal from '@/components/business/ShareModal';
import BusinessCategories from '@/components/business/BusinessCategories';
import BusinessReviews from '@/components/business/BusinessReviews';

interface MobileBusinessDetailsProps {
    slug: string;
    details: any;
    contacts: any;
    workingHours: any;
    media: any;
    services: any[];
    reviewsData: any;
    capacity?: any;
    categoriesData?: any;
    socialMedia?: any;
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
    reviewsData,
    capacity,
    categoriesData,
    socialMedia
}: MobileBusinessDetailsProps) {
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [activePhotoIdx, setActivePhotoIdx] = useState(0);
    const [currentUrl, setCurrentUrl] = useState('');
    const [isHoursOpen, setIsHoursOpen] = useState(false);
    const [isAboutExpanded, setIsAboutExpanded] = useState(false);

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
    }).filter((s: { name?: string; price?: number }) => Boolean(s.name && s.price && s.price > 0));

    const displayServices = realServices;
    const minStartingPrice = displayServices.length > 0 ? Math.min(...displayServices.map((s: { price: number }) => s.price)) : 0;

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
                    // Fall back to modal
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

    const getAmenityIcon = (name: string) => {
        const lower = name.toLowerCase();
        if (lower.includes('wifi') || lower.includes('wi-fi')) return Wifi;
        if (lower.includes('parking')) return Car;
        if (lower.includes('ac') || lower.includes('air conditioning')) return Wind;
        if (lower.includes('beverage') || lower.includes('coffee')) return Coffee;
        if (lower.includes('card') || lower.includes('payment')) return CreditCard;
        if (lower.includes('booking') || lower.includes('online')) return CalendarCheck;
        return ShieldCheck;
    };

    return (
        <div className="lg:hidden min-h-screen bg-white pb-24 font-sans">
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
                        {galleryImages.slice(0, 5).map((_img: string, idx: number) => (
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

            {/* Business Info Header Card */}
            <div className="px-4 pt-4 pb-3 space-y-2.5 bg-white">
                {/* Title */}
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

                {/* Action Buttons Row (Call, WhatsApp, Direction) */}
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

            {/* About Us Section */}
            <div className="px-4 py-3.5 border-t border-zinc-100 space-y-1.5 bg-white">
                <h2 className="text-base font-bold text-zinc-900">About Us</h2>
                <div>
                    <p className={`text-zinc-600 text-xs sm:text-sm leading-relaxed font-normal ${!isAboutExpanded ? 'line-clamp-4' : ''}`}>
                        {aboutDescription}
                    </p>
                    {aboutDescription && aboutDescription.length > 140 && (
                        <button
                            type="button"
                            onClick={() => setIsAboutExpanded(!isAboutExpanded)}
                            className="text-xs font-bold text-zinc-900 hover:underline mt-1 inline-flex items-center gap-0.5 cursor-pointer"
                        >
                            {isAboutExpanded ? 'Show Less' : '...more'}
                        </button>
                    )}
                </div>
            </div>

            {/* Real Services Menu Section from DB */}
            {displayServices.length > 0 && (
                <div className="px-4 py-3.5 border-t border-zinc-100 space-y-2 bg-white">
                    <h2 className="text-base font-bold text-zinc-900 mb-2">Services</h2>
                    <div className="divide-y divide-zinc-100">
                        {displayServices.map((service: any, idx: number) => (
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

            {/* Features & Amenities Section */}
            {(capacity?.features?.length > 0 || capacity?.amenities?.length > 0) && (
                <div className="px-4 py-4 border-t border-zinc-100 space-y-4 bg-white">
                    {capacity.features?.length > 0 && (
                        <div className="space-y-2">
                            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Key Features</h3>
                            <div className="flex flex-wrap gap-1.5">
                                {capacity.features.map((feature: string, i: number) => (
                                    <span key={i} className="px-2.5 py-1 bg-zinc-100 text-zinc-900 font-bold rounded-lg text-xs border border-zinc-200">
                                        {feature}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {capacity.amenities?.length > 0 && (
                        <div className="space-y-2">
                            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Amenities</h3>
                            <div className="grid grid-cols-2 gap-2">
                                {capacity.amenities.map((amenity: string, i: number) => {
                                    const Icon = getAmenityIcon(amenity);
                                    return (
                                        <div key={i} className="flex items-center gap-2 text-zinc-700 bg-zinc-50 p-2.5 rounded-xl border border-zinc-100">
                                            <Icon className="w-4 h-4 text-zinc-900 shrink-0" />
                                            <span className="text-xs font-medium truncate">{amenity}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Categories, Tags & Expertise Section */}
            {categoriesData && (
                <div className="px-4 py-4 border-t border-zinc-100 bg-white">
                    <BusinessCategories
                        categories={categoriesData?.categories ? [categoriesData.categories] : []}
                        subCategories={categoriesData?.sub_categories ? [categoriesData.sub_categories] : []}
                        tags={categoriesData?.tags || []}
                        specialties={categoriesData?.specialties || []}
                        languages={categoriesData?.languages || []}
                    />
                </div>
            )}

            {/* Working Hours & Schedule Section */}
            <div className="px-4 py-4 border-t border-zinc-100 bg-white space-y-3">
                <button
                    type="button"
                    onClick={() => setIsHoursOpen(!isHoursOpen)}
                    className="w-full flex items-center justify-between py-1 text-left cursor-pointer"
                >
                    <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-zinc-900" />
                        <h2 className="text-base font-bold text-zinc-900">Working Hours</h2>
                    </div>
                    <div className="p-1 text-zinc-500">
                        {isHoursOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                </button>

                {isHoursOpen && (
                    <div className="pt-2 space-y-3 border-t border-zinc-100">
                        <div className="space-y-2">
                            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => {
                                const dayLower = day.toLowerCase();
                                const isOpen = workingHours?.working_hours?.days?.includes(dayLower);
                                const timeRange = (isOpen && workingHours?.working_hours)
                                    ? `${workingHours.working_hours.open} - ${workingHours.working_hours.close}`
                                    : 'Closed';

                                return (
                                    <div key={day} className="flex justify-between text-xs sm:text-sm">
                                        <span className="text-zinc-500">{day}</span>
                                        <span className={`font-medium ${!isOpen ? 'text-rose-500' : 'text-zinc-900'}`}>
                                            {timeRange}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>

                        {(workingHours?.days_off?.length > 0 || workingHours?.holidays?.length > 0) && (
                            <div className="pt-2 border-t border-zinc-100 space-y-1.5">
                                {workingHours.days_off?.length > 0 && (
                                    <p className="text-[11px] text-zinc-500">
                                        <span className="font-bold text-zinc-700 uppercase">Days Off:</span> {workingHours.days_off.join(', ')}
                                    </p>
                                )}
                                {workingHours.holidays?.length > 0 && (
                                    <p className="text-[11px] text-zinc-500">
                                        <span className="font-bold text-zinc-700 uppercase">Holidays:</span> {workingHours.holidays.join(', ')}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Reviews & Customer Feedback Section */}
            <div className="px-4 py-4 border-t border-zinc-100 bg-white">
                <BusinessReviews
                    reviews={reviewsData?.reviews?.map((r: any) => ({
                        id: r._id || r.createdAt,
                        author: r.customerName || 'Customer',
                        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(r.customerName || 'Customer')}&background=random`,
                        rating: r.rating,
                        content: r.comment,
                        date: new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
                        helpfulPercentage: 0
                    })) || []}
                    rating={rawRating}
                    reviewCount={rawReviews}
                    slug={slug}
                    businessName={businessName}
                />
            </div>

            {/* Follow Us / Social Links */}
            {socialMedia && (
                <div className="px-4 py-5 border-t border-zinc-100 bg-white text-center space-y-3">
                    <h4 className="font-bold text-zinc-900 text-xs uppercase tracking-wider">Follow Us</h4>
                    <div className="flex flex-wrap justify-center gap-3">
                        {[
                            { Icon: Facebook, url: socialMedia?.facebook, name: "Facebook", color: "hover:bg-[#1877F2]" },
                            { Icon: Instagram, url: socialMedia?.instagram, name: "Instagram", color: "hover:bg-[#E4405F]" },
                            { Icon: Twitter, url: socialMedia?.twitter, name: "Twitter", color: "hover:bg-[#000000]" },
                            { Icon: Linkedin, url: socialMedia?.linkedin, name: "Linkedin", color: "hover:bg-[#0077B5]" },
                            { Icon: Youtube, url: socialMedia?.youtube, name: "Youtube", color: "hover:bg-[#FF0000]" },
                            { Icon: PhoneCall, url: socialMedia?.whatsapp ? `https://wa.me/${socialMedia.whatsapp.replace(/[^0-9]/g, '')}` : null, name: "WhatsApp", color: "hover:bg-[#25D366]" },
                            { Icon: Send, url: socialMedia?.telegram ? `https://t.me/${socialMedia.telegram.replace('@', '')}` : null, name: "Telegram", color: "hover:bg-[#24A1DE]" }
                        ].map((social, i) => social.url ? (
                            <a
                                key={i}
                                href={social.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                title={social.name}
                                className={`w-9 h-9 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-500 hover:text-white transition-all ${social.color}`}
                            >
                                <social.Icon className="w-4 h-4" />
                            </a>
                        ) : null)}
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
