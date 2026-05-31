
import { Check, ShieldCheck, Sparkles, Star } from 'lucide-react'
import { HeroSearch } from './HeroSearch'

const HeroSection = () => {
    return (
        <section aria-label="Hero - Book spas and salons" className="relative isolate overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-b from-rose-50 via-white to-fuchsia-50" aria-hidden="true" />
            <div className="absolute inset-0" aria-hidden="true">
                <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-fuchsia-300/40 blur-3xl" />
                <div className="absolute -right-24 top-16 h-80 w-80 rounded-full bg-rose-300/45 blur-3xl" />
                <div className="absolute left-1/2 top-72 h-72 w-72 -translate-x-1/2 rounded-full bg-pink-300/35 blur-3xl" />
            </div>

            <div className="relative mx-auto max-w-7xl py-14 sm:py-16 md:py-20">
                <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
                    <div className="text-center lg:text-left">
                        <div className="hidden mx-auto md:inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white/70 px-3 py-1 text-xs font-semibold tracking-wide text-rose-900 lg:mx-0">
                            <span className="h-1.5 w-1.5 rounded-full bg-rose-500" aria-hidden="true" />
                            100% Verified Spas, Salons, & Beauty Parlours Near You
                        </div>

                        <h1 className="md:mt-5 text-balance text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
                            Find & Book the Best Spas, Salons & Makeup Artists
                            <span className="block text-rose-700">Near You In India.</span>
                        </h1>

                        <p className="hidden md:block mt-4 max-w-2xl text-pretty text-base leading-relaxed text-slate-700 sm:text-lg lg:max-w-xl">
                            <b>Find and book</b> luxury spa treatments, full body massages, <b>hair salons, keratin treatments, hair spas</b>, facials, waxing, threading, <b>nail extensions, beard grooming, and professional bridal makeup artists</b> at <b>top-rated local beauty parlours. Filter by city, neighborhood, </b> or <b>near me, compare salon prices and verified customer reviews</b>, and <b>book salon appointments online instantly.</b>
                        </p>

                        <div className="mt-7 max-w-2xl lg:max-w-xl">
                            <HeroSearch />
                        </div>

                        <div className="mt-7 grid grid-cols-3 gap-2 sm:gap-3 px-6 md:px-0">
                            <div className="rounded-lg border border-rose-200 bg-white/70 px-2 py-2 text-center">
                                <Sparkles className="mx-auto h-4 w-4 text-rose-700" aria-hidden="true" />
                                <div className="mt-1 text-[11px] font-semibold leading-tight text-slate-900 sm:text-sm sm:leading-normal">
                                    Luxury Spas & Salons
                                </div>
                            </div>
                            <div className="rounded-lg border border-rose-200 bg-white/70 px-2 py-2 text-center">
                                <ShieldCheck className="mx-auto h-4 w-4 text-rose-700" aria-hidden="true" />
                                <div className="mt-1 text-[11px] font-semibold leading-tight text-slate-900 sm:text-sm sm:leading-normal">
                                    5-Star Rated Parlours
                                </div>
                            </div>
                            <div className="rounded-lg border border-rose-200 bg-white/70 px-2 py-2 text-center">
                                <Star className="mx-auto h-4 w-4 text-rose-700" aria-hidden="true" />
                                <div className="mt-1 text-[11px] font-semibold leading-tight text-slate-900 sm:text-sm sm:leading-normal">
                                    Best Deals & Offers
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="hidden md:block mx-auto w-full max-w-xl lg:max-w-none">
                        <div className="rounded-2xl border border-rose-200 bg-white/70 p-5 sm:p-6">
                            <div className="grid grid-cols-2 gap-3 sm:gap-4">
                                <div className="rounded-xl border border-rose-200 bg-white/70 p-4">
                                    <div className="text-xs font-semibold tracking-wide text-slate-600">Businesses</div>
                                    <h2 className="mt-1 text-2xl font-extrabold text-slate-900">15,000+</h2>
                                    <p className="mt-1 text-xs text-slate-600">Top-Rated Salons & Spas</p>
                                </div>
                                <div className="rounded-xl border border-rose-200 bg-white/70 p-4">
                                    <div className="text-xs font-semibold tracking-wide text-slate-600">Cities</div>
                                    <h2 className="mt-1 text-2xl font-extrabold text-slate-900">25+</h2>
                                    <p className="mt-1 text-xs text-slate-600">Major Cities in India</p>
                                </div>
                                <div className="col-span-2 rounded-xl border border-rose-200 bg-white/70 p-4">
                                    <div className="flex flex-col items-start gap-3 sm:flex-row">
                                        <div
                                            className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg border border-rose-200 bg-white/70 sm:h-9 sm:w-9"
                                            aria-hidden="true"
                                        >
                                            <Check className="h-4 w-4 text-rose-700 sm:h-5 sm:w-5" />
                                        </div>
                                        <div className="min-w-0">
                                            <h1 className="text-sm font-semibold leading-snug text-slate-900 sm:leading-normal">
                                                100% Verified Salon & Spa Listings
                                            </h1>
                                            <h2 className="mt-1 text-sm leading-relaxed text-slate-700">
                                                Transparent salon pricing, detailed rate lists, customer reviews, exact location addresses, and instant online slot booking so you can book with confidence.
                                            </h2>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 rounded-xl border border-rose-200 bg-white/70 p-4">
                                <h2 className="text-md font-semibold tracking-wide text-slate-600">Popular Searches</h2>
                                <div className="mt-2 grid grid-cols-3 gap-2 text-center">
                                    <p className="rounded-lg border border-rose-200 bg-white/70 px-2 py-2 text-[11px] font-semibold text-slate-900 sm:text-xs">
                                        Top Hair Salon Near Me
                                    </p>
                                    <p className="rounded-lg border border-rose-200 bg-white/70 px-2 py-2 text-[11px] font-semibold text-slate-900 sm:text-xs">
                                        Bridal Makeup Packages Price
                                    </p>
                                    <p className="rounded-lg border border-rose-200 bg-white/70 px-2 py-2 text-[11px] font-semibold text-slate-900 sm:text-xs">
                                        Nail Art Studio Near Me
                                    </p>
                                    <p className="rounded-lg border border-rose-200 bg-white/70 px-2 py-2 text-[11px] font-semibold text-slate-900 sm:text-xs">
                                        Best Keratin Treatment Salon
                                    </p>
                                    <p className="rounded-lg border border-rose-200 bg-white/70 px-2 py-2 text-[11px] font-semibold text-slate-900 sm:text-xs">
                                        Hydrafacial & Skin Clinics
                                    </p>
                                    <p className="rounded-lg border border-rose-200 bg-white/70 px-2 py-2 text-[11px] font-semibold text-slate-900 sm:text-xs">
                                        Luxury Spa & Body Massage
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default HeroSection
