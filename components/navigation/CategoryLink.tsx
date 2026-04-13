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
    const normalizedHref = React.useMemo(() => {
        if (!href) return href;

        // Backward compatibility: convert legacy /explore?category=... links
        if (href.startsWith("/explore?")) {
            const query = href.split("?")[1] || "";
            const params = new URLSearchParams(query);
            const category = params.get("category");
            if (category) {
                const slug = category
                    .trim()
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, "-")
                    .replace(/^-+|-+$/g, "");
                return `/${slug}-near-me`;
            }
        }

        return href.toLowerCase();
    }, [href]);

    return (
        <Link
            href={normalizedHref}
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
