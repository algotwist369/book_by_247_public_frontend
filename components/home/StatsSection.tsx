import React from 'react';
import { Users, Building2, Map, CalendarCheck } from 'lucide-react';

const stats = [
    {
        icon: <Users className="w-5 h-5 sm:w-6 sm:h-6 text-[#008080]" />,
        value: "1M+",
        label: "Happy Users",
        description: "Trusting our platform for their self-care"
    },
    {
        icon: <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-[#008080]" />,
        value: "25,000+",
        label: "Salons & Spas",
        description: "Verified business partners nationwide"
    },
    {
        icon: <Map className="w-5 h-5 sm:w-6 sm:h-6 text-[#008080]" />,
        value: "100+",
        label: "Cities Covered",
        description: "Bringing services to your doorstep"
    },
    {
        icon: <CalendarCheck className="w-5 h-5 sm:w-6 sm:h-6 text-[#008080]" />,
        value: "5M+",
        label: "Bookings",
        description: "Successful appointments made"
    }
];

export const StatsSection: React.FC = () => {
    return (
        <section className="w-full py-12 sm:py-16 md:py-20">
            <div className="max-w-[90rem] mx-auto px-4 sm:px-6">
                <div className="grid grid-cols-4 gap-4 sm:gap-6 md:gap-8 lg:gap-12">
                    {stats.map((stat, index) => (
                        <div key={index} className="flex flex-col gap-2 sm:gap-3 md:gap-4 items-center sm:items-start text-center sm:text-left">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-[#008080]/10 rounded-xl flex items-center justify-center">
                                {stat.icon}
                            </div>
                            <div>
                                <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold sm:font-black text-zinc-900 mb-0.5 sm:mb-1">{stat.value}</h3>
                                <p className="text-xs sm:text-sm md:text-base lg:text-lg font-semibold sm:font-bold text-zinc-800 mb-0.5 sm:mb-1 md:mb-2">{stat.label}</p>
                                <p className="text-zinc-500 text-[10px] sm:text-xs md:text-sm leading-relaxed hidden sm:block font-normal">{stat.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
