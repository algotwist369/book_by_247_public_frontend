import React from 'react';
import { notFound } from 'next/navigation';
import BusinessDetailsContent from './BusinessDetailsContent';
import { businessApi } from '@/api/public/business';
import { Metadata } from 'next';
import { safeJsonLdStringify } from '@/lib/utils';
import { generateLocalBusinessJsonLd, generateBreadcrumbJsonLd } from '@/lib/seo-jsonld';

export const revalidate = 3600;

interface PageProps {
    params: Promise<{
        slug: string;
    }>
}

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
    const city = business.locationInfo?.city || business.city;
    const area = business.locationInfo?.area || business.branch;

    const title =
        seo.metaTitle || `${business.name} - Best ${business.type || 'wellness center'} in ${area ? `${area}, ` : ''}${city} | Bookby247`;
    const description =
        seo.metaDescription ||
        (business.description
            ? business.description.substring(0, 157) + (business.description.length > 157 ? "..." : "")
            : `Book appointments at ${business.name} in ${area ? `${area}, ` : ''}${city}. Verified reviews, prices, and instant online booking for ${business.type || 'beauty services'}.`);
    
    const canonicalPath = `/business/${business.slug || slug}`;
    const ogImage =
        seo.ogImage || business.images?.banner || business.images?.logo || business.images?.thumbnail || "";

    return {
        title,
        description,
        keywords: seo.keywords || [business.name, business.type, city, "booking", "spa", "salon"],
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

    // Fetch reviews for SEO JSON-LD
    const reviewsResponse = await businessApi.getSeoReviewsBySlug(slug).catch(() => null);
    const seoReviews = reviewsResponse?.data || [];

    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                ...generateLocalBusinessJsonLd(business),
                "review": seoReviews.map((r: any) => ({
                    "@type": "Review",
                    "author": {
                        "@type": "Person",
                        "name": r.guestName || "Anonymous"
                    },
                    "datePublished": r.createdAt,
                    "reviewBody": r.review,
                    "reviewRating": {
                        "@type": "Rating",
                        "ratingValue": r.rating,
                        "bestRating": "5"
                    }
                }))
            },
            generateBreadcrumbJsonLd([
                { name: "Home", item: "https://bookby247.com/" },
                { name: "Explore", item: "https://bookby247.com/explore" },
                { name: business.name, item: `https://bookby247.com/business/${business.slug || slug}` },
            ])
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
