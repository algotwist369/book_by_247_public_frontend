import React from "react";

const SEOFooter = () => {
  return (
    <section className="border-t border-zinc-200 bg-white">
      <div className="flex max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-12 sm:py-16 md:py-20 flex-col gap-10 lg:gap-14">
        <div className="max-w-4xl">
          <h2 className="text-2xl font-bold leading-tight text-zinc-900 sm:text-3xl lg:text-4xl">
          Bookby247 - Your Trusted Beauty & Wellness Booking Platform
          </h2>

          <p className="mt-3 text-sm leading-relaxed text-zinc-600 sm:text-base">
            Discover, compare, and book the best spas and salons near you.
            Bookby247 connects customers with verified beauty professionals,
            making self-care simple, transparent, and accessible.
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-linear-to-br from-white via-zinc-50 to-rose-50/60 p-6 sm:p-8">
          <div className="grid gap-8 text-sm leading-relaxed md:grid-cols-3 md:gap-10">
            <div className="space-y-3">
              <h3 className="text-base font-semibold text-zinc-900">
                Find the Best Spas &amp; Salons
              </h3>
              <p className="text-zinc-600">
                Browse thousands of verified spas, salons, and wellness centers.
                Compare prices, explore real customer reviews, and choose services
                that match your preferences and budget.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-base font-semibold text-zinc-900">
                Book Instantly &amp; Securely
              </h3>
              <p className="text-zinc-600">
                Enjoy seamless online booking with real-time availability.
                Whether it&apos;s a massage, haircut, facial, manicure, pedicure, or bridal
                makeup, you can confirm appointments in seconds.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-base font-semibold text-zinc-900">
                Beauty for Every Budget
              </h3>
              <p className="text-zinc-600">
                From neighborhood salons to luxury spa resorts, Bookby247 makes self-care
                accessible to everyone with clear pricing and curated offers.
              </p>
            </div>
          </div>

          <div className="mt-8 border-t border-zinc-200 pt-4">
            <p className="max-w-4xl text-xs leading-relaxed text-zinc-500">
              Bookby247 is a beauty and wellness discovery platform helping users find
              trusted spa services, salon treatments, massage therapy, skincare, hair
              styling, grooming, and holistic wellness solutions across the country.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SEOFooter;
