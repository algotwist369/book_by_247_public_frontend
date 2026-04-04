"use client"

import React, { useEffect, useState } from "react"
import Image, { ImageProps } from "next/image"
import { cn } from "@/lib/utils"

interface CustomImageProps extends ImageProps {
    fallback?: string
    containerClassName?: string
}

const GLOBAL_PLACEHOLDER = "https://img.freepik.com/free-photo/stylish-beauty-women-elegent-enjoy-concept_53876-132577.jpg?semt=ais_user_personalization&w=740&q=80";

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
    "halohealingtherapies.com",
];

const isHotlinkProtected = (src: string): boolean => {
    if (!src || (!src.startsWith("http://") && !src.startsWith("https://"))) {
        return false;
    }
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
    const normalizeSrc = (s: string | undefined): string => {
        if (!s) return fallback;
        if (s.startsWith("http://") || s.startsWith("https://") || s.startsWith("/")) {
            return s;
        }
        return `/${s}`;
    };

    // Auto-detect hotlink-protected sources and bypass the optimizer for them
    const shouldUnoptimize = unoptimized ?? isHotlinkProtected(normalizeSrc(src as string ?? ""));
    const [imgSrc, setImgSrc] = useState<string>(normalizeSrc(src as string) || fallback)
    const [isLoading, setIsLoading] = useState(true)
    const [hasError, setHasError] = useState(false)

    // Reset state when src changes
    useEffect(() => {
        const normalized = normalizeSrc(src as string);
        if (src) {
            setImgSrc(normalized)
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
            isFill ? "absolute inset-0" : "h-full w-full",
            containerClassName
        )}>
            <Image
                {...props}
                src={imgSrc}
                alt={alt || "Image"}
                unoptimized={shouldUnoptimize}
                sizes={props.sizes || "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
                className={cn(
                    "duration-500 ease-in-out opacity-100",
                    className
                )}
                onLoad={() => {
                    setIsLoading(false);
                }}
                onError={handleError}
                referrerPolicy="no-referrer"
            />

            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-zinc-200">
                    <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
                </div>
            )}
        </div>
    )
}

export { CustomImage }
