import React from 'react';
import BusinessReviewsPageContent from './BusinessReviewsPageContent';

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
            title: 'Reviews Not Found | bookby247',
        };
    }

    const seo = business.seo || {};

    return {
        title: `Customer Reviews: ${seo.metaTitle || business.name} | bookby247`,
        description: `Read verified customer reviews for ${business.name} in ${business.city}. ${seo.metaDescription || ''}`,
        keywords: [...(seo.keywords || []), 'reviews', 'ratings', business.name],
    };
}

const BusinessReviewsPage = async ({ params }: PageProps) => {
    const { slug } = await params;
    const businessData = await businessApi.getBusinessBySlug(slug).catch(() => null);
    const businessId = businessData?.data?.id || businessData?.data?._id;

    let initialReviews = null;
    if (businessId) {
        initialReviews = await businessApi.getBusinessReviews(businessId, 1, 20).catch(() => null);
    }

    return <BusinessReviewsPageContent slug={slug} initialBusiness={businessData} initialReviews={initialReviews} />;
};

export default BusinessReviewsPage;
