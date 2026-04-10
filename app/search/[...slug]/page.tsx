import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { businessApi } from '@/api/public/business';
import { safeJsonLdStringify } from '@/lib/utils';
import { generateItemListJsonLd, generateBreadcrumbJsonLd } from '@/lib/seo-jsonld';
import SeoSearchContent from './SeoSearchContent';

interface PageProps {
    params: Promise<{
        slug: string[];
    }>
}

/**
 * Enhanced Slug Parser for SEO Parameters
 */
const parseSeoParams = (slug: string[]) => {
    const params: any = {};
    if (!slug || slug.length === 0) return params;

    // Simple heuristic for now:
    // /search/mumbai/massage -> city: mumbai, service: massage
    // /search/mumbai/andheri/salon -> city: mumbai, area: andheri, service: salon
    // /search/spa/luxury -> type: spa, intent: luxury
    
    if (slug.length === 1) {
        params.city = slug[0];
    } else if (slug.length === 2) {
        params.city = slug[0];
        params.service = slug[1];
    } else if (slug.length >= 3) {
        params.city = slug[0];
        params.area = slug[1];
        params.service = slug[2];
    }

    return params;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const { city, area, service, type, intent } = parseSeoParams(slug);

    const titleParts = [];
    if (intent) titleParts.push(intent.charAt(0).toUpperCase() + intent.slice(1));
    if (service) titleParts.push(service.charAt(0).toUpperCase() + service.slice(1));
    else if (type) titleParts.push(type.toUpperCase());
    else titleParts.push(`Best ${service || type || 'Wellness'} Centers`);

    if (area) titleParts.push(`in ${area.charAt(0).toUpperCase() + area.slice(1)}`);
    if (city) titleParts.push(area ? city.charAt(0).toUpperCase() + city.slice(1) : `in ${city.charAt(0).toUpperCase() + city.slice(1)}`);

    const title = `${titleParts.join(" ")} | Book Appointments Online | Bookby247`;
    const description = `Discover and book top-rated ${service || type || 'wellness services'} in ${area ? `${area}, ` : ''}${city || 'your city'}. Compare prices, reviews, and book instantly on Bookby247.`;

    const canonicalPath = `/search/${slug.join("/")}`;

    return {
        title,
        description,
        alternates: {
            canonical: canonicalPath,
        },
        openGraph: {
            title,
            description,
            url: `https://bookby247.com${canonicalPath}`,
            siteName: "Bookby247",
            type: "website",
        }
    };
}

const SeoSearchPage = async ({ params }: PageProps) => {
    const { slug } = await params;
    const seoParams = parseSeoParams(slug);
    
    // Initial fetch for SSR and SEO-ready content
    const response = await businessApi.getSeoBusinesses({ ...seoParams, limit: 10 }).catch(() => null);
    
    if (!response || !response.success) {
        // We can still show the page with empty results or standard explore
    }

    const businesses = response?.data || [];
    const total = response?.total || 0;

    // Generate JSON-LD
    const jsonLd = [
        generateItemListJsonLd(businesses, seoParams.city, seoParams.service || seoParams.type),
        generateBreadcrumbJsonLd([
            { name: "Home", item: "https://bookby247.com/" },
            { name: "Explore", item: "https://bookby247.com/explore" },
            { name: seoParams.city || "Search", item: `https://bookby247.com/search/${seoParams.city || ""}` }
        ])
    ];

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(jsonLd) }}
            />
            <SeoSearchContent 
                params={seoParams} 
                initialData={response} 
                slug={slug}
            />
        </>
    );
};

export default SeoSearchPage;
