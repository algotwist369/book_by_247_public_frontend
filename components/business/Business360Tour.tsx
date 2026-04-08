"use client";

import React, { useState } from 'react';
import { CustomImage } from '../ui/CustomImage';
import { Globe, View } from 'lucide-react'; // Changed Scan3d to View as standard lucide icons might vary
import Modal from '@/components/ui/Modal';
import ImageSlider from '@/components/ui/ImageSlider';

// Dummy data for 360 tours
interface Business360TourProps {
    images_360: string[];
}

const Business360Tour = ({ images_360 }: Business360TourProps) => {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    const openModal = (index: number) => setSelectedIndex(index);
    const closeModal = () => setSelectedIndex(null);

    if (!images_360 || images_360.length === 0) return null;

    // Clean all 360 URLs
    const clean360Images = images_360.map(url => url.trim().replace(/[`]/g, '').trim());

    return (
        <>
            <div className="grid grid-cols-3 gap-3 md:gap-4 h-64 md:h-80 rounded-2xl overflow-hidden">
                {/* Main Large Image */}
                <div
                    className="col-span-2 row-span-2 relative h-full bg-zinc-100 group cursor-pointer overflow-hidden rounded-xl"
                    onClick={() => openModal(0)}
                >
                    <div className="absolute inset-0 bg-zinc-200 animate-pulse" />
                    <iframe
                        src={clean360Images[0]}
                        className="w-full h-full border-0 pointer-events-none scale-110"
                        loading="lazy"
                        title="360 Tour Preview"
                    />
                    {/* Click Overlay */}
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors z-10" />
                    <div className="absolute inset-0 flex items-center justify-center z-20">
                        <div className="bg-white/20 backdrop-blur-md p-4 rounded-full border border-white/50 group-hover:scale-110 transition-transform shadow-xl">
                            <Globe className="w-8 h-8 text-white" />
                        </div>
                        <span className="absolute bottom-4 left-4 text-white text-[10px] font-bold uppercase tracking-widest bg-black/60 backdrop-blur-sm px-2 py-1 rounded-md border border-white/20 shadow-lg">360 View</span>
                    </div>
                </div>

                {/* Side Images */}
                <div className="col-span-1 row-span-2 flex flex-col gap-3 md:gap-4 h-full">
                    {/* Top Side Image */}
                    {clean360Images.length > 1 && (
                        <div
                            className="relative flex-1 bg-zinc-100 overflow-hidden group cursor-pointer rounded-xl"
                            onClick={() => openModal(1)}
                        >
                            <div className="absolute inset-0 bg-zinc-200 animate-pulse" />
                            <iframe
                                src={clean360Images[1]}
                                className="w-full h-full border-0 pointer-events-none scale-125"
                                loading="lazy"
                                title="360 Tour Preview 2"
                            />
                            {/* Click Overlay */}
                            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors z-10" />
                            <div className="absolute inset-0 flex items-center justify-center z-20">
                                <Globe className="w-6 h-6 text-white drop-shadow-lg" />
                            </div>
                        </div>
                    )}

                    {/* Bottom Side Image / More Indicator */}
                    {clean360Images.length > 2 && (
                        <div
                            className="relative flex-1 bg-zinc-100 overflow-hidden group cursor-pointer rounded-xl"
                            onClick={() => openModal(2)}
                        >
                            <div className="absolute inset-0 bg-zinc-200 animate-pulse" />
                            <iframe
                                src={clean360Images[2]}
                                className="w-full h-full border-0 pointer-events-none scale-125"
                                loading="lazy"
                                title="360 Tour Preview 3"
                            />
                            {/* Click Overlay */}
                            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors z-10" />
                            <div className="absolute inset-0 flex items-center justify-center z-20">
                                <Globe className="w-6 h-6 text-white drop-shadow-lg" />
                            </div>

                            {clean360Images.length > 3 && (
                                <>
                                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors z-30" />
                                    <div className="absolute inset-0 flex items-center justify-center z-40">
                                        <span className="text-white font-bold text-xl group-hover:scale-110 transition-transform drop-shadow-lg">
                                            +{clean360Images.length - 3}
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
                        images={clean360Images}
                        initialIndex={selectedIndex}
                        type="360"
                    />
                )}
            </Modal>
        </>
    );
};

export default Business360Tour;
