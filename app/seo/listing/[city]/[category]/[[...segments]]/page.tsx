import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { businessApi } from '@/api/public/business';
import SeoListingView from '@/components/explore-business/SeoListingView';
import { generateBreadcrumbJsonLd, generateLocalBusinessJsonLd } from '@/lib/seo-jsonld';
import { safeJsonLdStringify } from '@/lib/utils';

export const revalidate = 3600; // Revalidate every hour

interface PageProps {
    params: Promise<{
        city: string;
        category: string;
        segments?: string[];
    }>;
}

/**
 * Enhanced Metadata Generation for SEO Listing Routes
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { city, category, segments = [] } = await params;
    
    // Fetch dynamic listing info from backend
    const response = await businessApi.getDynamicListing(city, category, segments[0], segments[1]).catch(() => null);
    
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

    // 🚀 Best SEO Title: [Prefix] [Service] [Category] in [Location] - [CTR Trigger]
    let title = `Best ${serviceName ? `${serviceName} ` : ''}${categoryName} in ${locationName} - Top Rated & Verified`;
    
    // Ensure title is within 60 characters if possible
    if (title.length > 60) {
        title = `Best ${serviceName ? `${serviceName} ` : ''}${categoryName} in ${locationName} - BookBy247`;
    }

    // 🚀 Best SEO Description: [Value Prop] + [Social Proof] + [CTA]
    const description = `Discover the ${total > 0 ? `top ${total} ` : 'best '}rated ${categoryName.toLowerCase()} ${serviceName ? `offering ${serviceName.toLowerCase()} ` : ''}in ${locationName}. Compare prices, read verified customer reviews, and enjoy instant online booking with BookBy247!`;

    const fullCanonicalUrl = `https://bookby247.com/seo/listing/${city}/${category}${segments.length > 0 ? `/${segments.join('/')}` : ''}`;

    // Collect keywords from all businesses for better SEO ranking
    const businessKeywords = (response.data || [])
        .flatMap((b: any) => b.business_seo?.keywords || [])
        .filter((k: string, i: number, arr: string[]) => k && arr.indexOf(k) === i) // Unique
        .slice(0, 20); // Limit to top 20 keywords

    const baseKeywords = [categoryName, cityName, areaName, serviceName, 'BookBy247', 'Online Booking'].filter(Boolean);
    const finalKeywords = [...new Set([...baseKeywords, ...businessKeywords])];

    return {
        title,
        description,
        keywords: finalKeywords,
        alternates: {
            canonical: fullCanonicalUrl,
        },
        openGraph: {
            title,
            description,
            url: fullCanonicalUrl,
            siteName: 'BookBy247',
            type: 'website',
        },
        robots: {
            index: true,
            follow: true,
        }
    };
}

/**
 * SEO Listing Page Component
 */
export default async function SeoListingPage({ params }: PageProps) {
    const { city, category, segments = [] } = await params;

    // Initial fetch for SSR
    const response = await businessApi.getDynamicListing(city, category, segments[0], segments[1], { limit: 12 }).catch(() => null);
    
    if (!response || !response.success) {
        return notFound();
    }

    const { filters, data: businesses, total } = response;

    const capitalize = (s: string) => s.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    const cityName = capitalize(filters.citySlug);
    const categoryName = capitalize(filters.categorySlug);
    const areaName = filters.areaSlug ? capitalize(filters.areaSlug) : '';
    const serviceName = filters.serviceSlug ? capitalize(filters.serviceSlug) : '';

    // Generate JSON-LD for SEO
    const jsonLd = [
        // Breadcrumbs
        generateBreadcrumbJsonLd([
            { name: 'Home', item: 'https://bookby247.com/' },
            { name: 'SEO Listing', item: 'https://bookby247.com/seo/listing' },
            { name: cityName, item: `https://bookby247.com/seo/listing/${filters.citySlug}` },
            { name: categoryName, item: `https://bookby247.com/seo/listing/${filters.citySlug}/${filters.categorySlug}` },
            ...(filters.areaSlug ? [{ name: areaName, item: `https://bookby247.com/seo/listing/${filters.citySlug}/${filters.categorySlug}/${filters.areaSlug}` }] : []),
            ...(filters.serviceSlug ? [{ name: serviceName, item: `https://bookby247.com/seo/listing/${filters.citySlug}/${filters.categorySlug}/${filters.areaSlug || ''}/${filters.serviceSlug}`.replace('//', '/') }] : []),
        ]),
        // List Items
        {
            "@context": "https://schema.org",
            "@type": "ItemList",
            "itemListElement": businesses.slice(0, 10).map((b: any, index: number) => ({
                "@type": "ListItem",
                "position": index + 1,
                "item": {
                    ...generateLocalBusinessJsonLd(b),
                    // Add extra SEO metadata if available
                    "keywords": b.business_seo?.keywords?.join(', ') || undefined
                }
            }))
        }
    ];

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
        </main>
    );
}
