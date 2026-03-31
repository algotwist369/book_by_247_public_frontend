import React from 'react';
import { notFound } from 'next/navigation';
import BusinessDetailsContent from './BusinessDetailsContent';

interface PageProps {
    params: Promise<{
        slug: string;
    }>
}

import { businessApi } from '@/api/public/business';
import { Metadata } from 'next';
import { safeJsonLdStringify } from '@/lib/utils';

export const revalidate = 3600;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const response = await businessApi.getBusinessBySlug(slug).catch(() => null);
    const business = response?.data;

    if (!business) {
        return {
            title: 'Business Not Found | Bookby247',
        };
    }

    const seo = business.seo || {};

    const title =
        seo.metaTitle || `${business.name} - ${business.city} | Bookby247`;
    const description =
        seo.metaDescription ||
        (business.description
            ? business.description.substring(0, 157) + (business.description.length > 157 ? "..." : "")
            : `Book appointments at ${business.name} in ${business.city}. Premium spa and salon services.`);
    const canonicalPath = `/business/${business.slug || slug}`;
    const ogImage =
        seo.ogImage || business.images?.banner || business.images?.logo || business.images?.thumbnail || "";

    return {
        title,
        description,
        keywords: seo.keywords || [],
        authors: [{ name: "Bookby247 Team" }],
        alternates: {
            canonical: canonicalPath,
        },
        openGraph: {
            title,
            description,
            url: `https://bookby247.com${canonicalPath}`,
            siteName: "Bookby247",
            type: "website",
            images: ogImage ? [ogImage] : [],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: ogImage ? [ogImage] : [],
        }
    };
}

const BusinessDetailsPage = async ({ params }: PageProps) => {
    const { slug } = await params;
    const businessData = await businessApi.getBusinessBySlug(slug).catch(() => null);

    if (!businessData?.data) {
        notFound();
    }

    const business = businessData.data;

    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "LocalBusiness",
                "@id": `https://bookby247.com/business/${business.slug || slug}#business`,
                "name": business.name,
                "description": business.description,
                "image": [
                    business.images?.banner,
                    ...(business.images?.gallery || []),
                    business.images?.logo,
                    business.images?.thumbnail,
                ].filter(Boolean),
                "url": `https://bookby247.com/business/${business.slug || slug}`,
                "telephone": business.phone,
                "address": business.address
                    ? {
                        "@type": "PostalAddress",
                        "streetAddress": business.address,
                        "addressLocality": business.branch || business.city,
                        "addressRegion": business.state,
                        "postalCode": business.pincode,
                        "addressCountry": "IN",
                    }
                    : undefined,
                "aggregateRating": business.ratings
                    ? {
                        "@type": "AggregateRating",
                        "ratingValue": business.ratings.average,
                        "reviewCount": business.ratings.totalReviews,
                    }
                    : undefined,
                "geo": business.location?.coordinates
                    ? {
                        "@type": "GeoCoordinates",
                        "latitude": business.location.coordinates[1],
                        "longitude": business.location.coordinates[0],
                    }
                    : undefined,
            },
            {
                "@type": "BreadcrumbList",
                "itemListElement": [
                    {
                        "@type": "ListItem",
                        "position": 1,
                        "name": "Home",
                        "item": "https://bookby247.com/",
                    },
                    {
                        "@type": "ListItem",
                        "position": 2,
                        "name": "Explore",
                        "item": "https://bookby247.com/explore",
                    },
                    {
                        "@type": "ListItem",
                        "position": 3,
                        "name": business.name,
                        "item": `https://bookby247.com/business/${business.slug || slug}`,
                    },
                ],
            },
        ],
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(jsonLd) }}
            />
            <BusinessDetailsContent slug={slug} initialBusiness={businessData} />
        </>
    );
};

export default BusinessDetailsPage;
