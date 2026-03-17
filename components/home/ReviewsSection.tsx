"use client";

import * as React from "react";
import { ReviewColumn } from "./ReviewColumn";
import { REVIEWS_DATA } from "@/lib/constants";

export const ReviewsSection: React.FC = () => {
    // Split reviews into 4 groups for the animated columns
    const reviewGroups = React.useMemo(() => {
        const groups: any[][] = [[], [], [], []];
        REVIEWS_DATA.forEach((review, i) => groups[i % 4].push(review));
        return groups;
    }, []);

    return (
        <section className="w-full bg-white lg:pb-20 mt-10">
            <div className="max-w-7xl mx-auto px-6">
                <h2 className="text-3xl font-black text-zinc-800 my-10 tracking-tight">
                    What Customers Say
                </h2>

                <div className="relative h-[500px] md:h-[700px] w-full bg-zinc-50/50 rounded-[2rem] overflow-hidden py-12 px-4 border border-zinc-100">
                    {/* TOP FADE */}
                    <div className="pointer-events-none absolute top-0 left-0 w-full h-32 z-20 
                        bg-gradient-to-b from-white via-white/80 to-transparent" />

                    {/* BOTTOM FADE */}
                    <div className="pointer-events-none absolute bottom-0 left-0 w-full h-32 z-20 
                        bg-gradient-to-t from-white via-white/80 to-transparent" />

                    <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 h-full">
                        <ReviewColumn items={reviewGroups[0]} />
                        <ReviewColumn items={reviewGroups[1]} reverse />
                        <div className="hidden lg:block h-full">
                            <ReviewColumn items={reviewGroups[2]} />
                        </div>
                        <div className="hidden lg:block h-full">
                            <ReviewColumn items={reviewGroups[3]} reverse />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
