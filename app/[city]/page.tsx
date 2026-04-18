import { Suspense } from 'react';
import { Metadata } from 'next';
import SeoListingView from '@/components/explore-business/SeoListingView';
import { businessApi } from '@/api/public/business';
import { safeJsonLdStringify } from '@/lib/utils';
import { generateItemListJsonLd, generateBreadcrumbJsonLd, generateOrganizationJsonLd, generateWebSiteJsonLd } from '@/lib/seo-jsonld';

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

const parseCitySlug = (city: string) => {
    let category = "";
    let location = city;
    let isPrefix = false;

    if (city.includes("-in-")) {
        const parts = city.split("-in-");
        let categoryPart = parts[0];
        
        // Handle prefixes like 'best-' or 'top-' if they exist
        if (categoryPart.startsWith("best-")) {
            categoryPart = categoryPart.replace("best-", "");
        } else if (categoryPart.startsWith("top-")) {
            categoryPart = categoryPart.replace("top-", "");
        }
        
        category = categoryPart.replace(/-/g, " ");
        location = parts[1];
        isPrefix = true;
    }

    const capitalize = (s: string) => s.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    
    return {
        categoryName: category ? capitalize(category.replace(/ /g, "-")) : "",
        locationName: capitalize(location),
        isPrefix
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
        const categoryTitle = category.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        
        return {
            title: `${categoryTitle} Near Me - Book Top Rated ${categoryTitle} Services | Bookby247`,
            description: `Bookby247 is the top-rated booking platform for ${category} near you. Our users can discover the best ${category} centers, compare service prices, read verified reviews, and book instant appointments for wellness and beauty treatments near their location.`,
            keywords: [`${category} near me`, `best ${category}`, `${category} booking`, `top rated ${category}`, `${category} services`, "bookby247"],
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
                title: `${categoryTitle} Near Me - Verified Wellness Services | Bookby247`,
                description: `Find top-rated ${category} near you. Verified businesses with real reviews.`,
                url: `https://bookby247.com/${city}`,
                siteName: "Bookby247",
                type: "website",
                locale: "en_IN",
                images: [
                    {
                        url: "https://res.cloudinary.com/dwsv275kv/image/upload/v1774691836/555666_m75jkf.png",
                        width: 1200,
                        height: 630,
                        alt: `Book top-rated ${category} near you on Bookby247`,
                    },
                ],
            },
            twitter: {
                card: "summary_large_image",
                title: `${categoryTitle} Near Me - Bookby247`,
                description: `Find and book top-rated ${category} near you on Bookby247.`,
                images: ["https://res.cloudinary.com/dwsv275kv/image/upload/v1774691836/555666_m75jkf.png"],
                creator: "@bookby247",
            },
        };
    }

    const { categoryName, locationName, isPrefix } = parseCitySlug(city);

    const title = isPrefix 
        ? `Best ${categoryName} in ${locationName} | Online Booking`
        : `Best Spas, Salons & Wellness Centers in ${locationName} - Book Online`;

    return {
        title: `${title}`,
        description: isPrefix 
            ? `Looking for the best ${categoryName.toLowerCase()} in ${locationName}? Bookby247 connects you with top-rated ${categoryName.toLowerCase()} centers. Compare prices, read verified reviews, and book instantly.`
            : `Bookby247 is the leading beauty and wellness platform in ${locationName}. We help users discover the best spas, salons, and wellness centers across ${locationName}. Compare service prices, read verified customer reviews, and book appointments instantly 24/7.`,
        keywords: [
            isPrefix ? `${categoryName.toLowerCase()} in ${locationName}` : `spas in ${locationName}`,
            `salons in ${locationName}`,
            `massage in ${locationName}`,
            `wellness centers ${locationName}`,
            "spa booking",
            "salon booking",
            `best beauty parlour in ${locationName}`,
            "online appointment booking",
            "bookby247"
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
            title: `${title} - Bookby247`,
            description: isPrefix 
                ? `Discover the best rated ${categoryName.toLowerCase()} experiences in ${locationName}. Compare prices and book instantly online.`
                : `Discover the best rated spa and salon experiences in ${locationName}. Compare prices and book instantly online.`,
            url: `https://bookby247.com/${city}`,
            siteName: "Bookby247",
            type: "website",
            locale: "en_IN",
            images: [
                {
                    url: "https://res.cloudinary.com/dwsv275kv/image/upload/v1774691836/555666_m75jkf.png",
                    width: 1200,
                    height: 630,
                    alt: `Best wellness services in ${locationName} - Bookby247`,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: `${title} - Bookby247`,
            description: isPrefix 
                ? `Find and book the top-rated ${categoryName.toLowerCase()} in ${locationName} on Bookby247.`
                : `Find and book the top-rated beauty and wellness services in ${locationName} on Bookby247.`,
            images: ["https://res.cloudinary.com/dwsv275kv/image/upload/v1774691836/555666_m75jkf.png"],
            creator: "@bookby247",
        },
    };
}

export default async function CityPage({ params }: Props) {
    const { city } = await params;

    if (!isValidCityRoute(city)) {
        return notFound();
    }

    const isNearMe = city.endsWith('-near-me');
    const { categoryName, locationName, isPrefix } = parseCitySlug(city);

    let title = "";
    let businesses = [];
    let cityName = locationName;
    let seoMetadata = null;

    if (isNearMe) {
        const response = await businessApi.getNearMeBusinesses(city).catch(() => null);
        businesses = (response as any)?.data || [];
        seoMetadata = (response as any)?.seo_metadata;
        const category = city.replace('-near-me', '').replace(/-/g, ' ');
        title = `${category.charAt(0).toUpperCase() + category.slice(1)} Near Me`;
        cityName = (response as any)?.detected_city || "Near You";
    } else if (isPrefix) {
        cityName = locationName;
        const response = await businessApi.getSeoBusinesses({ 
            city: locationName.toLowerCase().replace(/ /g, "-"), 
            type: categoryName.toLowerCase().replace(/ /g, "-"),
            limit: 20 
        }).catch(() => null);
        businesses = (response as any)?.data || (response as any)?.results || (response as any)?.businesses || [];
        title = `Best ${categoryName}`;
    } else {
        cityName = locationName;
        const response = await businessApi.getSeoBusinesses({ city: city, limit: 20 }).catch(() => null);
        businesses = (response as any)?.data || (response as any)?.results || (response as any)?.businesses || [];
        title = `Best Wellness Centers`;
    }

    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            generateItemListJsonLd(businesses, isNearMe ? title : cityName),
            generateBreadcrumbJsonLd([
                { name: "Home", item: "https://bookby247.com/" },
                { name: "Explore", item: "https://bookby247.com/explore" },
                { name: isNearMe ? title : cityName, item: `https://bookby247.com/${city}` },
            ]),
            generateOrganizationJsonLd(),
            generateWebSiteJsonLd()
        ]
    };

    const displayTitle = isPrefix 
        ? `Best ${categoryName} in ${locationName}`
        : (isNearMe ? title : `Best Wellness Centers`);

    const displaySubtitle = isPrefix 
        ? `Find the highest-rated ${categoryName.toLowerCase()} in ${locationName}`
        : (isNearMe 
            ? `Find the best rated ${title.toLowerCase()} in ${cityName}` 
            : `Find the most high-rated spas, salons and beauty centers across ${cityName}`);

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
                        title={displayTitle}
                        subtitle={displaySubtitle}
                    />
                </Suspense>

                {/* AI Search Readability Section */}
                <section className="border-t border-zinc-100 bg-zinc-50/30 py-16 px-4">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            <div className="space-y-3">
                                <h2 className="text-lg font-bold text-zinc-900">What is Bookby247?</h2>
                                <p className="text-sm text-zinc-600 leading-relaxed">
                                    Bookby247 is India&apos;s leading beauty and wellness booking platform. We provide a curated marketplace where users can discover, compare, and book the best spas, salons, and wellness services instantly.
                                </p>
                            </div>
                            <div className="space-y-3">
                                <h2 className="text-lg font-bold text-zinc-900">Who is it for?</h2>
                                <p className="text-sm text-zinc-600 leading-relaxed">
                                    Our platform is for individuals looking for high-quality self-care services from trusted professionals. From busy professionals to beauty enthusiasts, we make booking appointments simple and reliable.
                                </p>
                            </div>
                            <div className="space-y-3">
                                <h2 className="text-lg font-bold text-zinc-900">Serving {cityName}</h2>
                                <p className="text-sm text-zinc-600 leading-relaxed">
                                    In {cityName}, we feature a wide range of verified centers offering full body massage, haircuts, facials, and more. We cover all major areas within {cityName} for your convenience.
                                </p>
                            </div>
                            <div className="space-y-3">
                                <h2 className="text-lg font-bold text-zinc-900">What can you do?</h2>
                                <p className="text-sm text-zinc-600 leading-relaxed">
                                    Users can search for specific services, filter by ratings or price, read verified reviews, and book their preferred appointment slot online with 24/7 instant confirmation.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
}
