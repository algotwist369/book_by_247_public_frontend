import React from "react";
import { CheckCircle2, TrendingUp, Laptop } from "lucide-react";
import { CustomImage } from "@/components/ui/CustomImage";

const benefits = [
  {
    icon: <TrendingUp className="w-5 h-5 text-gray-600" />,
    title: "Boost Your Visibility",
    description:
      "Get discovered by thousands of clients looking for services in your area.",
  },
  {
    icon: <Laptop className="w-5 h-5 text-gray-600" />,
    title: "Smart Management",
    description:
      "Calendar sync, automated reminders, and client management tools in one place.",
  },
  {
    icon: <CheckCircle2 className="w-5 h-5 text-gray-600" />,
    title: "Verified Pro Status",
    description:
      "Build immediate trust with our verified partner badge on your profile.",
  },
];

export const PartnerSection: React.FC = () => {
  return (
    <section className="relative w-full overflow-hidden">
      {/* Base — deep indigo/navy */}
      <div className="absolute inset-0 bg-[#0d0d1a]" />
      {/* Primary glow — violet top-left */}
      <div className="absolute inset-0 z-1" style={{background: 'radial-gradient(ellipse 70% 60% at 20% 10%, rgba(109,40,217,0.55) 0%, transparent 70%)'}} />
      {/* Secondary glow — rose/pink bottom-right */}
      <div className="absolute inset-0 z-1" style={{background: 'radial-gradient(ellipse 60% 50% at 80% 85%, rgba(219,39,119,0.40) 0%, transparent 70%)'}} />
      {/* Accent glow — indigo center */}
      <div className="absolute inset-0 z-1" style={{background: 'radial-gradient(ellipse 50% 40% at 55% 40%, rgba(79,70,229,0.25) 0%, transparent 65%)'}} />
      {/* Vignette */}
      <div className="absolute inset-0 z-2 bg-linear-to-t from-black/60 via-transparent to-black/20" />
      <div className="absolute inset-0 z-2 bg-linear-to-r from-black/30 via-transparent to-black/30" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* LEFT CONTENT */}
          <div className="space-y-8 text-center lg:text-left">
            {/* Heading */}
            <div className="space-y-4">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight">
                Grow your business <br className="hidden sm:block" />
                with logoname
              </h2>

              <p className="text-white text-base sm:text-lg md:text-xl max-w-xl mx-auto lg:mx-0">
                Join the largest network of spas and salons and start receiving
                bookings instantly.
              </p>
            </div>

            {/* Benefits */}
            <div className="space-y-6 max-w-xl mx-auto lg:mx-0">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 text-left"
                >
                  <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center shrink-0">
                    {benefit.icon}
                  </div>
                  <div>
                    <h3 className="text-gray-500 font-semibold text-lg">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-600 text-sm sm:text-base">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div>
              <a
                href="https://business.logoname.com/free-listing"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block w-full sm:w-auto bg-white text-black font-bold px-8 py-4 rounded-full text-base sm:text-lg hover:bg-zinc-200 transition-all duration-200 shadow-xl shadow-white/5 text-center"
              >
                List Your Business
              </a>
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="relative w-full max-w-md sm:max-w-lg lg:max-w-none mx-auto">
            <div className="relative bg-white p-3 sm:p-4 rounded-3xl shadow-2xl">
              <CustomImage
                src="https://res.cloudinary.com/dxpxcptn4/image/upload/v1771396607/reports-dashboard_ap3qhp.png"
                alt="Business Manager Dashboard"
                width={800}
                height={600}
                className="w-full h-auto rounded-2xl object-cover"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
