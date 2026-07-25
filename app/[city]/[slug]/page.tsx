import { Suspense } from 'react';
import { Metadata } from 'next';
import SeoListingView from '@/components/explore-business/SeoListingView';
import { businessApi } from '@/api/public/business';
import { serviceApi } from '@/api/public/services';
import { safeJsonLdStringify } from '@/lib/utils';
import { generateItemListJsonLd, generateBreadcrumbJsonLd, generateGlobalServiceItemListJsonLd, generateOrganizationJsonLd, generateWebSiteJsonLd } from '@/lib/seo-jsonld';
import AiReadabilitySection from '@/components/seo/AiReadabilitySection';
import { notFound } from 'next/navigation';
import { normalizeBusiness } from '@/lib/business-normalizer';
import { buildCleanHeading, buildCleanMetadataTitle, cleanLocationName, buildSeoMetadata } from '@/lib/seo-title-helper';

export const revalidate = 3600;

interface Props {
    params: Promise<{ city: string; slug: string }>;
}

const COMMON_BUSINESS_TYPES = ['salon', 'spa', 'clinic', 'wellness', 'massage-center', 'beauty-parlour', 'gym', 'yoga-studio', 'dentist', 'dermatologist'];

/**
 * Validates if the path segments look like valid SEO routes
 */
const isValidSeoRoute = (city: string, slug: string) => {
    if (city.startsWith('.') || city.startsWith('_') || city === 'api') return false;
    if (slug.startsWith('.') || slug.startsWith('_')) return false;
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

    const isService = !COMMON_BUSINESS_TYPES.includes(category.toLowerCase());

    return {
        isTop10,
        isService,
        categorySlug: category,
        areaSlug: area,
        categoryName: category.replace(/-/g, ' '),
        areaName: cleanLocationName(area)
    };
};



export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { city, slug } = await params;
    
    if (!isValidSeoRoute(city, slug)) {
        return { robots: { index: false, follow: false } };
    }

    const info = parseSlug(slug);
    const cityName = cleanLocationName(city);
    const pageType = info.areaName ? "localityService" : "cityService";

    return buildSeoMetadata({
        pageType,
        serviceName: info.categoryName,
        city: cityName,
        locality: info.areaName,
        canonicalPath: `/${city}/${slug}`
    });
}

export default async function DetailSeoPage({ params }: Props) {
    const { city, slug } = await params;

    if (!isValidSeoRoute(city, slug)) {
        return notFound();
    }

    const cityName = cleanLocationName(city);

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
            areaName: cleanLocationName(slug)
        };
    } else {
        info = parseSlug(slug);
    }

    let items: any[] = [];
    let jsonLd: any = [];

    if (info.isService) {
        const response = await serviceApi.getSeoServices({
            city: city,
            area: info.areaSlug || undefined,
            category: info.categorySlug,
            limit: info.isTop10 ? 10 : 20,
            sort: info.isTop10 ? 'rating' : undefined
        }).catch(() => null);
        
        const rawServices = (response as any)?.data || [];
        items = rawServices.map(normalizeBusiness);
        
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
        const response = await businessApi.getSeoBusinesses({ 
            city: city, 
            area: info.areaSlug || undefined,
            type: info.categorySlug || undefined,
            limit: info.isTop10 ? 10 : 20,
            sort: info.isTop10 ? 'rating' : undefined
        }).catch(() => null);
        
        const rawBusinesses = (response as any)?.data || (response as any)?.results || (response as any)?.businesses || [];
        items = rawBusinesses.map(normalizeBusiness);
        
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

    const { title: displayTitle, subtitle: displaySubtitle } = buildCleanHeading({
        category: info.categoryName,
        locality: info.areaName,
        city: cityName,
        isTop10: info.isTop10,
    });

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
                        subtitle={displaySubtitle}
                    />
                </Suspense>

                <AiReadabilitySection 
                    aboutTitle={`${info.categoryName} in ${info.areaName || cityName}`} 
                    aboutContent={`In ${info.areaName || cityName}, explore verified ${info.categoryName.toLowerCase()} offering wellness treatments and beauty services. Compare details and book online with BookBy247.`} 
                />
            </main>
        </>
    );
}
