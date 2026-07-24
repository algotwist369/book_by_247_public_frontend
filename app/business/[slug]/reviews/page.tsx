import React from 'react';
import BusinessReviewsPageContent from './BusinessReviewsPageContent';
import { businessDetailsApi } from '@/api/public/business.details.api';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { safeJsonLdStringify } from '@/lib/utils';
import { generateOrganizationJsonLd, generateWebSiteJsonLd } from '@/lib/seo-jsonld';
import AiReadabilitySection from '@/components/seo/AiReadabilitySection';

export const revalidate = 3600;

interface PageProps {
    params: Promise<{
        slug: string;
    }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    
    // Fetch SEO, Media, and Reviews data for metadata
    const [seoRes, mediaRes, reviewsRes] = await Promise.all([
        businessDetailsApi.getSeo(slug).catch(() => null),
        businessDetailsApi.getMedia(slug).catch(() => null),
        businessDetailsApi.getReviews(slug, 1, 10).catch(() => null)
    ]);

    const seoData = seoRes?.data;
    const mediaData = mediaRes?.data;
    const ratingsObj = reviewsRes?.data?.ratings;
    const totalReviews = ratingsObj?.total_reviews || (ratingsObj as any)?.totalReviews || reviewsRes?.data?.reviews?.length || 0;
    const hasGenuineReviews = totalReviews > 0;

    if (!seoData) {
        return {
            title: 'Reviews Not Found - BookBy247',
        };
    }

    const seo = seoData.seo || {};
    const city = seoData.location_info?.city || '';
    const type = seoData.search_profile?.spaTypes?.[0] || 'Wellness Center';

    const title = hasGenuineReviews 
        ? `Verified Reviews: ${seoData.name} - Ratings in ${city} - BookBy247`
        : `Customer Reviews: ${seoData.name} - BookBy247`;
    
    const description = hasGenuineReviews
        ? `Read customer reviews and ratings for ${seoData.name} in ${city}. Find out what people are saying about their ${type} services.`
        : `Customer reviews page for ${seoData.name} in ${city}. Leave a review or book your appointment online with BookBy247.`;

    const canonicalPath = hasGenuineReviews 
        ? `/business/${seoData.slug || slug}/reviews`
        : `/business/${seoData.slug || slug}`;
        
    const ogImage = mediaData?.images?.[0] || "";

    const metadata: Metadata = {
        title,
        description,
        keywords: [...(seo.keywords || []), 'reviews', 'ratings', seoData.name, city, type, 'verified reviews'],
        authors: [{ name: "BookBy247 Team" }],
        alternates: {
            canonical: canonicalPath,
        },
        robots: hasGenuineReviews ? {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                'max-image-preview': 'large',
            },
        } : {
            index: false,
            follow: true,
            googleBot: {
                index: false,
                follow: true,
            },
        },
        openGraph: {
            title,
            description,
            url: `https://bookby247.com${canonicalPath}`,
            siteName: "BookBy247",
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
            <BusinessReviewsPageContent 
                slug={slug} 
                initialData={{
                    details: detailsRes,
                    reviews: reviewsRes
                }} 
            />

            <AiReadabilitySection 
                aboutTitle={`Verified Reviews for ${details.name}`} 
                aboutContent={`Read authentic customer feedback and ratings for ${details.name} in ${details.location_info?.city || 'India'}. Our platform ensures that every review is verified, providing you with a transparent view of the service quality at this center.`} 
            />
        </>
    );
};

export default BusinessReviewsPage;
