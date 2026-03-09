import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Check } from 'lucide-react';

interface ExploreFiltersProps {
    isOpen: boolean;
    onClose: () => void;
    categories: string[];
    selectedCategory: string | null;
    onSelectCategory: (category: string | null) => void;
    minRating: number;
    onSelectRating: (rating: number) => void;
}

const ExploreFilters = ({
    isOpen,
    onClose,
    categories,
    selectedCategory,
    onSelectCategory,
    minRating,
    onSelectRating
}: ExploreFiltersProps) => {
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
                        className="fixed inset-0 bg-zinc-900/60 backdrop-blur-sm z-100"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white z-101 shadow-2xl flex flex-col"
                    >
                        <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
                            <h2 className="text-xl font-black text-zinc-900 uppercase tracking-tight italic">Refine Discovery</h2>
                            <button
                                onClick={onClose}
                                className="w-10 h-10 rounded-full bg-zinc-50 flex items-center justify-center text-zinc-400 hover:text-zinc-900 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-10">
                            {/* Categories */}
                            <div className="space-y-4">
                                <label className="text-xs font-black text-zinc-400 uppercase tracking-widest leading-none">Categories</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {categories.map((category) => {
                                        const isSelected = selectedCategory === category || (!selectedCategory && category === 'All');
                                        return (
                                            <button
                                                key={category}
                                                onClick={() => onSelectCategory(category === 'All' ? null : category)}
                                                className={`h-12 px-4 rounded-xl font-bold text-sm text-left transition-all flex items-center justify-between border-2 ${isSelected
                                                        ? 'bg-zinc-900 text-white border-zinc-900'
                                                        : 'bg-zinc-50 text-zinc-600 border-transparent hover:border-zinc-200'
                                                    }`}
                                            >
                                                <span>{category}</span>
                                                {isSelected && <Check className="w-4 h-4 text-white" />}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Ratings */}
                            <div className="space-y-4">
                                <label className="text-xs font-black text-zinc-400 uppercase tracking-widest leading-none">Minimum Rating</label>
                                <div className="flex flex-col gap-2">
                                    {[4.5, 4.0, 3.5, 0].map((rating) => {
                                        const isSelected = minRating === rating;
                                        return (
                                            <button
                                                key={rating}
                                                onClick={() => onSelectRating(rating)}
                                                className={`h-14 px-5 rounded-2xl font-black text-sm transition-all flex items-center justify-between border-2 ${isSelected
                                                        ? 'bg-zinc-900 text-white border-zinc-900'
                                                        : 'bg-zinc-50 text-zinc-600 border-transparent hover:border-zinc-200'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-2">
                                                    {rating > 0 ? (
                                                        <>
                                                            <div className="flex items-center gap-0.5">
                                                                <Star className="w-4 h-4 fill-black text-black" />
                                                                <span className="text-lg">{rating}+</span>
                                                            </div>
                                                            <span className="text-zinc-400 font-bold ml-1">Rating</span>
                                                        </>
                                                    ) : (
                                                        <span>Any Rating</span>
                                                    )}
                                                </div>
                                                {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border-t border-zinc-100">
                            <button
                                onClick={onClose}
                                className="w-full h-14 bg-zinc-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-black active:scale-[0.98] transition-all"
                            >
                                Apply Filters
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default ExploreFilters;
