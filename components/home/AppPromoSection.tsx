import React from "react";
import { Smartphone, Zap, Bell, Gift } from "lucide-react";
import { CustomImage } from "@/components/ui/CustomImage";

export const AppPromoSection: React.FC = () => {
  return (
    <section className="w-full bg-gradient-to-b from-white via-zinc-50 to-white">

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:py-24">

        <div className="rounded-3xl border border-zinc-200 bg-gradient-to-br from-white via-zinc-50 to-rose-50/60 p-6 sm:p-10 lg:p-16">

          <div className="flex flex-col lg:grid lg:grid-cols-2 gap-10 lg:gap-12 items-center">

            {/* ================= IMAGE ONLY ================= */}
            <div className="relative flex justify-center lg:order-2">
              <div className="relative w-full max-w-[280px] sm:max-w-[320px] aspect-[9/19] rotate-3 overflow-hidden">
                <CustomImage
                  src="https://res.cloudinary.com/dwsv275kv/image/upload/v1774952731/cr3_exqizu.png"
                  alt="App Interface"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* ================= CONTENT ================= */}
            <div className="mt-10 space-y-8 text-center lg:mt-0 lg:text-left">

              <div className="space-y-4">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-zinc-900 leading-tight">
                  Book Top-Rated Beauty Parlours on the BookBy247 App
                </h2>

                <p className="text-zinc-600 text-base sm:text-lg max-w-xl mx-auto lg:mx-0">
                  Book hair & beauty services faster, track salon appointments instantly, and unlock exclusive spa discounts and salon offers through the free BookBy247 web app.
                </p>
              </div>

              {/* Feature Grid */}
              <div className="grid grid-cols-2 gap-4 pt-4 sm:grid-cols-2 sm:gap-6">
                {[
                  {
                    icon: <Zap className="w-5 h-5 text-zinc-700" />,
                    title: "1-Tap Salon & Spa Booking",
                  },
                  {
                    icon: <Bell className="w-5 h-5 text-zinc-700" />,
                    title: "Automated SMS Reminders",
                  },
                  {
                    icon: <Gift className="w-5 h-5 text-zinc-700" />,
                    title: "Cashback & Spa/Salon Offers",
                  },
                  {
                    icon: <Smartphone className="w-5 h-5 text-zinc-700" />,
                    title: "Contactless Salon & Spa QR Check-in",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-center gap-3 lg:justify-start"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 sm:h-10 sm:w-10">
                      {item.icon}
                    </div>
                    <span className="text-zinc-800 text-xs font-medium sm:text-sm">
                      {item.title}
                    </span>
                  </div>
                ))}
              </div>

            </div>

          </div>
        </div>
      </div>
    </section>
  );
};