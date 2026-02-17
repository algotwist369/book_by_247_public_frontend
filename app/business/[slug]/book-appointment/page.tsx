import React from 'react';
import { notFound } from 'next/navigation';
import { businessApi } from '@/api/public/business';
import BookingPageContent from '@/app/business/[slug]/book-appointment/BookingPageContent';


interface PageProps {
    params: Promise<{
        slug: string;
    }>
}

const BookingPage = async ({ params }: PageProps) => {
    const { slug } = await params;

    // Fetch live business data
    const response = await businessApi.getBusinessBySlug(slug).catch(() => null);
    const businessData = response?.data;

    if (!businessData) {
        notFound();
    }

    // Normalize API data to match Business interface
    const business: any = {
        id: businessData.id || businessData._id,
        name: businessData.name,
        slug: businessData.slug || slug, // Fallback to params slug
        images: businessData.images?.gallery || [],
        image: businessData.images?.thumbnail || businessData.images?.logo,
        rating: businessData.ratings?.average || 0,
        reviews: businessData.ratings?.totalReviews || 0,
        address: businessData.address,
        city: businessData.city,
        branch: businessData.branch,
        price: businessData.price || 0, // Fallback if price is missing in API
        amenities: businessData.amenities || [],
        gender: businessData.gender || 'Unisex',
        coordinates: businessData.location?.coordinates ? {
            lat: businessData.location.coordinates[1],
            lng: businessData.location.coordinates[0]
        } : { lat: 0, lng: 0 },
        description: businessData.description,
        services: businessData.services || [] // Ensure services are passed
    };

    return <BookingPageContent business={business} />;
};

export default BookingPage;
