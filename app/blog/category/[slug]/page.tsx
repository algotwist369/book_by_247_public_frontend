import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { blogApi } from "@/api/public/blog"
import { getBlogShellData, getCategoryBySlug } from "@/lib/blog-queries"
import { BlogLandingContent } from "@/app/blog/BlogLandingContent"

interface PageProps {
    params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params
    return {
        title: `Category: ${slug}`,
        description: `Category archive for ${slug} on the BookBy247 blog.`,
        alternates: { canonical: `/blog/category/${slug}` },
    }
}

export default async function BlogCategoryPage({ params }: PageProps) {
    const { slug } = await params
    const category = await getCategoryBySlug(slug)
    if (!category) notFound()

    const [listing, shell] = await Promise.all([
        blogApi.listBlogs({ category: category.id || category._id, limit: 12 }).catch(() => ({ data: [], meta: { page: 1, limit: 12, total: 0, totalPages: 0 } })),
        getBlogShellData(),
    ])

    return (
        <BlogLandingContent
            title={category.name}
            description={category.description || category.seo?.metaDescription || `Articles filed under ${category.name}.`}
            blogs={listing.data}
            categories={shell.categories}
            tags={shell.tags}
            sidebarBlogs={shell.trending}
        />
    )
}
