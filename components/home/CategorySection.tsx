"use client";

import * as React from "react";
import { ArrowRight } from "lucide-react";
import { CategoryButton } from "./CategoryButton";
import { ServiceCard } from "./ServiceCard";
import Link from "next/link";

import { useRouter } from "next/navigation";
import { CATEGORIES_DATA, SERVICES_DATA } from "@/lib/constants";

export const CategorySection = () => {
    const router = useRouter();
    const categories = CATEGORIES_DATA;
    const services = SERVICES_DATA;
    const [selectedCategory, setSelectedCategory] = React.useState(categories[0]?.id || "");

    const handleCategorySelect = React.useCallback((id: string) => {
        setSelectedCategory(id);
    }, []);

    const handleServiceClick = React.useCallback((title: string) => {
        router.push(`/explore?q=${encodeURIComponent(title)}`);
    }, [router]);

    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-10">
            <div className="flex flex-col gap-5 sm:gap-6 md:gap-8 mb-2 sm:mb-8 md:mb-10">
                <div className="space-y-3 sm:space-y-4 md:space-y-6">
                    <div className="space-y-1 sm:space-y-1.5 md:space-y-2">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-zinc-900 tracking-tight">
                            Explore spa, salon and beauty services
                        </h2>
                        <p className="text-sm sm:text-base text-zinc-500 font-medium">
                            Find massage, haircare, skincare, nails, grooming and bridal makeup services near you.
                        </p>
                    </div>

                    {/* Mobile: Grid-like wrapping layout for categories */}
                    <div className="md:hidden px-2">
                        <div className="flex flex-wrap gap-3 justify-start">
                            {categories.map((cat) => (
                                <CategoryButton
                                    key={cat.id}
                                    category={cat}
                                    isActive={selectedCategory === cat.id}
                                    onClick={handleCategorySelect}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Desktop: Flex Wrap */}
                    <div className="hidden md:flex flex-wrap gap-4 lg:gap-6 xl:gap-8">
                        {categories.map((cat) => (
                            <CategoryButton
                                key={cat.id}
                                category={cat}
                                isActive={selectedCategory === cat.id}
                                onClick={handleCategorySelect}
                            />
                        ))}
                    </div>
                </div>

                <div className="hidden md:flex items-center justify-center sm:justify-end">
                    <Link
                        href="/explore"
                        className="flex items-center gap-2 text-zinc-900 text-sm sm:text-base font-bold hover:underline underline-offset-4 py-2 transition-all hover:gap-3"
                    >
                        Explore all services <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                    </Link>
                </div>
            </div>



            {/* Mobile: Grid-like wrapping layout */}
            <div className="md:hidden px-2">
                <div className="flex flex-wrap gap-4 lg:gap-6 xl:gap-8 justify-start">
                    {services
                        .filter((s) => s.category === selectedCategory)
                        .map((service) => (
                            <div key={service.id} className="flex-none">
                                <ServiceCard
                                    service={service}
                                    onClick={handleServiceClick}
                                />
                            </div>
                        ))
                    }
                </div>
            </div>

            {/* Desktop: Grid Layout */}
            <div className="hidden lg:flex flex-wrap gap-4 md:gap-6 lg:gap-6 xl:gap-8 justify-start">
                {services
                    .filter((s) => s.category === selectedCategory)
                    .map((service) => (
                        <ServiceCard
                            key={service.id}
                            service={service}
                            onClick={handleServiceClick}
                        />
                    ))
                }
            </div>
        </section>
    );
};
