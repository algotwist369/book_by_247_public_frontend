"use client";

import React, { useState } from 'react';
import { Star, X, Send } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { businessDetailsApi } from '@/api/public/business.details.api';
import { useQueryClient } from '@tanstack/react-query';

interface WriteReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    businessName: string;
    slug: string;
    onSuccess?: () => void;
}

const WriteReviewModal = ({ isOpen, onClose, businessName, slug, onSuccess }: WriteReviewModalProps) => {
    const queryClient = useQueryClient();
    const [customerName, setCustomerName] = useState('');
    const [email, setEmail] = useState('');
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [review, setReview] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');
        setSuccessMsg('');

        if (rating === 0) {
            setErrorMsg("Please select a star rating");
            return;
        }

        if (!customerName.trim()) {
            setErrorMsg("Please enter your name");
            return;
        }

        if (!review.trim()) {
            setErrorMsg("Please enter your review feedback");
            return;
        }

        setIsSubmitting(true);

        try {
            const res = await businessDetailsApi.submitReview(slug, {
                customerName: customerName.trim(),
                email: email.trim() || undefined,
                rating,
                comment: review.trim()
            });

            if (res?.success) {
                setSuccessMsg("Thank you! Your review has been submitted successfully.");
                
                queryClient.invalidateQueries({ queryKey: ["business-reviews", slug] });
                queryClient.invalidateQueries({ queryKey: ["business-details", slug] });

                setTimeout(() => {
                    setIsSubmitting(false);
                    setCustomerName('');
                    setEmail('');
                    setRating(0);
                    setReview('');
                    setSuccessMsg('');
                    onClose();
                    if (onSuccess) onSuccess();
                }, 1200);
            } else {
                setErrorMsg(res?.message || "Failed to submit review. Please try again.");
                setIsSubmitting(false);
            }
        } catch (err: any) {
            setErrorMsg(err?.message || "Error connecting to server. Please try again.");
            setIsSubmitting(false);
        }
    };

    const getRatingLabel = (val: number) => {
        if (val === 5) return 'Excellent';
        if (val === 4) return 'Very Good';
        if (val === 3) return 'Good';
        if (val === 2) return 'Fair';
        if (val === 1) return 'Poor';
        return 'Tap a star to rate';
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} showCloseButton={false} className="max-w-xl w-full px-4 sm:px-0">
            <div className="bg-white rounded-3xl shadow-xl border border-zinc-100 overflow-hidden">
                {/* Header with Inline Close Button */}
                <div className="flex items-start justify-between p-6 sm:p-8 pb-5 sm:pb-6 border-b border-zinc-100">
                    <div className="space-y-1">
                        <h2 className="text-xl sm:text-2xl font-extrabold text-zinc-900 tracking-tight">Write a Review</h2>
                        <p className="text-xs sm:text-sm text-zinc-500 font-medium">
                            Share your experience at <span className="text-zinc-900 font-semibold">{businessName}</span>
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 -mr-2 text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100 rounded-full transition-colors"
                        aria-label="Close"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 sm:p-8 space-y-6 sm:space-y-7">
                    {errorMsg && (
                        <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm font-semibold rounded-xl text-center">
                            {errorMsg}
                        </div>
                    )}

                    {successMsg && (
                        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-bold rounded-xl text-center">
                            {successMsg}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-7">
                        {/* Star Rating Section */}
                        <div className="flex flex-col items-center justify-center py-6 sm:py-7 px-4 bg-zinc-50/80 rounded-2xl border border-zinc-100/90 space-y-3">
                            <div className="flex gap-2 sm:gap-3">
                                {[1, 2, 3, 4, 5].map((star) => {
                                    const active = star <= (hoverRating || rating);
                                    return (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setRating(star)}
                                            onMouseEnter={() => setHoverRating(star)}
                                            onMouseLeave={() => setHoverRating(0)}
                                            className="transition-transform hover:scale-110 active:scale-95 p-1 outline-none"
                                        >
                                            <Star
                                                className={`w-9 h-9 sm:w-10 sm:h-10 transition-colors ${
                                                    active
                                                        ? 'text-amber-400 fill-amber-400'
                                                        : 'text-zinc-200 fill-transparent'
                                                }`}
                                            />
                                        </button>
                                    );
                                })}
                            </div>
                            <span className={`text-xs sm:text-sm font-semibold px-3.5 py-1 rounded-full transition-colors ${
                                (hoverRating || rating) > 0
                                    ? 'bg-amber-50 text-amber-700 border border-amber-200/60'
                                    : 'text-zinc-400'
                            }`}>
                                {getRatingLabel(hoverRating || rating)}
                            </span>
                        </div>

                        {/* Customer Info */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                            <div className="space-y-2">
                                <label className="text-xs sm:text-sm font-semibold text-zinc-700 ml-0.5">
                                    Your Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={customerName}
                                    onChange={(e) => setCustomerName(e.target.value)}
                                    placeholder="e.g. Rahul Sharma"
                                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-white focus:bg-white focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 outline-none text-sm text-zinc-900 font-medium transition-all placeholder:text-zinc-400"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs sm:text-sm font-semibold text-zinc-700 ml-0.5">
                                    Email <span className="text-zinc-400 font-normal">(Optional)</span>
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="e.g. rahul@example.com"
                                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-white focus:bg-white focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 outline-none text-sm text-zinc-900 font-medium transition-all placeholder:text-zinc-400"
                                />
                            </div>
                        </div>

                        {/* Review Text Area */}
                        <div className="space-y-2">
                            <label className="text-xs sm:text-sm font-semibold text-zinc-700 ml-0.5">
                                Your Feedback <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                value={review}
                                onChange={(e) => setReview(e.target.value)}
                                placeholder="Write your review here... What did you like or recommendations for others?"
                                className="w-full h-32 p-4 rounded-xl border border-zinc-200 bg-white focus:bg-white focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 outline-none transition-all resize-none text-zinc-900 placeholder:text-zinc-400 text-sm font-medium leading-relaxed"
                                required
                            />
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3.5 sm:gap-4 pt-5 border-t border-zinc-100 mt-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                                className="w-full sm:w-auto h-12 px-7 font-semibold border-zinc-200 text-zinc-700 hover:bg-zinc-50 rounded-xl text-sm transition-all"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSubmitting || rating === 0 || !customerName.trim() || !review.trim()}
                                className={`w-full sm:w-auto h-12 px-8 font-semibold transition-all rounded-xl gap-2 text-sm text-white ${
                                    isSubmitting || rating === 0 || !customerName.trim() || !review.trim()
                                        ? 'bg-zinc-300 cursor-not-allowed'
                                        : 'bg-zinc-900 hover:bg-zinc-800 shadow-sm hover:shadow-md'
                                }`}
                            >
                                {isSubmitting ? 'Posting...' : 'Submit Review'}
                                <Send className="w-4 h-4" />
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </Modal>
    );
};

export default WriteReviewModal;
