"use client";

import Link from "next/link";
import { CalendarDays, Phone, Star, MapPin, CheckCircle2 } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";
import { Business } from "@/components/business/businessData";
import { CustomImage } from "../ui/CustomImage";

interface ExploreBusinessCardProps {
    business: Business;
    index: number;
}

const DEFAULT_FALLBACK_IMAGES = [
    "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=800",
    "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?q=80&w=800",
    "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=800",
    "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?q=80&w=800",
];

const DEFAULT_SERVICE_PILLS = ["Haircut", "Facial", "Massage", "Manicure"];

const getServicePills = (business: Business) => {
    const raw = [
        ...(business.tags || []),
        ...(business.categories || []),
    ].filter(Boolean);

    if (raw.length === 0) return DEFAULT_SERVICE_PILLS;
    
    const clean = raw.map(t => String(t).trim()).map(t => t.charAt(0).toUpperCase() + t.slice(1));
    const unique = Array.from(new Set(clean));
    return unique.length >= 2 ? unique.slice(0, 4) : [...unique, ...DEFAULT_SERVICE_PILLS].slice(0, 4);
};

const ExploreBusinessCard = ({ business, index }: ExploreBusinessCardProps) => {
    const serviceTags = getServicePills(business);
    const businessHref = `/business/${business.slug}`;
    
    const fallbackImage = DEFAULT_FALLBACK_IMAGES[index % DEFAULT_FALLBACK_IMAGES.length];
    const imageSrc = business.image || business.thumbnailImage || business.images?.[0] || business.gallery?.[0] || fallbackImage;
    const cleanPhone = business.phone?.replace(/[^0-9]/g, "");

    const handleCall = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (cleanPhone) {
            window.location.href = `tel:${cleanPhone}`;
            return;
        }
        window.location.href = businessHref;
    };

    const handleWhatsApp = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (cleanPhone) {
            const formattedPhone = cleanPhone.startsWith("91") ? cleanPhone : `91${cleanPhone}`;
            const message = encodeURIComponent(`Hi ${business.name}, I found your business on BookBy247 and would like to inquire about services.`);
            window.open(`https://wa.me/${formattedPhone}?text=${message}`, "_blank", "noopener,noreferrer");
            return;
        }
        window.location.href = businessHref;
    };

    const handleEnquiry = (e: React.MouseEvent) => {
        e.stopPropagation();
        window.location.href = `${businessHref}/book-appointment`;
    };

    const locationText = business.branch || business.address || business.city || "";

    // 100% Real Database Ratings & Review Counts (No Dummy Calculations)
    const rawRating = Number(business.rating ?? business.averageRating ?? business.ratings?.average ?? 0);
    const rawReviews = Number(business.reviews ?? business.totalReviews ?? business.ratings?.totalReviews ?? business.reviewCount ?? 0);

    const hasRating = Number.isFinite(rawRating) && rawRating > 0;
    const ratingText = hasRating ? rawRating.toFixed(1) : null;

    return (
        <article className="group w-full rounded-2xl border border-zinc-200 bg-white overflow-hidden shadow-xs hover:shadow-xl hover:border-zinc-300 transition-all duration-300 flex flex-col justify-between">
            {/* Top Image Container */}
            <Link
                href={businessHref}
                className="relative block w-full h-48 sm:h-52 overflow-hidden bg-zinc-100 shrink-0"
                aria-label={`View ${business.name}`}
            >
                <CustomImage
                    src={imageSrc}
                    alt={business.name}
                    fill
                    priority={index < 4}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

                {/* Floating Rating Badge + Verified Icon (Top Right) */}
                <div className="absolute top-3 right-3 z-10 flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-xs font-bold text-zinc-900 shadow-md backdrop-blur-md">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400 shrink-0" />
                    <span>{ratingText ? ratingText : "New"}</span>
                    {rawReviews > 0 && (
                        <span className="text-[10px] text-zinc-500 font-medium">({rawReviews})</span>
                    )}
                    {hasRating && rawRating >= 4.0 && (
                        <CheckCircle2 className="h-3.5 w-3.5 text-blue-500 fill-blue-500/20 shrink-0 ml-0.5" />
                    )}
                </div>

                {/* Floating Distance Badge - Pixel-Perfect Match with Target Image 2 */}
                {business.distanceKm !== undefined && business.distanceKm !== null && (
                    <div className="absolute top-3 left-3 z-10 flex items-center gap-2 rounded-xl bg-[#2b2927]/95 px-3.5 py-2 text-sm font-medium text-white shadow-md backdrop-blur-md border border-white/10">
                        <MapPin className="h-4 w-4 text-white shrink-0" />
                        <span>
                            {business.distanceKm < 1
                                ? `${Math.round(business.distanceKm * 1000)} m`
                                : `${business.distanceKm} km`}
                        </span>
                    </div>
                )}
            </Link>

            {/* Card Body Details */}
            <div className="p-4 flex flex-col gap-3 flex-1 justify-between">
                <div className="space-y-2">
                    {/* Business Name */}
                    <Link href={businessHref} className="block">
                        <h2 className="line-clamp-1 text-base sm:text-lg font-bold text-zinc-900 group-hover:text-black transition-colors">
                            {business.name || "Luxury Hair & Spa Lounge"}
                        </h2>
                    </Link>

                    {/* Location Pin Line */}
                    {locationText && (
                        <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-500 truncate">
                            <MapPin className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                            <span className="truncate">{locationText}</span>
                        </div>
                    )}

                    {/* Service Pills Row */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        {serviceTags.map((tag) => (
                            <span
                                key={tag}
                                className="rounded-md bg-zinc-100 px-2.5 py-1 text-[11px] font-medium text-zinc-600"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Buttons Row - Solid Black BOOK NOW, Shaking WhatsApp (WA), and Shaking Call */}
                <div className="flex items-center gap-2 pt-3 border-t border-zinc-100 mt-2">
                    {/* Solid Black BOOK NOW Button */}
                    <button
                        type="button"
                        onClick={handleEnquiry}
                        style={{ backgroundColor: '#09090b', color: '#ffffff' }}
                        className="flex-1 h-10 bg-zinc-950 hover:bg-black active:scale-95 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                        aria-label={`Book appointment for ${business.name}`}
                    >
                        <CalendarDays className="h-4 w-4 text-white shrink-0" />
                        <span>BOOK NOW</span>
                    </button>

                    {/* Outline WhatsApp (WA) Button with Global Shaking Icon */}
                    <button
                        type="button"
                        onClick={handleWhatsApp}
                        className="h-10 px-3.5 border border-zinc-300 bg-white hover:bg-emerald-50 hover:border-emerald-300 active:scale-95 text-zinc-800 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer group/wa"
                        aria-label={`Chat on WhatsApp with ${business.name}`}
                        title="Chat on WhatsApp"
                    >
                        <span className="shake-icon flex items-center justify-center">
                            <FaWhatsapp className="h-4 w-4 text-emerald-600 shrink-0" />
                        </span>
                        <span>WA</span>
                    </button>

                    {/* Outline Call Button with Global Shaking Icon */}
                    <button
                        type="button"
                        onClick={handleCall}
                        className="h-10 px-3.5 border border-zinc-300 bg-white hover:bg-zinc-50 active:scale-95 text-zinc-800 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                        aria-label={`Call ${business.name}`}
                        title="Call Business"
                    >
                        <span className="shake-icon flex items-center justify-center">
                            <Phone className="h-3.5 w-3.5 text-zinc-700 shrink-0" />
                        </span>
                        <span>Call</span>
                    </button>
                </div>
            </div>
        </article>
    );
};

export default ExploreBusinessCard;
