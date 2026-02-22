
import Image from 'next/image'
import { ShieldCheck, Sparkles, Star } from 'lucide-react'
import { HeroSearch } from './HeroSearch'

const HeroSection = () => {
    return (
        <div>
            <section
                aria-label="Hero — Book spas and salons"
                className="relative w-full h-[500px] sm:h-[600px] md:h-[650px] lg:h-[700px] flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 overflow-hidden"
            >
                {/* Gradient overlays */}
                <div className="absolute inset-0 bg-zinc-900/40 z-[1]" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-[1]" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#008080]/40 via-transparent to-black/20 z-[1]" />

                <div className="relative z-10 w-full max-w-6xl text-center space-y-6 md:space-y-8">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight px-2">
                        Over 15,000 Spas &amp; Salons <br className="hidden sm:block" /> Across 25+ Cities
                    </h1>

                    {/* Client-side interactive search bar */}
                    <HeroSearch />

                    <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 md:gap-6 text-white/90 pt-4 md:pt-8 font-medium px-2">
                        <span className="flex items-center gap-1.5 md:gap-2 text-xs sm:text-sm md:text-base tracking-wide">
                            <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-white" aria-hidden="true" /> Premium Services
                        </span>
                        <span className="flex items-center gap-1.5 md:gap-2 text-xs sm:text-sm md:text-base tracking-wide">
                            <ShieldCheck className="w-4 h-4 md:w-5 md:h-5 text-white" aria-hidden="true" /> Verified Businesses
                        </span>
                        <span className="flex items-center gap-1.5 md:gap-2 text-xs sm:text-sm md:text-base tracking-wide">
                            <Star className="w-4 h-4 md:w-5 md:h-5 text-white" aria-hidden="true" /> Top Rated
                        </span>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default HeroSection