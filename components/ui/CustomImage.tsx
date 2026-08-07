"use client";

import React, { useMemo, useState } from "react";
import Image, { ImageProps } from "next/image";
import { cn } from "@/lib/utils";
import { getOptimizedImageUrl } from "@/lib/image-optimizer";

interface CustomImageProps extends ImageProps {
    fallback?: string;
    containerClassName?: string;
}

const GLOBAL_PLACEHOLDER = "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&q=80&auto=format";

const UNOPTIMIZED_HOSTS = [
    "content.jdmagicbox.com",
    "jdmagicbox.com",
    "halohealingtherapies.com",
];

const normalizeSrc = (src: string | undefined, fallback: string): string => {
    if (!src || typeof src !== "string" || src.includes("example.com")) return fallback;
    const trimmed = src.trim();
    if (!trimmed || trimmed.length <= 3) return fallback;
    if (
        trimmed.startsWith("http://") ||
        trimmed.startsWith("https://") ||
        trimmed.startsWith("/") ||
        trimmed.startsWith("data:") ||
        trimmed.startsWith("blob:")
    ) {
        return trimmed;
    }
    if (/\.(jpg|jpeg|png|webp|avif|svg|gif|ico)(\?.*)?$/i.test(trimmed) || trimmed.includes("/")) {
        return `/${trimmed}`;
    }
    return fallback;
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
    const optimizedSrc = useMemo(() => getOptimizedImageUrl(normalizedSrc, 400), [normalizedSrc]);

    const [failedSources, setFailedSources] = useState<Record<string, true>>({});
    const [loadedSrc, setLoadedSrc] = useState("");

    const fallbackSrc = normalizeSrc(fallback, GLOBAL_PLACEHOLDER);
    const effectiveSrc = failedSources[optimizedSrc]
        ? failedSources[fallbackSrc]
            ? GLOBAL_PLACEHOLDER
            : fallbackSrc
        : optimizedSrc;

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
                sizes={props.sizes || "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 384px"}
                className={cn(
                    "duration-300 ease-in-out opacity-100",
                    className
                )}
                loading={effectiveLoading}
                priority={priority}
                fetchPriority={priority ? "high" : (props.fetchPriority as any ?? "auto")}
                onLoad={() => setLoadedSrc(effectiveSrc)}
                onError={handleError}
                referrerPolicy="no-referrer"
            />

            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-zinc-100" aria-hidden="true">
                    <div className="w-5 h-5 border-2 border-zinc-400 border-t-black rounded-full animate-spin" />
                </div>
            )}
        </div>
    );
};

export { CustomImage };
