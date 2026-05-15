import { Suspense } from 'react';
import { Metadata } from 'next';
import { businessApi } from '@/api/public/business';
import { safeJsonLdStringify, slugToTitleCase } from '@/lib/utils';
import { generateBreadcrumbJsonLd, generateItemListJsonLd, generateOrganizationJsonLd, generateWebSiteJsonLd } from '@/lib/seo-jsonld';
import AiReadabilitySection from '@/components/seo/AiReadabilitySection';
import ExplorePageContent from '@/app/explore/ExplorePageContent';

export const revalidate = 3600;

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const tag = slug;
    const tagName = slugToTitleCase(tag);

    let displayCount = '10';
    try {
        const tagsResponse = await businessApi.getSeoTags();
        const tagData = tagsResponse?.data?.find((t: any) => t.slug === slug);
        displayCount = tagData?.count?.toString() || '10';
    } catch (error) {
        // Fallback to default count
    }

    const title = `Top ${displayCount} Best ${tagName} Services Near Me | Book Online 24/7`;
    const description = `Find and book the best ${tagName} professionals in your area. Compare verified reviews, transparent pricing, and instant availability. Skip the wait-book your ${tagName} appointment online via Bookby247 today.`;
    const keywords = [
        `${tag}`,
        `${tag} services near me`,
        `book ${tag} online`,
        `best ${tag} in my city`,
        `affordable ${tag} professionals`,
        `24/7 ${tag} booking`
    ];

    return {
        title,
        description,
        keywords,
        authors: [{ name: "Bookby247 Team" }],
        alternates: {
            canonical: `/tags/${slug}`,
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
            url: `https://bookby247.com/tags/${slug}`,
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

export default async function TagPage({ params }: PageProps) {
    const { slug } = await params;
    const tagName = slugToTitleCase(slug);

    let response;
    try {
        response = await businessApi.getBusinessesByTag(slug);
    } catch (error) {
        // Fallback to search if new API fails
        response = await businessApi.searchBusinesses({ 
            tag: slug,
            limit: 100 
        }).catch(() => null);
    }
    
    const data = (response as any)?.data || (response as any)?.payload?.decryptedData || response || {};
    const rawBusinesses = (response as any)?.data || data.results || data.businesses || [];

    const businesses = rawBusinesses.map((b: any) => {
        const rawImages = Array.isArray(b.images) ? b.images : [];
        const galleryImages = Array.isArray(b.gallery) ? b.gallery : [];
        const nestedGallery = Array.isArray(b.images?.gallery) ? b.images.gallery : [];

        const combinedImages = Array.from(new Set([
            b.thumbnailImage,
            b.logoImage,
            b.business_thumbnail_url,
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
            id: b.id || b._id || b.business_id,
            slug: b.slug || b.bussiness_slug,
            name: b.name || b.business_title,
            rating: b.averageRating ?? b.rating ?? b.ratings?.average ?? b.business_avg_tating ?? 0,
            reviews: b.totalReviews ?? b.reviews ?? b.ratings?.totalReviews ?? b.business_reviws_len ?? 0,
            images: combinedImages,
            image: b.thumbnailImage || b.image || b.business_thumbnail_url || combinedImages[0] || "",
            price: b.price ?? 0,
            amenities: Array.isArray(b.amenities) ? b.amenities : [],
            gender: b.gender ?? 'Any',
            categories: b.category ? [b.category] : (Array.isArray(b.categories) ? b.categories : b.business_type ? [b.business_type] : []),
            description: b.description || b.seo?.metaDescription || b.business_dec || "Experience premium wellness treatments and relaxation therapies.",
            coordinates: b.coordinates || b.location?.coordinates || { lat: 13.0418, lng: 80.2341 },
            address: b.address || b.business_location,
            phone: b.phone || b.business_contacts,
            type: b.type || b.business_type,
            priceCategory: b.priceCategory || b.business_price_category,
        };
    });

    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            generateItemListJsonLd(businesses, "India", tagName),
            generateBreadcrumbJsonLd([
                { name: "Home", item: "https://bookby247.com/" },
                { name: "Tags", item: "https://bookby247.com/tags" },
                { name: tagName, item: `https://bookby247.com/tags/${slug}` },
            ]),
            generateOrganizationJsonLd(),
            generateWebSiteJsonLd()
        ]
    };

    const initialData = {
        results: businesses,
        totalResults: (response as any)?.total ?? data?.totalResults ?? businesses.length,
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
                    <ExplorePageContent initialData={initialData} tagName={tagName} />
                </Suspense>

                <AiReadabilitySection 
                    aboutTitle={`${tagName} Services`}
                    aboutContent={`Explore top-rated ${tagName} services near you. Our platform connects you with verified professionals offering premium ${tagName} experiences. Read reviews, compare prices, and book your next appointment instantly on Bookby247.`}
                />
            </main>
        </>
    );
}
