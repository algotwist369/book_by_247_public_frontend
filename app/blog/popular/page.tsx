import type { Metadata } from "next"
import { blogApi } from "@/api/public/blog"
import { getBlogShellData } from "@/lib/blog-queries"
import { BlogLandingContent } from "@/app/blog/BlogLandingContent"

export const metadata: Metadata = {
    title: "Popular Blog Posts",
    description: "Most-read and most-engaged BookBy247 articles.",
    alternates: { canonical: "/blog/popular" },
}

export default async function PopularBlogPage() {
    const [{ data: blogs }, shell] = await Promise.all([
        blogApi.listBlogs({ limit: 12, sort: "-stats.views" }).catch(() => ({ data: [], meta: { page: 1, limit: 12, total: 0, totalPages: 0 } })),
        getBlogShellData(),
    ])

    return <BlogLandingContent title="Popular articles" blogs={blogs} categories={shell.categories} tags={shell.tags} sidebarBlogs={shell.trending} />
}
