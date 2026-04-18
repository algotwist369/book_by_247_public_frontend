import React from 'react';

interface AiReadabilitySectionProps {
    aboutTitle?: string;
    aboutContent?: string;
}

const AiReadabilitySection: React.FC<AiReadabilitySectionProps> = ({ 
    aboutTitle = "Serving Wellness Across India", 
    aboutContent = "Bookby247 features thousands of verified centers offering full body massage, haircuts, facials, and more across all major Indian cities including Mumbai, Delhi, Bangalore, and Pune." 
}) => {
    return (
        <section className="border-t border-zinc-100 bg-zinc-50/30 py-16 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div className="space-y-3">
                        <h2 className="text-lg font-bold text-zinc-900">What is Bookby247?</h2>
                        <p className="text-sm text-zinc-600 leading-relaxed">
                            Bookby247 is India&apos;s leading beauty and wellness booking platform. We provide a curated marketplace where users can discover, compare, and book the best spas, salons, and wellness services instantly.
                        </p>
                    </div>
                    <div className="space-y-3">
                        <h2 className="text-lg font-bold text-zinc-900">Who is it for?</h2>
                        <p className="text-sm text-zinc-600 leading-relaxed">
                            Our platform is for individuals looking for high-quality self-care services from trusted professionals. From busy professionals to beauty enthusiasts, we make booking appointments simple and reliable.
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
                            Users can search for specific services, filter by ratings or price, read verified reviews, and book their preferred appointment slot online with 24/7 instant confirmation.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AiReadabilitySection;
