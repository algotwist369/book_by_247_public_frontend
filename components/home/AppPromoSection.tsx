import React from "react";
import { Smartphone, Zap, Bell, Gift } from "lucide-react";

export const AppPromoSection: React.FC = () => {
  return (
    <section className="relative w-full bg-white overflow-hidden">

      {/* Soft Glow Background (lighter on mobile) */}
      <div className="hidden sm:block absolute -top-40 -left-40 w-96 h-96 bg-purple-100 blur-[120px] rounded-full" />
      <div className="hidden sm:block absolute -bottom-40 -right-40 w-96 h-96 bg-cyan-100 blur-[120px] rounded-full" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20 lg:py-32">

        <div className="bg-white border border-zinc-200 rounded-3xl sm:rounded-[3rem] p-6 sm:p-10 lg:p-20">

          <div className="flex flex-col lg:grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* ================= PHONE MOCKUP ================= */}
            <div className="relative flex justify-center lg:order-2 rotate-3">

              {/* smaller on mobile, bigger on larger screens */}
              <div className="relative w-[200px] xs:w-[230px] sm:w-[260px] md:w-[300px] lg:w-[320px] aspect-[9/19]">

                {/* Outer Frame */}
                <div className="absolute inset-0 rounded-[2.5rem] sm:rounded-[3rem] bg-gradient-to-br from-zinc-200 via-zinc-100 to-zinc-300" />

                {/* Metallic Edge */}
                <div className="absolute inset-[3px] rounded-[2.3rem] sm:rounded-[2.8rem] bg-black" />

                {/* Screen */}
                <div className="absolute inset-[8px] sm:inset-[10px] rounded-[2rem] sm:rounded-[2.6rem] overflow-hidden bg-black">

                  {/* Dynamic Island */}
                  <div className="absolute top-2 sm:top-3 left-1/2 -translate-x-1/2 w-20 sm:w-28 h-5 sm:h-6 bg-black rounded-full z-20" />

                  <img
                    src="https://res.cloudinary.com/dxpxcptn4/image/upload/v1771396713/new_mob_vb1vtz.png"
                    alt="App Interface"
                    className="w-full h-full object-cover"
                  />

                  {/* Light reflection */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-white/5 pointer-events-none" />
                </div>

                {/* Buttons hidden on very small screens */}
                <div className="hidden sm:block absolute left-[-4px] top-24 w-1 h-10 bg-zinc-300 rounded-full" />
                <div className="hidden sm:block absolute left-[-4px] top-36 w-1 h-14 bg-zinc-300 rounded-full" />
                <div className="hidden sm:block absolute right-[-4px] top-32 w-1 h-16 bg-zinc-300 rounded-full" />

              </div>
            </div>

            {/* ================= CONTENT ================= */}
            <div className="space-y-8 text-center lg:text-left md:block hidden">

              <div className="space-y-4 sm:space-y-6">
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-zinc-900 leading-tight">
                  A Premium <br />
                  <span className="bg-gradient-to-r from-purple-500 to-cyan-500 bg-clip-text text-transparent">
                    Experience Inside Your Pocket
                  </span>
                </h2>

                <p className="text-zinc-600 text-base sm:text-lg max-w-xl mx-auto lg:mx-0">
                  Book faster, manage appointments effortlessly, and unlock
                  exclusive members-only privileges through our mobile app.
                </p>
              </div>

              {/* Feature Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 pt-4">
                {[
                  {
                    icon: <Zap className="w-5 h-5 text-purple-500" />,
                    title: "Instant Booking",
                  },
                  {
                    icon: <Bell className="w-5 h-5 text-cyan-500" />,
                    title: "Smart Reminders",
                  },
                  {
                    icon: <Gift className="w-5 h-5 text-purple-500" />,
                    title: "VIP Rewards",
                  },
                  {
                    icon: <Smartphone className="w-5 h-5 text-cyan-500" />,
                    title: "QR Check-in",
                  },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-center lg:justify-start gap-3">
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
