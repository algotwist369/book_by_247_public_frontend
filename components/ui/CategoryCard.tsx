import * as React from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface CategoryCardProps {
    title: string
    image: string
    count?: string
    className?: string
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ title, image, count, className }) => {
    return (
        <div className={cn("group cursor-pointer", className)}>
            <div className="relative aspect-[16/10] sm:aspect-[4/3] overflow-hidden rounded-xl border border-zinc-100 bg-zinc-50">
                <Image
                    src={image}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/5 group-hover:bg-black/20 transition-colors" />
            </div>
            <div className="mt-2 sm:mt-3">
                <h3 className="text-base sm:text-lg font-bold text-zinc-900 group-hover:text-zinc-700 transition-colors uppercase tracking-tight">{title}</h3>
                {count && <p className="text-xs sm:text-sm text-zinc-500 font-medium">{count} places</p>}
            </div>
        </div>
    )
}
