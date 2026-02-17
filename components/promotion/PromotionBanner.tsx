import Link from "next/link";
import React from "react";
import { CustomImage } from "../ui/CustomImage";

interface PromotionBannerProps {
    title?: string;
    image?: string;
    link?: string;
}

const PromotionBanner = ({
    title = "best performing business",
    image = "https://d1csarkz8obe9u.cloudfront.net/posterpreviews/therapeutic-spa-massage-center-banner-design-template-6cfb483d03ce5674177adfb160c49455_screen.jpg?ts=1561532760",
    link = "/featured-businesses"
}: PromotionBannerProps) => {
    return (
        <section className="w-full h-137.5 relative overflow-hidden group">
            <Link href={link} className="block w-full h-full relative">
                {/* Banner Image */}
                <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-105">
                    <CustomImage
                        src={image}
                        alt={title}
                        fill
                        className="object-contain"
                        priority
                    />
                    {/* Dark Overlay for better text readability */}
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-300" />
                </div>

                {/* Content Overlay */}
                <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
                    <div className="max-w-4xl space-y-6">
                        <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-white uppercase tracking-tighter leading-none animate-in fade-in slide-in-from-bottom-8 duration-1000">
                            {title}
                        </h2>

                        <div className="pt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <span className="inline-block px-8 py-3 bg-white text-black font-bold rounded-full text-sm uppercase tracking-widest hover:bg-zinc-100 transition-colors">
                                Explore Now
                            </span>
                        </div>
                    </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute bottom-0 left-0 w-full h-32 bg-linear-to-t from-black/60 to-transparent pointer-events-none" />
            </Link>
        </section>
    );
};

export default PromotionBanner;
