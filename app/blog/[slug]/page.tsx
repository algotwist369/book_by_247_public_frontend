import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { blogApi } from "@/api/public/blog"
import { buildAbsoluteUrl } from "@/lib/blog-utils"
import { BlogJsonLd } from "@/components/blog/SEO/BlogJsonLd"
import BlogArticleContent from "@/app/blog/[slug]/BlogArticleContent"

interface PageProps {
    params: Promise<{ slug: string }>
}

export const revalidate = 300

import { buildSeoMetadata } from "@/lib/seo-title-helper"

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params
    const response = await blogApi.getBlogBySlug(slug).catch(() => null)
    const blog = response?.data

    if (!blog) {
        return { title: "Article Not Found - BookBy247" }
    }

    const path = `/blog/${blog.slug}`
    const image = blog.seo?.ogImage || blog.featuredImage?.url

    return buildSeoMetadata({
        pageType: "blog",
        articleTitle: blog.seo?.metaTitle || blog.title,
        articleSnippet: blog.seo?.metaDescription || blog.excerpt,
        canonicalPath: path,
        ogImage: image,
        robotsNoIndex: !!blog.seo?.noIndex
    })
}

export default async function BlogDetailPage({ params }: PageProps) {
    const { slug } = await params
    const response = await blogApi.getBlogBySlug(slug).catch(() => null)
    const blog = response?.data

    if (!blog) notFound()

    const [commentsResponse, relatedListing] = await Promise.all([
        blogApi.getComments(blog.id).catch(() => ({ data: [] })),
        (blog.tags[0]
            ? blogApi.listBlogs({ tag: blog.tags[0].id || blog.tags[0]._id, limit: 4 })
            : blogApi.listBlogs({ limit: 4 })
        ).catch(() => ({ data: [] })),
    ])

    const relatedBlogs = (relatedListing?.data || []).filter((item) => item.id !== blog.id).slice(0, 3)

    return (
        <>
            <BlogJsonLd blog={blog} />
            <BlogArticleContent blog={blog} comments={commentsResponse.data} relatedBlogs={relatedBlogs} />
        </>
    )
}
