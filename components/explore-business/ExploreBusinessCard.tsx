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

    const handleWhatsApp = () => {
        if (!cleanPhone) {
            window.location.href = businessHref;
            return;
        }

        const message = `Hi, I found ${business.name} on Bookby247 and want to know more about services.`;
        window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
    };

    const handleEnquiry = () => {
        window.location.href = `${businessHref}/book-appointment`;
    };

    return (
        <>
            <article className="group mx-auto w-full max-w-[650px] rounded-2xl p-2 sm:p-2 border shadow-sm border-gray-300">
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

                    <div className="grid min-h-0 gap-2 sm:grid-rows-[42px_minmax(64px,74px)_54px_42px]">
                        <div className="grid grid-cols-[minmax(0,1fr)_86px] gap-2 sm:grid-cols-[minmax(0,1fr)_78px]">
                            <Link
                                href={businessHref}
                                className="flex min-w-0 items-center rounded-md px-3 transition-colors hover:border-sky-300"
                            >
                                <h2 className="line-clamp-1 text-md font-black leading-tight text-zinc-900 sm:text-lg">
                                    {business.name}
                                </h2>
                            </Link>

                            <Link
                                href={`${businessHref}/reviews`}
                                className="flex h-[42px] flex-col items-center justify-center rounded-md px-1 transition-colors"
                                aria-label={`${business.name} rating and reviews`}
                            >
                                <span className="flex items-center gap-1 text-[10px] font-black text-white bg-pink-600 px-1.5 py-1 rounded-lg">
                                    {formatRating(business.rating)}
                                    {Number(business.rating) > 0 && <Star className="h-3 w-3 fill-amber-300 text-amber-300" />}
                                </span>
                                <span className="max-w-full truncate text-[10px] font-bold text-zinc-800">
                                    {business.reviews || 0} reviews
                                </span>
                            </Link>
                        </div>

                        <Link
                            href={businessHref}
                            className="flex min-h-[64px] max-h-[74px] items-center justify-center overflow-hidden px-4 pb-2"
                        >
                            <p className="line-clamp-3 text-xs font-semibold leading-5 text-zinc-500">
                                {business.description || fallbackDescription}
                            </p>
                        </Link>

                        <div className="hidden md:flex min-h-[54px] max-h-[58px] flex-wrap items-center gap-1.5 overflow-hidden rounded-md px-3 pb-4">
                            {tags.length > 0 ? (
                                tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="max-w-[132px] truncate rounded-xl border border-gray-300/30 bg-gray-400/10 px-2.5 py-1 text-[8px] font-black uppercase tracking-wide text-gray-600"
                                    >
                                        {tag}
                                    </span>
                                ))
                            ) : (
                                <span className="rounded-full border border-amber-300/30 bg-amber-400/10 px-3 py-1 text-[10px] font-black uppercase tracking-wide text-amber-900">
                                    Verified business
                                </span>
                            )}
                        </div>

                        <div className="grid min-h-[42px] grid-cols-3 gap-3">
                            <button
                                type="button"
                                onClick={handleEnquiry}
                                className={cn(
                                    "relative flex h-[42px] items-center justify-center gap-1.5 rounded-xl bg-black px-2 text-white transition-all hover:bg-zinc-800"
                                )}
                                aria-label={`Book appointment for ${business.name}`}
                            >
                                <CalendarDays className="h-3.5 w-3.5 shrink-0 text-white" />
                                <span className="truncate text-[10px] font-black uppercase tracking-wider">Book</span>
                            </button>

                            <button
                                type="button"
                                onClick={handleWhatsApp}
                                className="flex h-[42px] items-center justify-center gap-1.5 rounded-xl bg-emerald-500 px-2 text-white transition-all hover:bg-emerald-600"
                                aria-label={`Contact ${business.name} on WhatsApp`}
                            >
                                <FaWhatsapp className="h-3.5 w-3.5 shrink-0 fill-current" />
                                <span className="truncate text-[10px] font-black uppercase tracking-wider">WAP</span>
                            </button>

                            <button
                                type="button"
                                onClick={handleCall}
                                className="flex h-[42px] items-center justify-center gap-1.5 rounded-xl bg-pink-600 px-2 text-white transition-all hover:bg-pink-700"
                                aria-label={`Call ${business.name}`}
                            >
                                <Phone className="h-3.5 w-3.5 shrink-0" style={{ animation: "shake 0.9s infinite" }} />
                                <span className="truncate text-[10px] font-black uppercase tracking-wider">Call</span>
                            </button>
                        </div>
                    </div>
                </div>
            </article>
            <style jsx>{`
                @keyframes shake {
                    0% { transform: rotate(0deg); }
                    15% { transform: rotate(15deg); }
                    30% { transform: rotate(-15deg); }
                    45% { transform: rotate(10deg); }
                    60% { transform: rotate(-10deg); }
                    75% { transform: rotate(5deg); }
                    100% { transform: rotate(0deg); }
                }
            `}</style>
        </>
    );
};

export default ExploreBusinessCard;
