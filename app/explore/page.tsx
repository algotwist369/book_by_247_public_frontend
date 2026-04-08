import { Suspense } from 'react';
import { Metadata } from 'next';
import ExplorePageContent from './ExplorePageContent';
import { businessApi } from '@/api/public/business';
import { safeJsonLdStringify } from '@/lib/utils';

export const revalidate = 3600;

interface PageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
    const params = await searchParams;
    const q = typeof params.q === 'string' ? params.q : '';
    const location = typeof params.location === 'string' ? params.location : '';
    const category = typeof params.category === 'string' ? params.category : '';

    let title = 'Explore Top Spas, Salons and Beauty Centers Near You | Bookby247';
    let description = 'Compare and book top-rated spas, salons, and beauty centers near you with powerful filters for rating, category, and location.';

    if (q || location || category) {
        const parts = [];
        if (category) parts.push(`Best ${category}`);
        else if (q) parts.push(`Search results for "${q}"`);
        else parts.push('Top Spas, Salons and Beauty Centers');

        if (location) parts.push(`in ${location}`);

        title = `${parts.join(' ')} | Bookby247`;
        description = `Discover and book the highest-rated ${category || 'beauty centers'} ${location ? `in ${location}` : 'near you'}. ${q ? `Results for: ${q}.` : ''} Instant booking, verified reviews, and premium services.`;
    }

    return {
        title,
        description,
        keywords: [
            ...(category ? [category, `best ${category}`, `${category} near me`] : []),
            ...(location ? [location, `spas in ${location}`, `salons in ${location}`] : []),
            "explore spas",
            "explore salons",
            "explore beauty centers",
            "beauty centers",
            "spa booking",
            "salon booking",
            "beauty center booking",
        ],
        authors: [{ name: "Bookby247 Team" }],
        alternates: {
            canonical: "/explore",
        },
        openGraph: {
            title,
            description,
            images: ['https://thaiodyssey.co.in/assets/img/blog/475003.jpg'],
            url: "https://bookby247.com/explore",
            type: "website",
            siteName: "Bookby247",
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
        },
    };
}

export default async function ExplorePage({ searchParams }: PageProps) {
    const params = await searchParams;
    const response = await businessApi.searchBusinesses({ 
        ...params,
        limit: 100 
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
            coordinates: b.coordinates || b.location?.coordinates || { lat: 13.0418, lng: 80.2341 }
        };
    });

    const location = typeof params.location === 'string' ? params.location : '';
    const category = typeof params.category === 'string' ? params.category : '';

    // Senior SEO: Injecting JSON-LD for LocalBusiness list
    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "ItemList",
                "name": `Explore ${category || 'spas and salons'} ${location ? `in ${location}` : ''}`,
                "url": "https://bookby247.com/explore",
                "itemListElement": businesses.map((b: any, i: number) => ({
                    "@type": "ListItem",
                    "position": i + 1,
                    "item": {
                        "@type": "LocalBusiness",
                        "name": b.name,
                        "image": b.image,
                        "url": `https://bookby247.com/business/${b.slug}`,
                        "aggregateRating": {
                            "@type": "AggregateRating",
                            "ratingValue": b.rating,
                            "reviewCount": b.reviews,
                        },
                        "address": {
                            "@type": "PostalAddress",
                            "streetAddress": b.address,
                            "addressLocality": b.branch || b.city,
                        },
                    },
                })),
            },
            {
                "@type": "BreadcrumbList",
                "itemListElement": [
                    {
                        "@type": "ListItem",
                        "position": 1,
                        "name": "Home",
                        "item": "https://bookby247.com/",
                    },
                    {
                        "@type": "ListItem",
                        "position": 2,
                        "name": "Explore",
                        "item": "https://bookby247.com/explore",
                    },
                ],
            },
        ],
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
            <main className="min-h-screen bg-white">
                <Suspense fallback={
                    <div className="flex items-center justify-center min-h-[50vh]">
                        <div className="w-8 h-8 border-4 border-zinc-200 border-t-black rounded-full animate-spin" />
                    </div>
                }>
                    <ExplorePageContent initialData={initialData} />
                </Suspense>
            </main>
        </>
    );
}
