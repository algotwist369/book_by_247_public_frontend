import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { blogApi } from "@/api/public/blog"
import { getBlogShellData, getTagBySlug } from "@/lib/blog-queries"
import { BlogLandingContent } from "@/app/blog/BlogLandingContent"

interface PageProps {
    params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params
    return {
        title: `Tag: ${slug}`,
        description: `Tag archive for ${slug} on the Bookby247 blog.`,
        alternates: { canonical: `/blog/tag/${slug}` },
    }
}

export default async function BlogTagPage({ params }: PageProps) {
    const { slug } = await params
    const tag = await getTagBySlug(slug)
    if (!tag) notFound()

    const [listing, shell] = await Promise.all([
        blogApi.listBlogs({ tag: tag.id || tag._id, limit: 12 }).catch(() => ({ data: [], meta: { page: 1, limit: 12, total: 0, totalPages: 0 } })),
        getBlogShellData(),
    ])

    return (
        <BlogLandingContent
            title={`#${tag.name}`}
            description={`Articles tagged with ${tag.name}.`}
            blogs={listing.data}
            categories={shell.categories}
            tags={shell.tags}
            sidebarBlogs={shell.trending}
        />
    )
}
