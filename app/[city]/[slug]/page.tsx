import { Suspense } from 'react';
import { Metadata } from 'next';
import SeoListingView from '@/components/explore-business/SeoListingView';
import { businessApi } from '@/api/public/business';
import { serviceApi } from '@/api/public/services';
import { safeJsonLdStringify } from '@/lib/utils';
import { generateItemListJsonLd, generateBreadcrumbJsonLd, generateGlobalServiceItemListJsonLd, generateOrganizationJsonLd, generateWebSiteJsonLd } from '@/lib/seo-jsonld';
import AiReadabilitySection from '@/components/seo/AiReadabilitySection';
import { notFound } from 'next/navigation';

export const revalidate = 3600;

interface Props {
    params: Promise<{ city: string; slug: string }>;
}

const COMMON_BUSINESS_TYPES = ['salon', 'spa', 'clinic', 'wellness', 'massage-center', 'beauty-parlour', 'gym', 'yoga-studio', 'dentist', 'dermatologist'];

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

const parseSlug = (slug: string) => {
    let isTop10 = false;
    let category = "";
    let area = "";

    let currentSlug = slug;

    if (currentSlug.startsWith("top-10-")) {
        isTop10 = true;
        currentSlug = currentSlug.replace("top-10-", "");
    }

    if (currentSlug.includes("-in-")) {
        const [catPart, areaPart] = currentSlug.split("-in-");
        category = catPart;
        area = areaPart;
    } else {
        category = currentSlug;
    }

    const capitalize = (s: string) => s.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    
    // Determine if it's a service or a business type
    const isService = !COMMON_BUSINESS_TYPES.includes(category.toLowerCase());

    return {
        isTop10,
        isService,
        categorySlug: category,
        areaSlug: area,
        categoryName: capitalize(category),
        areaName: area ? capitalize(area) : ""
    };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { city, slug } = await params;
    
    if (!isValidSeoRoute(city, slug)) {
        return { robots: { index: false, follow: false } };
    }

    const info = parseSlug(slug);
    const cityName = city.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

    const title = info.isTop10
        ? `Top 10 Best ${info.categoryName} in ${info.areaName || cityName} | Ratings & Reviews`
        : `Best ${info.categoryName} in ${info.areaName || cityName} ${info.areaName ? `, ${cityName}` : ""} | Online Booking`;

    const description = `BookBy247 is the leading platform for finding the ${info.isTop10 ? "top 10" : "best"} ${info.categoryName.toLowerCase()} in ${info.areaName || cityName}. Read customer reviews, compare service prices, and book your appointment online instantly with 24/7 confirmation.`;

    return {
        title,
        description,
        keywords: [
            `${info.categoryName} in ${info.areaName || cityName}`,
            `${info.isTop10 ? "top 10 " : ""}${info.categoryName.toLowerCase()} ${cityName}`,
            `best ${info.categoryName.toLowerCase()} ${info.areaName || cityName}`,
            "online spa booking",
            "salon appointment booking",
            "BookBy247"
        ],
        alternates: {
            canonical: `/${city}/${slug}`,
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
            url: `https://bookby247.com/${city}/${slug}`,
            siteName: "BookBy247",
            type: "website",
            locale: "en_IN",
            images: [
                {
                    url: "https://res.cloudinary.com/dwsv275kv/image/upload/v1774691836/555666_m75jkf.png",
                    width: 1200,
                    height: 630,
                    alt: `Find the best ${info.categoryName} in ${info.areaName || cityName} - BookBy247`,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: ["https://res.cloudinary.com/dwsv275kv/image/upload/v1774691836/555666_m75jkf.png"],
            creator: "@BookBy247",
        },
    };
}

export default async function DetailSeoPage({ params }: Props) {
    const { city, slug } = await params;

    if (!isValidSeoRoute(city, slug)) {
        return notFound();
    }

    const capitalize = (s: string) => s.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    const cityName = city.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

    // Check if the slug is an area in the city
    const areasResponse = await businessApi.getCityAreas(city).catch(() => null);
    const cityAreas = areasResponse?.data || [];
    const isAreaPage = cityAreas.includes(slug.toLowerCase());

    let info;
    if (isAreaPage) {
        info = {
            isTop10: false,
            isService: false,
            categorySlug: "",
            areaSlug: slug,
            categoryName: "Wellness Centers",
            areaName: capitalize(slug)
        };
    } else {
        info = parseSlug(slug);
    }

    let items: any[] = [];
    let jsonLd: any = [];

    if (info.isService) {
        // Fetch Service initial data
        const response = await serviceApi.getSeoServices({
            city: city,
            area: info.areaSlug || undefined,
            category: info.categorySlug,
            limit: info.isTop10 ? 10 : 20,
            sort: info.isTop10 ? 'rating' : undefined
        }).catch(() => null);
        
        items = (response as any)?.data || [];
        
        jsonLd = {
            "@context": "https://schema.org",
            "@graph": [
                generateGlobalServiceItemListJsonLd(items, info.areaName || cityName, info.categoryName),
                generateBreadcrumbJsonLd([
                    { name: "Home", item: "https://bookby247.com/" },
                    { name: "Explore", item: "https://bookby247.com/explore" },
                    { name: cityName, item: `https://bookby247.com/${city}` },
                    { name: info.categoryName, item: `https://bookby247.com/${city}/${slug}` },
                ]),
                generateOrganizationJsonLd(),
                generateWebSiteJsonLd()
            ]
        };
    } else {
        // Fetch Business initial data
        const response = await businessApi.getSeoBusinesses({ 
            city: city, 
            area: info.areaSlug || undefined,
            type: info.categorySlug || undefined,
            limit: info.isTop10 ? 10 : 20,
            sort: info.isTop10 ? 'rating' : undefined
        }).catch(() => null);
        
        items = (response as any)?.data || (response as any)?.results || (response as any)?.businesses || [];
        
        jsonLd = {
            "@context": "https://schema.org",
            "@graph": [
                generateItemListJsonLd(items, info.areaName || cityName, info.categoryName),
                generateBreadcrumbJsonLd([
                    { name: "Home", item: "https://bookby247.com/" },
                    { name: "Explore", item: "https://bookby247.com/explore" },
                    { name: cityName, item: `https://bookby247.com/${city}` },
                    { name: info.categoryName, item: `https://bookby247.com/${city}/${slug}` },
                ]),
                generateOrganizationJsonLd(),
                generateWebSiteJsonLd()
            ]
        };
    }

    const displayTitle = info.isTop10 
        ? `Top 10 ${info.categoryName} in ${info.areaName || cityName}`
        : `${info.categoryName} in ${info.areaName || cityName}`;


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
                        initialArea={info.areaName}
                        initialCategory={info.categoryName}
                        initialBusinesses={items}
                        isTop10={info.isTop10}
                        viewType={info.isService ? 'service' : 'business'}
                        title={displayTitle}
                        subtitle={`Find the highest-rated ${info.categoryName.toLowerCase()} and wellness services in ${info.areaName || cityName}`}
                    />
                </Suspense>

                <AiReadabilitySection 
                    aboutTitle={`Best ${info.categoryName} in ${info.areaName || cityName}`} 
                    aboutContent={`In ${info.areaName || cityName}, we feature a wide range of verified ${info.categoryName.toLowerCase()} offering premium treatments. Our platform ensures you find the highest-rated services with transparent pricing.`} 
                />
            </main>
        </>
    );
}
