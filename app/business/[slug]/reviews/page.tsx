import React from 'react';
import BusinessReviewsPageContent from './BusinessReviewsPageContent';

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
            title: 'Reviews Not Found | bookby247',
        };
    }

    const seo = business.seo || {};

    const title = `Customer Reviews: ${seo.metaTitle || business.name} | bookby247`;
    const description = `Read verified customer reviews for ${business.name} in ${business.city}. ${seo.metaDescription || ''}`.slice(0, 159);
    const canonicalPath = `/business/${business.slug || slug}/reviews`;

    return {
        title,
        description,
        keywords: [...(seo.keywords || []), 'reviews', 'ratings', business.name],
        authors: [{ name: "bookby247 Team" }],
        alternates: {
            canonical: canonicalPath,
        },
        openGraph: {
            title,
            description,
            url: `https://bookby247.com${canonicalPath}`,
            siteName: "bookby247",
            type: "article",
        },
        twitter: {
            card: "summary",
            title,
            description,
        },
    };
}

const BusinessReviewsPage = async ({ params }: PageProps) => {
    const { slug } = await params;
    const businessData = await businessApi.getBusinessBySlug(slug).catch(() => null);
    const businessId = businessData?.data?.id || businessData?.data?._id;

    let initialReviews = null;
    if (businessId) {
        initialReviews = await businessApi.getBusinessReviews(businessId, 1, 20).catch(() => null);
    }

    const business = businessData.data;

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
                        "name": business.name,
                        "item": `https://bookby247.com/business/${business.slug || slug}`,
                    },
                    {
                        "@type": "ListItem",
                        "position": 3,
                        "name": "Reviews",
                        "item": `https://bookby247.com/business/${business.slug || slug}/reviews`,
                    },
                ],
            },
            {
                "@type": "CollectionPage",
                "name": `Reviews for ${business.name}`,
                "about": {
                    "@id": `https://bookby247.com/business/${business.slug || slug}#business`,
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
            <BusinessReviewsPageContent slug={slug} initialBusiness={businessData} initialReviews={initialReviews} />
        </>
    );
};

export default BusinessReviewsPage;
