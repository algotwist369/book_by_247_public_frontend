import * as React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface CategoryLinkProps {
    name: string
    href: string
    className?: string
    onClick?: () => void
}

export const CategoryLink: React.FC<CategoryLinkProps> = ({ name, href, className, onClick }) => {
    return (
        <Link
            href={href}
            onClick={onClick}
            className={cn(
                "flex items-center gap-1 text-sm text-zinc-600 hover:text-black transition-colors font-medium px-2 py-1 whitespace-nowrap",
                className
            )}
        >
            {name}
        </Link>
    )
}
