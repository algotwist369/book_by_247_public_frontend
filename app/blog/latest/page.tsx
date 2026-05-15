import type { Metadata } from "next"
import { blogApi } from "@/api/public/blog"
import { getBlogShellData } from "@/lib/blog-queries"
import { BlogLandingContent } from "@/app/blog/BlogLandingContent"

export const metadata: Metadata = {
    title: "Latest Blog Posts",
    description: "Newest Bookby247 editorial articles and wellness publishing updates.",
    alternates: { canonical: "/blog/latest" },
}

export default async function LatestBlogPage() {
    const [{ data: blogs }, shell] = await Promise.all([
        blogApi.listBlogs({ limit: 12, sort: "-publishedAt" }).catch(() => ({ data: [], meta: { page: 1, limit: 12, total: 0, totalPages: 0 } })),
        getBlogShellData(),
    ])

    return <BlogLandingContent title="Latest articles" blogs={blogs} categories={shell.categories} tags={shell.tags} sidebarBlogs={shell.trending} />
}
