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
        return { title: 'Not Found - BookBy247' };
    }

    const seoRes = await businessDetailsApi.getSeo(slug).catch(() => null);
    const seoData = seoRes?.data;

    if (!seoData) {
        return { title: 'Business Not Found - BookBy247' };
    }

    const subpathLabel = capitalize(currentSubpath);
    const title = `${subpathLabel} - ${seoData.name} - BookBy247`;
    const description = `View ${currentSubpath.replace('-', ' ')} for ${seoData.name} in ${seoData.location_info?.city || ''}. Book appointments online and get the latest updates.`;

    return {
        title,
        description,
        alternates: {
            canonical: `/business/${slug}`,
        },
        robots: {
            index: false,
            follow: true,
            googleBot: {
                index: false,
                follow: true,
            },
        }
    };
}

const BusinessSubPage = async ({ params }: PageProps) => {
    const { slug, subpath } = await params;
    const currentSubpath = subpath[0];

    if (!VALID_SUBPATHS.includes(currentSubpath)) {
        notFound();
    }

    // Fetch initial data in parallel to eliminate server loading placeholders
    const [detailsRes, servicesRes, contactsRes, workingHoursRes, mediaRes] = await Promise.all([
        businessDetailsApi.getDetails(slug).catch(() => null),
        businessDetailsApi.getServices(slug, 1, 10).catch(() => null),
        businessDetailsApi.getContacts(slug).catch(() => null),
        businessDetailsApi.getWorkingHours(slug).catch(() => null),
        businessDetailsApi.getMedia(slug).catch(() => null),
    ]);

    if (!detailsRes?.data) {
        notFound();
    }

    const initialData = {
        details: detailsRes.data,
        services: servicesRes?.data,
        contacts: contactsRes?.data,
        workingHours: workingHoursRes?.data,
        media: mediaRes?.data,
    };

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
            initialData={initialData}
        />
    );
};

export default BusinessSubPage;
