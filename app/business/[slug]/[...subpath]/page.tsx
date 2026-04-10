import React from 'react';
import { notFound } from 'next/navigation';
import BusinessDetailsContent from '../BusinessDetailsContent';
import { businessDetailsApi } from '@/api/public/business.details.api';
import { Metadata } from 'next';

interface PageProps {
    params: Promise<{
        slug: string;
        subpath: string[];
    }>
}

const VALID_SUBPATHS = ['contacts', 'working-hours', 'social-media', 'media', 'categories', 'capacity', 'services', 'seo'];

const capitalize = (s: string) => s.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug, subpath } = await params;
    const currentSubpath = subpath[0];

    if (!VALID_SUBPATHS.includes(currentSubpath)) {
        return { title: 'Not Found | Bookby247' };
    }

    const seoRes = await businessDetailsApi.getSeo(slug).catch(() => null);
    const seoData = seoRes?.data;

    if (!seoData) {
        return { title: 'Business Not Found | Bookby247' };
    }

    const subpathLabel = capitalize(currentSubpath);
    const title = `${subpathLabel} - ${seoData.name} | Bookby247`;
    const description = `View ${currentSubpath.replace('-', ' ')} for ${seoData.name} in ${seoData.location_info?.city || ''}. Book appointments online and get the latest updates.`;

    return {
        title,
        description,
        alternates: {
            canonical: `/business/${slug}/${currentSubpath}`,
        },
        robots: {
            index: true,
            follow: true,
        }
    };
}

const BusinessSubPage = async ({ params }: PageProps) => {
    const { slug, subpath } = await params;
    const currentSubpath = subpath[0];

    if (!VALID_SUBPATHS.includes(currentSubpath)) {
        notFound();
    }

    // Fetch details to ensure business exists
    const detailsRes = await businessDetailsApi.getDetails(slug).catch(() => null);
    if (!detailsRes?.data) {
        notFound();
    }

    // Map subpath to initial tab in the UI
    const tabMap: Record<string, string> = {
        'media': 'Photos',
        'services': 'Services',
        'contacts': 'About',
        'working-hours': 'About',
        'social-media': 'About',
        'categories': 'About',
        'capacity': 'About'
    };

    return (
        <BusinessDetailsContent 
            slug={slug} 
            initialTab={tabMap[currentSubpath] || 'Photos'} 
        />
    );
};

export default BusinessSubPage;
