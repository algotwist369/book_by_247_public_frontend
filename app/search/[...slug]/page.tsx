import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { businessApi } from '@/api/public/business';
import { safeJsonLdStringify } from '@/lib/utils';
import { generateItemListJsonLd, generateBreadcrumbJsonLd, generateOrganizationJsonLd, generateWebSiteJsonLd } from '@/lib/seo-jsonld';
import AiReadabilitySection from '@/components/seo/AiReadabilitySection';
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

    const title = `${titleParts.join(" ")} - Book Appointments Online - BookBy247`;
    const description = `Discover and book top-rated ${service || type || 'wellness services'} in ${area ? `${area}, ` : ''}${city || 'your city'}. Compare prices, read reviews, and book instantly on BookBy247.`;

    const canonicalPath = `/search/${slug.join("/")}`;

    return {
        title,
        description,
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
            images: [
                {
                    url: "https://res.cloudinary.com/dwsv275kv/image/upload/v1774691836/555666_m75jkf.png",
                    width: 1200,
                    height: 630,
                    alt: "Book verified spa, salon, and beauty services near you in India",
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: ["https://res.cloudinary.com/dwsv275kv/image/upload/v1774691836/555666_m75jkf.png"],
            creator: "@BookBy247",
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
    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            generateItemListJsonLd(businesses, seoParams.city, seoParams.service || seoParams.type),
            generateBreadcrumbJsonLd([
                { name: "Home", item: "https://bookby247.com/" },
                { name: "Explore", item: "https://bookby247.com/explore" },
                { name: seoParams.city || "Search", item: `https://bookby247.com/search/${seoParams.city || ""}` }
            ]),
            generateOrganizationJsonLd(),
            generateWebSiteJsonLd()
        ]
    };

    const cityName = seoParams.city ? seoParams.city.charAt(0).toUpperCase() + seoParams.city.slice(1) : "";
    const serviceName = seoParams.service ? seoParams.service.charAt(0).toUpperCase() + seoParams.service.slice(1) : (seoParams.type ? seoParams.type.toUpperCase() : "");

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(jsonLd) }}
            />
            <main className="min-h-screen bg-white">
                <SeoSearchContent 
                    params={seoParams}
                    initialData={response}
                    slug={slug}
                />
                
                <AiReadabilitySection 
                    aboutTitle={cityName ? `Best Wellness in ${cityName}` : "Search Local Wellness"}
                    aboutContent={cityName 
                        ? `Discover the highest-rated ${serviceName || 'wellness services'} in ${cityName}. Our platform connects you with verified professionals for instant online booking.`
                        : "Our search tool helps you find verified spas, salons, and beauty parlours across India. Compare prices, read reviews, and book your next appointment in minutes."
                    }
                />
            </main>
        </>
    );
};

export default SeoSearchPage;
