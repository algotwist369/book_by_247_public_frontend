import React from 'react';
import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { businessApi } from '@/api/public/business';
import SeoListingView from '@/components/explore-business/SeoListingView';
import { generateBreadcrumbJsonLd, generateLocalBusinessJsonLd, generateOrganizationJsonLd, generateWebSiteJsonLd } from '@/lib/seo-jsonld';
import AiReadabilitySection from '@/components/seo/AiReadabilitySection';
import { safeJsonLdStringify } from '@/lib/utils';

export const revalidate = 3600; // Revalidate every hour

interface PageProps {
    params: Promise<{
        city: string;
        slug: string; // This is our 'category'
        subslugs: string[]; // This is our 'area' and 'service'
    }>;
}

/**
 * Validates if the path segments look like valid SEO routes
 */
const isValidSeoRoute = (city: string, slug: string) => {
    // Ignore internal Next.js/System files
    if (city.startsWith('.') || city.startsWith('_') || city === 'api') return false;
    if (slug.startsWith('.') || slug.startsWith('_')) return false;
    // Ignore files with extensions (e.g., .json, .js, .ico)
    if (city.includes('.') || slug.includes('.')) return false;
    return true;
};

/**
 * Enhanced Metadata Generation for Dynamic SEO Routes
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { city, slug, subslugs = [] } = await params;
    
    if (!isValidSeoRoute(city, slug)) {
        return { robots: { index: false, follow: false } };
    }
    
    // Fetch dynamic listing info to identify correct slugs and canonical URL
    const response = await businessApi.getDynamicListing(city, slug, subslugs[0], subslugs[1]).catch(() => null);
    
    if (!response || !response.success) {
        return { title: 'Not Found - BookBy247' };
    }

    const { filters, canonicalUrl, total = 0 } = response;
    const capitalize = (s: string) => s.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

    const cityName = capitalize(filters.citySlug);
    const categoryName = capitalize(filters.categorySlug);
    const areaName = filters.areaSlug ? capitalize(filters.areaSlug) : '';
    const serviceName = filters.serviceSlug ? capitalize(filters.serviceSlug) : '';

    const locationName = areaName ? `${areaName}, ${cityName}` : cityName;

    // Best SEO Title: [Prefix] [Service] [Category] in [Location] - [CTR Trigger]
    let title = `Best ${serviceName ? `${serviceName} ` : ''}${categoryName} in ${locationName} - Top Rated & Verified`;
    
    // Ensure title is within 60 characters if possible
    if (title.length > 60) {
        title = `Best ${serviceName ? `${serviceName} ` : ''}${categoryName} in ${locationName}`;
    }

    // Best SEO Description: [Value Prop] + [Social Proof] + [CTA]
    const description = `BookBy247 is the top platform for finding the ${total > 0 ? `top ${total} ` : 'best '}rated ${categoryName.toLowerCase()} ${serviceName ? `offering ${serviceName.toLowerCase()} ` : ''}in ${locationName}. Compare prices, read verified reviews, and book appointments online instantly.`;

    const fullCanonicalUrl = `https://bookby247.com${canonicalUrl}`;

    return {
        title,
        description,
        alternates: {
            canonical: fullCanonicalUrl,
        },
        openGraph: {
            title,
            description,
            url: fullCanonicalUrl,
            siteName: 'BookBy247',
            type: 'website',
            locale: 'en_IN',
            images: [
                {
                    url: 'https://res.cloudinary.com/dwsv275kv/image/upload/v1774691836/555666_m75jkf.png',
                    width: 1200,
                    height: 630,
                    alt: `Best ${categoryName} in ${locationName} - BookBy247`,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: ['https://res.cloudinary.com/dwsv275kv/image/upload/v1774691836/555666_m75jkf.png'],
            creator: '@BookBy247',
        },
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                'max-image-preview': 'large',
            },
        }
    };
}

/**
 * Dynamic SEO Listing Page Component (Server Component)
 */
export default async function DynamicSeoListingPage({ params }: PageProps) {
    const { city, slug, subslugs = [] } = await params;

    // Fast-fail for system/file requests
    if (!isValidSeoRoute(city, slug)) {
        return notFound();
    }
    
    // Initial fetch for SSR
    const response = await businessApi.getDynamicListing(city, slug, subslugs[0], subslugs[1], { limit: 12 }).catch(() => null);
    
    if (!response || !response.success) {
        return notFound();
    }

    const { filters, canonicalUrl, data: businesses, total } = response;
    const currentPath = `/${city}/${slug}${subslugs.length > 0 ? `/${subslugs.join('/')}` : ''}`;

    // SEO Optimization: Redirect to canonical URL if order is wrong
    if (currentPath.toLowerCase() !== canonicalUrl.toLowerCase()) {
        redirect(canonicalUrl);
    }

    const capitalize = (s: string) => s.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    const cityName = capitalize(filters.citySlug);
    const categoryName = capitalize(filters.categorySlug);
    const areaName = filters.areaSlug ? capitalize(filters.areaSlug) : '';
    const serviceName = filters.serviceSlug ? capitalize(filters.serviceSlug) : '';

    // Generate JSON-LD for SEO
    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            // Breadcrumbs
            generateBreadcrumbJsonLd([
                { name: 'Home', item: 'https://bookby247.com/' },
                { name: cityName, item: `https://bookby247.com/${filters.citySlug}` },
                { name: categoryName, item: `https://bookby247.com/${filters.citySlug}/${filters.categorySlug}` },
                ...(filters.areaSlug ? [{ name: areaName, item: `https://bookby247.com/${filters.citySlug}/${filters.categorySlug}/${filters.areaSlug}` }] : []),
                ...(filters.serviceSlug ? [{ name: serviceName, item: `https://bookby247.com/${filters.citySlug}/${filters.categorySlug}/${filters.areaSlug || ''}/${filters.serviceSlug}`.replace('//', '/') }] : []),
            ]),
            // List Items (First few businesses)
            {
                "@type": "ItemList",
                "itemListElement": businesses.slice(0, 10).map((b: any, index: number) => ({
                    "@type": "ListItem",
                    "position": index + 1,
                    "item": generateLocalBusinessJsonLd(b)
                }))
            },
            generateOrganizationJsonLd(),
            generateWebSiteJsonLd()
        ]
    };

    const displayTitle = serviceName 
        ? `Best ${serviceName} ${categoryName} in ${areaName || cityName}`
        : `Best ${categoryName} in ${areaName || cityName}`;

    return (
        <main className="min-h-screen bg-gray-50">
            {/* Inject JSON-LD */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(jsonLd) }}
            />

            <SeoListingView 
                initialCity={filters.citySlug}
                initialArea={filters.areaSlug}
                initialCategory={filters.categorySlug}
                title={displayTitle}
                subtitle={`Top rated ${categoryName.toLowerCase()} in ${areaName || cityName}. ${total} results found.`}
                viewType="business"
            />

            <AiReadabilitySection 
                aboutTitle={`Best ${categoryName} in ${areaName || cityName}`} 
                aboutContent={`In ${areaName || cityName}, we feature a wide range of verified ${categoryName.toLowerCase()} offering premium treatments. Our platform ensures you find the highest-rated services with transparent pricing.`} 
            />
        </main>
    );
}
