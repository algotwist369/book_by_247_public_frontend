import Link from "next/link"
import { cn } from "@/lib/utils"

/** Shared pill style for tag links / buttons on blog listing pages */
export const blogTagChipClassName =
    "inline-flex max-w-full truncate rounded-md border border-gray-200 bg-gray-950/[0.035] px-2.5 py-1 text-[12px] font-medium leading-snug text-gray-900 transition-colors hover:border-gray-300 hover:bg-gray-950/[0.06]"

interface BlogTagChipLinkProps {
    slug: string
    name: string
    className?: string
}

export function BlogTagChipLink({ slug, name, className }: BlogTagChipLinkProps) {
    return (
        <Link href={`/blog/tag/${slug}`} className={cn(blogTagChipClassName, className)}>
            {name}
        </Link>
    )
}
