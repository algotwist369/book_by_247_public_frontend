"use client";

import React from "react";
import { Store, Sparkles } from "lucide-react";
import Link from "next/link";

export const FloatingActionButtons = () => {
    return (
        <div className="hidden md:flex fixed right-0 top-1/2 -translate-y-1/2 z-50 flex-col pointer-events-none">
            {/* Premium Free Listing Floating Badge (Book Demo Removed) */}
            <Link
                href="/free-listing"
                className="group pointer-events-auto flex items-center gap-3 bg-slate-950/90 hover:bg-black text-white py-5 px-3 rounded-l-2xl border-l border-t border-b border-indigo-500/40 shadow-xl shadow-indigo-950/30 backdrop-blur-xl transition-all duration-300 hover:-translate-x-1.5"
                title="Add your business to BookBy247 network for free"
            >
                <div className="flex flex-col items-center gap-3">
                    {/* Glowing Store Icon Badge */}
                    <div className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/40 group-hover:scale-110 transition-transform">
                        <Store className="w-4 h-4 text-amber-300" />
                        <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                        </span>
                    </div>

                    {/* Vertical Typography Badge */}
                    <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-black uppercase tracking-[0.25em] [writing-mode:vertical-rl] rotate-180 bg-gradient-to-b from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent group-hover:to-white transition-colors">
                            Free Listing
                        </span>
                    </div>
                </div>
            </Link>
        </div>
    );
};
