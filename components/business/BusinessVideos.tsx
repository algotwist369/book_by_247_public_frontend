"use client";

import React, { useState } from 'react';
import { CustomImage } from '../ui/CustomImage';
import { Play } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import ImageSlider from '@/components/ui/ImageSlider';

// Dummy data for Videos (Using thumbnails)
const videoThumbnails = [
    "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=1920",
    "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&q=80&w=1920",
    "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=1920",
    "https://images.unsplash.com/photo-1552693673-1bf958298935?auto=format&fit=crop&q=80&w=1920",
];

const BusinessVideos = () => {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    const openModal = (index: number) => setSelectedIndex(index);
    const closeModal = () => setSelectedIndex(null);

    return (
        <>
            <div className="grid grid-cols-3 gap-3 md:gap-4 h-64 md:h-80 rounded-2xl overflow-hidden">
                {/* Main Large Image */}
                <div
                    className="col-span-2 row-span-2 relative h-full bg-zinc-100 group cursor-pointer"
                    onClick={() => openModal(0)}
                >
                    <CustomImage
                        src={videoThumbnails[0]}
                        alt="Video Main"
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-white/20 backdrop-blur-md p-4 rounded-full border border-white/50 group-hover:scale-110 transition-transform">
                            <Play className="w-8 h-8 text-white fill-white" />
                        </div>
                    </div>
                </div>

                {/* Side Images */}
                <div className="col-span-1 row-span-2 flex flex-col gap-3 md:gap-4 h-full">
                    {/* Top Side Image */}
                    {videoThumbnails.length > 1 && (
                        <div
                            className="relative flex-1 bg-zinc-100 overflow-hidden group cursor-pointer"
                            onClick={() => openModal(1)}
                        >
                            <CustomImage
                                src={videoThumbnails[1]}
                                alt="Video 1"
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                            <div className="absolute top-2 right-2 bg-black/50 p-1.5 rounded-full backdrop-blur-sm">
                                <Play className="w-4 h-4 text-white fill-white" />
                            </div>
                        </div>
                    )}

                    {/* Bottom Side Image / More Indicator */}
                    {videoThumbnails.length > 2 && (
                        <div
                            className="relative flex-1 bg-zinc-100 overflow-hidden group cursor-pointer"
                            onClick={() => openModal(2)}
                        >
                            <CustomImage
                                src={videoThumbnails[2]}
                                alt="Video 2"
                                fill
                                className={`object-cover transition-transform duration-700 group-hover:scale-105 ${videoThumbnails.length > 3 ? 'opacity-50' : ''}`}
                            />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                            <div className="absolute top-2 right-2 bg-black/50 p-1.5 rounded-full backdrop-blur-sm">
                                <Play className="w-4 h-4 text-white fill-white" />
                            </div>

                            {videoThumbnails.length > 3 && (
                                <>
                                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-white font-bold text-xl group-hover:scale-110 transition-transform">
                                            +{videoThumbnails.length - 3}
                                        </span>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <Modal isOpen={selectedIndex !== null} onClose={closeModal}>
                {selectedIndex !== null && (
                    <ImageSlider
                        images={videoThumbnails}
                        initialIndex={selectedIndex}
                    />
                )}
            </Modal>
        </>
    );
};

export default BusinessVideos;
