import React from "react";

const SEOFooter = () => {
  return (
    <section className="border-t border-zinc-200 bg-white">
      <div className="flex max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-12 sm:py-16 md:py-20 flex-col gap-10 lg:gap-14">
        <div className="max-w-4xl">
          <h2 className="text-2xl font-bold leading-tight text-zinc-900 sm:text-3xl lg:text-4xl">
            Bookby247 - Find Spas, Salons and Beauty Services Near You
          </h2>

          <p className="mt-3 text-sm leading-relaxed text-zinc-600 sm:text-base">
            Bookby247 is a dedicated beauty and wellness discovery platform for users across India.
            Whether you are searching for a full body massage in Mumbai, a hair salon in Delhi, a facial in Bangalore,
            bridal makeup in Pune, or a beauty parlour near your area, our platform connects you with verified spas,
            salons, massage centers, skincare studios, nail salons and grooming professionals.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <h3 className="font-bold text-zinc-900">What is Bookby247?</h3>
            <p className="text-sm text-zinc-600">A marketplace for discovering and booking spa, salon, massage, skincare, haircare, makeup, nail and grooming services online.</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-zinc-900">Who is it for?</h3>
            <p className="text-sm text-zinc-600">Designed for people searching for trusted self-care services, from quick haircuts to luxury spa days and bridal beauty appointments.</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-zinc-900">Where we serve?</h3>
            <p className="text-sm text-zinc-600">Available in major Indian cities including Mumbai, Delhi, Bangalore, Pune, Hyderabad, and growing nationwide.</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-zinc-900">What can you do?</h3>
            <p className="text-sm text-zinc-600">Search by location or service, compare prices and reviews, check business details, and book appointments 24/7 with instant confirmation.</p>
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-linear-to-br from-white via-zinc-50 to-rose-50/60 p-6 sm:p-8">
          <div className="grid gap-8 text-sm leading-relaxed md:grid-cols-3 md:gap-10">
            <div className="space-y-3">
              <h3 className="text-base font-semibold text-zinc-900">
                Find Spas, Salons &amp; Beauty Parlours
              </h3>
              <p className="text-zinc-600">
                Browse verified spas, salons, beauty parlours and wellness centers
                for full body massage, aromatherapy, deep tissue massage, haircuts,
                hair spa, keratin treatment, beard grooming, facials and skincare.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-base font-semibold text-zinc-900">
                Book Instantly &amp; Securely
              </h3>
              <p className="text-zinc-600">
                Enjoy seamless online booking with real-time availability.
                Whether it&apos;s massage therapy, haircut, facial cleanup, waxing,
                threading, manicure, pedicure, nail art, body polishing or bridal
                makeup, you can confirm appointments in seconds.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-base font-semibold text-zinc-900">
                Beauty for Every Budget
              </h3>
              <p className="text-zinc-600">
                From neighborhood salons and affordable beauty parlours to premium
                spas and luxury wellness centers, Bookby247 makes self-care accessible
                with clear pricing, trusted reviews and curated offers.
              </p>
            </div>
          </div>

          <div className="mt-8 border-t border-zinc-200 pt-4">
            <p className="max-w-4xl text-xs leading-relaxed text-zinc-500">
              Bookby247 is a beauty and wellness discovery platform helping users find
              trusted spa services, salon treatments, massage therapy, skincare,
              hair styling, nail care, bridal makeup, waxing, threading, grooming,
              and holistic wellness solutions across India.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SEOFooter;
