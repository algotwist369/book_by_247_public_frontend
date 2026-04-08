import React from 'react';
import { notFound } from 'next/navigation';
import { businessDetailsApi } from '@/api/public/business.details.api';
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
    const response = await businessDetailsApi.getSeo(slug).catch(() => null);
    const seoData = response?.data;

    if (!seoData) {
        return {
            title: "Book Appointment | Bookby247",
            description: "Securely book spa and salon appointments online with Bookby247.",
            robots: {
                index: false,
                follow: true,
            },
        };
    }

    const title = `Book Appointment at ${seoData.name} | Bookby247`;
    const description = `Choose your preferred slot and instantly book an appointment at ${seoData.name} in ${seoData.location_info?.city || ''}.`;
    const canonicalPath = `/business/${seoData.slug || slug}/book-appointment`;

    return {
        title,
        description,
        authors: [{ name: "Bookby247 Team" }],
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
            siteName: "Bookby247",
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

    // Fetch live business data required for booking
    const [detailsRes, contactsRes, mediaRes, servicesRes, capacityRes] = await Promise.all([
        businessDetailsApi.getDetails(slug).catch(() => null),
        businessDetailsApi.getContacts(slug).catch(() => null),
        businessDetailsApi.getMedia(slug).catch(() => null),
        businessDetailsApi.getServices(slug, 1, 50).catch(() => null),
        businessDetailsApi.getCapacity(slug).catch(() => null)
    ]);

    if (!detailsRes?.data) {
        notFound();
    }

    const details = detailsRes.data;
    const contacts = contactsRes?.data;
    const media = mediaRes?.data;
    const services = servicesRes?.data?.services || [];
    const capacity = capacityRes?.data;

    // Normalize API data to match Business interface for BookingPageContent
    const business: any = {
        id: details.slug, // Using slug as id if needed, or _id if available in response
        name: details.name,
        slug: details.slug || slug,
        images: media?.images?.gallery || [],
        image: media?.images?.thumbnail || media?.images?.logo,
        rating: details.avg_rating || 0,
        reviews: details.total_reviews || 0,
        address: contacts?.address,
        city: contacts?.city,
        branch: details.business_branch,
        price: 0, // Will be calculated from services
        amenities: capacity?.amenities || [],
        gender: 'Unisex', // Default
        coordinates: contacts?.location?.coordinates ? {
            lat: contacts.location.coordinates[1],
            lng: contacts.location.coordinates[0]
        } : { lat: 0, lng: 0 },
        description: details.description,
        services: services
    };

    return <BookingPageContent business={business} />;
};

export default BookingPage;
