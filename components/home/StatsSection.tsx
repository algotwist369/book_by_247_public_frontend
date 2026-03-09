import React from "react";
import { Users, Building2, Map, CalendarCheck } from "lucide-react";

const stats = [
    {
        icon: <Users className="w-6 h-6 text-zinc-900" />,
        value: "1M+",
        label: "Happy Users",
        description: "Trusting our platform for their self-care",
    },
    {
        icon: <Building2 className="w-6 h-6 text-zinc-900" />,
        value: "25,000+",
        label: "Salons & Spas",
        description: "Verified business partners nationwide",
    },
    {
        icon: <Map className="w-6 h-6 text-zinc-900" />,
        value: "100+",
        label: "Cities Covered",
        description: "Bringing services to your doorstep",
    },
    {
        icon: <CalendarCheck className="w-6 h-6 text-zinc-900" />,
        value: "5M+",
        label: "Bookings",
        description: "Successful appointments made",
    },
];

export const StatsSection: React.FC = () => {
    return (
        <section className="lg:block hidden w-full py-14 md:py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 text-center sm:text-left">
                    {stats.map((stat, index) => (
                        <div key={index} className="flex flex-col items-center sm:items-start space-y-3">

                            {/* Icon */}
                            <div className="w-12 h-12 flex items-center justify-center bg-zinc-50 rounded-lg">
                                {stat.icon}
                            </div>

                            {/* Content */}
                            <div>
                                <h2 className="text-3xl md:text-4xl font-semibold text-gray-900">
                                    {stat.value}
                                </h2>

                                <p className="text-base font-medium text-gray-800 mt-1">
                                    {stat.label}
                                </p>

                                <p className="text-sm text-gray-500 mt-1 hidden sm:block">
                                    {stat.description}
                                </p>
                            </div>

                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
};