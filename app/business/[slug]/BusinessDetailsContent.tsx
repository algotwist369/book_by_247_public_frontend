"use client";

import React from 'react';
import Link from 'next/link';
import { Star, MapPin, Phone, Globe, Clock, Share2, Mail, Facebook, Instagram, Twitter, Wifi, Car, Wind, Coffee, BadgeCheck, ShieldCheck, Navigation, CreditCard, CalendarCheck, Linkedin, Youtube, Send, PhoneCall } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { Button } from '@/components/ui/Button';
import DropdownSection from '@/components/ui/DropdownSection';
import PopularServices from '@/components/business/PopularServices';
import BusinessGallery from '@/components/business/BusinessGallery';
import Business360Tour from '@/components/business/Business360Tour';
import TabNavigation from '@/components/ui/TabNavigation';
import ShareModal from '@/components/business/ShareModal';
import BusinessCategories from '@/components/business/BusinessCategories';
import BusinessReviews from '@/components/business/BusinessReviews';
import BusinessVideos from '@/components/business/BusinessVideos';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import EnquiryModal from '@/components/business/EnquiryModal';

import {
    useBusinessDetails,
    useBusinessContacts,
    useBusinessWorkingHours,
    useBusinessSocialMedia,
    useBusinessMedia,
    useBusinessCategories,
    useBusinessCapacity,
    useBusinessServices,
    useBusinessReviews
} from '@/hooks/useBusinessDetails';

interface ClientProps {
    slug: string;
    initialTab?: string;
    initialData?: {
        details?: any;
        contacts?: any;
        workingHours?: any;
        socialMedia?: any;
        media?: any;
        categories?: any;
        capacity?: any;
        services?: any;
        reviews?: any;
    };
}

