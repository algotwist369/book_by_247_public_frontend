"use client";

import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface FilterState {
    sortBy: string;
    priceRange: string;
    rating: number;
    amenities: string[];
    gender: string;
}

interface ExploreFilterModalProps {
    isOpen: boolean;
    onClose: () => void;
    onApply: (filters: FilterState) => void;
    currentFilters: FilterState;
}

const ExploreFilterModal = ({ isOpen, onClose, onApply, currentFilters }: ExploreFilterModalProps) => {
    const [tempFilters, setTempFilters] = useState<FilterState>(currentFilters);

    useEffect(() => {
        if (isOpen) {
            setTempFilters(currentFilters);
        }
    }, [isOpen, currentFilters]);

    const sortOptions = ['Recommended', 'Rating (High to Low)', 'Distance (Nearest First)', 'Price (Low to High)', 'Price (High to Low)'];
    const priceOptions = ['Any Price', 'Under ₹500', '₹500 - ₹1000', '₹1000 - ₹2500', 'Above ₹2500'];
    const ratingOptions = [4.5, 4.0, 3.5, 3.0];
    const amenityOptions = ['Free Wi-Fi', 'Parking Available', 'Air Conditioning', 'Card Payment', 'Online Booking'];
    const genderOptions = ['Any', 'Male', 'Female', 'Unisex'];

    const toggleAmenity = (amenity: string) => {
        setTempFilters(prev => ({
            ...prev,
            amenities: prev.amenities.includes(amenity)
                ? prev.amenities.filter(a => a !== amenity)
                : [...prev.amenities, amenity]
        }));
    };

    const clearAll = () => {
        setTempFilters({
            sortBy: 'Recommended',
            priceRange: 'Any Price',
            rating: 0,
            amenities: [],
            gender: 'Any'
        });
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-[101] shadow-2xl flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-6 border-b border-zinc-100">
                            <h2 className="text-xl font-bold text-zinc-900 tracking-tight">Filters</h2>
                            <button
                                onClick={onClose}
                                className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-zinc-100 transition-colors"
                            >
                                <X className="w-5 h-5 text-zinc-400" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto px-6 py-8 space-y-10 custom-scrollbar">
                            {/* Sort By */}
                            <section>
                                <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest mb-4">Sort By</h3>
                                <div className="flex flex-wrap gap-2">
                                    {sortOptions.map(option => (
                                        <button
                                            key={option}
                                            onClick={() => setTempFilters({ ...tempFilters, sortBy: option })}
                                            className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all border-2 ${tempFilters.sortBy === option
                                                ? 'bg-zinc-900 text-white border-zinc-900 shadow-md'
                                                : 'bg-white text-zinc-500 border-zinc-100 hover:border-zinc-200'
                                                }`}
                                        >
                                            {option}
                                        </button>
                                    ))}
                                </div>
                            </section>

                            {/* Price Range */}
                            <section>
                                <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest mb-4">Price Range</h3>
                                <div className="flex flex-wrap gap-2">
                                    {priceOptions.map(option => (
                                        <button
                                            key={option}
                                            onClick={() => setTempFilters({ ...tempFilters, priceRange: option })}
                                            className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all border-2 ${tempFilters.priceRange === option
                                                ? 'bg-zinc-900 text-white border-zinc-900 shadow-md'
                                                : 'bg-white text-zinc-500 border-zinc-100 hover:border-zinc-200'
                                                }`}
                                        >
                                            {option}
                                        </button>
                                    ))}
                                </div>
                            </section>

                            {/* Rating */}
                            <section>
                                <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest mb-4">Rating</h3>
                                <div className="flex flex-wrap gap-2">
                                    {ratingOptions.map(rating => (
                                        <button
                                            key={rating}
                                            onClick={() => setTempFilters({ ...tempFilters, rating })}
                                            className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all border-2 ${tempFilters.rating === rating
                                                ? 'bg-zinc-900 text-white border-zinc-900 shadow-md'
                                                : 'bg-white text-zinc-500 border-zinc-100 hover:border-zinc-200'
                                                }`}
                                        >
                                            {rating}+ Stars
                                        </button>
                                    ))}
                                </div>
                            </section>

                            {/* Amenities */}
                            <section>
                                <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest mb-4">Amenities</h3>
                                <div className="flex flex-wrap gap-2">
                                    {amenityOptions.map(amenity => {
                                        const isSelected = tempFilters.amenities.includes(amenity);
                                        return (
                                            <button
                                                key={amenity}
                                                onClick={() => toggleAmenity(amenity)}
                                                className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all border-2 ${isSelected
                                                    ? 'bg-zinc-900 text-white border-zinc-900 shadow-md'
                                                    : 'bg-white text-zinc-500 border-zinc-100 hover:border-zinc-200'
                                                    }`}
                                            >
                                                {amenity}
                                            </button>
                                        );
                                    })}
                                </div>
                            </section>

                            {/* Gender */}
                            <section>
                                <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest mb-4">Gender</h3>
                                <div className="flex flex-wrap gap-2">
                                    {genderOptions.map(option => (
                                        <button
                                            key={option}
                                            onClick={() => setTempFilters({ ...tempFilters, gender: option })}
                                            className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all border-2 ${tempFilters.gender === option
                                                ? 'bg-zinc-900 text-white border-zinc-900 shadow-md'
                                                : 'bg-white text-zinc-500 border-zinc-100 hover:border-zinc-200'
                                                }`}
                                        >
                                            {option}
                                        </button>
                                    ))}
                                </div>
                            </section>
                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t border-zinc-100 grid grid-cols-2 gap-4">
                            <button
                                onClick={clearAll}
                                className="h-14 rounded-2xl font-bold text-zinc-900 border-2 border-zinc-100 hover:bg-zinc-50 transition-all active:scale-95"
                            >
                                Clear All
                            </button>
                            <button
                                onClick={() => onApply(tempFilters)}
                                className="h-14 rounded-2xl font-bold text-white bg-zinc-900 hover:bg-zinc-800 transition-all active:scale-95 shadow-xl shadow-zinc-200"
                            >
                                Show Results
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default ExploreFilterModal;
