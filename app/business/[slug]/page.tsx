import React from 'react';
import { notFound } from 'next/navigation';
import BusinessDetailsContent from './BusinessDetailsContent';
import { businessApi } from '@/api/public/business';
import { Metadata } from 'next';
import { safeJsonLdStringify } from '@/lib/utils';
import { generateLocalBusinessJsonLd, generateBreadcrumbJsonLd, generateServiceItemListJsonLd } from '@/lib/seo-jsonld';

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
    const type = business.type || 'Wellness Center';

    // Pro SEO Title: [Business Name] | Best [Type] in [Area], [City] | Online Booking
    const title =
        seo.metaTitle || `${business.name} | Best ${type} in ${area ? `${area}, ` : ''}${city} | Bookby247`;
    
    const description =
        seo.metaDescription ||
        `Book appointments at ${business.name} in ${area ? `${area}, ` : ''}${city}. Verified reviews, latest prices, and instant online booking for ${type} services. Rated ${business.ratings?.average || 5}/5 by our community.`;
    
    const canonicalPath = `/business/${business.slug || slug}`;
    const ogImage =
        seo.ogImage || business.images?.banner || business.images?.logo || business.images?.thumbnail || "";

    return {
        title,
        description,
        keywords: seo.keywords || [business.name, type, area, city, "online booking", "prices", "reviews"],
        alternates: {
            canonical: canonicalPath,
        },
        openGraph: {
            title,
            description,
            url: `https://bookby247.com${canonicalPath}`,
            siteName: "Bookby247",
            type: "website",
            images: ogImage ? [{ url: ogImage, width: 1200, height: 630, alt: business.name }] : [],
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
    const city = business.locationInfo?.city || business.city;
    const citySlug = business.locationInfo?.citySlug || city?.toLowerCase().replace(/\s+/g, '-');

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
            generateServiceItemListJsonLd(business),
            generateBreadcrumbJsonLd([
                { name: "Home", item: "https://bookby247.com/" },
                { name: city || "India", item: `https://bookby247.com/${citySlug || "india"}` },
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
