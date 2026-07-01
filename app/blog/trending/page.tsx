import type { Metadata } from "next"
import { blogApi } from "@/api/public/blog"
import { getBlogShellData } from "@/lib/blog-queries"
import { BlogLandingContent } from "@/app/blog/BlogLandingContent"

export const metadata: Metadata = {
    title: "Trending Blog Posts",
    description: "Trending wellness and beauty content on BookBy247.",
    alternates: { canonical: "/blog/trending" },
}

export default async function TrendingBlogPage() {
    const [trendingResponse, shell] = await Promise.all([
        blogApi.getTrendingBlogs().catch(() => ({ data: [] })),
        getBlogShellData(),
    ])

    return <BlogLandingContent title="Trending now" blogs={trendingResponse.data} categories={shell.categories} tags={shell.tags} sidebarBlogs={trendingResponse.data} />
}
