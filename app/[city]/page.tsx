import { Suspense } from 'react';
import { Metadata } from 'next';
import SeoListingView from '@/components/explore-business/SeoListingView';
import { businessApi } from '@/api/public/business';
import { safeJsonLdStringify } from '@/lib/utils';
import { generateItemListJsonLd, generateBreadcrumbJsonLd, generateOrganizationJsonLd, generateWebSiteJsonLd } from '@/lib/seo-jsonld';
import AiReadabilitySection from '@/components/seo/AiReadabilitySection';
import { notFound } from 'next/navigation';
import { normalizeBusiness } from '@/lib/business-normalizer';
import { buildCleanHeading, buildCleanMetadataTitle, cleanLocationName } from '@/lib/seo-title-helper';

export const revalidate = 3600;

interface Props {
    params: Promise<{ city: string }>;
}

/**
 * Validates if the city segment looks like a valid SEO route
 */
const isValidCityRoute = (city: string) => {
    if (city.startsWith('.') || city.startsWith('_') || city === 'api') return false;
    if (city.includes('.')) return false;
    return true;
};

const parseCitySlug = (city: string) => {
    let category = "";
    let location = city;

    if (city.includes("-in-")) {
        const parts = city.split("-in-");
        let categoryPart = parts[0];
        if (categoryPart.startsWith("best-")) categoryPart = categoryPart.replace("best-", "");
        if (categoryPart.startsWith("top-")) categoryPart = categoryPart.replace("top-", "");
        category = categoryPart.replace(/-/g, " ");
        location = parts[1];
    }

    return {
        categoryName: category,
        locationName: cleanLocationName(location),
    };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { city } = await params;
    
    if (!isValidCityRoute(city)) {
        return { robots: { index: false, follow: false } };
    }

    // Handle "Near Me" routes
    if (city.endsWith('-near-me')) {
        const category = city.replace('-near-me', '').replace(/-/g, ' ');
        const categoryTitle = cleanLocationName(category);
        
        return {
            title: `${categoryTitle} Near Me – Compare & Book Online | BookBy247`,
            description: `Discover ${category} centers near you on BookBy247. Compare service options, view locations, and book appointments online.`,
            keywords: [`${category} near me`, `${category} booking`, `${category} services`, "BookBy247"],
            alternates: {
                canonical: `/${city}`,
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
                title: `${categoryTitle} Near Me | BookBy247`,
                description: `Find ${category} centers near you with verified location information.`,
                url: `https://bookby247.com/${city}`,
                siteName: "BookBy247",
                type: "website",
                locale: "en_IN",
            },
        };
    }

    const { categoryName, locationName } = parseCitySlug(city);
    const title = buildCleanMetadataTitle({ category: categoryName, city: locationName });

    return {
        title,
        description: categoryName
            ? `Explore ${categoryName.toLowerCase()} options in ${locationName}. View locations, prices, and book appointments on BookBy247.`
            : `Discover beauty and wellness centers in ${locationName}. Compare service details and book appointments online with BookBy247.`,
        keywords: [
            categoryName ? `${categoryName.toLowerCase()} in ${locationName}` : `spas in ${locationName}`,
            `salons in ${locationName}`,
            `wellness centers in ${locationName}`,
            "online appointment booking",
            "BookBy247"
        ],
        alternates: {
            canonical: `/${city}`,
        },
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                'max-video-preview': -1,
                'max-image-preview': 'large',
                'max-snippet': -1,
            },
        },
        openGraph: {
            title,
            description: `Explore wellness services in ${locationName} on BookBy247.`,
            url: `https://bookby247.com/${city}`,
            siteName: "BookBy247",
            type: "website",
            locale: "en_IN",
        },
    };
}

export default async function CityPage({ params }: Props) {
    const { city } = await params;

    if (!isValidCityRoute(city)) {
        return notFound();
    }

    const isNearMe = city.endsWith('-near-me');
    const { categoryName, locationName } = parseCitySlug(city);

    let rawBusinesses = [];
    let cityName = locationName;

    if (isNearMe) {
        const response = await businessApi.getNearMeBusinesses(city).catch(() => null);
        rawBusinesses = (response as any)?.data || [];
        cityName = (response as any)?.detected_city || "Near You";
    } else if (categoryName) {
        cityName = locationName;
        const response = await businessApi.getSeoBusinesses({ 
            city: locationName.toLowerCase().replace(/ /g, "-"), 
            type: categoryName.toLowerCase().replace(/ /g, "-"),
            limit: 20 
        }).catch(() => null);
        rawBusinesses = (response as any)?.data || (response as any)?.results || (response as any)?.businesses || [];
    } else {
        cityName = locationName;
        const response = await businessApi.getSeoBusinesses({ city: city, limit: 20 }).catch(() => null);
        rawBusinesses = (response as any)?.data || (response as any)?.results || (response as any)?.businesses || [];
    }

    const businesses = Array.isArray(rawBusinesses) ? rawBusinesses.map(normalizeBusiness) : [];

    const { title: displayTitle, subtitle: displaySubtitle } = buildCleanHeading({
        category: categoryName,
        city: cityName,
    });

    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            generateItemListJsonLd(businesses, cityName),
            generateBreadcrumbJsonLd([
                { name: "Home", item: "https://bookby247.com/" },
                { name: "Explore", item: "https://bookby247.com/explore" },
                { name: cityName, item: `https://bookby247.com/${city}` },
            ]),
            generateOrganizationJsonLd(),
            generateWebSiteJsonLd()
        ]
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(jsonLd) }}
            />
            <main className="min-h-screen bg-white w-full">

                <Suspense fallback={
                    <div className="flex items-center justify-center min-h-[50vh]">
                        <div className="w-8 h-8 border-4 border-zinc-200 border-t-black rounded-full animate-spin" />
                    </div>
                }>
                    <SeoListingView 
                        initialCity={cityName} 
                        initialNearMe={isNearMe ? city : undefined}
                        initialBusinesses={businesses}
                        title={displayTitle}
                        subtitle={displaySubtitle}
                    />
                </Suspense>

                <AiReadabilitySection 
                    aboutTitle={`Wellness Services in ${cityName}`} 
                    aboutContent={`In ${cityName}, BookBy247 presents verified wellness and beauty centers. Compare service details and book appointments directly online.`} 
                />
            </main>
        </>
    );
}
