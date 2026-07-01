import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { blogApi } from "@/api/public/blog"
import { getBlogShellData } from "@/lib/blog-queries"
import { BlogLandingContent } from "@/app/blog/BlogLandingContent"

interface PageProps {
    params: Promise<{ username: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { username } = await params
    return {
        title: `Author: ${username}`,
        description: `Author archive for ${username} on the BookBy247 blog.`,
        alternates: { canonical: `/blog/author/${username}` },
    }
}

export default async function BlogAuthorPage({ params }: PageProps) {
    const { username } = await params
    const authorResponse = await blogApi.getAuthorByUsername(username).catch(() => null)
    if (!authorResponse?.data) notFound()

    const [listing, shell] = await Promise.all([
        blogApi.listBlogs({ author: authorResponse.data.id, limit: 12 }).catch(() => ({ data: [], meta: { page: 1, limit: 12, total: 0, totalPages: 0 } })),
        getBlogShellData(),
    ])

    return (
        <BlogLandingContent
            title={authorResponse.data.name}
            description={authorResponse.data.bio || `Read articles published by ${authorResponse.data.name}.`}
            blogs={listing.data}
            categories={shell.categories}
            tags={shell.tags}
            sidebarBlogs={shell.trending}
        />
    )
}
