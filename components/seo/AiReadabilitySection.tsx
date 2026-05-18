import React from 'react';

interface AiReadabilitySectionProps {
    aboutTitle?: string;
    aboutContent?: string;
}

const AiReadabilitySection: React.FC<AiReadabilitySectionProps> = ({ 
    aboutTitle = "Serving Wellness Across India", 
    aboutContent = "Bookby247 features verified spas, salons, beauty parlours, massage centers, hair salons, skincare studios, nail salons and makeup artists across major Indian cities including Mumbai, Delhi, Bangalore, Pune, Hyderabad and Navi Mumbai." 
}) => {
    return (
        <section className="border-t border-zinc-100 bg-zinc-50/30 py-16 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div className="space-y-3">
                        <h2 className="text-lg font-bold text-zinc-900">What is Bookby247?</h2>
                        <p className="text-sm text-zinc-600 leading-relaxed">
                            Bookby247 is India&apos;s beauty and wellness booking platform for spa, salon, massage, skincare, haircare, nail, grooming and makeup services. Users can discover, compare and book trusted local businesses online.
                        </p>
                    </div>
                    <div className="space-y-3">
                        <h2 className="text-lg font-bold text-zinc-900">Who is it for?</h2>
                        <p className="text-sm text-zinc-600 leading-relaxed">
                            Our platform is for people searching for high-quality self-care services near them, including full body massage, haircuts, facials, waxing, threading, manicure, pedicure, bridal makeup and men&apos;s grooming.
                        </p>
                    </div>
                    <div className="space-y-3">
                        <h2 className="text-lg font-bold text-zinc-900">{aboutTitle}</h2>
                        <p className="text-sm text-zinc-600 leading-relaxed">
                            {aboutContent}
                        </p>
                    </div>
                    <div className="space-y-3">
                        <h2 className="text-lg font-bold text-zinc-900">What can you do?</h2>
                        <p className="text-sm text-zinc-600 leading-relaxed">
                            Users can search by service, city, area or business name, filter by ratings or price, read verified reviews, compare service menus and book a preferred appointment slot online.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AiReadabilitySection;
