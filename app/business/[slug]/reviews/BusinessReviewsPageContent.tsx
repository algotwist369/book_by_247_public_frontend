"use client";

import React from 'react';
import { Star, MapPin, Phone, Clock, Share2, BadgeCheck, } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import DropdownSection from '@/components/ui/DropdownSection';
import BusinessReviews from '@/components/business/BusinessReviews';
import ShareModal from '@/components/business/ShareModal';
import Breadcrumbs from '@/components/ui/Breadcrumbs';

import Link from 'next/link';
import { 
    useBusinessDetails, 
    useBusinessContacts, 
    useBusinessWorkingHours, 
    useBusinessReviews 
} from '@/hooks/useBusinessDetails';

interface ReviewsPageProps {
    slug: string;
    initialData?: {
        details?: any;
        contacts?: any;
        workingHours?: any;
        reviews?: any;
    };
}

const BusinessReviewsPageContent = ({ slug, initialData }: ReviewsPageProps) => {
    const { data: details, isLoading: isBusinessLoading, error: businessError } = useBusinessDetails(slug, initialData?.details);
    const { data: contacts, isLoading: isContactsLoading } = useBusinessContacts(slug, initialData?.contacts);
    const { data: workingHours, isLoading: isWorkingHoursLoading } = useBusinessWorkingHours(slug, initialData?.workingHours);
    
    const [page, setPage] = React.useState(1);
    const { data: reviewsData, isLoading: isReviewsLoading } = useBusinessReviews(slug, page, 10, initialData?.reviews);

    const [allReviews, setAllReviews] = React.useState<any[]>([]);
    const [isShareModalOpen, setIsShareModalOpen] = React.useState(false);
    const [currentUrl, setCurrentUrl] = React.useState('');

    React.useEffect(() => {
        if (typeof window !== 'undefined') {
            setCurrentUrl(window.location.href);
        }
    }, []);

    React.useEffect(() => {
        if (reviewsData?.reviews) {
            const normalizedReviews = reviewsData.reviews.map((r: any) => ({
                id: r.createdAt, // Using createdAt as id if _id is missing
                author: r.customerName,
                avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(r.customerName)}&background=random`,
                rating: r.rating,
                content: r.comment,
                date: new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
                helpfulPercentage: 0
            }));

            setAllReviews(prev => {
                const combined = page === 1 ? normalizedReviews : [...prev, ...normalizedReviews];
                // Use a Map to deduplicate reviews by ID
                const uniqueMap = new Map();
                combined.forEach((review: any) => {
                    uniqueMap.set(review.id, review);
                });
                return Array.from(uniqueMap.values());
            });
        }
    }, [reviewsData, page]);

    if (isBusinessLoading) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
                <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin" />
                <p className="text-zinc-500 font-medium">Loading reviews...</p>
            </div>
        );
    }

    if (businessError || !details) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-6 px-4">
                <h1 className="text-3xl font-black text-zinc-900">Business Not Found</h1>
                <Link href="/">
                    <Button variant="primary" className="bg-black hover:bg-zinc-900">
                        Back to Home
                    </Button>
                </Link>
            </div>
        );
    }

    const businessName = details.name;
    const businessPhone = contacts?.phone;
    const businessAddress = contacts?.address || '';
    const businessRatings = reviewsData?.ratings || { average: details.avg_rating, total_reviews: details.total_reviews };

    return (
        <div className="min-h-screen bg-white pb-20">
            {/* Content Section */}
            <div className="max-w-360 mx-auto px-4 md:px-8 py-10 md:py-16">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-16">

                    {/* Left Column - Sidebar (Sticky) */}
                    <div className="lg:col-span-1 order-last lg:order-first">
                        <div className="sticky top-28 space-y-6">
                            {/* Booking Card snippet */}
                            <div className="p-6 md:p-8 rounded-3xl border border-zinc-100 bg-white space-y-6">
                                <div>
                                    <h3 className="text-2xl font-black text-zinc-900 tracking-tight">Book Appointment</h3>
                                    <p className="text-sm text-zinc-500 mt-1">Select your preferred slot</p>
                                </div>
                                <div className="space-y-4">
                                    <Link href={`/business/${slug}/book-appointment`} className="block w-full">
                                        <Button className="w-full h-14 text-lg font-bold bg-black hover:bg-zinc-900 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]" variant="primary">
                                            Proceed to Book
                                        </Button>
                                    </Link>
                                </div>
                            </div>

                            {/* Contact & Hours */}
                            <div className="bg-white rounded-3xl border border-zinc-100 overflow-hidden divide-y divide-zinc-100">
                                <DropdownSection title="Contact Information" icon={<MapPin className="w-5 h-5 text-black" />}>
                                    <div className="space-y-4 pt-2">
                                        <button
                                            onClick={() => {
                                                const mapUrl = contacts?.google_maps_url || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${businessName} ${businessAddress}`)}`;
                                                window.open(mapUrl, '_blank');
                                            }}
                                            className="flex items-start gap-3 text-left hover:text-black transition-colors group"
                                        >
                                            <MapPin className="w-5 h-5 text-zinc-400 mt-0.5 shrink-0 group-hover:text-black transition-colors" />
                                            <p className="text-sm text-zinc-600 group-hover:text-black transition-colors">{businessAddress}</p>
                                        </button>
                                        <div className="flex items-center gap-3">
                                            <Phone className="w-5 h-5 text-zinc-400 shrink-0" />
                                            {businessPhone && (
                                                <a href={`tel:${businessPhone}`} className="text-sm text-zinc-600 hover:text-black transition-colors">{businessPhone}</a>
                                            )}
                                        </div>
                                    </div>
                                </DropdownSection>

                                <DropdownSection title="Working Hours" icon={<Clock className="w-5 h-5 text-black" />}>
                                    <div className="space-y-2 pt-2">
                                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => {
                                            const dayLower = day.toLowerCase();
                                            const isOpen = workingHours?.working_hours?.days?.includes(dayLower);
                                            const timeRange = (isOpen && workingHours?.working_hours)
                                                ? `${workingHours.working_hours.open} - ${workingHours.working_hours.close}`
                                                : 'Closed';

                                            return (
                                                <div key={day} className="flex justify-between text-sm">
                                                    <span className="text-zinc-500">{day}</span>
                                                    <span className={`font-medium ${!isOpen ? 'text-red-500' : 'text-zinc-900'}`}>
                                                        {timeRange}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </DropdownSection>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Main Content (Dedicated to Reviews) */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Breadcrumbs */}
                        <div className="flex items-center justify-between gap-4">
                            <Breadcrumbs
                                items={[
                                    { label: businessName, href: `/business/${slug}` },
                                    { label: 'Reviews' }
                                ]}
                            />
                            <button
                                onClick={() => setIsShareModalOpen(true)}
                                className="text-zinc-400 hover:text-zinc-900 transition-colors p-2 hover:bg-zinc-100 rounded-full shrink-0"
                            >
                                <Share2 className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Title & Stats */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <h1 className="text-3xl md:text-4xl font-black text-zinc-900 tracking-tight">
                                    Reviews for {businessName}
                                </h1>
                                <div className="flex items-center gap-1 bg-zinc-100 px-2 py-1 rounded-md border border-zinc-200 shrink-0">
                                    <BadgeCheck className="w-4 h-4 text-black fill-black/10" />
                                    <span className="text-[10px] font-bold text-black uppercase tracking-wide">Verified</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 bg-zinc-50 px-4 py-2 rounded-xl border border-zinc-100 w-fit">
                                <span className="text-xl font-bold text-zinc-900">{businessRatings.average}</span>
                                <div className="flex gap-0.5">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`w-4 h-4 ${i < Math.floor(businessRatings.average) ? 'text-black fill-black' : 'text-zinc-200'}`}
                                        />
                                    ))}
                                </div>
                                <span className="w-px h-4 bg-zinc-200 mx-2" />
                                <span className="text-sm font-bold text-zinc-500">{businessRatings.total_reviews} Total Reviews</span>
                            </div>
                        </div>

                        {/* Reviews Component */}
                        <div className="bg-white rounded-3xl border border-zinc-100 overflow-hidden">
                            <BusinessReviews
                                reviews={allReviews}
                                rating={businessRatings.average}
                                reviewCount={businessRatings.total_reviews}
                                slug={slug}
                                businessName={businessName}
                                showViewAll={false}
                            />

                            {/* Load More Button */}
                            {reviewsData?.pagination?.hasNextPage && (
                                <div className="p-8 pt-0 text-center">
                                    <Button
                                        variant="outline"
                                        onClick={() => setPage(prev => prev + 1)}
                                        disabled={isReviewsLoading}
                                        className="rounded-xl border-zinc-200 hover:bg-zinc-50 font-bold px-8"
                                    >
                                        Load More Reviews
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>

            {/* Share Modal */}
            <ShareModal
                isOpen={isShareModalOpen}
                onClose={() => setIsShareModalOpen(false)}
                url={currentUrl}
            />
        </div>
    );
};

export default BusinessReviewsPageContent;
