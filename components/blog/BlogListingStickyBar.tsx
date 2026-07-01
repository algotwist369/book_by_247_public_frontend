"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { BlogSearch } from "@/components/blog/BlogSearch"
import { startRouteProgress } from "@/lib/navigation-events"

const SORT_OPTIONS = ["-publishedAt", "-stats.views", "-stats.likes", "-readingTimeMinutes"] as const

interface BlogListingStickyBarProps {
    searchValue?: string
}

export function BlogListingStickyBar({ searchValue = "" }: BlogListingStickyBarProps) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const rawSort = searchParams.get("sort") || "-publishedAt"
    const selectedSort = SORT_OPTIONS.includes(rawSort as (typeof SORT_OPTIONS)[number]) ? rawSort : "-publishedAt"

    return (
        <div className="sticky top-0 z-40 -mx-4 border-b border-gray-100 bg-white/95 px-4 py-3 backdrop-blur-sm supports-[backdrop-filter]:bg-white/90 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                <div className="min-w-0 flex-1">
                    <BlogSearch
                        initialValue={searchValue}
                        className="w-full max-w-none"
                        inputClassName="h-10 w-full"
                    />
                </div>
                <div className="flex shrink-0 items-center gap-2 sm:min-w-[200px]">
                    <label htmlFor="blog-sort" className="sr-only">
                        Sort articles
                    </label>
                    <select
                        id="blog-sort"
                        value={selectedSort}
                        onChange={(event) => {
                            const next = new URLSearchParams(searchParams.toString())
                            next.set("sort", event.target.value)
                            const q = next.toString()
                            const href = q ? `${pathname}?${q}` : pathname
                            startRouteProgress(href)
                            router.prefetch(href)
                            router.push(href)
                        }}
                        className="h-10 w-full rounded-md border border-gray-200 bg-white px-3 text-[14px] text-gray-900 outline-none focus:border-gray-400 sm:min-w-[11rem]"
                    >
                        <option value="-publishedAt">Latest</option>
                        <option value="-stats.views">Most viewed</option>
                        <option value="-stats.likes">Most liked</option>
                        <option value="-readingTimeMinutes">Short reads</option>
                    </select>
                </div>
            </div>
        </div>
    )
}
