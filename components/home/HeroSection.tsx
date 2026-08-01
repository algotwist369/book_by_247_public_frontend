import { HeroSearch } from './HeroSearch'

const HeroSection = () => {
    return (
        <section
            aria-labelledby="hero-title"
            className="relative isolate overflow-hidden min-h-[420px] sm:min-h-[500px] lg:min-h-[600px]"
        >
            <div
                className="absolute inset-0 bg-gradient-to-b from-rose-50 via-white to-fuchsia-50"
                aria-hidden="true"
            />

            <div className="absolute inset-0" aria-hidden="true">
                <div className="absolute -left-24 top-10 h-56 w-56 rounded-full bg-fuchsia-300/40 blur-3xl transform-gpu sm:h-72 sm:w-72" />
                <div className="absolute -right-24 top-16 h-60 w-60 rounded-full bg-rose-300/45 blur-3xl transform-gpu sm:h-80 sm:w-80" />
                <div className="absolute left-1/2 top-72 h-56 w-56 -translate-x-1/2 rounded-full bg-pink-300/35 blur-3xl transform-gpu sm:h-72 sm:w-72" />
            </div>

            <div className="relative mx-auto flex min-h-[420px] max-w-7xl items-center justify-center px-4 py-12 sm:min-h-[500px] sm:px-6 sm:py-16 lg:min-h-[450px] lg:px-8 lg:py-16">
                <div className="flex w-full flex-col items-center justify-center text-center">
                    <h1
                        id="hero-title"
                        className="max-w-5xl text-[40px] font-bold leading-[1.08] text-slate-900 sm:text-[52px] md:text-[58px] lg:text-[64px]"
                    >
                        Discover & Book Top Salons, Spas & Beauty Businesses
                        <span className="block text-rose-700">
                            Near You.
                        </span>
                    </h1>

                    {/* Search Center Fix */}
                    <div className="mt-6 flex w-full justify-center sm:mt-8">
                        <div className="w-full max-w-[1024px]">
                            <HeroSearch />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default HeroSection