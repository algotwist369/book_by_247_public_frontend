"use client";

import * as React from "react";
import { ArrowRight } from "lucide-react";
import { CategoryButton } from "./CategoryButton";
import { ServiceCard } from "./ServiceCard";
import Link from "next/link";
import { LucideIcon } from "lucide-react";

interface Category {
    id: string;
    label: string;
    image: string;
}

interface Service {
    id: string | number;
    title: string;
    description: string;
    image: string;
    category: string;
    icon: LucideIcon;
}

import { useRouter } from "next/navigation";
import { CATEGORIES_DATA, SERVICES_DATA } from "@/lib/constants";

interface CategorySectionProps {
    // Data imported directly to avoid serialization issues with icons
}

export const CategorySection: React.FC<CategorySectionProps> = () => {
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

    const handleExploreAll = React.useCallback(() => {
        router.push("/explore");
    }, [router]);

    return (
        <section className="max-w-[90rem] mx-auto px-4 sm:px-6 md:px-8 py-12 sm:py-16 md:py-20">
            <div className="flex flex-col gap-5 sm:gap-6 md:gap-8 mb-6 sm:mb-8 md:mb-10">
                <div className="space-y-3 sm:space-y-4 md:space-y-6">
                    <div className="space-y-1 sm:space-y-1.5 md:space-y-2">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-zinc-900 tracking-tight">
                            Explore by category
                        </h2>
                        <p className="text-sm sm:text-base text-zinc-500 font-medium">
                            Find the perfect service for your well-being
                        </p>
                    </div>

                    {/* Mobile: Horizontal Scroll */}
                    <div className="md:hidden overflow-x-auto scrollbar-hide -mx-4 px-4">
                        <div className="flex gap-3 pb-2">
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



            {/* Mobile: Horizontal Slider */}
            <div className="md:hidden overflow-x-auto scrollbar-hide -mx-4 px-4">
                <div className="flex gap-4 pb-2">
                    {services
                        .filter((s) => s.category === selectedCategory)
                        .map((service) => (
                            <div key={service.id} className="flex-none w-[calc(40%-8px)]">
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
            <div className="hidden md:grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 lg:gap-8">
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
