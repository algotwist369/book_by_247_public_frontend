import React from "react";

const SEOFooter = () => {
  return (
    <section className="max-w-7xl mx-auto px-6 py-24 mt-20 border-t border-zinc-200">

      <div className="max-w-4xl">
        <h2 className="text-zinc-900 text-3xl md:text-4xl font-bold leading-tight">
          bookby247 – Your Trusted Beauty & Wellness Booking Platform
        </h2>

        <p className="mt-4 text-zinc-600 text-base leading-relaxed">
          Discover, compare, and book the best spas and salons near you.
          bookby247 connects customers with verified beauty professionals,
          making self-care simple, transparent, and accessible.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-10 mt-16 text-sm leading-relaxed">

        {/* Column 1 */}
        <div className="space-y-4">
          <h3 className="text-zinc-900 font-semibold text-base">
            Find the Best Spas & Salons
          </h3>
          <p className="text-zinc-600">
            Browse thousands of verified spas, salons, and wellness centers.
            Compare prices, explore real customer reviews, and choose services
            that match your preferences and budget.
          </p>
        </div>

        {/* Column 2 */}
        <div className="space-y-4">
          <h3 className="text-zinc-900 font-semibold text-base">
            Book Instantly & Securely
          </h3>
          <p className="text-zinc-600">
            Enjoy seamless online booking with real-time availability.
            Whether it's a Swedish massage, haircut, facial, manicure,
            pedicure, or bridal makeup - book your appointment in seconds.
          </p>
        </div>

        {/* Column 3 */}
        <div className="space-y-4">
          <h3 className="text-zinc-900 font-semibold text-base">
            Beauty for Every Budget
          </h3>
          <p className="text-zinc-600">
            From affordable neighborhood salons to luxury spa resorts,
            bookby247 ensures self-care is accessible to everyone.
            Discover exclusive deals, discounts, and premium experiences.
          </p>
        </div>

      </div>

      <div className="mt-16 pt-8 border-t border-zinc-200">
        <p className="text-xs text-zinc-500 leading-relaxed max-w-4xl">
          bookby247 is a leading beauty and wellness discovery platform,
          helping users find trusted spa services, salon treatments,
          massage therapy, skincare, hair styling, grooming, and
          holistic wellness solutions across the country.
        </p>
      </div>

    </section>
  );
};

export default SEOFooter;
