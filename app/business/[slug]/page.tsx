import React from 'react';
import { notFound } from 'next/navigation';
import BusinessDetailsContent from './BusinessDetailsContent';
import { businessDetailsApi } from '@/api/public/business.details.api';
import { Metadata } from 'next';
import { safeJsonLdStringify } from '@/lib/utils';
import { generateLocalBusinessJsonLd, generateBreadcrumbJsonLd, generateServiceItemListJsonLd, generateOrganizationJsonLd, generateWebSiteJsonLd } from '@/lib/seo-jsonld';
import AiReadabilitySection from '@/components/seo/AiReadabilitySection';

export const revalidate = 3600;

interface PageProps {
    params: Promise<{
        slug: string;
    }>
}

type BusinessReviewForJsonLd = {
    customerName?: string;
    createdAt?: string;
    comment?: string;
    rating?: number;
};

import { buildSeoMetadata } from '@/lib/seo-title-helper';

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    
    // Fetch SEO, Media, Details & Services data for metadata evaluation
    const [seoRes, mediaRes, servicesRes, reviewsRes] = await Promise.all([
        businessDetailsApi.getSeo(slug).catch(() => null),
        businessDetailsApi.getMedia(slug).catch(() => null),
        businessDetailsApi.getServices(slug, 1, 5).catch(() => null),
        businessDetailsApi.getReviews(slug, 1, 5).catch(() => null)
    ]);

    const seoData = seoRes?.data;
    const mediaData = mediaRes?.data;
    const services = servicesRes?.data?.services || [];
    const reviews = reviewsRes?.data?.reviews || [];

    if (!seoData) {
        return {
            title: 'Business Not Found - BookBy247',
        };
    }

    const seo = seoData.seo || {};
    const city = seoData.location_info?.city || '';
    const locality = seoData.location_info?.area || '';
    const canonicalPath = `/business/${seoData.slug || slug}`;
    const ogImage = seo.ogImage || (Array.isArray(mediaData?.images) ? mediaData.images[0] : "");

    const realTotalReviews = reviewsRes?.data?.ratings?.total_reviews || seoData.ratings?.totalReviews || reviews.length;

    return buildSeoMetadata({
        pageType: "business",
        businessName: seoData.name,
        city,
        locality,
        hasPrices: services.length > 0,
        hasReviews: realTotalReviews > 0,
        hasOpeningHours: true,
        hasBooking: true,
        dbMetaTitle: seo.metaTitle,
        dbMetaDescription: seo.metaDescription,
        canonicalPath,
        ogImage
    });
}

const BusinessDetailsPage = async ({ params }: PageProps) => {
    const { slug } = await params;

    // Fetch all required data sections in parallel for SSR and JSON-LD
    const [
        detailsRes,
        contactsRes,
        workingHoursRes,
        mediaRes,
        servicesRes,
        reviewsRes
    ] = await Promise.all([
        businessDetailsApi.getDetails(slug).catch(() => null),
        businessDetailsApi.getContacts(slug).catch(() => null),
        businessDetailsApi.getWorkingHours(slug).catch(() => null),
        businessDetailsApi.getMedia(slug).catch(() => null),
        businessDetailsApi.getServices(slug, 1, 10).catch(() => null),
        businessDetailsApi.getReviews(slug, 1, 10).catch(() => null)
    ]);

    if (!detailsRes?.data) {
        notFound();
    }

    const details = detailsRes.data;
    const contacts = contactsRes?.data;
    const workingHours = workingHoursRes?.data;
    const media = mediaRes?.data;
    const services = servicesRes?.data?.services || [];
    const reviews = reviewsRes?.data?.reviews || [];
    const ratings = reviewsRes?.data?.ratings;

    // Construct a consolidated object for JSON-LD generators
    const consolidatedBusiness = {
        ...details,
        ...contacts,
        workingHours,
        images: media?.images,
        services,
        ratings
    };

    const city = contacts?.city || '';
    const citySlug = city.toLowerCase().replace(/\s+/g, '-');

    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                ...generateLocalBusinessJsonLd(consolidatedBusiness),
                "review": (reviews as BusinessReviewForJsonLd[]).map((review) => ({
                    "@type": "Review",
                    "author": {
                        "@type": "Person",
                        "name": review.customerName || "Anonymous"
                    },
                    "datePublished": review.createdAt,
                    "reviewBody": review.comment,
                    "reviewRating": {
                        "@type": "Rating",
                        "ratingValue": review.rating,
                        "bestRating": "5"
                    }
                }))
            },
            generateServiceItemListJsonLd(consolidatedBusiness),
            generateBreadcrumbJsonLd([
                { name: "Home", item: "https://bookby247.com/" },
                { name: city || "India", item: `https://bookby247.com/${citySlug || "india"}` },
                { name: details.name, item: `https://bookby247.com/business/${details.slug || slug}` },
            ]),
            generateOrganizationJsonLd(),
            generateWebSiteJsonLd()
        ],
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(jsonLd) }}
            />
            <BusinessDetailsContent 
                slug={slug} 
                initialData={{
                    details: detailsRes,
                    contacts: contactsRes,
                    workingHours: workingHoursRes,
                    media: mediaRes,
                    services: servicesRes,
                    reviews: reviewsRes
                }} 
            />

            <AiReadabilitySection 
                aboutTitle={`About ${details.name}`} 
                aboutContent={`${details.name} is a verified ${details.search_profile?.spaTypes?.[0] || 'wellness partner'} on BookBy247, located in ${contacts?.area ? `${contacts.area}, ` : ''}${contacts?.city}. They offer professional services with transparent pricing and verified customer reviews.`} 
            />
        </>
    );
};

export default BusinessDetailsPage;
