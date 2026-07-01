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

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    
    // Fetch SEO and Media data for metadata
    const [seoRes, mediaRes] = await Promise.all([
        businessDetailsApi.getSeo(slug).catch(() => null),
        businessDetailsApi.getMedia(slug).catch(() => null)
    ]);

    const seoData = seoRes?.data;
    const mediaData = mediaRes?.data;

    if (!seoData) {
        return {
            title: 'Business Not Found - BookBy247',
        };
    }

    const seo = seoData.seo || {};
    const city = seoData.location_info?.city || '';
    const area = seoData.location_info?.area || '';
    const type = seoData.search_profile?.spaTypes?.[0] || 'Wellness Center';
    const flags = seoData.seo_flags || {};

    // Dynamic SEO prefix based on flags
    let prefix = 'Best';
    if (flags.isTrending) prefix = 'Trending';
    else if (flags.isPopular) prefix = 'Popular';
    else if (flags.isBest) prefix = 'Best';

    // Pro SEO Title: [Business Name] - [Prefix] [Type] in [Area], [City] - Online Booking
    const title =
        seo.metaTitle || `${seoData.name} - ${prefix} ${type} in ${area ? `${area}, ` : ''}${city} - BookBy247`;
    
    const avgRating = seoData.ratings?.average || 5;
    const totalReviews = seoData.ratings?.totalReviews || 10;
    
    const description =
        seo.metaDescription ||
        `Book appointments at ${seoData.name} in ${area ? `${area}, ` : ''}${city}. Rated ${avgRating}/5 from ${totalReviews}+ verified reviews. Instant online booking, latest prices, and ${type} services. ${flags.isPopular ? 'Highly popular among locals.' : ''}`;
    
    const canonicalPath = `/business/${seoData.slug || slug}`;
    const ogImage = seo.ogImage || (Array.isArray(mediaData?.images) ? mediaData.images[0] : "");

    const metadata: Metadata = {
        title,
        description,
        keywords: [
            ...(seo.keywords || []),
            seoData.name, 
            type, 
            area, 
            city, 
            "online booking", 
            "prices", 
            "reviews", 
            prefix.toLowerCase(),
            `${type} near me`,
            `best ${type} in ${city}`,
            `${seoData.name} booking`,
            `${seoData.name} reviews`,
            "BookBy247"
        ].filter((v, i, a) => a.indexOf(v) === i), // deduplicate
        alternates: {
            canonical: canonicalPath,
        },
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                'max-image-preview': 'large',
            },
        },
        openGraph: {
            title,
            description,
            url: `https://bookby247.com${canonicalPath}`,
            siteName: "BookBy247",
            type: "website",
            locale: "en_IN",
            images: ogImage ? [{ url: ogImage, width: 1200, height: 630, alt: seoData.name }] : [],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: ogImage ? [ogImage] : [],
            creator: "@BookBy247",
        }
    };

    return metadata;
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
