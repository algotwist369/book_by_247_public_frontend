"use client";

import * as React from "react";
import { ReviewCard } from "./ReviewCard";

interface Review {
    title: string;
    text: string;
    name: string;
    location: string;
    avatar: string;
}

interface ReviewColumnProps {
    items: Review[];
    reverse?: boolean;
}

export const ReviewColumn: React.FC<ReviewColumnProps> = ({ items, reverse }) => {
    return (
        <div className="relative overflow-hidden h-full group">
            <div
                className={`flex flex-col gap-6 will-change-transform
                    ${reverse ? "animate-[slideDown_260s_linear_infinite]" : "animate-[slideUp_260s_linear_infinite]"}
                    group-hover:[animation-play-state:paused]
                `}
            >
                {[...items, ...items, ...items].map((review, i) => (
                    <ReviewCard key={i} review={review} />
                ))}
            </div>
        </div>
    );
};
