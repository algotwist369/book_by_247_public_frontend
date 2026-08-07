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
    PhoneCall,
    Sparkles
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
    const [touchStartX, setTouchStartX] = useState<number | null>(null);
    const [touchEndX, setTouchEndX] = useState<number | null>(null);

    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchStartX(e.targetTouches[0].clientX);
        setTouchEndX(null);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        setTouchEndX(e.targetTouches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (!touchStartX || !touchEndX) return;
        const distance = touchStartX - touchEndX;
        const minSwipeDistance = 35;

        if (distance > minSwipeDistance) {
            setActivePhotoIdx((prev) => (prev + 1) % galleryImages.length);
        } else if (distance < -minSwipeDistance) {
            setActivePhotoIdx((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
        }
        setTouchStartX(null);
        setTouchEndX(null);
    };

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
        <div className="lg:hidden min-h-screen bg-zinc-50 pb-28 font-sans">
            {/* Top Photo Banner / Touch Slider */}
            <div
                className="relative w-full h-64 sm:h-72 bg-zinc-900 overflow-hidden select-none touch-pan-x"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                {/* Horizontal Sliding Photo Container */}
                <div
                    className="flex w-full h-full transition-transform duration-300 ease-out"
                    style={{ transform: `translateX(-${activePhotoIdx * 100}%)` }}
                >
                    {galleryImages.map((img: string, idx: number) => (
                        <div key={idx} className="relative w-full h-full shrink-0">
                            <CustomImage
                                src={img}
                                alt={`${businessName} photo ${idx + 1}`}
                                fill
                                priority={idx === 0}
                                sizes="100vw"
                                className="object-cover"
                            />
                        </div>
                    ))}
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30 pointer-events-none z-10" />

                {/* Floating Back Button (Top Left) */}
                <button
                    type="button"
                    onClick={() => window.history.back()}
                    className="w-10 h-10 rounded-full bg-white/95 shadow-lg backdrop-blur-md flex items-center justify-center text-zinc-900 absolute top-4 left-4 z-20 active:scale-95 transition-transform cursor-pointer"
                    aria-label="Go back"
                >
                    <ArrowLeft className="w-5 h-5 text-zinc-900" />
                </button>

                {/* Floating Share Button (Top Right) */}
                <button
                    type="button"
                    onClick={handleShare}
                    className="w-10 h-10 rounded-full bg-white/95 shadow-lg backdrop-blur-md flex items-center justify-center text-zinc-900 absolute top-4 right-4 z-20 active:scale-95 transition-transform cursor-pointer"
                    aria-label="Share business"
                    title="Share this business"
                >
                    <Share2 className="w-5 h-5 text-zinc-900" />
                </button>

                {/* Carousel Indicator Dots */}
                {galleryImages.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1 bg-black/40 px-3 py-1 rounded-full backdrop-blur-md">
                        {galleryImages.slice(0, 5).map((_img: string, idx: number) => (
                            <button
                                key={idx}
                                onClick={() => setActivePhotoIdx(idx)}
                                className="p-2 min-w-[36px] min-h-[36px] flex items-center justify-center cursor-pointer"
                                aria-label={`Go to slide ${idx + 1}`}
                            >
                                <span className={`h-2 rounded-full transition-all ${
                                    activePhotoIdx === idx ? 'w-5 bg-white' : 'w-2 bg-white/60'
                                }`} />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Business Info Header Card */}
            <div className="px-4 pt-5 pb-5 space-y-4 bg-white border-b border-zinc-100 shadow-2xs">
                {/* Title */}
                <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 tracking-tight leading-snug">
                    {businessName}
                </h1>

                {/* Location Line */}
                <div className="flex items-start gap-2 text-sm text-zinc-600 font-medium leading-relaxed">
                    <MapPin className="w-4 h-4 text-zinc-700 shrink-0 mt-0.5" />
                    <span>{businessAddress}</span>
                </div>

                {/* Badges Row */}
                <div className="flex items-center gap-2.5 pt-1">
                    {/* Rating Badge */}
                    <div className="bg-zinc-900 text-white text-xs font-black px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-xs">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400 shrink-0" />
                        <span className="text-sm">{ratingText ? ratingText : "New"}</span>
                        {rawReviews > 0 && (
                            <span className="text-zinc-300 font-medium text-xs ml-0.5">({rawReviews.toLocaleString()})</span>
                        )}
                    </div>

                    {/* Open Status Badge */}
                    <div className="bg-emerald-50 text-emerald-800 text-xs font-extrabold px-3 py-1.5 rounded-xl border border-emerald-200 uppercase tracking-wider">
                        OPEN
                    </div>
                </div>
            </div>

            {/* Action Buttons Row (Call Now, WhatsApp, Direction) - Sticky Top on Scroll */}
            <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md px-4 py-3 border-b border-zinc-200/80 shadow-xs transition-all duration-200">
                <div className="grid grid-cols-3 gap-2.5">
                    {/* Call Button */}
                    <button
                        type="button"
                        onClick={handleCall}
                        className="h-11 sm:h-12 border border-zinc-900 rounded-xl bg-zinc-950 hover:bg-black active:scale-95 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
                    >
                        <span className="shake-icon flex items-center justify-center">
                            <Phone className="w-4 h-4 text-white shrink-0" />
                        </span>
                        <span>Call Now</span>
                    </button>

                    {/* WhatsApp Button */}
                    <button
                        type="button"
                        onClick={handleWhatsApp}
                        className="h-11 sm:h-12 border border-emerald-300 rounded-xl bg-emerald-50 hover:bg-emerald-100 active:scale-95 text-emerald-950 font-extrabold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
                    >
                        <span className="shake-icon flex items-center justify-center">
                            <FaWhatsapp className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
                        </span>
                        <span>WhatsApp</span>
                    </button>

                    {/* Direction Button */}
                    <button
                        type="button"
                        onClick={handleDirections}
                        className="h-11 sm:h-12 border border-zinc-200 rounded-xl bg-zinc-50 hover:bg-zinc-100 active:scale-95 text-zinc-900 font-extrabold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
                    >
                        <Navigation className="w-4 h-4 text-zinc-800 shrink-0" />
                        <span>Direction</span>
                    </button>
                </div>
            </div>

            {/* About Us Section */}
            <div className="px-4 py-5 mt-2 border-y border-zinc-100 space-y-2 bg-white">
                <h2 className="text-lg sm:text-xl font-black text-zinc-950 tracking-tight">About Us</h2>
                <div>
                    <p className={`text-zinc-600 text-sm sm:text-base leading-relaxed font-normal ${!isAboutExpanded ? 'line-clamp-4' : ''}`}>
                        {aboutDescription}
                    </p>
                    {aboutDescription && aboutDescription.length > 140 && (
                        <button
                            type="button"
                            onClick={() => setIsAboutExpanded(!isAboutExpanded)}
                            className="text-sm font-extrabold text-indigo-600 hover:text-indigo-800 mt-1.5 inline-flex items-center gap-1 cursor-pointer"
                        >
                            {isAboutExpanded ? 'Show Less' : 'Read More...'}
                        </button>
                    )}
                </div>
            </div>

            {/* Real Services Menu Section */}
            {displayServices.length > 0 && (
                <div className="px-4 py-5 mt-2 border-y border-zinc-100 space-y-3 bg-white">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg sm:text-xl font-black text-zinc-950 tracking-tight">Popular Services</h2>
                        <span className="text-xs font-bold text-zinc-600 uppercase tracking-wider">{displayServices.length} Items</span>
                    </div>
                    <div className="divide-y divide-zinc-100">
                        {displayServices.map((service: any, idx: number) => (
                            <div
                                key={idx}
                                className="py-3.5 flex items-center justify-between gap-3 first:pt-1 last:pb-0"
                            >
                                <div className="flex flex-col min-w-0 pr-2">
                                    <span className="text-sm sm:text-base font-bold text-zinc-900 truncate">
                                        {service.name}
                                    </span>
                                    <span className="text-xs text-zinc-500 font-medium">
                                        Duration: {service.duration} mins
                                    </span>
                                </div>
                                <div className="text-right shrink-0">
                                    <span className="font-extrabold text-zinc-950 text-base sm:text-lg">
                                        ₹{service.price.toLocaleString('en-IN')}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Features & Amenities Section */}
            {(capacity?.features?.length > 0 || capacity?.amenities?.length > 0) && (
                <div className="px-4 py-5 mt-2 border-y border-zinc-100 space-y-4 bg-white">
                    {capacity.features?.length > 0 && (
                        <div className="space-y-2.5">
                            <h3 className="text-xs font-black text-zinc-600 uppercase tracking-widest">Key Features</h3>
                            <div className="flex flex-wrap gap-2">
                                {capacity.features.map((feature: string, i: number) => (
                                    <span key={i} className="px-3 py-1.5 bg-zinc-100 text-zinc-900 font-extrabold rounded-xl text-xs border border-zinc-200">
                                        {feature}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {capacity.amenities?.length > 0 && (
                        <div className="space-y-2.5">
                            <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest">Amenities</h3>
                            <div className="grid grid-cols-2 gap-2.5">
                                {capacity.amenities.map((amenity: string, i: number) => {
                                    const Icon = getAmenityIcon(amenity);
                                    return (
                                        <div key={i} className="flex items-center gap-2.5 text-zinc-800 bg-zinc-50 p-3 rounded-2xl border border-zinc-100">
                                            <Icon className="w-4.5 h-4.5 text-zinc-900 shrink-0" />
                                            <span className="text-xs font-bold truncate">{amenity}</span>
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
                <div className="px-4 py-5 mt-2 border-y border-zinc-100 bg-white">
                    <h2 className="text-lg sm:text-xl font-black text-zinc-950 tracking-tight mb-3">Expertise & Categories</h2>
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
            <div className="px-4 py-5 mt-2 border-y border-zinc-100 bg-white space-y-3">
                <button
                    type="button"
                    onClick={() => setIsHoursOpen(!isHoursOpen)}
                    className="w-full flex items-center justify-between py-1 text-left cursor-pointer"
                >
                    <div className="flex items-center gap-2.5">
                        <Clock className="w-5 h-5 text-zinc-900" />
                        <h2 className="text-lg sm:text-xl font-black text-zinc-950 tracking-tight">Working Hours</h2>
                    </div>
                    <div className="p-1 text-zinc-500">
                        {isHoursOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                </button>

                {isHoursOpen && (
                    <div className="pt-3 space-y-3 border-t border-zinc-100">
                        <div className="space-y-2.5">
                            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => {
                                const dayLower = day.toLowerCase();
                                const isOpen = workingHours?.working_hours?.days?.includes(dayLower);
                                const timeRange = (isOpen && workingHours?.working_hours)
                                    ? `${workingHours.working_hours.open} - ${workingHours.working_hours.close}`
                                    : 'Closed';

                                return (
                                    <div key={day} className="flex justify-between text-xs sm:text-sm">
                                        <span className="text-zinc-600 font-medium">{day}</span>
                                        <span className={`font-bold ${!isOpen ? 'text-rose-600' : 'text-zinc-900'}`}>
                                            {timeRange}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            {/* Reviews & Customer Feedback Section */}
            <div className="px-4 py-5 mt-2 border-y border-zinc-100 bg-white">
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
                <div className="px-4 py-6 mt-2 border-y border-zinc-100 bg-white text-center space-y-3">
                    <h4 className="font-black text-zinc-900 text-xs uppercase tracking-widest">Follow Us</h4>
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
                                className={`w-10 h-10 rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-600 hover:text-white transition-all ${social.color}`}
                            >
                                <social.Icon className="w-4.5 h-4.5" />
                            </a>
                        ) : null)}
                    </div>
                </div>
            )}

            {/* Sticky Bottom Booking Bar (Fixed at Bottom on Mobile - High Impact CTA Layout) */}
            <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-zinc-200 px-4 py-3 flex items-center justify-between gap-3 shadow-2xl">
                {minStartingPrice > 0 ? (
                    <div className="flex flex-col pl-1">
                        <span className="text-[11px] text-zinc-600 font-bold uppercase tracking-wider leading-none">from</span>
                        <span className="text-xl sm:text-2xl font-black text-zinc-950 leading-tight">
                            ₹{minStartingPrice.toLocaleString('en-IN')}
                        </span>
                    </div>
                ) : (
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={handleCall}
                            className="w-11 h-11 rounded-2xl border border-zinc-300 bg-zinc-100 hover:bg-zinc-200 active:scale-95 text-zinc-900 flex items-center justify-center transition-all cursor-pointer shadow-xs"
                            aria-label="Call business"
                            title="Call Business"
                        >
                            <span className="shake-icon flex items-center justify-center">
                                <Phone className="w-5 h-5 text-zinc-900 shrink-0" />
                            </span>
                        </button>

                        <button
                            type="button"
                            onClick={handleWhatsApp}
                            className="w-11 h-11 rounded-2xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 active:scale-95 text-emerald-600 flex items-center justify-center transition-all cursor-pointer shadow-xs"
                            aria-label="Chat on WhatsApp"
                            title="WhatsApp Business"
                        >
                            <span className="shake-icon flex items-center justify-center">
                                <FaWhatsapp className="w-5.5 h-5.5 text-emerald-600 shrink-0" />
                            </span>
                        </button>
                    </div>
                )}

                {/* High Impact Book Appointment CTA Button */}
                <Link
                    href={`/business/${slug}/book-appointment`}
                    className="flex-1 max-w-[240px] h-12 sm:h-13 bg-zinc-950 hover:bg-black active:scale-98 text-white font-black text-sm sm:text-base rounded-2xl shadow-xl shadow-zinc-950/20 flex items-center justify-center gap-2 transition-all cursor-pointer tracking-wide"
                >
                    <Sparkles className="w-4.5 h-4.5 text-amber-300" />
                    <span>Book Appointment</span>
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
