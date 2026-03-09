"use client";

import React from 'react';
import { Star, ThumbsUp } from 'lucide-react';
import Link from 'next/link';
import { Review } from './businessData';
import WriteReviewModal from './WriteReviewModal';
import { CustomImage } from '../ui/CustomImage';

interface BusinessReviewsProps {
    reviews?: Review[];
    rating: number;
    reviewCount: number;
    slug: string;
    businessName: string;
    showViewAll?: boolean;
}

const BusinessReviews = ({ reviews = [], rating, reviewCount, slug, businessName, showViewAll = true }: BusinessReviewsProps) => {
    const [isWriteModalOpen, setIsWriteModalOpen] = React.useState(false);
    return (
        <section className="space-y-6 sm:space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className="text-xl sm:text-2xl font-bold text-zinc-900">Reviews & Ratings</h2>
                <button
                    onClick={() => setIsWriteModalOpen(true)}
                    className="w-full sm:w-auto px-4 py-2.5 bg-zinc-900 text-white rounded-xl font-bold text-sm hover:bg-zinc-800 transition-colors"
                >
                    Write a Review
                </button>
            </div>

            {/* Rating Summary */}
            <div className="flex flex-col sm:flex-row items-center gap-6 bg-zinc-50 p-5 sm:p-6 rounded-2xl border border-zinc-100">
                <div className="text-center sm:px-4">
                    <div className="text-4xl sm:text-5xl font-black text-zinc-900">{Number(rating).toFixed(1)}</div>
                    <div className="flex gap-1 justify-center my-2">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${i < Math.floor(rating) ? 'text-zinc-900 fill-zinc-900' : 'text-zinc-300'}`}
                            />
                        ))}
                    </div>
                    <div className="text-xs sm:text-sm text-zinc-500 font-bold">{reviewCount} Reviews</div>
                </div>

                <div className="hidden sm:block h-16 w-px bg-zinc-200" />

                <div className="flex-1 w-full sm:w-auto space-y-2">
                    {[5, 4, 3, 2, 1].map((star) => (
                        <div key={star} className="flex items-center gap-3">
                            <span className="text-[10px] font-bold text-zinc-400 w-3">{star}</span>
                            <div className="flex-1 h-1.5 sm:h-2 bg-zinc-200 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-zinc-900 rounded-full"
                                    style={{ width: star === 5 ? '70%' : star === 4 ? '20%' : '5%' }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Reviews List */}
            <div className="grid gap-4">
                {reviews.map((review) => (
                    <div key={review.id} className="p-4 sm:p-6 bg-white border border-zinc-100 rounded-2xl hover:border-zinc-200 transition-colors">
                        <div className="flex justify-between items-start mb-4 gap-2">
                            <div className="flex items-center gap-3">
                                <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden bg-zinc-100 shrink-0">
                                    <CustomImage
                                        src={review.avatar}
                                        fallback={`https://ui-avatars.com/api/?name=${encodeURIComponent(review.author || 'User')}&background=random`}
                                        alt={review.author}
                                        fill
                                        className="object-cover"
                                        unoptimized
                                    />
                                </div>
                                <div className="min-w-0">
                                    <h4 className="font-bold text-zinc-900 text-sm sm:text-base truncate">{review.author}</h4>
                                    <p className="text-[10px] sm:text-xs text-zinc-400">{review.date}</p>
                                </div>
                            </div>
                            <div className="flex gap-0.5 shrink-0">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`w-3 h-3 sm:w-4 sm:h-4 ${i < review.rating ? 'text-zinc-900 fill-zinc-900' : 'text-zinc-200'}`}
                                    />
                                ))}
                            </div>
                        </div>
                        <p className="text-zinc-600 leading-relaxed text-sm mb-4 line-clamp-4">
                            {review.content}
                        </p>
                        <div className="flex items-center gap-4 text-[11px] sm:text-xs font-bold text-zinc-400">
                            <button className="flex items-center gap-1.5 hover:text-black transition-colors">
                                <ThumbsUp className="w-3.5 h-3.5" />
                                <span>Helpful</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {showViewAll && reviews.length > 0 && (
                <Link
                    href={`/business/${slug}/reviews`}
                    className="block w-full"
                >
                    <button className="w-full py-3 text-xs sm:text-sm font-bold text-zinc-500 border border-zinc-200 rounded-xl hover:bg-zinc-50 transition-colors">
                        View All Reviews
                    </button>
                </Link>
            )}

            <WriteReviewModal
                isOpen={isWriteModalOpen}
                onClose={() => setIsWriteModalOpen(false)}
                businessName={businessName}
            />
        </section>
    );
};

export default BusinessReviews;
