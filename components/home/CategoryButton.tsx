"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { CustomImage } from "../ui/CustomImage";

interface CategoryButtonProps {
    category: {
        id: string;
        label: string;
        image: string;
    };
    isActive: boolean;
    onClick: (id: string) => void;
}

export const CategoryButton: React.FC<CategoryButtonProps> = React.memo(({ category, isActive, onClick }) => {
    return (
        <button
            onClick={() => onClick(category.id)}
            className="flex flex-col items-center gap-3 group focus:outline-none"
            aria-pressed={isActive}
        >
            <div className={cn(
                "w-14 h-14 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 transition-all active:scale-95",
                isActive
                    ? "border-zinc-900 shadow-xl ring-4 ring-zinc-900/5"
                    : "border-zinc-100 grayscale hover:grayscale-0 hover:border-zinc-200"
            )}>
                <CustomImage
                    src={category.image}
                    alt={category.label}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                    loading="lazy"
                />
            </div>
            <span className={cn(
                "hidden lg:block text-[8px] lg:text-xs font-black tracking-widest uppercase transition-colors text-center",
                isActive ? "text-zinc-900" : "text-zinc-400 group-hover:text-zinc-600"
            )}>
                {category.label}
            </span>
        </button>
    );
});

CategoryButton.displayName = "CategoryButton";
