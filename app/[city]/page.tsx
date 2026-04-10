import { Suspense } from 'react';
import { Metadata } from 'next';
import SeoListingView from '@/components/explore-business/SeoListingView';
import { businessApi } from '@/api/public/business';
import { safeJsonLdStringify } from '@/lib/utils';
import { generateItemListJsonLd, generateBreadcrumbJsonLd } from '@/lib/seo-jsonld';

import { notFound } from 'next/navigation';

export const revalidate = 3600;

interface Props {
    params: Promise<{ city: string }>;
}

/**
 * Validates if the city segment looks like a valid SEO route
 */
const isValidCityRoute = (city: string) => {
    // Ignore internal Next.js/System files
    if (city.startsWith('.') || city.startsWith('_') || city === 'api') return false;
    // Ignore files with extensions (e.g., .json, .js, .ico)
    if (city.includes('.')) return false;
    return true;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { city } = await params;
    
    if (!isValidCityRoute(city)) {
        return { robots: { index: false, follow: false } };
    }

    // Handle "Near Me" routes
    if (city.endsWith('-near-me')) {
        const category = city.replace('-near-me', '').replace(/-/g, ' ');
        const categoryTitle = category.charAt(0).toUpperCase() + category.slice(1);
        
        return {
            title: `${categoryTitle} Near Me - Best ${categoryTitle} Services Near You | Bookby247`,
            description: `Find top-rated ${category} centers near you. Compare prices, ratings, and book your appointment online instantly.`,
            keywords: [`${category} near me`, `best ${category}`, `${category} booking`],
            alternates: {
                canonical: `/${city}`,
            },
        };
    }

    const cityName = city.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

    return {
        title: `Best Spas, Salons and Beauty Centers in ${cityName} | Bookby247`,
        description: `Discover top-rated spas, salons, and wellness centers in ${cityName}. Compare prices, ratings, and book your appointment online instantly.`,
        keywords: [
            `spas in ${cityName}`,
            `salons in ${cityName}`,
            `massage in ${cityName}`,
            `wellness centers ${cityName}`,
            "spa booking",
            "salon booking",
        ],
        alternates: {
            canonical: `/${city}`,
        },
        openGraph: {
            title: `Best Spas, Salons and Beauty Centers in ${cityName} | Bookby247`,
            description: `Find the perfect spa or salon experience in ${cityName}.`,
            url: `https://bookby247.com/${city}`,
            type: "website",
        },
    };
}

export default async function CityPage({ params }: Props) {
    const { city } = await params;

    if (!isValidCityRoute(city)) {
        return notFound();
    }

    const isNearMe = city.endsWith('-near-me');
    let title = "";
    let businesses = [];
    let cityName = "";
    let seoMetadata = null;

    if (isNearMe) {
        const response = await businessApi.getNearMeBusinesses(city).catch(() => null);
        businesses = (response as any)?.data || [];
        seoMetadata = (response as any)?.seo_metadata;
        const category = city.replace('-near-me', '').replace(/-/g, ' ');
        title = `${category.charAt(0).toUpperCase() + category.slice(1)} Near Me`;
        cityName = (response as any)?.detected_city || "Near You";
    } else {
        cityName = city.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        const response = await businessApi.getSeoBusinesses({ city: city, limit: 20 }).catch(() => null);
        businesses = (response as any)?.data || (response as any)?.results || (response as any)?.businesses || [];
        title = `Best Wellness Centers`;
    }

    const jsonLd = [
        generateItemListJsonLd(businesses, isNearMe ? title : cityName),
        generateBreadcrumbJsonLd([
            { name: "Home", item: "https://bookby247.com/" },
            { name: "Explore", item: "https://bookby247.com/explore" },
            { name: isNearMe ? title : cityName, item: `https://bookby247.com/${city}` },
        ])
    ];

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(jsonLd) }}
            />
            <main className="min-h-screen bg-white">
                <Suspense fallback={
                    <div className="flex items-center justify-center min-h-[50vh]">
                        <div className="w-8 h-8 border-4 border-zinc-200 border-t-black rounded-full animate-spin" />
                    </div>
                }>
                    <SeoListingView 
                        initialCity={isNearMe ? "" : cityName} 
                        initialNearMe={isNearMe ? city : undefined}
                        title={isNearMe ? title : `Best Wellness Centers`}
                        subtitle={isNearMe 
                            ? `Find the best rated ${title.toLowerCase()} in ${cityName}` 
                            : `Find the most high-rated spas, salons and beauty centers across ${cityName}`
                        }
                    />
                </Suspense>
            </main>
        </>
    );
}
