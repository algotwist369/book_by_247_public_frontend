import React from 'react';
import BusinessReviewsPageContent from './BusinessReviewsPageContent';

interface PageProps {
    params: Promise<{
        slug: string;
    }>
}

import { businessDetailsApi } from '@/api/public/business.details.api';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { safeJsonLdStringify } from '@/lib/utils';

export const revalidate = 3600;

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
            title: 'Reviews Not Found | Bookby247',
        };
    }

    const seo = seoData.seo || {};
    const city = seoData.location_info?.city || '';
    const type = seoData.search_profile?.spaTypes?.[0] || 'Wellness Center';

    // Pro SEO Title for Reviews
    const title = `Customer Reviews: ${seoData.name} | Verified Ratings in ${city} | Bookby247`;
    
    const description = 
        `Read verified customer reviews and ratings for ${seoData.name} in ${city}. Find out what people are saying about their ${type} services and book online.`;

    const canonicalPath = `/business/${seoData.slug || slug}/reviews`;
    const ogImage =
        mediaData?.images?.[0] || "";

    const metadata: Metadata = {
        title,
        description,
        keywords: [...(seo.keywords || []), 'reviews', 'ratings', seoData.name, city, type, 'verified reviews'],
        authors: [{ name: "Bookby247 Team" }],
        alternates: {
            canonical: canonicalPath,
        },
        openGraph: {
            title,
            description,
            url: `https://bookby247.com${canonicalPath}`,
            siteName: "Bookby247",
            type: "article",
            images: ogImage ? [{ url: ogImage, width: 1200, height: 630, alt: `Reviews for ${seoData.name}` }] : [],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: ogImage ? [ogImage] : [],
        },
    };

    console.log(`SEO Metadata for ${slug} Reviews:`, JSON.stringify(metadata, null, 2));

    return metadata;
}

const BusinessReviewsPage = async ({ params }: PageProps) => {
    const { slug } = await params;
    
    // Fetch initial business details and reviews in parallel
    const [detailsRes, reviewsRes] = await Promise.all([
        businessDetailsApi.getDetails(slug).catch(() => null),
        businessDetailsApi.getReviews(slug, 1, 10).catch(() => null)
    ]);

    if (!detailsRes?.data) {
        notFound();
    }

    const details = detailsRes?.data || null;

    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
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
                        "name": details?.name || '',
                        "item": `https://bookby247.com/business/${details?.slug || slug}`,
                    },
                    {
                        "@type": "ListItem",
                        "position": 3,
                        "name": "Reviews",
                        "item": `https://bookby247.com/business/${details?.slug || slug}/reviews`,
                    },
                ],
            },
            {
                "@type": "CollectionPage",
                "name": `Reviews for ${details?.name || ''}`,
                "about": {
                    "@id": `https://bookby247.com/business/${details?.slug || slug}#business`,  
                },
            },
        ],
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(jsonLd) }}
            />
            <BusinessReviewsPageContent 
                slug={slug} 
                initialData={{
                    details: detailsRes,
                    reviews: reviewsRes
                }} 
            />
        </>
    );
};

export default BusinessReviewsPage;

