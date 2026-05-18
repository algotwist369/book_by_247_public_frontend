import React from "react";
import { FiCheckCircle, FiClock, FiMapPin, FiStar } from "react-icons/fi";
import { CustomImage } from "@/components/ui/CustomImage";

const features = [
  {
    icon: FiClock,
    title: "Instant spa and salon booking",
    description:
      "Book massage, haircut, facial, waxing, nail and grooming appointments online without waiting for callbacks.",
  },
  {
    icon: FiMapPin,
    title: "Hyper-local beauty search",
    description:
      "Find salons, spas, beauty parlours and massage centers near your city, area or neighborhood.",
  },
  {
    icon: FiStar,
    title: "Verified reviews and prices",
    description:
      "Compare service menus, ratings, reviews and pricing before choosing the right wellness partner.",
  },
] as const;

const FeatureSection = () => {
  return (
    <section className="bg-gradient-to-b from-slate-50 via-slate-50/80 to-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:flex-row lg:items-center lg:gap-16 lg:py-24">
        {/* LEFT CONTENT */}
        <div className="flex-1 space-y-8 text-center lg:text-left">
          <div className="space-y-3">
            <p className="inline-flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-widest text-rose-700 lg:justify-start">
              <FiCheckCircle className="h-4 w-4 text-rose-700" aria-hidden="true" />
              Why guests choose us
            </p>
            <h2 className="text-balance text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
              Search, compare and book
              <span className="block text-rose-700">trusted beauty services</span>
            </h2>
          </div>

          <div className="space-y-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-3 text-left">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900">
                  <feature.icon className="h-5 w-5 text-white sm:h-6 sm:w-6" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 sm:text-base">
                    {feature.title}
                  </h3>
                  <p className="text-xs leading-relaxed text-slate-700 sm:text-sm">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT IMAGE + STATS */}
        <div className="flex-1">
          <div className="mx-auto max-w-md rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-rose-50/60 p-4 sm:max-w-lg sm:p-5 lg:max-w-2xl">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl sm:aspect-square">
              <CustomImage
                src="https://res.cloudinary.com/dwsv275kv/image/upload/v1774788053/service1_ta4znw.png"
                alt="Professional spa service"
                fill
                className="object-cover"
              />
            </div>
            <div className="mt-4 flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <div>
                <p className="text-xl font-extrabold text-slate-900 sm:text-2xl">4.9/5</p>
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                  Average rating
                </p>
              </div>
              <p className="text-xs text-slate-600 sm:text-sm">
                Based on verified bookings across top partners.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
