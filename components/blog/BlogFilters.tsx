"use client"

import { useRouter } from "next/navigation"
import { blogTagChipClassName } from "@/components/blog/BlogTagChip"
import type { BlogTaxonomy } from "@/lib/blog-types"
import { cn } from "@/lib/utils"
import { startRouteProgress } from "@/lib/navigation-events"

interface BlogFiltersProps {
    categories: BlogTaxonomy[]
    tags: BlogTaxonomy[]
}

export function BlogFilters({ categories, tags }: BlogFiltersProps) {
    const router = useRouter()
    const navigate = (href: string) => {
        startRouteProgress(href)
        router.prefetch(href)
        router.push(href)
    }

    return (
        <div className="rounded-lg border border-gray-900/12 bg-gray-950/[0.04] px-4 py-5 sm:px-5">
            <div className="space-y-6 text-[14px]">
                {categories.length ? (
                    <div>
                        <p className="text-[12px] font-medium uppercase tracking-wide text-gray-600">Categories</p>
                        <div className="mt-2 flex flex-wrap gap-x-1 gap-y-1">
                            {categories.slice(0, 12).map((category, i) => (
                                <span key={category.slug} className="inline-flex items-center text-[14px] text-gray-900">
                                    {i > 0 ? <span className="mx-1 text-gray-300">·</span> : null}
                                    <button
                                        type="button"
                                        aria-label={`Filter by category: ${category.name}`}
                                        onClick={() => navigate(`/blog/category/${category.slug}`)}
                                        className="rounded-sm px-0.5 text-left hover:bg-gray-950/[0.06] hover:underline"
                                    >
                                        {category.name}
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>
                ) : null}

                {tags.length ? (
                    <div>
                        <p className="text-[12px] font-medium uppercase tracking-wide text-gray-600">Tags</p>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                            {tags.slice(0, 18).map((tag) => (
                                <button
                                    key={tag.slug}
                                    type="button"
                                    aria-label={`Filter by tag: ${tag.name}`}
                                    onClick={() => navigate(`/blog/tag/${tag.slug}`)}
                                    className={cn(blogTagChipClassName, "cursor-pointer text-left")}
                                >
                                    {tag.name}
                                </button>
                            ))}
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    )
}
