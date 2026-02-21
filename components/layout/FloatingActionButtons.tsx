"use client";

import React from "react";
import { Store, CalendarCheck } from "lucide-react";
import Link from "next/link";

export const FloatingActionButtons = () => {
    return (
        <div className="fixed right-0 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-2 pointer-events-none">
            {/* Free Listing Button */}
            <Link
                href="/business"
                className="pointer-events-auto bg-[#008080] text-white flex flex-col items-center gap-2 md:gap-4 py-4 px-2 md:py-6 md:px-3 rounded-l-xl md:rounded-l-2xl transition-colors hover:bg-[#006666]"
            >
                <Store className="w-4 h-4 md:w-5 md:h-5" />
                <span className="text-[9px] md:text-[11px] font-black uppercase tracking-[0.2em] [writing-mode:vertical-rl] rotate-180">
                    Free Listing
                </span>
            </Link>

            {/* Book Demo Button */}
            <Link
                href="/book-demo"
                className="pointer-events-auto bg-[#f15a24] text-white flex flex-col items-center gap-2 md:gap-4 py-4 px-2 md:py-6 md:px-3 rounded-l-xl md:rounded-l-2xl transition-colors hover:bg-[#d94e1c]"
            >
                <CalendarCheck className="w-4 h-4 md:w-5 md:h-5" />
                <span className="text-[9px] md:text-[11px] font-black uppercase tracking-[0.2em] [writing-mode:vertical-rl] rotate-180">
                    Book Demo
                </span>
            </Link>
        </div>
    );
};