const BusinessDetailsContent = ({ slug, initialTab = 'Photos', initialData }: ClientProps) => {
    // New granular hooks for each data section
    const { data: details, isLoading: isDetailsLoading, error: detailsError } = useBusinessDetails(slug, initialData?.details);
    const { data: contacts, isLoading: isContactsLoading } = useBusinessContacts(slug, initialData?.contacts);
    const { data: workingHours, isLoading: isWorkingHoursLoading } = useBusinessWorkingHours(slug, initialData?.workingHours);
    const { data: socialMedia, isLoading: isSocialMediaLoading } = useBusinessSocialMedia(slug, initialData?.socialMedia);
    const { data: media, isLoading: isMediaLoading } = useBusinessMedia(slug, initialData?.media);
    const { data: categoriesData, isLoading: isCategoriesLoading } = useBusinessCategories(slug, initialData?.categories);
    const { data: capacity, isLoading: isCapacityLoading } = useBusinessCapacity(slug, initialData?.capacity);
    const { data: servicesData, isLoading: isServicesLoading } = useBusinessServices(slug, 1, 10, initialData?.services);
    const { data: reviewsData, isLoading: isReviewsLoading } = useBusinessReviews(slug, 1, 10, initialData?.reviews);

    const [galleryTab, setGalleryTab] = React.useState(initialTab);
    const [activeTab, setActiveTab] = React.useState('gallery');
    const [isTabsVisible, setIsTabsVisible] = React.useState(false);
    const [isShareModalOpen, setIsShareModalOpen] = React.useState(false);
    const [isEnquiryModalOpen, setIsEnquiryModalOpen] = React.useState(false);

    // Consolidate loading state (optional, can be more granular in UI)
    const isLoading = isDetailsLoading;
    const error = detailsError;

    // Get current URL safely
    const [currentUrl, setCurrentUrl] = React.useState('');

    React.useEffect(() => {
        if (typeof window !== 'undefined') {
            setCurrentUrl(window.location.href);

            const handleScroll = () => {
                // Visibility Logic
                const threshold = 300;
                setIsTabsVisible(window.scrollY > threshold);

                // Active Tab Logic
                const sections = ['gallery', 'about', 'services', 'reviews'];
                const scrollPosition = window.scrollY + 120; // Adjusted for flush alignment

                for (const section of sections) {
                    const element = document.getElementById(section);
                    if (element) {
                        const { offsetTop, offsetHeight } = element;
                        if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
                            setActiveTab(section);
                            break;
                        }
                    }
                }
            };

            window.addEventListener('scroll', handleScroll);
            return () => window.removeEventListener('scroll', handleScroll);
        }
    }, []);

    // Auto-trigger Enquiry Modal after 30 seconds
    React.useEffect(() => {
        const timer = setTimeout(() => {
            setIsEnquiryModalOpen(true);
        }, 30000); // 30 seconds

        return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
                <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin" />
                <p className="text-zinc-500 font-medium">Loading business details...</p>
            </div>
        );
    }

    if (error || !details) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-6 px-4">
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-black text-zinc-900">Business Not Found</h1>
                    <p className="text-zinc-500 max-w-md mx-auto">
                        We couldn't find the business you're looking for. It might have been moved or deleted.
                    </p>
                </div>
                <Link href="/">
                    <Button variant="primary" className="bg-black hover:bg-zinc-800">
                        Back to Home
                    </Button>
                </Link>
            </div>
        );
    }

    // Prepare gallery images
    const galleryImages = Array.isArray(media?.images) ? media.images : [];

    const businessName = details.name;
    const businessPhone = contacts?.phone;
    const alternatePhone = contacts?.alternate_phone;
    const businessAddress = contacts?.address || '';
    const businessRatings = reviewsData?.ratings || { average: details.avg_rating, total_reviews: details.total_reviews };

    return (
        <div className="min-h-screen bg-white pb-20 relative">
            {/* Content Section */}
            <div className="max-w-360 mx-auto px-4 md:px-8 py-6 md:py-16">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-16">
                    {/* Left Column - Sidebar (Sticky) */}
                    <div className="lg:col-span-1 order-last lg:order-first">
                        <div className="sticky top-28 space-y-6">
                            {/* Booking Card */}
                            <div className="p-6 md:p-8 rounded-3xl border border-zinc-100 bg-white space-y-6">
                                <div>
                                    <h2 className="text-2xl font-black text-zinc-900 tracking-tight">Book Appointment</h2>
                                    <p className="text-sm text-zinc-500 mt-1">Select your preferred slot</p>
                                </div>

                                <div className="space-y-4">
                                    <Link href={`/business/${slug}/book-appointment`} className="block w-full">
                                        <Button className="w-full h-12 text-lg font-bold rounded-xl" variant="primary">
                                            Proceed to Book
                                        </Button>
                                    </Link>

                                    <div className="grid grid-cols-3 gap-2">
                                        {[
                                            { Icon: Phone, label: 'Call', isWhatsApp: false },
                                            { Icon: FaWhatsapp, label: 'WA', isWhatsApp: true },
                                            { Icon: Mail, label: 'Enquiry', isWhatsApp: false }
                                        ].map((action, idx) => {
                                            const { Icon } = action;
                                            return (
                                                <Button
                                                    key={idx}
                                                    variant="outline"
                                                    onClick={() => {
                                                        if (action.label === 'Enquiry') {
                                                            setIsEnquiryModalOpen(true);
                                                        } else if (action.label === 'Call') {
                                                            if (businessPhone) window.location.href = `tel:${businessPhone}`;
                                                        } else if (action.isWhatsApp) {
                                                            if (businessPhone) {
                                                                const cleanPhone = businessPhone.replace(/[^0-9]/g, '');
                                                                const prefilledMessage = `Hi ${businessName}, I am reaching out from the Bookby247. I am interested in booking an appointment. Please share available slots & details.`;
                                                                const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(prefilledMessage)}`;
                                                                window.open(whatsappUrl, '_blank');
                                                            }
                                                        }
                                                    }}
                                                    className="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-center justify-center gap-1.5 sm:gap-2 px-2 h-12 sm:h-11 lg:h-12 xl:h-11 border-zinc-200 bg-white text-zinc-700 shadow-none transition-none hover:bg-white hover:border-zinc-200"
                                                    aria-label={`${action.label} business`}
                                                >
                                                    {Icon && <Icon className="w-6 h-6 sm:w-5 sm:h-5 text-zinc-800" />}
                                                    <span className="text-[11px] sm:text-xs font-medium text-zinc-700 leading-none">{action.label}</span>
                                                </Button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* Contact & Hours - Collapsible */}
                            <div className="bg-white rounded-3xl border border-zinc-100 overflow-hidden divide-y divide-zinc-100">
                                {/* Contact Info Accordion */}
                                <DropdownSection title="Contact Information" icon={<MapPin className="w-5 h-5 text-zinc-900" />}>
                                    <div className="space-y-4 pt-2">
                                        <button
                                            onClick={() => {
                                                const mapUrl = contacts?.google_maps_url || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${businessName} ${businessAddress}`)}`;
                                                window.open(mapUrl, '_blank');
                                            }}
                                            className="flex items-start gap-3 text-left hover:text-black transition-colors group"
                                        >
                                            <MapPin className="w-5 h-5 text-zinc-400 mt-0.5 shrink-0 group-hover:text-black transition-colors" />
                                            <p className="text-sm text-zinc-600 group-hover:text-black transition-colors">{businessAddress}</p>
                                        </button>
                                        <div className="flex items-center gap-3">
                                            <Phone className="w-5 h-5 text-zinc-400 shrink-0" />
                                            <div className="flex flex-col">
                                                {businessPhone && (
                                                    <a href={`tel:${businessPhone}`} className="text-sm text-zinc-600 hover:text-black transition-colors">{businessPhone}</a>
                                                )}
                                                {alternatePhone && (
                                                    <a href={`tel:${alternatePhone}`} className="text-xs text-zinc-400 hover:text-black transition-colors">{alternatePhone} (Alt)</a>
                                                )}
                                            </div>
                                        </div>
                                        {contacts?.email && (
                                            <div className="flex items-center gap-3">
                                                <Mail className="w-5 h-5 text-zinc-400 shrink-0" />
                                                <a href={`mailto:${contacts.email}`} className="text-sm text-zinc-600 hover:text-black transition-colors">{contacts.email}</a>
                                            </div>
                                        )}
                                        {contacts?.website && (
                                            <div className="flex items-center gap-3">
                                                <Globe className="w-5 h-5 text-zinc-400 shrink-0" />
                                                <a href={contacts.website} target="_blank" rel="noopener noreferrer" className="text-sm text-zinc-600 hover:text-black transition-colors">
                                                    {contacts.website.replace(/^https?:\/\//, '')}
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </DropdownSection>

                                {/* Working Hours Accordion */}
                                <DropdownSection title="Working Hours" icon={<Clock className="w-5 h-5 text-zinc-900" />}>
                                    <div className="space-y-4 pt-2">
                                        <div className="space-y-2">
                                            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => {
                                                const dayLower = day.toLowerCase();
                                                const isOpen = workingHours?.working_hours?.days?.includes(dayLower);
                                                const timeRange = (isOpen && workingHours?.working_hours)
                                                    ? `${workingHours.working_hours.open} - ${workingHours.working_hours.close}`
                                                    : 'Closed';

                                                return (
                                                    <div key={day} className="flex justify-between text-sm">
                                                        <span className="text-zinc-500">{day}</span>
                                                        <span className={`font-medium ${!isOpen ? 'text-red-500' : 'text-zinc-900'}`}>
                                                            {timeRange}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {(workingHours?.days_off?.length > 0 || workingHours?.holidays?.length > 0) && (
                                            <div className="pt-3 border-t border-zinc-100 space-y-2">
                                                {workingHours.days_off?.length > 0 && (
                                                    <div className="flex items-start gap-2">
                                                        <CalendarCheck className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                                                        <p className="text-[10px] text-zinc-500 leading-tight">
                                                            <span className="font-bold text-zinc-700 uppercase">Days Off:</span> {workingHours.days_off.join(', ')}
                                                        </p>
                                                    </div>
                                                )}
                                                {workingHours.holidays?.length > 0 && (
                                                    <div className="flex items-start gap-2">
                                                        <Clock className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                                                        <p className="text-[10px] text-zinc-500 leading-tight">
                                                            <span className="font-bold text-zinc-700 uppercase">Holidays:</span> {workingHours.holidays.join(', ')}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </DropdownSection>
                            </div>

                            {/* Follow Us */}
                            <div className="p-6 rounded-3xl border border-zinc-100 bg-white text-center space-y-4">
                                <h4 className="font-bold text-zinc-900 text-sm uppercase tracking-wide">Follow Us</h4>
                                <div className="flex flex-wrap justify-center gap-3">
                                    {[
                                        { Icon: Facebook, url: socialMedia?.facebook, name: "Facebook", color: "hover:bg-[#1877F2]" },
                                        { Icon: Instagram, url: socialMedia?.instagram, name: "Instagram", color: "hover:bg-[#E4405F]" },
                                        { Icon: Twitter, url: socialMedia?.twitter, name: "Twitter", color: "hover:bg-[#000000]" },
                                        { Icon: Linkedin, url: socialMedia?.linkedin, name: "Linkedin", color: "hover:bg-[#0077B5]" },
                                        { Icon: Youtube, url: socialMedia?.youtube, name: "Youtube", color: "hover:bg-[#FF0000]" },
                                        { Icon: PhoneCall, url: socialMedia?.whatsapp ? `https://wa.me/${socialMedia.whatsapp.replace(/[^0-9]/g, '')}` : null, name: "WhatsApp", color: "hover:bg-[#25D366]" },
                                        { Icon: Send, url: socialMedia?.telegram ? `https://t.me/${socialMedia.telegram.replace('@', '')}` : null, name: "Telegram", color: "hover:bg-[#24A1DE]" }
                                    ].map((social, i) => social.url ? (
                                        <a
                                            key={i}
                                            href={social.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            title={social.name}
                                            className={`w-10 h-10 rounded-full bg-zinc-50 flex items-center justify-center text-zinc-400 hover:text-white transition-all transform hover:scale-110 ${social.color} group relative`}
                                        >
                                            <social.Icon className="w-5 h-5" />
                                            <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-black text-white text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl z-10">
                                                {social.name}
                                            </span>
                                        </a>
                                    ) : null)}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Main Content */}
                    <div className="lg:col-span-2 flex flex-col gap-y-2 sm:gap-y-10">

                        {/* Top Bar - Breadcrumbs & Share */}
                        <div className="flex items-center justify-between gap-4">
                            <Breadcrumbs
                                items={[{ label: businessName }]}
                            />
                            <button
                                onClick={() => setIsShareModalOpen(true)}
                                className="text-zinc-400 hover:text-zinc-900 transition-colors p-2 hover:bg-zinc-100 rounded-full shrink-0"
                                aria-label="Share this business"
                            >
                                <Share2 className="w-5 h-5 sm:w-6 sm:h-6" />
                            </button>
                        </div>

                        {/* Identity Block - Business Name, Badges & Meta */}
                        <div className="space-y-4 mb-2 md:block hidden">
                            {/* Title & Badges */}
                            <div className="flex flex-wrap items-center gap-2 sm:flex-col sm:items-start sm:gap-3 ">
                                <div className="space-y-1">
                                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-zinc-900 tracking-tight leading-tight">
                                        {businessName}
                                    </h1>

                                </div>
                                <div className="flex flex-wrap items-center gap-2">
                                    {/* Verified Badge */}
                                    <div className="flex items-center gap-1 sm:bg-zinc-100 sm:px-2 sm:py-1 sm:rounded-md sm:border sm:border-zinc-200 shrink-0">
                                        <BadgeCheck className="w-5 h-5 sm:w-3.5 sm:h-3.5 text-black fill-black/10" />
                                        <span className="hidden sm:inline text-[10px] font-bold text-black uppercase tracking-wide">Verified</span>
                                    </div>
                                    {/* Trusted Badge */}
                                    <div className="flex items-center gap-1 sm:bg-zinc-100 sm:px-2 sm:py-1 sm:rounded-md sm:border sm:border-zinc-200 shrink-0">
                                        <ShieldCheck className="w-5 h-5 sm:w-3.5 sm:h-3.5 text-black fill-black/10" />
                                        <span className="hidden sm:inline text-[10px] font-bold text-black uppercase tracking-wide">Trusted</span>
                                    </div>
                                    {details.business_branch && (
                                        <p className="text-sm sm:text-base font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                                            <MapPin className="w-3.5 h-3.5" />
                                            {details.business_branch}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Meta Info Row */}
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-3 text-sm text-zinc-600">
                                <div className="flex items-center gap-1.5">
                                    <MapPin className="w-4 h-4 text-zinc-400" />
                                    <span>{businessAddress.split(',')[0]}</span>
                                </div>

                                <div className="hidden sm:block w-1 h-1 rounded-full bg-zinc-300" />

                                <div className="flex items-center gap-1.5">
                                    <Clock className="w-4 h-4 text-zinc-400" />
                                    <span className="text-zinc-500 font-medium">Open until {workingHours?.working_hours?.close || '09:00 PM'}</span>
                                </div>

                                <div className="hidden sm:block w-1 h-1 rounded-full bg-zinc-300" />

                                <div className="flex items-center gap-2 bg-zinc-50 px-2.5 py-1 rounded-lg border border-zinc-100">
                                    <div className="flex items-center gap-1">
                                        <span className="font-bold text-zinc-900">{businessRatings.average || 0}</span>
                                        <Star className="w-3.5 h-3.5 text-black fill-black" />
                                    </div>
                                    <span className="w-px h-3 bg-zinc-200" />
                                    <span className="text-black font-bold text-xs underline underline-offset-2">{businessRatings.total_reviews || 0} reviews</span>
                                </div>

                                <div className="ml-auto">
                                    <button
                                        onClick={() => {
                                            const mapUrl = contacts?.google_maps_url || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${businessName} ${businessAddress}`)}`;
                                            window.open(mapUrl, '_blank');
                                        }}
                                        className="flex items-center gap-1.5 text-zinc-900 font-bold hover:underline whitespace-nowrap bg-zinc-100 px-3 py-1 rounded-full border border-zinc-200"
                                        aria-label="Get directions to business"
                                    >
                                        <Navigation className="w-3.5 h-3.5 fill-current" />
                                        Direction
                                    </button>
                                </div>
                            </div>
                        </div>
                        {/* Sticky Navigation Tabs */}
                        <div className={`sticky top-[64px] md:top-[72px] z-40 bg-white/95 backdrop-blur-md -mx-4 px-4 sm:mx-0 sm:px-0 border-b border-zinc-100 transition-all duration-300 ease-in-out ${isTabsVisible ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-4 invisible pointer-events-none hidden'
                            }`}>
                            <div className="flex items-center gap-6 overflow-x-auto no-scrollbar whitespace-nowrap">
                                {([
                                    { label: 'Gallery', id: 'gallery' },
                                    { label: 'About', id: 'about' },
                                    { label: 'Services', id: 'services' },
                                    ...((reviewsData?.reviews?.length ?? 0) > 0 || (businessRatings.total_reviews ?? 0) > 0
                                        ? [{ label: 'Reviews', id: 'reviews' }]
                                        : []),

                                ] as { label: string; id: string }[]).map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => {
                                            const element = document.getElementById(tab.id);
                                            if (element) {
                                                const offset = 125; // Adjusted offset for flush navbar + tabs
                                                const elementPosition = element.getBoundingClientRect().top;
                                                const offsetPosition = elementPosition + window.pageYOffset - offset;
                                                window.scrollTo({
                                                    top: offsetPosition,
                                                    behavior: 'smooth'
                                                });
                                            }
                                        }}
                                        className={`pb-4 pt-4 text-sm sm:text-base font-bold transition-colors relative ${activeTab === tab.id ? 'text-zinc-900' : 'text-zinc-400 hover:text-zinc-600'
                                            }`}
                                    >
                                        {tab.label}
                                        {activeTab === tab.id && (
                                            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-black" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                        {/* Gallery Grid */}
                        {galleryImages.length > 0 && (() => {
                            const has360 = media?.images_360 && media.images_360.length > 0;
                            const hasVideos = media?.videos && media.videos.length > 0;
                            const galleryTabs = [
                                { label: 'Photos', count: galleryImages.length },
                                ...(has360 ? [{ label: '360 Tours' }] : []),
                                ...(hasVideos ? [{ label: 'Videos' }] : []),
                            ];
                            return (
                                <section id="gallery">
                                    <TabNavigation
                                        tabs={galleryTabs}
                                        activeTab={galleryTab}
                                        onTabChange={setGalleryTab}
                                    />

                                    {galleryTab === 'Photos' && <BusinessGallery images={galleryImages} businessName={businessName} />}
                                    {has360 && galleryTab === '360 Tours' && <Business360Tour images_360={media.images_360} />}
                                    {hasVideos && galleryTab === 'Videos' && <BusinessVideos videos={media.videos} />}
                                </section>
                            );
                        })()}
                        {/* Identity Block - Business Name, Badges & Meta */}
                        <div className="space-y-4 mt-2 md:hidden">
                            {/* Title & Badges */}
                            <div className="flex flex-wrap items-center gap-2 sm:flex-col sm:items-start sm:gap-3 ">
                                <div className="space-y-1">
                                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-zinc-900 tracking-tight leading-tight">
                                        {businessName}
                                    </h1>

                                </div>
                                <div className="flex flex-wrap items-center gap-2">
                                    {/* Verified Badge */}
                                    <div className="flex items-center gap-1 sm:bg-zinc-100 sm:px-2 sm:py-1 sm:rounded-md sm:border sm:border-zinc-200 shrink-0">
                                        <BadgeCheck className="w-5 h-5 sm:w-3.5 sm:h-3.5 text-black fill-black/10" />
                                        <span className="hidden sm:inline text-[10px] font-bold text-black uppercase tracking-wide">Verified</span>
                                    </div>
                                    {/* Trusted Badge */}
                                    <div className="flex items-center gap-1 sm:bg-zinc-100 sm:px-2 sm:py-1 sm:rounded-md sm:border sm:border-zinc-200 shrink-0">
                                        <ShieldCheck className="w-5 h-5 sm:w-3.5 sm:h-3.5 text-black fill-black/10" />
                                        <span className="hidden sm:inline text-[10px] font-bold text-black uppercase tracking-wide">Trusted</span>
                                    </div>
                                    {details.business_branch && (
                                        <p className="text-sm sm:text-base font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                                            <MapPin className="w-3.5 h-3.5" />
                                            {details.business_branch}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Meta Info Row */}
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-3 text-sm text-zinc-600">
                                <div className="flex items-center gap-1.5">
                                    <MapPin className="w-4 h-4 text-zinc-400" />
                                    <span>{businessAddress.split(',')[0]}</span>
                                </div>

                                <div className="hidden sm:block w-1 h-1 rounded-full bg-zinc-300" />

                                <div className="flex items-center gap-1.5">
                                    <Clock className="w-4 h-4 text-zinc-400" />
                                    <span className="text-zinc-500 font-medium">Open until {workingHours?.working_hours?.close || '09:00 PM'}</span>
                                </div>

                                <div className="hidden sm:block w-1 h-1 rounded-full bg-zinc-300" />

                                <div className="flex items-center gap-2 bg-zinc-50 px-2.5 py-1 rounded-lg border border-zinc-100">
                                    <div className="flex items-center gap-1">
                                        <span className="font-bold text-zinc-900">{businessRatings.average || 0}</span>
                                        <Star className="w-3.5 h-3.5 text-black fill-black" />
                                    </div>
                                    <span className="w-px h-3 bg-zinc-200" />
                                    <span className="text-black font-bold text-xs underline underline-offset-2">{businessRatings.total_reviews || 0} reviews</span>
                                </div>

                                <div className="ml-auto">
                                    <button
                                        onClick={() => {
                                            const mapUrl = contacts?.google_maps_url || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${businessName} ${businessAddress}`)}`;
                                            window.open(mapUrl, '_blank');
                                        }}
                                        className="flex items-center gap-1.5 text-zinc-900 font-bold hover:underline whitespace-nowrap bg-zinc-100 px-3 py-1 rounded-full border border-zinc-200"
                                        aria-label="Get directions to business"
                                    >
                                        <Navigation className="w-3.5 h-3.5 fill-current" />
                                        Direction
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* About Section */}
                        <section id="about" className="mt-4 md:mt-2">
                            <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 mb-4">About</h2>
                            <p className="text-zinc-600 leading-relaxed text-sm sm:text-base md:text-lg">
                                {details.description}
                            </p>
                        </section>

                        {/* Services Section */}
                        <div id="services" >
                            <PopularServices services={servicesData?.services || []} businessName={businessName} slug={slug} />
                        </div>

                        {/* Features & Amenities */}
                        {(capacity?.features?.length > 0 || capacity?.amenities?.length > 0) && (
                            <div className="mt-8 space-y-6">
                                {capacity.features?.length > 0 && (
                                    <div className="space-y-3">
                                        <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Key Features</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {capacity.features.map((feature: string, i: number) => (
                                                <span key={i} className="px-3 py-1 bg-zinc-100 text-zinc-900 font-bold rounded-lg text-xs border border-zinc-200">
                                                    {feature}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {capacity.amenities?.length > 0 && (
                                    <div className="space-y-3">
                                        <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Amenities</h3>
                                        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                                            {capacity.amenities.map((amenity: string, i: number) => {
                                                const getIcon = (name: string) => {
                                                    const lowerName = name.toLowerCase();
                                                    if (lowerName.includes('wifi') || lowerName.includes('wi-fi')) return Wifi;
                                                    if (lowerName.includes('parking')) return Car;
                                                    if (lowerName.includes('ac') || lowerName.includes('air conditioning')) return Wind;
                                                    if (lowerName.includes('beverage') || lowerName.includes('coffee')) return Coffee;
                                                    if (lowerName.includes('card') || lowerName.includes('payment')) return CreditCard;
                                                    if (lowerName.includes('booking') || lowerName.includes('online')) return CalendarCheck;
                                                    return ShieldCheck; // Fallback icon
                                                };
                                                const Icon = getIcon(amenity);
                                                return (
                                                    <div key={i} className="flex items-center gap-3 text-zinc-600 bg-zinc-50 p-3 rounded-xl border border-zinc-100 hover:bg-white hover:shadow-sm transition-all">
                                                        <Icon className="w-4 h-4 text-zinc-900" />
                                                        <span className="text-xs sm:text-sm font-medium">{amenity}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Categories & Tags Section */}
                        <div>
                            <BusinessCategories
                                categories={categoriesData?.categories ? [categoriesData.categories] : []}
                                subCategories={categoriesData?.sub_categories ? [categoriesData.sub_categories] : []}
                                tags={categoriesData?.tags || []}
                                specialties={categoriesData?.specialties || []}
                                languages={categoriesData?.languages || []}
                            />
                        </div>

                        {/* Reviews Section */}
                        {((reviewsData?.reviews?.length ?? 0) > 0 || (businessRatings.total_reviews ?? 0) > 0) && (
                            <div id="reviews">
                                <BusinessReviews
                                    reviews={reviewsData?.reviews?.map((r: any) => ({
                                        id: r.createdAt, // Using createdAt as id if _id is missing
                                        author: r.customerName,
                                        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(r.customerName)}&background=random`,
                                        rating: r.rating,
                                        content: r.comment,
                                        date: new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
                                        helpfulPercentage: 0
                                    })) || []}
                                    rating={businessRatings.average || 0}
                                    reviewCount={businessRatings.total_reviews || 0}
                                    slug={slug}
                                    businessName={businessName || 'businessname'}
                                />
                            </div>
                        )}
                    </div>

                </div>
            </div>
            {/* Sticky Mobile Actions Footer */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-zinc-100 z-50">
                <div className="flex items-center gap-3">
                    {businessPhone && (
                        <>
                            <a
                                href={`tel:${businessPhone}`}
                                className="flex items-center justify-center w-12 h-12 rounded-xl bg-zinc-100 text-zinc-900 border border-zinc-200 transition-all active:scale-95 shrink-0"
                                aria-label="Call business"
                            >
                                <Phone className="w-5 h-5" />
                            </a>
                            <a
                                href={`https://wa.me/${businessPhone.replace(/[^0-9]/g, '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center w-12 h-12 rounded-xl bg-zinc-100 text-black border border-zinc-200 transition-all active:scale-95 shrink-0"
                                aria-label="Contact on WhatsApp"
                            >
                                <svg viewBox="0 0 24 24" className="w-6 h-6 fill-black" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                            </a>
                        </>
                    )}
                    <Link href={`/business/${slug}/book-appointment`} className="flex-1">
                        <Button
                            className="w-full h-12 text-sm sm:text-base font-bold rounded-xl"
                            variant="primary"
                        >
                            Book Now
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Share Modal */}
            <ShareModal
                isOpen={isShareModalOpen}
                onClose={() => setIsShareModalOpen(false)}
                url={currentUrl}
            />

            {/* Enquiry Modal */}
            <EnquiryModal
                isOpen={isEnquiryModalOpen}
                onClose={() => setIsEnquiryModalOpen(false)}
                businessName={businessName}
            />
        </div >
    );
};

export default BusinessDetailsContent;
