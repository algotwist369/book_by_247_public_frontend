"use client";

import Link from "next/link";
import { CalendarDays, Phone, Star } from "lucide-react";
import { FaLocationArrow } from "react-icons/fa6";
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

    return Array.from(new Set(tags.filter(Boolean))).slice(0, 5) as string[];
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
            <article className="group mx-auto w-full max-w-[760px] rounded-[14px] border-2 border-zinc-200 p-1.5">
            <div className="grid min-h-[224px] grid-cols-1 gap-2 sm:grid-cols-[minmax(150px,224px)_minmax(0,1fr)]">
                <Link
                    href={businessHref}
                    className="relative block h-[190px] max-h-[220px] min-h-[170px] overflow-hidden rounded-lg sm:h-full sm:max-h-[232px] sm:min-h-[224px]"
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
                    <div className="grid min-h-[42px] grid-cols-[minmax(0,1fr)_86px] gap-2 sm:grid-cols-[minmax(0,1fr)_78px]">
                        <Link
                            href={businessHref}
                            className="flex h-[42px] min-w-0 items-center rounded-md px-3 transition-colors hover:border-sky-300"
                        >
                            <h3 className="line-clamp-1 text-sm font-black leading-tight text-zinc-900 sm:text-[15px]">
                                {business.name}
                            </h3>
                        </Link>

                        <Link
                            href={`${businessHref}/reviews`}
                            className="flex h-[42px] flex-col items-center justify-center rounded-md px-1 transition-colors hover:underline"
                            aria-label={`${business.name} rating and reviews`}
                        >
                            <span className="flex items-center gap-1 text-xs font-black text-yellow-600">
                                {formatRating(business.rating)}
                                {Number(business.rating) > 0 && <Star className="h-3 w-3 fill-amber-300 text-amber-300" />}
                            </span>
                            <span className="max-w-full truncate text-[9px] font-bold text-zinc-800">
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

                    <div className="flex min-h-[54px] max-h-[58px] flex-wrap items-center gap-1.5 overflow-hidden rounded-md px-3 pb-4">
                        {tags.length > 0 ? (
                            tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="max-w-[132px] truncate rounded-full border border-amber-300/30 bg-amber-400/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-amber-600"
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

                    <div className="grid min-h-[42px] grid-cols-3 gap-2">
                        <button
                            type="button"
                            onClick={handleEnquiry}
                            className={cn(
                                "relative flex h-[42px] items-center justify-center gap-1.5 rounded-full bg-black px-2 text-white transition-all hover:bg-zinc-800"
                            )}
                            aria-label={`Book appointment for ${business.name}`}
                        >
                            <span className="absolute right-2 top-1 rounded-full bg-amber-300 px-2 py-0.5 text-[9px] font-black uppercase tracking-wide text-amber-900">
                                upto 50% off
                            </span>
                            <CalendarDays className="h-3.5 w-3.5 shrink-0 text-white" />
                            <span className="truncate text-[10px] font-black uppercase tracking-wider">Book Now</span>
                        </button>

                        <button
                            type="button"
                            onClick={handleWhatsApp}
                            className="flex h-[42px] items-center justify-center gap-1.5 rounded-full bg-emerald-500 px-2 text-white transition-all hover:bg-emerald-600"
                            aria-label={`Contact ${business.name} on WhatsApp`}
                        >
                            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 shrink-0 fill-current" aria-hidden="true">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                            </svg>
                            <span className="truncate text-[10px] font-black uppercase tracking-wider">WhatsApp</span>
                        </button>

                        <button
                            type="button"
                            onClick={handleCall}
                            className="flex h-[42px] items-center justify-center gap-1.5 rounded-full bg-blue-600 px-2 text-white transition-all hover:bg-blue-700"
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
