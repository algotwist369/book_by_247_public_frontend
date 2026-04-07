import { Suspense } from 'react';
import { Metadata } from 'next';
import SeoListingView from '@/components/explore-business/SeoListingView';
import { businessApi } from '@/api/public/business';
import { serviceApi } from '@/api/public/services';
import { safeJsonLdStringify } from '@/lib/utils';
import { generateItemListJsonLd, generateBreadcrumbJsonLd, generateGlobalServiceItemListJsonLd } from '@/lib/seo-jsonld';

export const revalidate = 3600;

interface Props {
    params: Promise<{ city: string; slug: string }>;
}

const COMMON_BUSINESS_TYPES = ['salon', 'spa', 'clinic', 'wellness', 'massage-center', 'beauty-parlour', 'gym', 'yoga-studio', 'dentist', 'dermatologist'];

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
    const info = parseSlug(slug);
    const cityName = city.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

    const title = info.isTop10
        ? `Top 10 Best ${info.categoryName} in ${info.areaName || cityName} | Ratings & Reviews | Bookby247`
        : `Best ${info.categoryName} in ${info.areaName || cityName} ${info.areaName ? `, ${cityName}` : ""} | Online Booking | Bookby247`;

    const description = `Find the ${info.isTop10 ? "top 10" : "best"} ${info.categoryName.toLowerCase()} in ${info.areaName || cityName}. Read customer reviews, check prices, view gallery and book your appointments online at Bookby247.`;

    return {
        title,
        description,
        keywords: [
            `${info.categoryName} in ${info.areaName || cityName}`,
            `${info.isTop10 ? "top 10 " : ""}${info.categoryName.toLowerCase()} ${cityName}`,
            `best ${info.categoryName.toLowerCase()} ${info.areaName || cityName}`,
            "online spa booking",
            "salon appointment booking"
        ],
        alternates: {
            canonical: `/${city}/${slug}`,
        },
        openGraph: {
            title,
            description,
            url: `https://bookby247.com/${city}/${slug}`,
            type: "website",
        },
    };
}

export default async function DetailSeoPage({ params }: Props) {
    const { city, slug } = await params;
    const info = parseSlug(slug);
    const cityName = city.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

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
        
        jsonLd = [
            generateGlobalServiceItemListJsonLd(items, info.areaName || cityName, info.categoryName),
            generateBreadcrumbJsonLd([
                { name: "Home", item: "https://bookby247.com/" },
                { name: "Explore", item: "https://bookby247.com/explore" },
                { name: cityName, item: `https://bookby247.com/${city}` },
                { name: info.categoryName, item: `https://bookby247.com/${city}/${slug}` },
            ])
        ];
    } else {
        // Fetch Business initial data
        const response = await businessApi.getSeoBusinesses({ 
            city: city, 
            area: info.areaSlug || undefined,
            type: info.categorySlug || undefined,
            limit: info.isTop10 ? 10 : 20,
            sort: info.isTop10 ? 'rating' : undefined
        }).catch(() => null);
        
        items = (response as any)?.results || (response as any)?.businesses || [];
        
        jsonLd = [
            generateItemListJsonLd(items, info.areaName || cityName, info.categoryName),
            generateBreadcrumbJsonLd([
                { name: "Home", item: "https://bookby247.com/" },
                { name: "Explore", item: "https://bookby247.com/explore" },
                { name: cityName, item: `https://bookby247.com/${city}` },
                { name: info.categoryName, item: `https://bookby247.com/${city}/${slug}` },
            ])
        ];
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
            <main className="min-h-screen bg-white">
                <Suspense fallback={
                    <div className="flex items-center justify-center min-h-[50vh]">
                        <div className="w-8 h-8 border-4 border-zinc-200 border-t-black rounded-full animate-spin" />
                    </div>
                }>
                    <SeoListingView 
                        initialCity={cityName}
                        initialArea={info.areaName}
                        initialCategory={info.categoryName}
                        isTop10={info.isTop10}
                        viewType={info.isService ? 'service' : 'business'}
                        title={displayTitle}
                        subtitle={`Find the highest-rated ${info.categoryName.toLowerCase()} and wellness services in ${info.areaName || cityName}`}
                    />
                </Suspense>
            </main>
        </>
    );
}
