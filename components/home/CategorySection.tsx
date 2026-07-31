"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Flame, Star } from "lucide-react";
import { CustomImage } from "../ui/CustomImage";

interface CategoryItem {
    id: string;
    title: string;
    badge: string;
    badgeIcon: "star" | "fire";
    badgeColor: string;
    category: "massage" | "hair" | "skincare";
    image: string;
}

const CATEGORY_ITEMS: CategoryItem[] = [
    {
        id: "swedish-massage",
        title: "Swedish Massage",
        badge: "Popular",
        badgeIcon: "star",
        badgeColor: "bg-sky-50 text-sky-700 border-sky-100",
        category: "massage",
        image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=800",
    },
    {
        id: "massage-spa",
        title: "Massage & Spa",
        badge: "Popular",
        badgeIcon: "fire",
        badgeColor: "bg-amber-50 text-amber-700 border-amber-100",
        category: "massage",
        image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=800",
    },
    {
        id: "hair-salon",
        title: "Hair & Salon",
        badge: "Popular",
        badgeIcon: "fire",
        badgeColor: "bg-sky-50 text-sky-700 border-sky-100",
        category: "hair",
        image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=800",
    },
    {
        id: "skincare-treatment",
        title: "Skincare Treatment",
        badge: "Popular",
        badgeIcon: "fire",
        badgeColor: "bg-amber-50 text-amber-700 border-amber-100",
        category: "skincare",
        image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=800",
    },
    {
        id: "dentor-rose",
        title: "Dentor Rose",
        badge: "Popular",
        badgeIcon: "fire",
        badgeColor: "bg-amber-50 text-amber-700 border-amber-100",
        category: "massage",
        image: "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?q=80&w=800",
    },
    {
        id: "treatment",
        title: "Treatment",
        badge: "Popular",
        badgeIcon: "fire",
        badgeColor: "bg-sky-50 text-sky-700 border-sky-100",
        category: "skincare",
        image: "https://images.unsplash.com/photo-1512290900673-700200411926?q=80&w=800",
    },
    {
        id: "hair-styling",
        title: "Hair Salon",
        badge: "Popular",
        badgeIcon: "fire",
        badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-100",
        category: "hair",
        image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=800",
    },
    {
        id: "skincare-care",
        title: "Skincare",
        badge: "Popular",
        badgeIcon: "fire",
        badgeColor: "bg-amber-50 text-amber-700 border-amber-100",
        category: "skincare",
        image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=800",
    },
];

const TABS = [
    { id: "all", label: "All Services" },
    { id: "massage", label: "Massage & Spa" },
    { id: "hair", label: "Hair & Salon" },
    { id: "skincare", label: "Skincare" },
];

export const CategorySection: React.FC = () => {
    const [activeTab, setActiveTab] = useState("all");

    const filteredItems = activeTab === "all"
        ? CATEGORY_ITEMS
        : CATEGORY_ITEMS.filter(item => item.category === activeTab);

    return (
        <section className="w-full max-w-6xl mx-auto px-4 py-12 md:py-16">
            {/* Header Section matching Target Screenshot */}
            <div className="text-center space-y-1.5 mb-6">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-zinc-900 tracking-tight">
                    Book Trending Spa & Salon Services
                </h2>
                <p className="text-sm sm:text-base text-zinc-600 font-normal">
                    Explore Popular Services
                </p>
            </div>

            {/* Filter Pills Row */}
            <div className="flex items-center justify-center flex-wrap gap-2.5 mb-8">
                {TABS.map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                                isActive
                                    ? "bg-zinc-950 text-white shadow-md scale-105"
                                    : "bg-white text-zinc-700 border border-zinc-200 hover:bg-zinc-50 hover:border-zinc-300"
                            }`}
                        >
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* 4-Column Grid matching Target Screenshot */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                {filteredItems.map((item) => (
                    <Link
                        key={item.id}
                        href={`/explore?q=${encodeURIComponent(item.title)}`}
                        className="group bg-white rounded-2xl border border-zinc-200/90 p-3 sm:p-4 shadow-2xs hover:shadow-xl hover:border-zinc-300 transition-all duration-300 flex flex-col justify-between"
                    >
                        <div>
                            {/* Card Image */}
                            <div className="relative w-full h-32 sm:h-40 rounded-xl overflow-hidden mb-3 bg-zinc-100">
                                <CustomImage
                                    src={item.image}
                                    alt={item.title}
                                    fill
                                    sizes="(max-width: 768px) 50vw, 25vw"
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                            </div>

                            {/* Card Title */}
                            <h3 className="text-sm sm:text-base font-extrabold text-zinc-900 group-hover:text-black transition-colors line-clamp-1 mb-1.5">
                                {item.title}
                            </h3>

                            {/* Badge */}
                            <div className="flex items-center gap-1">
                                <span className={`px-2 py-0.5 rounded-md text-[10px] sm:text-xs font-bold inline-flex items-center gap-1 border ${item.badgeColor}`}>
                                    <span>{item.badge}</span>
                                    {item.badgeIcon === "star" ? (
                                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                    ) : (
                                        <Flame className="w-3 h-3 fill-orange-500 text-orange-500" />
                                    )}
                                </span>
                            </div>
                        </div>

                        {/* Explore Link */}
                        <div className="pt-2.5 border-t border-zinc-100 mt-3 flex items-center justify-between">
                            <span className="text-xs sm:text-sm font-bold text-emerald-800 group-hover:text-emerald-900 flex items-center gap-1 transition-colors">
                                Explore <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                            </span>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
};
