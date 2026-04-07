import { Suspense } from 'react';
import { Metadata } from 'next';
import SeoListingView from '@/components/explore-business/SeoListingView';
import { businessApi } from '@/api/public/business';
import { safeJsonLdStringify } from '@/lib/utils';
import { generateItemListJsonLd, generateBreadcrumbJsonLd } from '@/lib/seo-jsonld';

export const revalidate = 3600;

interface Props {
    params: Promise<{ city: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { city } = await params;
    const cityName = city.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

    return {
        title: `Best Spas and Salons in ${cityName} | Bookby247`,
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
            title: `Best Spas and Salons in ${cityName} | Bookby247`,
            description: `Find the perfect spa or salon experience in ${cityName}.`,
            url: `https://bookby247.com/${city}`,
            type: "website",
        },
    };
}

export default async function CityPage({ params }: Props) {
    const { city } = await params;
    const cityName = city.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

    // Fetch initial data for JSON-LD
    const response = await businessApi.getSeoBusinesses({ city: city, limit: 20 }).catch(() => null);
    const businesses = (response as any)?.results || (response as any)?.businesses || [];

    const jsonLd = [
        generateItemListJsonLd(businesses, cityName),
        generateBreadcrumbJsonLd([
            { name: "Home", item: "https://bookby247.com/" },
            { name: "Explore", item: "https://bookby247.com/explore" },
            { name: cityName, item: `https://bookby247.com/${city}` },
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
                        initialCity={cityName} 
                        title={`Best Wellness in ${cityName}`}
                        subtitle={`Explore the most high-rated spas, salons and massage centers across ${cityName}`}
                    />
                </Suspense>
            </main>
        </>
    );
}
