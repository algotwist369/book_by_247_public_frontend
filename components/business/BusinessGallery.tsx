"use client";

import React, { useState } from 'react';
import Modal from '@/components/ui/Modal';
import ImageSlider from '@/components/ui/ImageSlider';
import { CustomImage } from '../ui/CustomImage';

interface BusinessGalleryProps {
    images: string[];
}

const BusinessGallery = ({ images }: BusinessGalleryProps) => {
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
                        src={images[0]}
                        alt="Gallery main"
                        fill
                        priority
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                </div>
                {/* Side Images */}
                <div className="col-span-1 row-span-2 flex flex-col gap-3 md:gap-4 h-full">
                    {/* Top Side Image */}
                    {images.length > 1 && (
                        <div
                            className="relative flex-1 bg-zinc-100 overflow-hidden group cursor-pointer"
                            onClick={() => openModal(1)}
                        >
                            <CustomImage
                                src={images[1]}
                                alt="Gallery 1"
                                fill
                                priority
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                        </div>
                    )}

                    {/* Bottom Side Image / More Indicator */}
                    {images.length > 2 && (
                        <div
                            className="relative flex-1 bg-zinc-100 overflow-hidden group cursor-pointer"
                            onClick={() => openModal(2)}
                        >
                            <CustomImage
                                src={images[2]}
                                alt="Gallery 2"
                                fill
                                priority
                                className={`object-cover transition-transform duration-700 group-hover:scale-105 ${images.length > 3 ? 'opacity-50' : ''}`}
                            />
                            {images.length > 3 && (
                                <>
                                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-white font-bold text-xl group-hover:scale-110 transition-transform">
                                            +{images.length - 3}
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
                        images={images}
                        initialIndex={selectedIndex}
                    />
                )}
            </Modal>
        </>
    );
};

export default BusinessGallery;
