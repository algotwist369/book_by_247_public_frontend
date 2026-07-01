import React from 'react';

interface AiReadabilitySectionProps {
    aboutTitle?: string;
    aboutContent?: string;
}

const AiReadabilitySection: React.FC<AiReadabilitySectionProps> = ({ 
    aboutTitle = "Best Spas & Salons Across Major Cities in India", 
    aboutContent = "BookBy247 lists thousands of verified local partners across major urban hubs. Find your next appointment at the best hair salons in Mumbai, luxury spas in Delhi, top beauty parlours in Bangalore, or premier wellness studios across Pune, Hyderabad, and Navi Mumbai." 
}) => {
    return (
        <section className="border-t border-zinc-100 bg-white py-16">
            <div className="max-w-7xl mx-auto px-4 px-6 md:px-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div className="space-y-3">
                        <h2 className="text-lg font-bold text-zinc-900">What is BookBy247 Salon and Spa Booking App?</h2>
                        <p className="text-sm text-zinc-800 leading-relaxed">
                           BookBy247 is India&apos;s premier online salon appointment booking app designed for premium spas, hair salons, beauty parlours, and massage centers. Users can effortlessly discover, compare service menus, and book trusted local beauty services online with instant confirmation.
                        </p>
                    </div>
                    <div className="space-y-3">
                        <h2 className="text-lg font-bold text-zinc-900">Who Can Book Services on BookBy247?</h2>
                        <p className="text-sm text-zinc-800 leading-relaxed">
                            Our platform connects clients searching for top-rated beauty parlours and unisex salons near me for trending treatments. Book local experts for full body massages, luxury spa packages, keratin treatments, deep-cleansing facials, body waxing, gel nail extensions, and professional bridal makeup artists.
                        </p>
                    </div>
                    <div className="space-y-3">
                        <h2 className="text-lg font-bold text-zinc-900">{aboutTitle}</h2>
                        <p className="text-sm text-zinc-800 leading-relaxed">
                            {aboutContent}
                        </p>
                    </div>
                    <div className="space-y-3">
                        <h2 className="text-lg font-bold text-zinc-900">How to Book Salon Appointments Online?</h2>
                        <p className="text-sm text-zinc-800 leading-relaxed">
                            Customers can filter by city, neighborhood, near me searches, salon price lists, real-time slot availability, and 100% verified customer reviews. Search by service type, local area, or studio name to compare salon prices and book salon appointments online instantly without waiting for callbacks.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AiReadabilitySection;

