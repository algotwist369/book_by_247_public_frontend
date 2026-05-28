"use client";

import React, { useState } from 'react';
import { Star, MessageSquare, Send } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

interface WriteReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    businessName: string;
}

const WriteReviewModal = ({ isOpen, onClose, businessName }: WriteReviewModalProps) => {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [review, setReview] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) {
            alert("Please select a rating");
            return;
        }

        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            onClose();
            // Reset state
            setRating(0);
            setReview('');
        }, 1000);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-2xl px-4 sm:px-0">
            <div className="bg-white rounded-2xl sm:rounded-3xl overflow-hidden flex flex-col max-h-[85vh] sm:max-h-none">
                <div className="overflow-y-auto p-5 sm:p-8 md:p-12 space-y-6 sm:space-y-8">
                    {/* Header */}
                    <div className="text-center space-y-1.5 sm:space-y-2">
                        <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 tracking-tight">Write a Review</h2>
                        <p className="text-xs sm:text-base text-zinc-500 font-medium">How was your experience at <span className="text-zinc-900 font-bold">{businessName}</span>?</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
                        {/* Star Rating Section */}
                        <div className="flex flex-col items-center space-y-3 sm:space-y-4">
                            <div className="flex gap-1 sm:gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRating(star)}
                                        onMouseEnter={() => setHoverRating(star)}
                                        onMouseLeave={() => setHoverRating(0)}
                                        className="transition-transform hover:scale-110 active:scale-95 p-1"
                                    >
                                        <Star
                                            className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 transition-colors ${star <= (hoverRating || rating)
                                                ? 'text-zinc-900 fill-zinc-900'
                                                : 'text-zinc-200'
                                                }`}
                                        />
                                    </button>
                                ))}
                            </div>
                            <span className="text-[10px] sm:text-sm font-bold text-zinc-400 uppercase tracking-widest">
                                {rating > 0 ? (
                                    rating === 5 ? 'Excellent!' :
                                        rating === 4 ? 'Very Good' :
                                            rating === 3 ? 'Good' :
                                                rating === 2 ? 'Fair' : 'Poor'
                                ) : 'Select Rating'}
                            </span>
                        </div>

                        {/* Review Text Area */}
                        <div className="space-y-2">
                            <label className="text-xs sm:text-sm font-bold text-zinc-900 uppercase tracking-wide ml-1 flex items-center gap-2">
                                <MessageSquare className="w-4 h-4 text-zinc-900" />
                                Your Feedback
                            </label>
                            <textarea
                                value={review}
                                onChange={(e) => setReview(e.target.value)}
                                placeholder="Tell others about your experience, services you liked, or recommendations..."
                                className="w-full h-32 sm:h-40 p-4 rounded-xl sm:rounded-2xl border border-zinc-200 bg-zinc-50 focus:bg-white focus:ring-2 focus:ring-black/20 focus:border-black outline-none transition-all resize-none text-zinc-700 placeholder:text-zinc-400 text-sm sm:text-base"
                                required
                            />
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 sm:pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                                className="order-2 sm:order-1 flex-1 h-12 sm:h-14 font-bold border-zinc-200 hover:bg-zinc-50 rounded-xl text-sm"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSubmitting || rating === 0}
                                className={`order-1 sm:order-2 flex-1 h-12 sm:h-14 font-black transition-all rounded-xl gap-2 text-sm sm:text-base ${isSubmitting ? 'bg-zinc-400' : 'bg-black hover:bg-zinc-800'
                                    }`}
                            >
                                {isSubmitting ? 'Posting...' : 'Submit Review'}
                                <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </Modal>
    );
};

export default WriteReviewModal;
