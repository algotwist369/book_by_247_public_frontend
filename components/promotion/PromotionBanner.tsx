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
    image = "https://res.cloudinary.com/dxpxcptn4/image/upload/v1771920468/Book_now_yueyz3.png",
    link = "/explore"
}: PromotionBannerProps) => {
    return (
        <section className="w-full relative overflow-hidden px-4 sm:px-6 md:px-10">
            <Link href={link} className="block w-full relative aspect-[16/6] sm:aspect-[16/5] md:aspect-[16/4] rounded-xl overflow-hidden">

                <CustomImage
                    src={image}
                    alt={title}
                    fill
                    className="object-cover"
                    priority={false}
                />

                <div className="absolute inset-0 bg-black/40" />

            </Link>
        </section>
    );
};

export default PromotionBanner;
