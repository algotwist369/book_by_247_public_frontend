import { Metadata } from 'next';
import ExplorePageContent from './ExplorePageContent';
import { businessApi } from '@/api/public/business';

export const revalidate = 3600;

export const metadata: Metadata = {
    title: 'Explore Top Spas & Salons | SpaAdvisor',
    description: 'Discover and book the best spas, salons, and wellness centers near you. Filter by rating, category, and location for a premium experience.',
    openGraph: {
        title: 'Explore Top Spas & Salons | SpaAdvisor',
        description: 'Discover and book the best spas, salons, and wellness centers near you.',
        images: ['https://thaiodyssey.co.in/assets/img/blog/475003.jpg'],
    },
};

export default async function ExplorePage() {
    const response = await businessApi.getPublicBusinesses({ limit: 100 }).catch(() => null);
    const rawBusinesses = (response as any)?.data || (response as any)?.businesses || [];

    const businesses = rawBusinesses.map((b: any) => ({
        ...b,
        id: b.id || b._id,
        rating: b.rating ?? b.ratings?.average ?? 0,
        reviews: b.reviews ?? b.ratings?.totalReviews ?? 0,
        images: Array.isArray(b.images)
            ? b.images
            : Array.from(new Set([
                b.images?.banner,
                b.images?.logo,
                ...(b.images?.gallery || []),
                b.images?.thumbnail
            ])).filter(Boolean) as string[],
        price: b.price ?? 0,
        amenities: Array.isArray(b.amenities) ? b.amenities : [],
        gender: b.gender ?? 'Any',
        categories: b.category ? [b.category] : (Array.isArray(b.categories) ? b.categories : []),
        description: b.description || b.seo?.metaDescription || "Experience premium wellness treatments and relaxation therapies.",
        coordinates: b.coordinates || { lat: 13.0418, lng: 80.2341 }
    }));

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
                "url": `https://spaadvisor.com/business/${b.slug}`,
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
                <ExplorePageContent />
            </main>
        </>
    );
}
