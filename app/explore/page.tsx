import { Suspense } from 'react';
import { Metadata } from 'next';
import ExplorePageContent from './ExplorePageContent';
import { businessApi } from '@/api/public/business';
import { safeJsonLdStringify, slugToTitleCase } from '@/lib/utils';
import { generateBreadcrumbJsonLd, generateItemListJsonLd, generateOrganizationJsonLd, generateWebSiteJsonLd } from '@/lib/seo-jsonld';
import AiReadabilitySection from '@/components/seo/AiReadabilitySection';

export const revalidate = 3600;

interface PageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

import { buildSeoMetadata, cleanLocationName } from '@/lib/seo-title-helper';

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
    const params = await searchParams;
    const q = typeof params.q === 'string' ? params.q : '';
    const location = typeof params.location === 'string' ? params.location : '';
    const category = typeof params.category === 'string' ? params.category : '';
    const tag = typeof params.tag === 'string' ? params.tag : '';

    if (location) {
        return buildSeoMetadata({
            pageType: category ? "cityService" : "city",
            serviceName: category || q,
            city: cleanLocationName(location),
            canonicalPath: "/explore"
        });
    }

    return buildSeoMetadata({
        pageType: "city",
        city: "India",
        canonicalPath: "/explore"
    });
}

export default async function ExplorePage({ searchParams }: PageProps) {
    const params = await searchParams;
    const safeLimit = params.limit ? Math.min(Number(params.limit) || 8, 12) : 8;
    const response = await businessApi.searchBusinesses({
        ...params,
        limit: safeLimit
    }).catch(() => null);

    const data = (response as any)?.data || (response as any)?.payload?.decryptedData || response || {};
    const rawBusinesses = data.results || data.businesses || [];

    const businesses = rawBusinesses.map((b: any) => {
        const rawImages = Array.isArray(b.images) ? b.images : [];
        const galleryImages = Array.isArray(b.gallery) ? b.gallery : [];
        const nestedGallery = Array.isArray(b.images?.gallery) ? b.images.gallery : [];

        const combinedImages = Array.from(new Set([
            b.thumbnailImage,
            b.logoImage,
            ...rawImages,
            ...galleryImages,
            ...nestedGallery,
            b.image,
            b.images?.banner,
            b.images?.logo,
            b.images?.thumbnail
        ])).filter(Boolean) as string[];

        return {
            ...b,
            id: b.id || b._id,
            rating: b.averageRating ?? b.rating ?? b.ratings?.average ?? 0,
            reviews: b.totalReviews ?? b.reviews ?? b.ratings?.totalReviews ?? 0,
            images: combinedImages,
            image: b.thumbnailImage || b.image || combinedImages[0] || "",
            price: b.price ?? 0,
            amenities: Array.isArray(b.amenities) ? b.amenities : [],
            gender: b.gender ?? 'Any',
            categories: b.category ? [b.category] : (Array.isArray(b.categories) ? b.categories : []),
            description: b.description || b.seo?.metaDescription || "Experience premium wellness treatments and relaxation therapies.",
            coordinates: b.coordinates || b.location?.coordinates || { lat: 13.0418, lng: 80.2341 },
            slug: b.slug || b.bussiness_slug,
        };
    });

    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            generateItemListJsonLd(businesses, "India", "Wellness Centers"),
            generateBreadcrumbJsonLd([
                { name: "Home", item: "https://bookby247.com/" },
                { name: "Explore", item: "https://bookby247.com/explore" },
            ]),
            generateOrganizationJsonLd(),
            generateWebSiteJsonLd()
        ]
    };

    const initialData = {
        results: businesses,
        totalResults: data?.totalResults ?? businesses.length,
        page: 1,
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
                    <ExplorePageContent initialData={initialData} />
                </Suspense>

                <AiReadabilitySection
                    aboutTitle="Explore Wellness Anywhere"
                    aboutContent="Our explore page allows you to filter through thousands of verified spas, salons, and beauty parlours across India. Whether you are looking for specific services or local favorites, BookBy247 provides a seamless discovery experience."
                />
            </main>
        </>
    );
}
