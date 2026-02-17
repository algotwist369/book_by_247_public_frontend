"use client"

import React, { useState } from "react"
import Image, { ImageProps } from "next/image"
import { cn } from "@/lib/utils"

interface CustomImageProps extends ImageProps {
    fallback?: string
    containerClassName?: string
}

const GLOBAL_PLACEHOLDER = "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=2070&auto=format&fit=crop";

const CustomImage = ({
    src,
    alt,
    className,
    containerClassName,
    fallback = GLOBAL_PLACEHOLDER,
    unoptimized = true, // Force unoptimized by default to bypass local proxy issues
    ...props
}: CustomImageProps) => {
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
                unoptimized={unoptimized}
                sizes={props.sizes || "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
                className={cn(
                    "duration-700 ease-in-out",
                    isLoading ? "scale-105 blur-lg grayscale" : "scale-100 blur-0 grayscale-0",
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
