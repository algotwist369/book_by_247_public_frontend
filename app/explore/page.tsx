import { Suspense } from 'react';
import { Metadata } from 'next';
import ExplorePageContent from './ExplorePageContent';
import { businessApi } from '@/api/public/business';

export const revalidate = 3600;

export const metadata: Metadata = {
    title: 'Explore Top Spas & Salons | logoname',
    description: 'Discover and book the best spas, salons, and wellness centers near you. Filter by rating, category, and location for a premium experience.',
    openGraph: {
        title: 'Explore Top Spas & Salons | logoname',
        description: 'Discover and book the best spas, salons, and wellness centers near you.',
        images: ['https://thaiodyssey.co.in/assets/img/blog/475003.jpg'],
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
        "@type": "ItemList",
        "itemListElement": businesses.map((b: any, i: number) => ({
            "@type": "ListItem",
            "position": i + 1,
            "item": {
                "@type": "LocalBusiness",
                "name": b.name,
                "image": Array.isArray(b.images) ? b.images[0] : (b.images?.banner || b.images?.logo),
                "url": `https://logoname.com/business/${b.slug}`,
                "aggregateRating": {
                    "@type": "AggregateRating",
                    "ratingValue": b.rating ?? b.ratings?.average ?? 0,
                    "reviewCount": b.reviews ?? b.ratings?.totalReviews ?? 0
                },
                "address": {
                    "@type": "PostalAddress",
                    "streetAddress": b.address,
                    "addressLocality": b.branch || b.city
                }
            }
        }))
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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
