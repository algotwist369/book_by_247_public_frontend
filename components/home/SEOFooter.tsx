import Link from "next/link";
import React from "react";

const popularSearches = [
  "spa near me",
  "spa in Hosa Road",
  "massage spa Hosa Road",
  "local spa treatments near me",
  "couple spa in Hosa Road",
  "nearest day spa",
  "nearby spa massage",
  "body spa near me",
  "massage service in Hosa Road",
  "best massage spa Hosa Road",
  "couples spa",
  "spa days near me",
  "spa experience",
  "massage spa near me",
  "spa near Hosa Road",
  "massage spa center near me",
  "body spa massage near me",
  "massage therapy massage near me",
  "sports massage near me",
  "best spa Hosa Road",
  "aroma thai spa Hosa Road",
  "deep tissue massage",
  "body massage spa in Hosa Road",
  "luxury spa",
  "relaxation spa",
  "massage center in Hosa Road",
  "luxury massage spa",
  "couple massage in Hosa Road",
  "body spa",
  "near by spa center",
  "thai massage massage near me",
  "near by me massage center",
  "spa wellness center near me",
  "best body massage near me",
  "find massage places near me",
  "luxury spa near me",
  "nearest spa centre",
  "body massage center",
  "best body spa near me",
  "near by thai massage",
  "best massage spa near me",
  "luxury spa weekend near me",
  "massage near me now",
  "massage spa and sauna near me",
  "best spa in location",
  "best massage in location",
  "best body spa in location",
  "best body massage in location",
  "spa & massage services",
  "luxury spa in location",
];

const SEOFooter = () => {
  return (
    <section className="border-t border-zinc-200 bg-white">
      <div className="flex max-w-7xl mx-auto px-4 px-6 md:px-0 py-12 sm:py-16 md:py-20 flex-col gap-10 lg:gap-14">
        <div className="max-w-4xl">
          <h2 className="text-2xl font-bold leading-tight text-zinc-900 sm:text-3xl lg:text-4xl">
            BookBy247 - Find Spas, Salons and Beauty Services Near You
          </h2>

          <p className="mt-3 text-sm leading-relaxed text-zinc-600 sm:text-base">
            BookBy247 is a dedicated beauty and wellness discovery platform for users across India.
            Whether you are searching for a full body massage in Mumbai, a massage spa in Hosa Road, a hair salon in Delhi, a facial in Bangalore,
            bridal makeup in Pune, or a beauty parlour near your area, our platform connects you with verified spas,
            salons, massage centers, skincare studios, nail salons and grooming professionals.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <h3 className="font-bold text-zinc-900">What is BookBy247 Salon and Spa Booking App?</h3>
            <p className="text-sm text-zinc-600">BookBy247 is India&apos;s premier online salon appointment booking app designed for premium spas, hair salons, beauty parlours, and massage centers. Users can effortlessly discover, compare service menus, and book trusted local beauty services online with instant confirmation.</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-zinc-900">Who Can Book Services on BookBy247?</h3>
            <p className="text-sm text-zinc-600">Our platform connects clients searching for top-rated beauty parlours and unisex salons near me for trending treatments. Book local experts for full body massages, luxury spa packages, keratin treatments, deep-cleansing facials, body waxing, gel nail extensions, and professional bridal makeup artists.</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-zinc-900">Top Cities & Locations We Serve</h3>
            <p className="text-sm text-zinc-600">Find the best hair salons, luxury spas, and beauty parlours in major Indian cities including Mumbai, Delhi, Bengaluru, Pune, Hyderabad, and premier neighborhoods nationwide.</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-zinc-900">How to Book Salon Appointments Online?</h3>
            <p className="text-sm text-zinc-600">Customers can filter by city, neighborhood, service type, salon price lists, real-time slot availability, and 100% verified customer reviews. Search by service, local area, or studio name to book salon appointments online instantly without waiting for callbacks.</p>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-base font-semibold text-zinc-900">Popular Spa & Massage Searches</h3>
          <div className="flex flex-wrap gap-2">
            {popularSearches.map((search) => (
              <Link
                key={search}
                href={`/explore?q=${encodeURIComponent(search)}`}
                className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold text-zinc-800 transition-colors hover:border-rose-300 hover:bg-rose-50"
              >
                {search}
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-linear-to-br from-white via-zinc-50 to-rose-50/60 p-6 sm:p-8">
          <div className="grid gap-8 text-sm leading-relaxed md:grid-cols-3 md:gap-10">
            <div className="space-y-3">
              <h3 className="text-base font-semibold text-zinc-900">
                Find Top Spas, Hair Salons &amp; Beauty Parlours Near You
              </h3>
              <p className="text-zinc-600">
                Browse 100% verified luxury day spas, nearby spa massage centers, local unisex salons, premium beauty parlours, and wellness centers. Book trending local services including full body massages, aromatherapy spa packages, deep tissue massage therapy, trendy haircuts, premium hair spas, keratin treatments, hair smoothening, beard grooming, and anti-acne facials.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-base font-semibold text-zinc-900">
                Book Salon Appointments Online Instantly &amp; Securely
              </h3>
              <p className="text-zinc-600">
                Enjoy a seamless online salon booking system featuring real-time calendar availability. Whether you want to book massage therapy, professional haircuts, hydrafacials, facial cleanups, full body waxing, threading, manicures, pedicures, gel nail extensions, custom nail art, body polishing, or professional bridal makeup artists, secure your slot instantly.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-base font-semibold text-zinc-900">
                Compare Salon Service Menu Prices for Every Budget
              </h3>
              <p className="text-zinc-600">
                From budget neighborhood beauty salons and affordable ladies parlours to premium international spas and luxury skin clinics, BookBy247 makes self-care accessible. Effortlessly compare salon service menu cards, read verified customer reviews, and unlock exclusive beauty deals, discounts, and booking offers.
              </p>
            </div>
          </div>

          <div className="mt-8 border-t border-zinc-200 pt-4">
            <p className="max-w-4xl text-xs leading-relaxed text-zinc-500">
              <strong>BookBy247</strong> is India&apos;s leading beauty and wellness marketplace platform helping clients locate trusted day spa services, hair studio salon treatments, certified massage therapy, skincare clinics, hair styling, premium nail care, celebrity bridal makeup, facial waxing, threading, men&apos;s grooming, and holistic wellness solutions across major neighborhoods.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default SEOFooter;

