"use client";

import * as React from "react";
import { LucideIcon } from "lucide-react";
import { CustomImage } from "../ui/CustomImage";

interface ServiceCardProps {
    service: {
        id: string | number;
        title: string;
        description: string;
        image: string;
        icon: LucideIcon;
    };
    onClick: (title: string) => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = React.memo(({ service, onClick }) => {
    const Icon = service.icon;

    return (
        <div
            onClick={() => onClick(service.title)}
            className="group relative cursor-pointer"
            role="button"
            tabIndex={0}
            aria-label={`Explore ${service.title} category`}
            onKeyDown={(e) => e.key === "Enter" && onClick(service.title)}
        >
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-zinc-100 mb-4">
                <CustomImage
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60" />

                <div className="absolute top-2 right-2 sm:top-3 sm:right-3 md:top-4 md:right-4 w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20">
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" aria-hidden="true" />
                </div>

                <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 md:bottom-6 md:left-6 md:right-6">
                    <h3 className="text-xs sm:text-sm md:text-lg font-semibold md:font-bold text-white mb-0 md:mb-1.5">{service.title}</h3>
                </div>
            </div>
        </div>
    );
});

ServiceCard.displayName = "ServiceCard";
