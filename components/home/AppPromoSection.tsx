import React from "react";
import { Smartphone, Zap, Bell, Gift } from "lucide-react";
import { CustomImage } from "@/components/ui/CustomImage";

export const AppPromoSection: React.FC = () => {
  return (
    <section className="w-full bg-white">

      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 py-16 sm:py-20 lg:py-28">

        <div className="bg-white border border-zinc-200 rounded-3xl p-6 sm:p-10 lg:p-16">

          <div className="flex flex-col lg:grid lg:grid-cols-2 gap-12 items-center">

            {/* ================= PHONE MOCKUP ================= */}
            <div className="relative flex justify-center lg:order-2">

              <div className="relative w-[200px] sm:w-[200px] md:w-[200px] aspect-[9/19] rotate-3">

                {/* Outer Frame */}
                <div className="absolute inset-0 rounded-[2.5rem] bg-zinc-200" />

                {/* Metallic Edge */}
                <div className="absolute inset-[3px] rounded-[2.3rem] bg-black" />

                {/* Screen */}
                <div className="absolute inset-[8px] rounded-[2rem] overflow-hidden bg-black">

                  {/* Top notch */}
                  <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-full z-20" />

                  <CustomImage
                    src="https://res.cloudinary.com/dxpxcptn4/image/upload/v1771396713/new_mob_vb1vtz.png"
                    alt="App Interface"
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Side Buttons */}
                <div className="hidden sm:block absolute left-[-4px] top-24 w-1 h-10 bg-zinc-400 rounded-full" />
                <div className="hidden sm:block absolute left-[-4px] top-36 w-1 h-14 bg-zinc-400 rounded-full" />
                <div className="hidden sm:block absolute right-[-4px] top-32 w-1 h-16 bg-zinc-400 rounded-full" />

              </div>
            </div>

            {/* ================= CONTENT ================= */}
            <div className="space-y-8 text-center lg:text-left md:block hidden">

              <div className="space-y-4">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-zinc-900 leading-tight">
                  A Premium Experience Inside Your Pocket
                </h2>

                <p className="text-zinc-600 text-base sm:text-lg max-w-xl mx-auto lg:mx-0">
                  Book faster, manage appointments effortlessly, and unlock
                  exclusive members-only privileges through our mobile app.
                </p>
              </div>

              {/* Feature Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                {[
                  {
                    icon: <Zap className="w-5 h-5 text-zinc-700" />,
                    title: "Instant Booking",
                  },
                  {
                    icon: <Bell className="w-5 h-5 text-zinc-700" />,
                    title: "Smart Reminders",
                  },
                  {
                    icon: <Gift className="w-5 h-5 text-zinc-700" />,
                    title: "VIP Rewards",
                  },
                  {
                    icon: <Smartphone className="w-5 h-5 text-zinc-700" />,
                    title: "QR Check-in",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-center lg:justify-start gap-3"
                  >
                    <div className="w-10 h-10 bg-zinc-100 border border-zinc-200 rounded-xl flex items-center justify-center">
                      {item.icon}
                    </div>
                    <span className="text-zinc-800 font-medium text-sm sm:text-base">
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