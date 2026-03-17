import { Suspense } from 'react';
import { Metadata } from 'next';
import ExplorePageContent from './ExplorePageContent';
import { businessApi } from '@/api/public/business';
import { safeJsonLdStringify } from '@/lib/utils';

export const revalidate = 3600;

export const metadata: Metadata = {
    title: 'Explore Top Spas & Salons',
    description: 'Compare and book top-rated spas, salons, and wellness centers near you with powerful filters for rating, category, and location.',
    keywords: [
        "explore spas",
        "explore salons",
        "wellness centers",
        "spa booking",
        "salon booking",
        "nearby spas",
    ],
    authors: [{ name: "bookby247 Team" }],
    alternates: {
        canonical: "/explore",
    },
    openGraph: {
        title: 'Explore Top Spas & Salons | bookby247',
        description: 'Discover and book the best spas, salons, and wellness centers near you.',
        images: ['https://thaiodyssey.co.in/assets/img/blog/475003.jpg'],
        url: "https://bookby247.com/explore",
        type: "website",
        siteName: "bookby247",
    },
    twitter: {
        card: "summary_large_image",
        title: "Explore Top Spas & Salons | bookby247",
        description: "Discover and book the best spas, salons, and wellness centers near you.",
    },
};

export default async function ExplorePage() {
    const response = await businessApi.getPublicBusinesses({ limit: 100 }).catch(() => null);
    const rawBusinesses = (response as any)?.data || (response as any)?.businesses || [];

    const businesses = rawBusinesses.map((b: any) => {
        const combinedImages = Array.from(new Set([
            ...(Array.isArray(b.images) ? b.images : []),
            ...(Array.isArray(b.gallery) ? b.gallery : []),
            ...(Array.isArray(b.images?.gallery) ? b.images.gallery : []),
            b.image,
            b.images?.banner,
            b.images?.logo,
            b.images?.thumbnail
        ])).filter(Boolean) as string[];

        return {
            ...b,
            id: b.id || b._id,
            rating: b.rating ?? b.ratings?.average ?? 0,
            reviews: b.reviews ?? b.ratings?.totalReviews ?? 0,
            images: combinedImages,
            image: b.image || combinedImages[0] || "",
            price: b.price ?? 0,
            amenities: Array.isArray(b.amenities) ? b.amenities : [],
            gender: b.gender ?? 'Any',
            categories: b.category ? [b.category] : (Array.isArray(b.categories) ? b.categories : []),
            description: b.description || b.seo?.metaDescription || "Experience premium wellness treatments and relaxation therapies.",
            coordinates: b.coordinates || { lat: 13.0418, lng: 80.2341 }
        };
    });

    // Senior SEO: Injecting JSON-LD for LocalBusiness list
    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "ItemList",
                "name": "Explore spas and salons",
                "url": "https://bookby247.com/explore",
                "itemListElement": businesses.map((b: any, i: number) => ({
                    "@type": "ListItem",
                    "position": i + 1,
                    "item": {
                        "@type": "LocalBusiness",
                        "name": b.name,
                        "image":
                            Array.isArray(b.images) && b.images.length > 0
                                ? b.images[0]
                                : b.images?.banner || b.images?.logo || b.images?.thumbnail,
                        "url": `https://bookby247.com/business/${b.slug}`,
                        "aggregateRating": {
                            "@type": "AggregateRating",
                            "ratingValue": b.rating ?? b.ratings?.average ?? 0,
                            "reviewCount": b.reviews ?? b.ratings?.totalReviews ?? 0,
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
                    <ExplorePageContent />
                </Suspense>
            </main>
        </>
    );
}
