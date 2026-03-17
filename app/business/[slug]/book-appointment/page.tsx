import React from 'react';
import { notFound } from 'next/navigation';
import { businessApi } from '@/api/public/business';
import BookingPageContent from '@/app/business/[slug]/book-appointment/BookingPageContent';
import type { Metadata } from 'next';


interface PageProps {
    params: Promise<{
        slug: string;
    }>
}

export const revalidate = 3600;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const response = await businessApi.getBusinessBySlug(slug).catch(() => null);
    const business = response?.data;

    if (!business) {
        return {
            title: "Book Appointment | bookby247",
            description: "Securely book spa and salon appointments online with bookby247.",
            robots: {
                index: false,
                follow: true,
            },
        };
    }

    const title = `Book Appointment at ${business.name} | bookby247`;
    const description = `Choose your preferred slot and instantly book an appointment at ${business.name} in ${business.city}.`;
    const canonicalPath = `/business/${business.slug || slug}/book-appointment`;

    return {
        title,
        description,
        authors: [{ name: "bookby247 Team" }],
        alternates: {
            canonical: canonicalPath,
        },
        robots: {
            index: true,
            follow: true,
        },
        openGraph: {
            title,
            description,
            url: `https://bookby247.com${canonicalPath}`,
            type: "website",
            siteName: "bookby247",
        },
        twitter: {
            card: "summary",
            title,
            description,
        },
    };
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
