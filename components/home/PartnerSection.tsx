import React from "react";
import { CheckCircle2, TrendingUp, Laptop } from "lucide-react";
import { CustomImage } from "@/components/ui/CustomImage";

const benefits = [
  {
    icon: TrendingUp,
    title: "Boost Your Visibility",
    description:
      "Get discovered by thousands of clients looking for services in your area.",
  },
  {
    icon: Laptop,
    title: "Smart Management",
    description:
      "Calendar sync, automated reminders, and client management tools in one place.",
  },
  {
    icon: CheckCircle2,
    title: "Verified Pro Status",
    description:
      "Build immediate trust with our verified partner badge on your profile.",
  },
] as const;

export const PartnerSection: React.FC = () => {
  return (
    <section className="w-full bg-linear-to-b from-rose-50 via-rose-50/80 to-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:flex-row lg:items-center lg:gap-16 lg:py-24">
        {/* LEFT CONTENT */}
        <div className="flex-1 space-y-8 text-center lg:text-left">
          <div className="space-y-4">
            <p className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white px-3 py-1 text-xs font-semibold tracking-wide text-rose-800">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-500" aria-hidden="true" />
              Partner with us
            </p>
            <h2 className="text-balance text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
              Grow your spa &amp; salon
              <span className="block text-rose-700">with Bookby247</span>
            </h2>
            <p className="mx-auto max-w-xl text-sm leading-relaxed text-slate-700 sm:text-base">
              Join a curated marketplace of wellness businesses and start receiving quality bookings from day one.
            </p>
          </div>

          <div className="space-y-5">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-3 text-left">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-rose-200 bg-white sm:h-10 sm:w-10">
                  <benefit.icon className="h-4 w-4 text-gray-700 sm:h-5 sm:w-5" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 sm:text-base">
                    {benefit.title}
                  </h3>
                  <p className="text-xs leading-relaxed text-slate-700 sm:text-sm">
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <a
              href="https://business.bookby247.com/free-listing"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center rounded-full bg-slate-900 px-8 py-3 text-sm font-semibold text-white sm:w-auto sm:text-base"
            >
              List your business
            </a>
          </div>
        </div>

        {/* RIGHT IMAGE */}
        <div className="flex-1">
          <div className="mx-auto max-w-md rounded-3xl border border-rose-100 bg-linear-to-br from-white via-rose-50 to-rose-100/60 p-4 sm:max-w-lg sm:p-5 lg:max-w-2xl">
            <CustomImage
              src="https://res.cloudinary.com/dwsv275kv/image/upload/v1774953174/CRM_dashboard__February_2025_overview_y0fj7b.png"
              alt="Business manager dashboard"
              width={800}
              height={600}
              className="h-auto w-full rounded-2xl object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
