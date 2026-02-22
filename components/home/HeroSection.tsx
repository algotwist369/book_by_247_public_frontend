"use client"

import React from 'react'
import { SearchBar } from '../ui/SearchBar'
import { ShieldCheck, Sparkles, Star } from 'lucide-react'
import { useRouter } from 'next/navigation'

const HeroSection = () => {
    const router = useRouter();

    const handleSearch = (q?: string, loc?: string) => {
        const params = new URLSearchParams();
        if (q) params.set('q', q);
        if (loc) params.set('location', loc);
        router.push(`/explore?${params.toString()}`);
    };

    return (
        <div>
            <section className="relative w-full h-[500px] sm:h-[600px] md:h-[650px] lg:h-[700px] flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 overflow-hidden">
                {/* Background Overlay with Gradient */}
                <div
                    className="absolute inset-0 bg-cover bg-center z-0"
                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1540555700478-4be289a5150a?q=80&w=2070&auto=format&fit=crop')" }}
                >
                    {/* Multi-layered premium gradient overlay */}
                    <div className="absolute inset-0 bg-zinc-900/40" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#008080]/40 via-transparent to-black/20" />
                </div>

                <div className="relative z-10 w-full max-w-6xl text-center space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight px-2">
                        Over 15,000 Spas & Salons <br className="hidden sm:block" /> Across 25+ Cities
                    </h1>

                    <div className="flex justify-center pt-2 md:pt-4">
                        <SearchBar onSearch={handleSearch} />
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 md:gap-6 text-white/90 pt-4 md:pt-8 font-medium px-2">
                        <span className="flex items-center gap-1.5 md:gap-2 text-xs sm:text-sm md:text-base tracking-wide">
                            <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-white" /> Premium Services
                        </span>
                        <span className="flex items-center gap-1.5 md:gap-2 text-xs sm:text-sm md:text-base tracking-wide">
                            <ShieldCheck className="w-4 h-4 md:w-5 md:h-5 text-white" /> Verified Businesses
                        </span>
                        <span className="flex items-center gap-1.5 md:gap-2 text-xs sm:text-sm md:text-base tracking-wide">
                            <Star className="w-4 h-4 md:w-5 md:h-5 text-white" /> Top Rated
                        </span>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default HeroSection