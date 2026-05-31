"use client";

import * as React from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { CustomImage } from "../ui/CustomImage";

interface ReviewCardProps {
    review: {
        title: string;
        text: string;
        name: string;
        location: string;
        avatar: string | null;
        avatarFallback?: string;
        rating?: number;
    };
}

export const ReviewCard: React.FC<ReviewCardProps> = React.memo(({ review }) => {
    return (
        <div className="bg-zinc-50 rounded-2xl p-4 sm:p-6 flex flex-col justify-between hover:shadow-xl transition-all duration-300 border border-zinc-100/50 group">
            {/* Stars - Gray for monochromatic feel */}
            <div className="flex gap-1 text-zinc-900 mb-3 sm:mb-4 transform group-hover:scale-105 transition-transform origin-left">
                {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 sm:w-4 sm:h-4 fill-current" />
                ))}
            </div>

            {/* Content */}
            <div>
                <h3 className="text-sm sm:text-lg font-bold text-zinc-900 mb-1 sm:mb-2 leading-snug line-clamp-2">
                    {review.title}
                </h3>
                <p className="text-zinc-600 text-[11px] sm:text-sm leading-relaxed font-medium line-clamp-3 sm:line-clamp-none">
                    {review.text}
                </p>
            </div>

            {/* User */}
            <div className="flex items-center gap-2 sm:gap-3 mt-4 sm:mt-6">
                <div className="relative flex-shrink-0">
                    <CustomImage
                        src={review.avatar || review.avatarFallback || ""}
                        alt={review.name || review.location || ""}
                        width={40}
                        height={40}
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover ring-2 ring-white shadow-sm"
                    />
                </div>
                <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-bold text-zinc-900 truncate">
                        {review.name || review.location || ""}
                    </p>
                    <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-zinc-400 truncate">
                        {review.location || ""}
                    </p>
                </div>
            </div>
        </div>
    );
});

ReviewCard.displayName = "ReviewCard";
