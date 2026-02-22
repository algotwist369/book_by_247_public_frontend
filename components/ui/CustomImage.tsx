"use client"

import React, { useState } from "react"
import Image, { ImageProps } from "next/image"
import { cn } from "@/lib/utils"

interface CustomImageProps extends ImageProps {
    fallback?: string
    containerClassName?: string
}

const GLOBAL_PLACEHOLDER = "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=2070&auto=format&fit=crop";

// Domains that block proxy requests (hotlink protected). Images from these
// hosts must be served directly by the browser, not through Next.js's optimizer.
const UNOPTIMIZED_HOSTS = [
    "googleusercontent.com",
    "lh3.googleusercontent.com",
    "maps.googleapis.com",
    "content.jdmagicbox.com",
    "jdmagicbox.com",
    "images.unsplash.com",
    "cdn.pixabay.com",
];

const isHotlinkProtected = (src: string): boolean => {
    try {
        const { hostname } = new URL(src);
        return UNOPTIMIZED_HOSTS.some((h) => hostname === h || hostname.endsWith("." + h));
    } catch {
        return false;
    }
};

const CustomImage = ({
    src,
    alt,
    className,
    containerClassName,
    fallback = GLOBAL_PLACEHOLDER,
    unoptimized,
    ...props
}: CustomImageProps) => {
    // Auto-detect hotlink-protected sources and bypass the optimizer for them
    const shouldUnoptimize = unoptimized ?? isHotlinkProtected(src as string ?? "");
    const [imgSrc, setImgSrc] = useState<string>(src as string || fallback)
    const [isLoading, setIsLoading] = useState(true)
    const [hasError, setHasError] = useState(false)

    // Reset state when src changes
    React.useEffect(() => {
        if (src) {
            setImgSrc(src as string)
            setIsLoading(true)
            setHasError(false)
        } else {
            setImgSrc(fallback)
            setIsLoading(false)
        }
    }, [src, fallback])

    const handleError = () => {
        if (!hasError) {
            setHasError(true)
            setImgSrc(fallback)
        } else if (imgSrc !== GLOBAL_PLACEHOLDER) {
            setImgSrc(GLOBAL_PLACEHOLDER)
        }
        setIsLoading(false)
    }

    const isFill = !!props.fill;

    return (
        <div className={cn(
            "relative overflow-hidden bg-zinc-100",
            isFill && "h-full w-full",
            containerClassName
        )}>
            <Image
                {...props}
                src={imgSrc}
                alt={alt || "Image"}
                unoptimized={shouldUnoptimize}
                sizes={props.sizes || "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
                className={cn(
                    "duration-500 ease-in-out",
                    isLoading ? "opacity-0" : "opacity-100",
                    className
                )}
                onLoad={() => {
                    setIsLoading(false);
                }}
                onError={handleError}
            />
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-zinc-200">
                    <div className="w-6 h-6 border-2 border-[#008080] border-t-transparent rounded-full animate-spin" />
                </div>
            )}
        </div>
    )
}

export { CustomImage }
