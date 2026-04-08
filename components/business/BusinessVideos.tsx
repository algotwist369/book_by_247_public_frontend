"use client";

import React, { useState } from 'react';
import { CustomImage } from '../ui/CustomImage';
import { Play } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import ImageSlider from '@/components/ui/ImageSlider';

interface BusinessVideosProps {
    videos: string[];
}

const getYouTubeThumbnail = (url: string) => {
    if (!url) return null;
    const cleanUrl = url.trim().replace(/[`]/g, '').trim();
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
   
    return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null;
};

const BusinessVideos = ({ videos }: BusinessVideosProps) => {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    const openModal = (index: number) => setSelectedIndex(index);
    const closeModal = () => setSelectedIndex(null);

    if (!videos || videos.length === 0) return null;

    return (
        <>
            <div className="grid grid-cols-3 gap-3 md:gap-4 h-64 md:h-80 rounded-2xl overflow-hidden">
                {/* Main Large Image */}
                <div
                    className="col-span-2 row-span-2 relative h-full bg-zinc-100 group cursor-pointer"
                    onClick={() => openModal(0)}
                >
                    <CustomImage
                        src={getYouTubeThumbnail(videos[0]) || ''}
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
                    {videos.length > 1 && (
                        <div
                            className="relative flex-1 bg-zinc-100 overflow-hidden group cursor-pointer"
                            onClick={() => openModal(1)}
                        >
                            <CustomImage
                                src={getYouTubeThumbnail(videos[1]) || ''}
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
                    {videos.length > 2 && (
                        <div
                            className="relative flex-1 bg-zinc-100 overflow-hidden group cursor-pointer"
                            onClick={() => openModal(2)}
                        >
                            <CustomImage
                                src={getYouTubeThumbnail(videos[2]) || ''}
                                alt="Video 2"
                                fill
                                className={`object-cover transition-transform duration-700 group-hover:scale-105 ${videos.length > 3 ? 'opacity-50' : ''}`}
                            />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                            <div className="absolute top-2 right-2 bg-black/50 p-1.5 rounded-full backdrop-blur-sm">
                                <Play className="w-4 h-4 text-white fill-white" />
                            </div>

                            {videos.length > 3 && (
                                <>
                                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-white font-bold text-xl group-hover:scale-110 transition-transform">
                                            +{videos.length - 3}
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
                        images={videos}
                        initialIndex={selectedIndex}
                        type="video"
                    />
                )}
            </Modal>
        </>
    );
};

export default BusinessVideos;
