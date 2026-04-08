"use client";

import React, { useState } from 'react';
import { CustomImage } from './CustomImage';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ImageSliderProps {
    images: string[];
    initialIndex?: number;
    type?: 'image' | 'video' | '360';
}

const ImageSlider = ({ images, initialIndex = 0, type = 'image' }: ImageSliderProps) => {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const [direction, setDirection] = useState(0);

    const getEmbedUrl = (url: string) => {
        if (!url) return '';
        const cleanUrl = url.trim().replace(/[`]/g, '').trim();

        if (type === 'video') {
            let videoId = '';
            if (cleanUrl.includes('youtube.com/shorts/')) {
                videoId = cleanUrl.split('shorts/')[1]?.split('?')[0];
            } else if (cleanUrl.includes('youtube.com/embed/')) {
                videoId = cleanUrl.split('embed/')[1]?.split('?')[0];
            } else if (cleanUrl.includes('v=')) {
                videoId = cleanUrl.split('v=')[1]?.split('&')[0];
            } else if (cleanUrl.includes('youtu.be/')) {
                videoId = cleanUrl.split('youtu.be/')[1]?.split('?')[0];
            }

            if (videoId) {
                const origin = typeof window !== 'undefined' ? window.location.origin : '';
                return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&autoplay=1&mute=1&enablejsapi=1${origin ? `&origin=${encodeURIComponent(origin)}` : ''}`;
            }
        }
        return cleanUrl;
    };

    const slideVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 1000 : -1000,
            opacity: 0
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 1000 : -1000,
            opacity: 0
        })
    };

    const swipeConfidenceThreshold = 10000;
    const swipePower = (offset: number, velocity: number) => {
        return Math.abs(offset) * velocity;
    };

    const paginate = (newDirection: number) => {
        setDirection(newDirection);
        let nextIndex = currentIndex + newDirection;

        // Loop around
        if (nextIndex < 0) nextIndex = images.length - 1;
        if (nextIndex >= images.length) nextIndex = 0;

        setCurrentIndex(nextIndex);
    };

    const isEmbed = type === 'video' || type === '360';

    return (
        <div className="relative w-full h-full min-h-[50vh] md:min-h-[70vh] bg-black rounded-lg overflow-hidden flex items-center justify-center">

            <AnimatePresence initial={false} custom={direction}>
                <motion.div
                    key={currentIndex}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                        x: { type: "spring", stiffness: 300, damping: 30 },
                        opacity: { duration: 0.2 }
                    }}
                    drag={isEmbed ? false : "x"}
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={1}
                    onDragEnd={(e, { offset, velocity }) => {
                        const swipe = swipePower(offset.x, velocity.x);

                        if (swipe < -swipeConfidenceThreshold) {
                            paginate(1);
                        } else if (swipe > swipeConfidenceThreshold) {
                            paginate(-1);
                        }
                    }}
                    className="absolute w-full h-full"
                >
                    {isEmbed ? (
                        <div className="w-full h-full flex items-center justify-center p-4 md:p-12 bg-zinc-950">
                            <iframe
                                src={getEmbedUrl(images[currentIndex])}
                                className="w-full h-full rounded-2xl border-0 shadow-2xl"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                                allowFullScreen
                                title={type === 'video' ? "YouTube video player" : "360 Tour player"}
                                loading="lazy"
                            />
                        </div>
                    ) : (
                        <CustomImage
                            src={images[currentIndex]}
                            alt={`Slide ${currentIndex + 1}`}
                            fill
                            className="object-contain"
                            priority
                        />
                    )}
                </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <button
                className="absolute left-4 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-all hidden md:block"
                onClick={() => paginate(-1)}
            >
                <ChevronLeft className="w-8 h-8" />
            </button>
            <button
                className="absolute right-4 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-all hidden md:block"
                onClick={() => paginate(1)}
            >
                <ChevronRight className="w-8 h-8" />
            </button>

            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-black/50 text-white/90 font-medium text-sm backdrop-blur-md border border-white/10">
                {currentIndex + 1} / {images.length}
            </div>
        </div>
    );
};

export default ImageSlider;
