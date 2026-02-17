"use client";

import React, { useState } from 'react';
import { CustomImage } from '../ui/CustomImage';
import { Globe, View } from 'lucide-react'; // Changed Scan3d to View as standard lucide icons might vary
import Modal from '@/components/ui/Modal';
import ImageSlider from '@/components/ui/ImageSlider';

// Dummy data for 360 tours
const tourImages = [
    "https://images.unsplash.com/photo-1596178060671-7a80dc8059ea?auto=format&fit=crop&q=80&w=1920",
    "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&q=80&w=1920",
    "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=1920",
    "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=1920",
];

const Business360Tour = () => {
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
                        src={tourImages[0]}
                        alt="360 Tour Main"
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-white/20 backdrop-blur-md p-4 rounded-full border border-white/50 group-hover:scale-110 transition-transform">
                            <Globe className="w-8 h-8 text-white" />
                        </div>
                    </div>
                </div>

                {/* Side Images */}
                <div className="col-span-1 row-span-2 flex flex-col gap-3 md:gap-4 h-full">
                    {/* Top Side Image */}
                    {tourImages.length > 1 && (
                        <div
                            className="relative flex-1 bg-zinc-100 overflow-hidden group cursor-pointer"
                            onClick={() => openModal(1)}
                        >
                            <CustomImage
                                src={tourImages[1]}
                                alt="360 Tour 1"
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                            <div className="absolute top-2 right-2 bg-black/50 p-1.5 rounded-full backdrop-blur-sm">
                                <Globe className="w-4 h-4 text-white" />
                            </div>
                        </div>
                    )}

                    {/* Bottom Side Image / More Indicator */}
                    {tourImages.length > 2 && (
                        <div
                            className="relative flex-1 bg-zinc-100 overflow-hidden group cursor-pointer"
                            onClick={() => openModal(2)}
                        >
                            <CustomImage
                                src={tourImages[2]}
                                alt="360 Tour 2"
                                fill
                                className={`object-cover transition-transform duration-700 group-hover:scale-105 ${tourImages.length > 3 ? 'opacity-50' : ''}`}
                            />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                            {/* Small icon if it's just an image */}
                            <div className="absolute top-2 right-2 bg-black/50 p-1.5 rounded-full backdrop-blur-sm">
                                <Globe className="w-4 h-4 text-white" />
                            </div>

                            {tourImages.length > 3 && (
                                <>
                                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-white font-bold text-xl group-hover:scale-110 transition-transform">
                                            +{tourImages.length - 3}
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
                        images={tourImages}
                        initialIndex={selectedIndex}
                    />
                )}
            </Modal>
        </>
    );
};

export default Business360Tour;
