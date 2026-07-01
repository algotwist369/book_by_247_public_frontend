"use client"

import { useEffect, useState } from "react"
import { Search } from "lucide-react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/Input"
import { blogApi } from "@/api/public/blog"
import { useDebounce } from "@/hooks/useDebounce"
import { cn } from "@/lib/utils"
import { startRouteProgress } from "@/lib/navigation-events"

interface BlogSearchProps {
    initialValue?: string
    /** Outer wrapper */
    className?: string
    /** Passed to Input */
    inputClassName?: string
}

export function BlogSearch({ initialValue = "", className = "", inputClassName = "" }: BlogSearchProps) {
    const router = useRouter()
    const [query, setQuery] = useState(initialValue)
    const [suggestions, setSuggestions] = useState<Array<{ label: string; href: string }>>([])
    const debounced = useDebounce(query, 250)

    useEffect(() => {
        let active = true
        if (!debounced.trim()) {
            setSuggestions([])
            return
        }

        blogApi.getSearchSuggestions(debounced).then((response) => {
            if (!active) return
            setSuggestions([
                ...response.data.blogs.map((blog) => ({ label: blog.title, href: `/blog/${blog.slug}` })),
                ...response.data.tags.map((tag) => ({ label: `#${tag.name}`, href: `/blog/tag/${tag.slug}` })),
            ])
        }).catch(() => {
            if (active) setSuggestions([])
        })

        return () => {
            active = false
        }
    }, [debounced])

    return (
        <div className={cn("relative max-w-md", className)}>
            <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(event) => {
                    if (event.key === "Enter" && query.trim()) {
                        const href = `/blog/search?q=${encodeURIComponent(query.trim())}`
                        startRouteProgress(href)
                        router.prefetch(href)
                        router.push(href)
                    }
                }}
                placeholder="Search articles"
                icon={<Search className="h-4 w-4 text-gray-400" />}
                className={cn(
                    "h-10 rounded-md border-gray-200 bg-white text-gray-900 shadow-none outline-none focus-visible:border-gray-400 focus-visible:ring-0",
                    inputClassName
                )}
            />
            {suggestions.length > 0 ? (
                <div className="absolute top-full z-[100] mt-1 w-full divide-y divide-gray-100 border border-gray-200 bg-white shadow-sm">
                    {suggestions.slice(0, 6).map((suggestion) => (
                        <button
                            key={`${suggestion.href}-${suggestion.label}`}
                            type="button"
                            aria-label={`Go to ${suggestion.label}`}
                            onClick={() => {
                                startRouteProgress(suggestion.href)
                                router.prefetch(suggestion.href)
                                router.push(suggestion.href)
                            }}
                            className="w-full px-3 py-2.5 text-left text-[14px] text-gray-900 outline-none hover:bg-gray-50"
                        >
                            {suggestion.label}
                        </button>
                    ))}
                </div>
            ) : null}
        </div>
    )
}
