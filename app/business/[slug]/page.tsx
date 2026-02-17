import React from 'react';
import { notFound } from 'next/navigation';
import BusinessDetailsContent from './BusinessDetailsContent';

interface PageProps {
    params: Promise<{
        slug: string;
    }>
}

import { businessApi } from '@/api/public/business';
import { Metadata } from 'next';

export const revalidate = 3600;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const response = await businessApi.getBusinessBySlug(slug).catch(() => null);
    const business = response?.data;

    if (!business) {
        return {
            title: 'Business Not Found | SpaAdvisor',
        };
    }

    const seo = business.seo || {};

    return {
        title: seo.metaTitle || `${business.name} - ${business.city} | SpaAdvisor`,
        description: seo.metaDescription || business.description?.substring(0, 160) || `Book appointments at ${business.name} in ${business.city}.`,
        keywords: seo.keywords || [],
        openGraph: {
            title: seo.metaTitle || business.name,
            description: seo.metaDescription || business.description,
            images: seo.ogImage ? [seo.ogImage] : (business.images?.banner ? [business.images.banner] : []),
        },
        twitter: {
            card: 'summary_large_image',
            title: seo.metaTitle || business.name,
            description: seo.metaDescription || business.description,
            images: seo.ogImage ? [seo.ogImage] : (business.images?.banner ? [business.images.banner] : []),
        }
    };
}

const BusinessDetailsPage = async ({ params }: PageProps) => {
    const { slug } = await params;
    const businessData = await businessApi.getBusinessBySlug(slug).catch(() => null);

    if (!businessData?.data) {
        notFound();
    }

    return <BusinessDetailsContent slug={slug} initialBusiness={businessData} />;
};

export default BusinessDetailsPage;
