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
    const [cardSize, setCardSize] = React.useState('70px');

    React.useEffect(() => {
        const updateSize = () => {
            setCardSize(window.innerWidth >= 768 ? '110px' : '70px');
        };
        updateSize();
        window.addEventListener('resize', updateSize);
        return () => window.removeEventListener('resize', updateSize);
    }, []);

    return (
        <div
            onClick={() => onClick(service.title)}
            className="group relative cursor-pointer"
            role="button"
            tabIndex={0}
            aria-label={`Explore ${service.title} category`}
            onKeyDown={(e) => e.key === "Enter" && onClick(service.title)}
        >
            <div
                className="relative rounded-xl sm:rounded-3xl overflow-hidden mb-2 sm:mb-4 border border-zinc-200/10 bg-zinc-200"
                style={{
                    height: cardSize,
                    width: cardSize,
                    margin: '0 auto'
                }}
            >
                <CustomImage
                    src={service.image}
                    alt={service.title}
                    fill
                    unoptimized
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
            </div>
            <h3
                className="font-bold text-black mb-0 md:mb-1.5 capitalize text-center mt-1"
                style={{ fontSize: '11px', lineHeight: '1.2' }}
            >
                {service.title.split(' ').map((word, i, arr) => (
                    <React.Fragment key={i}>
                        {word}
                        {i < arr.length - 1 && <br />}
                    </React.Fragment>
                ))}
            </h3>
        </div>
    );
});

ServiceCard.displayName = "ServiceCard";
