"use client";

import React from 'react';
import Link from 'next/link';
import { Star, MapPin, Phone, Globe, Clock, Share2, Mail, Facebook, Instagram, Twitter, Wifi, Car, Wind, Coffee, BadgeCheck, ShieldCheck, Navigation } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { Button } from '@/components/ui/Button';
import { CustomImage } from '@/components/ui/CustomImage';
import { Business } from '@/components/business/businessData';
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

import { useBusinessBySlug } from '@/hooks/useBusinesses';

interface ClientProps {
    slug: string;
    initialTab?: string;
    initialBusiness?: any;
}

const BusinessDetailsContent = ({ slug, initialTab = 'Photos', initialBusiness }: ClientProps) => {
    const { data: business, isLoading, error } = useBusinessBySlug(slug, initialBusiness);
    const [galleryTab, setGalleryTab] = React.useState(initialTab);
    const [activeTab, setActiveTab] = React.useState('gallery');
    const [isTabsVisible, setIsTabsVisible] = React.useState(false);
    const [isShareModalOpen, setIsShareModalOpen] = React.useState(false);
    const [isEnquiryModalOpen, setIsEnquiryModalOpen] = React.useState(false);

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
                const sections = ['gallery', 'services', 'reviews', 'about'];
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

    // Auto-trigger Enquiry Modal after 12 seconds
    React.useEffect(() => {
        const timer = setTimeout(() => {
            setIsEnquiryModalOpen(true);
        }, 30000); // 30 seconds

        return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
                <div className="w-12 h-12 border-4 border-[#008080] border-t-transparent rounded-full animate-spin" />
                <p className="text-zinc-500 font-medium">Loading business details...</p>
            </div>
        );
    }

    if (error || !business) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-6 px-4">
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-black text-zinc-900">Business Not Found</h1>
                    <p className="text-zinc-500 max-w-md mx-auto">
                        We couldn't find the business you're looking for. It might have been moved or deleted.
                    </p>
                </div>
                <Link href="/">
                    <Button variant="primary" className="bg-[#008080] hover:bg-[#006666]">
                        Back to Home
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white pb-20 relative">
            {/* Content Section */}
            <div className="max-w-[90rem] mx-auto px-4 md:px-8 py-6 md:py-16">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-16">
                    {/* Left Column - Sidebar (Sticky) */}
                    <div className="lg:col-span-1 order-last lg:order-first">
                        <div className="sticky top-28 space-y-6">
                            {/* Booking Card */}
                            <div className="p-6 md:p-8 rounded-3xl border border-zinc-100 bg-white space-y-6">
                                <div>
                                    <h3 className="text-2xl font-black text-zinc-900 tracking-tight">Book Appointment</h3>
                                    <p className="text-sm text-zinc-500 mt-1">Select your preferred slot</p>
                                </div>

                                <div className="space-y-4">
                                    <Link href={`/business/${slug}/book-appointment`} className="block w-full">
                                        <Button className="w-full h-14 text-lg font-bold bg-[#008080] hover:bg-[#006666] rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]" variant="primary">
                                            Proceed to Book
                                        </Button>
                                    </Link>

                                    <div className="grid grid-cols-3 gap-2">
                                        {[
                                            { icon: Phone, label: 'Call', color: 'text-[#008080]', border: 'hover:border-[#008080]' },
                                            { icon: FaWhatsapp, label: 'WhatsApp', color: 'text-green-600', border: 'hover:border-green-600' },
                                            { icon: Mail, label: 'Enquiry', color: 'text-blue-600', border: 'hover:border-blue-600' }
                                        ].map((action, idx) => (
                                            <Button
                                                key={idx}
                                                variant="outline"
                                                onClick={() => {
                                                    if (action.label === 'Enquiry') {
                                                        setIsEnquiryModalOpen(true);
                                                    } else if (action.label === 'Call') {
                                                        window.location.href = `tel:${business.phone}`;
                                                    } else if (action.label === 'WhatsApp') {
                                                        window.open(`https://wa.me/${business.phone.replace(/[^0-9]/g, '')}`, '_blank');
                                                    }
                                                }}
                                                className={`flex flex-col md:flex-row lg:flex-col xl:flex-row items-center justify-center p-2 h-auto gap-1 border-zinc-200 hover:bg-zinc-50 ${action.border} group`}
                                            >
                                                <action.icon className={`w-5 h-5 ${action.color}`} />
                                                <span className="text-xs font-medium text-zinc-600">{action.label}</span>
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Contact & Hours - Collapsible */}
                            <div className="bg-white rounded-3xl border border-zinc-100 overflow-hidden divide-y divide-zinc-100">
                                {/* Contact Info Accordion */}
                                <DropdownSection title="Contact Information" icon={<MapPin className="w-5 h-5 text-[#008080]" />}>
                                    <div className="space-y-4 pt-2">
                                        <button
                                            onClick={() => {
                                                const mapUrl = business.googleMapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${business.name} ${business.address}`)}`;
                                                window.open(mapUrl, '_blank');
                                            }}
                                            className="flex items-start gap-3 text-left hover:text-[#008080] transition-colors group"
                                        >
                                            <MapPin className="w-5 h-5 text-zinc-400 mt-0.5 shrink-0 group-hover:text-[#008080] transition-colors" />
                                            <p className="text-sm text-zinc-600 group-hover:text-[#008080] transition-colors">{business.address}</p>
                                        </button>
                                        <div className="flex items-center gap-3">
                                            <Phone className="w-5 h-5 text-zinc-400 shrink-0" />
                                            <a href={`tel:${business.phone}`} className="text-sm text-zinc-600 hover:text-[#008080] transition-colors">{business.phone}</a>
                                        </div>
                                        {business.email && (
                                            <div className="flex items-center gap-3">
                                                <Mail className="w-5 h-5 text-zinc-400 shrink-0" />
                                                <a href={`mailto:${business.email}`} className="text-sm text-zinc-600 hover:text-[#008080] transition-colors">{business.email}</a>
                                            </div>
                                        )}
                                        {business.website && (
                                            <div className="flex items-center gap-3">
                                                <Globe className="w-5 h-5 text-zinc-400 shrink-0" />
                                                <a href={business.website} target="_blank" rel="noopener noreferrer" className="text-sm text-zinc-600 hover:text-[#008080] transition-colors">
                                                    {business.website.replace(/^https?:\/\//, '')}
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </DropdownSection>

                                {/* Working Hours Accordion */}
                                <DropdownSection title="Working Hours" icon={<Clock className="w-5 h-5 text-[#008080]" />}>
                                    <div className="space-y-2 pt-2">
                                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => {
                                            const dayLower = day.toLowerCase();
                                            const isOpen = business.workingHours?.days?.includes(dayLower);
                                            const timeRange = isOpen
                                                ? `${business.workingHours.open} - ${business.workingHours.close}`
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
                                </DropdownSection>
                            </div>

                            {/* Follow Us */}
                            <div className="p-6 rounded-3xl border border-zinc-100 bg-white text-center space-y-4">
                                <h4 className="font-bold text-zinc-900 text-sm uppercase tracking-wide">Follow Us</h4>
                                <div className="flex justify-center gap-4">
                                    {[Facebook, Instagram, Twitter].map((Icon, i) => (
                                        <a key={i} href="#" className="w-10 h-10 rounded-full bg-zinc-50 flex items-center justify-center text-zinc-400 hover:bg-[#008080] hover:text-white transition-all transform hover:scale-110">
                                            <Icon className="w-5 h-5" />
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Main Content */}
                    <div className="lg:col-span-2 flex flex-col gap-y-2 sm:gap-y-10">

                        {/* Top Bar - Breadcrumbs & Share */}
                        <div className="flex items-center justify-between gap-4 order-1">
                            <Breadcrumbs
                                items={[{ label: business.name }]}
                            />
                            <button
                                onClick={() => setIsShareModalOpen(true)}
                                className="text-zinc-400 hover:text-zinc-900 transition-colors p-2 hover:bg-zinc-100 rounded-full shrink-0"
                            >
                                <Share2 className="w-5 h-5 sm:w-6 sm:h-6" />
                            </button>
                        </div>

                        {/* Identity Block - Business Name, Badges & Meta */}
                        <div className="space-y-4 order-3 lg:order-2">
                            {/* Title & Badges */}
                            <div className="flex flex-wrap items-center gap-2 sm:gap-0 sm:flex-col sm:items-start sm:gap-3">
                                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-zinc-900 tracking-tight leading-tight">
                                    {business.name}
                                </h1>
                                <div className="flex flex-wrap items-center gap-2">
                                    {/* Verified Badge */}
                                    <div className="flex items-center gap-1 sm:bg-blue-50 sm:px-2 sm:py-1 sm:rounded-md sm:border sm:border-blue-100 shrink-0">
                                        <BadgeCheck className="w-5 h-5 sm:w-3.5 sm:h-3.5 text-blue-600 fill-blue-600/10" />
                                        <span className="hidden sm:inline text-[10px] font-bold text-blue-700 uppercase tracking-wide">Verified</span>
                                    </div>
                                    {/* Trusted Badge */}
                                    <div className="flex items-center gap-1 sm:bg-amber-50 sm:px-2 sm:py-1 sm:rounded-md sm:border sm:border-amber-100 shrink-0">
                                        <ShieldCheck className="w-5 h-5 sm:w-3.5 sm:h-3.5 text-amber-600 fill-amber-600/10" />
                                        <span className="hidden sm:inline text-[10px] font-bold text-amber-700 uppercase tracking-wide">Trusted</span>
                                    </div>
                                </div>
                            </div>

                            {/* Meta Info Row */}
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-3 text-sm text-zinc-600">
                                <div className="flex items-center gap-1.5">
                                    <MapPin className="w-4 h-4 text-zinc-400" />
                                    <span>{business.address.split(',')[0]}</span>
                                </div>

                                <div className="hidden sm:block w-1 h-1 rounded-full bg-zinc-300" />

                                <div className="flex items-center gap-1.5">
                                    <Clock className="w-4 h-4 text-zinc-400" />
                                    <span className="text-zinc-500 font-medium">Open until 09:00 PM</span>
                                </div>

                                <div className="hidden sm:block w-1 h-1 rounded-full bg-zinc-300" />

                                <div className="flex items-center gap-2 bg-zinc-50 px-2.5 py-1 rounded-lg border border-zinc-100">
                                    <div className="flex items-center gap-1">
                                        <span className="font-bold text-zinc-900">{business.ratings?.average || 0}</span>
                                        <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                                    </div>
                                    <span className="w-px h-3 bg-zinc-200" />
                                    <span className="text-blue-600 font-bold text-xs">{business.ratings?.totalReviews || 0} reviews</span>
                                </div>

                                <div className="ml-auto">
                                    <button
                                        onClick={() => {
                                            const mapUrl = business.googleMapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${business.name} ${business.address}`)}`;
                                            window.open(mapUrl, '_blank');
                                        }}
                                        className="flex items-center gap-1.5 text-[#008080] font-bold hover:underline whitespace-nowrap bg-[#008080]/5 px-3 py-1 rounded-full"
                                    >
                                        <Navigation className="w-3.5 h-3.5 fill-current" />
                                        Direction
                                    </button>
                                </div>
                            </div>
                        </div>
                        {/* Sticky Navigation Tabs */}
                        <div className={`sticky top-[64px] md:top-[72px] z-40 bg-white/95 backdrop-blur-md -mx-4 px-4 sm:mx-0 sm:px-0 border-b border-zinc-100 mb-6 order-4 transition-all duration-300 ease-in-out ${isTabsVisible ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-4 invisible pointer-events-none'
                            }`}>
                            <div className="flex items-center gap-6 overflow-x-auto no-scrollbar whitespace-nowrap">
                                {[
                                    { label: 'Gallery', id: 'gallery' },
                                    { label: 'Services', id: 'services' },
                                    { label: 'Reviews', id: 'reviews' },
                                    { label: 'About', id: 'about' }
                                ].map((tab) => (
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
                                        className={`pb-4 pt-4 text-sm sm:text-base font-bold transition-colors relative ${activeTab === tab.id ? 'text-[#008080]' : 'text-zinc-400 hover:text-zinc-600'
                                            }`}
                                    >
                                        {tab.label}
                                        {activeTab === tab.id && (
                                            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#008080]" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Gallery Grid */}
                        {business.images.length > 0 && (
                            <section id="gallery" className="order-2 lg:order-3">
                                <TabNavigation
                                    tabs={[
                                        { label: 'Photos', count: business.images.length },
                                        { label: '360 Tours' },
                                        { label: 'Videos' }
                                    ]}
                                    activeTab={galleryTab}
                                    onTabChange={setGalleryTab}
                                />

                                {galleryTab === 'Photos' && <BusinessGallery images={business.images} />}
                                {galleryTab === '360 Tours' && <Business360Tour />}
                                {galleryTab === 'Videos' && <BusinessVideos />}
                            </section>
                        )}

                        {/* About Section */}
                        <section id="about" className="order-7 lg:order-4 mt-4 md:mt-0">
                            <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 mb-4">About</h2>
                            <p className="text-zinc-600 leading-relaxed text-sm sm:text-base md:text-lg">
                                {business.description}
                            </p>

                            <div className="mt-6 sm:mt-8 grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                                {[
                                    { name: "Free Wi-Fi", icon: Wifi },
                                    { name: "Parking Available", icon: Car },
                                    { name: "AC Rooms", icon: Wind },
                                    { name: "Beverages", icon: Coffee }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-3 text-zinc-600 bg-zinc-50 p-3 rounded-xl border border-zinc-100 hover:bg-white hover:shadow-sm transition-all">
                                        <item.icon className="w-4 h-4 text-[#008080]" />
                                        <span className="text-xs sm:text-sm font-medium">{item.name}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Services Section */}
                        <div id="services" className="order-5">
                            <PopularServices services={business.services || []} />
                        </div>

                        {/* Categories & Tags Section */}
                        <div className="order-8 lg:order-6">
                            <BusinessCategories
                                categories={business.categories}
                                tags={business.tags}
                            />
                        </div>

                        {/* Reviews Section */}
                        <div id="reviews" className="order-6 lg:order-7">
                            <BusinessReviews
                                reviews={business.reviewsList}
                                rating={business.ratings?.average || 0}
                                reviewCount={business.ratings?.totalReviews || 0}
                                slug={slug}
                                businessName={business.name || 'businessname'}
                            />
                        </div>
                    </div>

                </div>
            </div>
            {/* Sticky Mobile Actions Footer */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-zinc-100 z-50">
                <div className="flex items-center gap-3">
                    <a
                        href={`tel:${business.phone}`}
                        className="flex items-center justify-center w-12 h-12 rounded-xl bg-zinc-100 text-zinc-900 border border-zinc-200 transition-all active:scale-95 shrink-0"
                    >
                        <Phone className="w-5 h-5" />
                    </a>
                    <a
                        href={`https://wa.me/${business.phone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-12 h-12 rounded-xl bg-green-50 text-green-600 border border-green-100 transition-all active:scale-95 shrink-0"
                    >
                        <FaWhatsapp className="w-6 h-6 fill-current" />
                    </a>
                    <Link href={`/business/${slug}/book-appointment`} className="flex-1">
                        <Button
                            className="w-full h-12 text-sm sm:text-base font-bold bg-[#008080] hover:bg-[#006666] rounded-xl shadow-lg shadow-[#008080]/20 transition-all active:scale-[0.98]"
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
                businessName={business.name}
            />
        </div >
    );
};

export default BusinessDetailsContent;
