
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
                {/* Base — deep indigo/navy */}
                <div className="absolute inset-0 bg-slate-950" />

                {/* Primary glow — violet top-left */}
                <div className="absolute inset-0 z-10" style={{background: 'radial-gradient(ellipse 70% 60% at 20% 10%, rgba(109,40,217,0.55) 0%, transparent 70%)'}} />

                {/* Secondary glow — rose/pink bottom-right */}
                <div className="absolute inset-0 z-10" style={{background: 'radial-gradient(ellipse 60% 50% at 80% 85%, rgba(219,39,119,0.40) 0%, transparent 70%)'}} />

                {/* Accent glow — indigo center */}
                <div className="absolute inset-0 z-10" style={{background: 'radial-gradient(ellipse 50% 40% at 55% 40%, rgba(79,70,229,0.25) 0%, transparent 65%)'}} />

                {/* Vignette — top & bottom darkness for legibility */}
                <div className="absolute inset-0 z-20 bg-linear-to-t from-slate-950/80 via-transparent to-slate-950/40" />
                <div className="absolute inset-0 z-20 bg-linear-to-r from-slate-950/40 via-transparent to-slate-950/40" />

                {/* Subtle noise texture */}
                <div className="absolute inset-0 opacity-[0.05] mix-blend-overlay z-30 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />

                <div className="relative z-10 w-full max-w-6xl text-center space-y-6 md:space-y-8">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-gray-600 leading-tight tracking-tight px-2">
                        Over 15,000 Spas &amp; Salons <br className="hidden sm:block" /> Across 25+ Cities
                    </h1>

                    {/* Client-side interactive search bar */}
                    <HeroSearch />

                    <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 md:gap-6 text-gray-600 pt-4 md:pt-8 font-medium px-2">
                        <span className="flex items-center gap-1.5 md:gap-2 text-xs sm:text-sm md:text-base tracking-wide">
                            <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-gray-600" aria-hidden="true" /> Premium Services
                        </span>
                        <span className="flex items-center gap-1.5 md:gap-2 text-xs sm:text-sm md:text-base tracking-wide">
                            <ShieldCheck className="w-4 h-4 md:w-5 md:h-5 text-gray-600" aria-hidden="true" /> Verified Businesses
                        </span>
                        <span className="flex items-center gap-1.5 md:gap-2 text-xs sm:text-sm md:text-base tracking-wide">
                            <Star className="w-4 h-4 md:w-5 md:h-5 text-gray-600" aria-hidden="true" /> Top Rated
                        </span>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default HeroSection