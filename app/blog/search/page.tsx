import type { Metadata } from "next"
import { blogApi } from "@/api/public/blog"
import { getBlogShellData } from "@/lib/blog-queries"
import { BlogLandingContent } from "@/app/blog/BlogLandingContent"

interface PageProps {
    searchParams: Promise<{ q?: string }>
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
    const params = await searchParams
    const query = params.q || ""
    return {
        title: query ? `Search: ${query}` : "Search Blog",
        description: query ? `Search results for ${query} across the BookBy247 blog.` : "Search editorial articles on BookBy247.",
        alternates: { canonical: query ? `/blog/search?q=${encodeURIComponent(query)}` : "/blog/search" },
    }
}

export default async function BlogSearchPage({ searchParams }: PageProps) {
    const params = await searchParams
    const query = params.q || ""
    const [{ data: blogs }, shell] = await Promise.all([
        query ? blogApi.searchBlogs(query).then((response) => ({ data: response.data })) : Promise.resolve({ data: [] }),
        getBlogShellData(),
    ])

    return (
        <BlogLandingContent
            title={query ? `Search results for "${query}"` : "Search the blog"}
            description="Find intent-matched articles, topic clusters, and category pages."
            blogs={blogs}
            categories={shell.categories}
            tags={shell.tags}
            sidebarBlogs={shell.trending}
            searchValue={query}
        />
    )
}
