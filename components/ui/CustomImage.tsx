"use client"

import React, { useMemo, useState } from "react"
import Image, { ImageProps } from "next/image"
import { cn } from "@/lib/utils"

interface CustomImageProps extends ImageProps {
    fallback?: string
    containerClassName?: string
}

const GLOBAL_PLACEHOLDER = "https://img.freepik.com/free-photo/stylish-beauty-women-elegent-enjoy-concept_53876-132577.jpg?semt=ais_user_personalization&w=740&q=80";

const UNOPTIMIZED_HOSTS = [
    "googleusercontent.com",
    "lh3.googleusercontent.com",
    "maps.googleapis.com",
    "content.jdmagicbox.com",
    "jdmagicbox.com",
    "images.unsplash.com",
    "cdn.pixabay.com",
    "halohealingtherapies.com",
    "img.youtube.com",
];

const normalizeSrc = (src: string | undefined, fallback: string): string => {
    if (!src || src.includes("example.com")) return fallback;
    if (src.startsWith("http://") || src.startsWith("https://") || src.startsWith("/")) {
        return src;
    }
    return `/${src}`;
};

const isHotlinkProtected = (src: string): boolean => {
    if (!src || (!src.startsWith("http://") && !src.startsWith("https://"))) {
        return false;
    }
    try {
        const { hostname } = new URL(src);
        if (hostname.includes("example.com")) return true;
        return UNOPTIMIZED_HOSTS.some((host) => hostname === host || hostname.endsWith(`.${host}`));
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
    loading,
    priority,
    ...props
}: CustomImageProps) => {
    const normalizedSrc = useMemo(() => normalizeSrc(src as string | undefined, fallback), [src, fallback]);
    const [failedSources, setFailedSources] = useState<Record<string, true>>({});
    const [loadedSrc, setLoadedSrc] = useState("");

    const fallbackSrc = normalizeSrc(fallback, GLOBAL_PLACEHOLDER);
    const effectiveSrc = failedSources[normalizedSrc]
        ? failedSources[fallbackSrc]
            ? GLOBAL_PLACEHOLDER
            : fallbackSrc
        : normalizedSrc;
    const shouldUnoptimize = unoptimized ?? isHotlinkProtected(effectiveSrc);
    const isFill = !!props.fill;
    const effectiveLoading = priority ? "eager" : (loading ?? "lazy");
    const isLoading = loadedSrc !== effectiveSrc;

    const handleError = () => {
        setFailedSources((previous) => ({
            ...previous,
            [effectiveSrc]: true,
        }));
    };

    return (
        <div className={cn(
            "relative overflow-hidden bg-zinc-100",
            isFill ? "absolute inset-0" : "h-full w-full",
            containerClassName
        )}>
            <Image
                {...props}
                src={effectiveSrc}
                alt={alt || "BookBy247 spa salon and beauty service image"}
                unoptimized={shouldUnoptimize}
                sizes={props.sizes || "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
                className={cn(
                    "duration-500 ease-in-out opacity-100",
                    className
                )}
                loading={effectiveLoading}
                priority={priority}
                onLoad={() => setLoadedSrc(effectiveSrc)}
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
