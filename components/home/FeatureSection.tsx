import React from "react";
import { FiCheckCircle, FiClock, FiMapPin, FiStar } from "react-icons/fi";
import { CustomImage } from "@/components/ui/CustomImage";

const features = [
  {
    icon: FiClock,
    title: "Instant Salon & Spa Appointment Booking",
    description:
      "Secure your full body massage, men's haircut, hydrafacial, body waxing, nail extensions, or grooming appointments online instantly with real-time salon slot confirmation.",
  },
  {
    icon: FiMapPin,
    title: `Hyper-Local "Near Me" Salon Finder `,
    description:
      "Instantly locate top-rated hair salons, luxury day spas, local beauty parlours, and certified massage centers mapped directly to your specific city area or neighborhood.",
  },
  {
    icon: FiStar,
    title: "Transparent Salon Prices & Verified Reviews",
    description:
      "Easily check salon service menu card prices, read 100% verified customer reviews, and compare local ratings before booking your next treatment.",
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
              WHY CUSTOMERS BOOK WITH US
            </p>
            <h2 className="text-balance text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
              Search, Compare & Book Trusted
              <span className="block text-rose-700">Spas, Salons & Beauty Parlours</span>
            </h2>
          </div>

          <div className="space-y-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-3 text-left">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900">
                  <feature.icon className="h-8 w-8 text-white sm:h-12 sm:w-12" aria-hidden="true" />
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
                Based on verified customer reviews across top spas and salons in India.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
