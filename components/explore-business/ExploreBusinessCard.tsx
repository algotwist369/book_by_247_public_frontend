"use client";

import Link from "next/link";
import { CalendarDays, Phone, Star } from "lucide-react";
import { FaLocationArrow, FaWhatsapp } from "react-icons/fa6";
import { Business } from "@/components/business/businessData";
import { cn } from "@/lib/utils";
import { CustomImage } from "../ui/CustomImage";

interface ExploreBusinessCardProps {
    business: Business;
    index: number;
}

const fallbackDescription =
    "Experience premium wellness treatments, beauty services and relaxation therapies verified for quality and customer trust.";

const getBusinessTags = (business: Business) => {
    const tags = [
        ...(business.tags || []),
        ...(business.categories || []),
        business.city,
        business.branch,
        business.gender && business.gender !== "Any" ? business.gender : undefined,
    ];

    return Array.from(new Set(tags.filter(Boolean))).slice(0, 4) as string[];
};

const formatRating = (rating?: number) => {
    const safeRating = Number.isFinite(Number(rating)) ? Number(rating) : 0;
    return safeRating > 0 ? safeRating.toFixed(1) : "New";
};

const ExploreBusinessCard = ({ business, index }: ExploreBusinessCardProps) => {
    const isBest = business.seoFlags?.isBest;
    const isPopular = business.seoFlags?.isPopular;
    const isTrending = business.seoFlags?.isTrending;
    const hasPromotion = isBest || isPopular || isTrending;
    const tags = getBusinessTags(business);
    const businessHref = `/business/${business.slug}`;
    const imageSrc = business.image || business.thumbnailImage || business.images?.[0] || business.gallery?.[0] || "";
    const cleanPhone = business.phone?.replace(/[^0-9]/g, "");

    const handleCall = () => {
        if (cleanPhone) {
            window.location.href = `tel:${cleanPhone}`;
            return;
        }

        window.location.href = businessHref;
    };

    const handleMapClick = () => {
        if (business.googleMapsUrl) {
            window.open(business.googleMapsUrl, "_blank", "noopener,noreferrer");
        } else {
            window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(business.name + " " + (business.address || business.city))}`, "_blank", "noopener,noreferrer");
        }
    };

    const handleEnquiry = () => {
        window.location.href = `${businessHref}/book-appointment`;
    };

    return (
        <>
            <article className="group mx-auto w-full max-w-[650px] rounded-2xl p-2 sm:p-2 border shadow-xs border-zinc-200 bg-white hover:shadow-md transition-all duration-300">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-[minmax(150px,224px)_minmax(0,1fr)]">
                    <Link
                        href={businessHref}
                        className="relative block h-[210px] max-h-[240px] min-h-[200px] overflow-hidden rounded-lg sm:h-full sm:max-h-[260px] sm:min-h-[250px]"
                        aria-label={`View ${business.name}`}
                    >
                        <CustomImage
                            src={imageSrc}
                            alt={business.name}
                            fill
                            priority={index < 3}
                            sizes="(max-width: 640px) 100vw, 224px"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/55 via-transparent to-black/20" />

                        {business.distanceKm !== undefined && (
                            <div className="absolute left-3 top-3 z-10 flex max-w-[120px] items-center gap-1.5 rounded-full border border-white/20 bg-black/65 px-2.5 py-1 text-white backdrop-blur">
                                <FaLocationArrow className="h-3 w-3 shrink-0" />
                                <span className="truncate text-[10px] font-black">{business.distanceKm} km</span>
                            </div>
                        )}

                        {hasPromotion && (
                            <div className="absolute bottom-3 left-3 right-3 z-10 truncate rounded-md border border-amber-300/60 bg-black/75 px-2.5 py-1.5 text-[10px] font-black uppercase tracking-widest text-amber-200 backdrop-blur">
                                {isBest ? "Best Rated" : isPopular ? "Popular Choice" : "Trending Now"}
                            </div>
                        )}
                    </Link>

                    <div className="flex flex-col justify-between py-2 min-h-full min-w-0">
                        {/* Title and Rating Row */}
                        <div className="space-y-1">
                            <div className="flex justify-between items-start gap-2 px-3">
                                <Link href={businessHref} className="min-w-0 flex-1">
                                    <h2 className="line-clamp-1 text-base font-bold leading-tight text-zinc-900 sm:text-lg hover:text-rose-700 transition-colors">
                                        {business.name}
                                    </h2>
                                </Link>

                                <Link
                                    href={`${businessHref}/reviews`}
                                    className="shrink-0 flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full"
                                    aria-label={`${business.name} rating and reviews`}
                                >
                                    <span>{formatRating(business.rating)}</span>
                                    <Star className="h-3 w-3 fill-emerald-600 text-emerald-600" />
                                </Link>
                            </div>

                            {/* New Badge and reviews */}
                            <div className="flex items-center gap-2 px-3 text-xs text-zinc-500">
                                <span className="bg-rose-100 text-rose-700 font-bold text-[9px] px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0">
                                    New
                                </span>
                                <span>•</span>
                                <span className="font-medium text-zinc-500">{business.reviews || 0} reviews</span>
                            </div>

                            {/* Description */}
                            <Link href={businessHref} className="block px-3 pt-1">
                                <p className="line-clamp-3 text-xs font-semibold leading-relaxed text-zinc-500">
                                    {business.description || fallbackDescription}
                                </p>
                            </Link>
                        </div>

                        {/* Tags & Action Buttons */}
                        <div className="space-y-3 mt-4">
                            {/* Tags (Desktop only) */}
                            <div className="hidden md:flex flex-wrap items-center gap-1.5 px-3 overflow-hidden">
                                {tags.length > 0 ? (
                                    tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="max-w-[132px] truncate rounded-full border border-zinc-200/60 bg-zinc-100/50 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-zinc-500"
                                        >
                                            {tag}
                                        </span>
                                    ))
                                ) : (
                                    <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-amber-800">
                                        Verified business
                                    </span>
                                )}
                            </div>

                            {/* Buttons */}
                            <div className="grid grid-cols-3 gap-2 px-3">
                                <button
                                    type="button"
                                    onClick={handleEnquiry}
                                    className="flex h-9 items-center justify-center gap-1 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-800 transition-all text-[11px] font-bold uppercase tracking-wider cursor-pointer"
                                    aria-label={`Book appointment for ${business.name}`}
                                >
                                    <CalendarDays className="h-3.5 w-3.5 shrink-0 text-zinc-500" />
                                    <span>Book</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={handleMapClick}
                                    className="flex h-9 items-center justify-center gap-1 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-800 transition-all text-[11px] font-bold uppercase tracking-wider cursor-pointer"
                                    aria-label={`View ${business.name} on map`}
                                >
                                    <FaLocationArrow className="h-3.5 w-3.5 shrink-0 text-zinc-500" />
                                    <span>Map</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={handleCall}
                                    className="flex h-9 items-center justify-center gap-1 rounded-lg bg-zinc-950 hover:bg-zinc-900 text-white transition-all text-[11px] font-bold uppercase tracking-wider cursor-pointer"
                                    aria-label={`Call ${business.name}`}
                                >
                                    <Phone className="h-3.5 w-3.5 shrink-0 text-white animate-pulse" />
                                    <span>Call</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </article>
        </>
    );
};
export default ExploreBusinessCard;

