import { Suspense } from "react"
import { BlogHero } from "@/components/blog/BlogHero"
import { BlogFilters } from "@/components/blog/BlogFilters"
import { BlogList } from "@/components/blog/BlogList"
import { BlogSidebar } from "@/components/blog/BlogSidebar"
import { BlogListingStickyBar } from "@/components/blog/BlogListingStickyBar"
import type { BlogArticle, BlogTaxonomy } from "@/lib/blog-types"

interface BlogLandingContentProps {
    title?: string
    description?: string
    blogs: BlogArticle[]
    featured?: BlogArticle
    categories: BlogTaxonomy[]
    tags: BlogTaxonomy[]
    sidebarBlogs: BlogArticle[]
    showHero?: boolean
    searchValue?: string
}

export function BlogLandingContent({
    title = "Latest articles",
    description = "Browse by topic or filter below.",
    blogs,
    featured,
    categories,
    tags,
    sidebarBlogs,
    showHero = false,
    searchValue = "",
}: BlogLandingContentProps) {
    return (
        <div className="min-h-screen bg-white">
            {showHero ? <BlogHero featured={featured} topics={categories} /> : null}

            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(260px,300px)] lg:gap-14 lg:px-8 lg:pb-14 lg:pt-6">
                <div className="min-w-0">
                    <Suspense
                        fallback={
                            <div className="h-[52px] border-b border-gray-100 bg-white lg:rounded-none" aria-hidden />
                        }
                    >
                        <BlogListingStickyBar searchValue={searchValue} />
                    </Suspense>

                    <header className="pb-6 pt-6">
                        <h2 className="text-2xl font-semibold tracking-tight text-gray-900">{title}</h2>
                        <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-gray-600">{description}</p>
                    </header>

                    <div className="pb-8">
                        <BlogFilters categories={categories} tags={tags} />
                    </div>

                    <BlogList blogs={blogs} />
                </div>

                <BlogSidebar popularBlogs={sidebarBlogs} tags={tags} />
            </div>
        </div>
    )
}
