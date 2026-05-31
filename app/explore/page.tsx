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

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
    const params = await searchParams;
    const q = typeof params.q === 'string' ? params.q : '';
    const location = typeof params.location === 'string' ? params.location : '';
    const category = typeof params.category === 'string' ? params.category : '';
    const tag = typeof params.tag === 'string' ? params.tag : '';
    const count = typeof params.count === 'string' ? params.count : '';

    let title = 'Discover Top-Rated Spas, Salons & Beauty Centers Near You - Compare Reviews & Book Online | Bookby247';
    let description = 'Find, explore, compare, and book top-rated spas, salons, beauty centers, wellness clinics, and massage services near you. Discover verified reviews, ratings, services, pricing, and locations with advanced filters for a seamless online booking experience on Bookby247.';
    let keywords: string[] = [];
    let canonicalPath = '/explore';

    if (tag) {
        const tagName = slugToTitleCase(tag);
        const displayCount = count || "10";

        title = `Top ${displayCount} ${tagName} Services Near You | Compare & Book Online | Bookby247`;

        description = `Find, compare, and book top-rated ${tagName} services near you. Explore verified reviews, ratings, pricing, locations, and instant availability. Discover trusted professionals and book your appointment online with Bookby247.`;

        keywords = [
            tagName,
            `${tagName} near me`,
            `best ${tagName} near me`,
            `top rated ${tagName}`,
            `${tagName} services`,
            `${tagName} booking`,
            `book ${tagName} online`,
            `${tagName} professionals`,
            `affordable ${tagName}`,
            `${tagName} appointment`,
            `${tagName} services near me`,
            `${tagName} reviews`,
            `${tagName} pricing`,
            `${tagName} experts`,
            `${tagName} in my city`,
            `online ${tagName} booking`,
            `trusted ${tagName} providers`,
            `Bookby247 ${tagName}`
        ];

        canonicalPath = `/tags/${tag}`;
    } else if (q || location || category) {
        const parts = [];

        if (category) {
            parts.push(`Top-Rated ${category}`);
        } else if (q) {
            parts.push(`${q}`);
        } else {
            parts.push("Spas, Salons & Beauty Centers");
        }

        if (location) {
            parts.push(`in ${location}`);
        } else {
            parts.push("Near You");
        }

        title = `Find, Compare & Book ${parts.join(" ")} | Bookby247`;

        description = `Discover top-rated ${category || "spas, salons and beauty centers"} ${location ? `in ${location}` : "near you"
            }. Compare verified reviews, ratings, services, pricing, locations, and availability. ${q ? `Explore results for "${q}" and find trusted businesses.` : ""
            } Book instantly with Bookby247.`;

        keywords = [
            category || "spa",
            `${category || "spa"} near me`,
            `${category || "spa"} booking`,
            `best ${category || "spa"} ${location ? `in ${location}` : "near me"
            }`,
            `top rated ${category || "spa"}`,
            `online booking`,
            `beauty services`,
            `wellness services`,
            location,
            q,
        ].filter(Boolean);
    }

    return {
        title,
        description,
        keywords: [
            ...keywords,
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
            canonical: canonicalPath,
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
            images: ['https://res.cloudinary.com/dwsv275kv/image/upload/v1774691836/555666_m75jkf.png'],
            url: `https://bookby247.com${canonicalPath}`,
            type: "website",
            siteName: "Bookby247",
            locale: "en_IN",
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: ['https://res.cloudinary.com/dwsv275kv/image/upload/v1774691836/555666_m75jkf.png'],
            creator: "@bookby247",
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
            <main className="min-h-screen bg-white max-w-7xl mx-auto">
                <Suspense fallback={
                    <div className="flex items-center justify-center min-h-[50vh]">
                        <div className="w-8 h-8 border-4 border-zinc-200 border-t-black rounded-full animate-spin" />
                    </div>
                }>
                    <ExplorePageContent initialData={initialData} />
                </Suspense>

                <AiReadabilitySection
                    aboutTitle="Explore Wellness Anywhere"
                    aboutContent="Our explore page allows you to filter through thousands of verified spas, salons, and beauty parlours across India. Whether you are looking for specific services or local favorites, Bookby247 provides a seamless discovery experience."
                />
            </main>
        </>
    );
}
