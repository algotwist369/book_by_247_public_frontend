import React from "react";
import { Smartphone, Zap, Bell, Gift } from "lucide-react";

export const AppPromoSection: React.FC = () => {
  return (
    <section className="w-full bg-[#d6d2cd]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28">
        <div className="relative bg-zinc-900 rounded-3xl lg:rounded-[3rem] p-6 sm:p-10 lg:p-20 overflow-hidden">

          <div className="relative z-10 flex flex-col lg:grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* ✅ MOBILE PHONE FIRST */}
            <div className="relative flex justify-center lg:order-2">
              <div className="relative w-60 sm:w-72 aspect-[9/19] bg-zinc-800 rounded-[2.5rem] border-[6px] border-zinc-700 shadow-2xl overflow-hidden rotate-3 sm:rotate-6">
                
                <div className="absolute top-0 inset-x-0 h-5 bg-zinc-900 rounded-b-xl mx-12 z-20" />

                <img
                  src="https://databox.com/wp-content/themes/databox/inc/img/product/mobile/wizard-5.png"
                  alt="App Interface"
                  className="w-full h-full object-cover opacity-70"
                />

                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-900/40 to-black/80 flex flex-col justify-end p-5 gap-3">
                  <div className="w-10 h-10 bg-[#008080] rounded-xl flex items-center justify-center shadow-lg">
                    <Smartphone className="text-white w-5 h-5" />
                  </div>

                  <p className="text-white font-extrabold text-lg">
                    Book your next treatment.
                  </p>
                </div>
              </div>
            </div>

            {/* ✅ DESKTOP CONTENT (HIDDEN ON MOBILE) */}
            <div className="hidden lg:block space-y-10">
              <div className="space-y-4">
                <h2 className="text-5xl font-extrabold text-white leading-tight">
                  Better results <br />
                  on the app
                </h2>

                <p className="text-zinc-400 text-xl max-w-xl">
                  Book faster, track appointments, and get exclusive mobile-only deals.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-8">
                {[
                  { icon: <Zap className="w-5 h-5 text-[#008080]" />, title: "One-tap Book", desc: "Confirmation in seconds" },
                  { icon: <Bell className="w-5 h-5 text-[#008080]" />, title: "Real-time alerts", desc: "Never miss an appointment" },
                  { icon: <Gift className="w-5 h-5 text-[#008080]" />, title: "Exclusive Rewards", desc: "App-only points & gifts" },
                  { icon: <Smartphone className="w-5 h-5 text-[#008080]" />, title: "Digital QR Entry", desc: "Contactless check-ins" },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">{item.title}</h4>
                      <p className="text-zinc-500 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ✅ MOBILE DOWNLOAD BUTTONS ONLY */}
            <div className="lg:hidden w-full space-y-4 mt-6">
              <button className="w-full bg-white text-black px-6 py-4 rounded-2xl font-bold">
                Download on App Store
              </button>
              <button className="w-full bg-white text-black px-6 py-4 rounded-2xl font-bold">
                Get it on Google Play
              </button>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
