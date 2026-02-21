import React from "react";
import { Clock, MapPin, Star } from "lucide-react";
import { CustomImage } from "@/components/ui/CustomImage";

const features = [
  {
    icon: <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-white" />,
    title: "Instant Booking",
    description:
      "Confirmation in under 60 seconds. No more waiting for callbacks.",
  },
  {
    icon: <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-white" />,
    title: "Hyper-local Search",
    description:
      "Discover hidden gems right in your neighborhood with real-time availability.",
  },
  {
    icon: <Star className="w-5 h-5 sm:w-6 sm:h-6 text-white" />,
    title: "Authentic Reviews",
    description:
      "Only verified customers can leave reviews, ensuring you get the real picture.",
  },
];

const FeatureSection = () => {
  return (
    <section className="bg-zinc-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* LEFT CONTENT */}
          <div className="space-y-10 text-center lg:text-left">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight">
              Why people love <br className="hidden sm:block" />
              booking with us
            </h2>

            <div className="space-y-8 max-w-xl mx-auto lg:mx-0">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-4 text-left">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/10 rounded-full flex items-center justify-center shrink-0">
                    {feature.icon}
                  </div>

                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-zinc-400 text-sm sm:text-base">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="relative w-full max-w-md sm:max-w-lg lg:max-w-none mx-auto">
            <div className="relative aspect-4/5 sm:aspect-square rounded-3xl overflow-hidden border border-white/10 shadow-xl">
              <CustomImage
                src="https://res.cloudinary.com/dxpxcptn4/image/upload/v1771399342/4_hb33eu.png"
                alt="Professional Spa Service"
                fill
                className="object-cover"
              />
            </div>

            {/* Floating Stats Card */}
            <div className="absolute bottom-4 left-4 sm:-bottom-6 sm:-left-6 bg-white p-4 sm:p-6 rounded-2xl shadow-2xl text-zinc-900">
              <p className="text-2xl sm:text-3xl lg:text-4xl font-black">
                4.9/5
              </p>
              <p className="text-[10px] sm:text-xs font-bold text-zinc-500 uppercase tracking-widest mt-1">
                Average Rating
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
