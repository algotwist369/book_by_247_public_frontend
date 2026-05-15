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

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params
    const response = await blogApi.getBlogBySlug(slug).catch(() => null)
    const blog = response?.data

    if (!blog) {
        return { title: "Article not found" }
    }

    const path = `/blog/${blog.slug}`
    const title = blog.seo?.metaTitle || blog.title
    const description = blog.seo?.metaDescription || blog.excerpt
    const image = blog.seo?.ogImage || blog.featuredImage?.url
    const canonicalAbsolute =
        typeof blog.seo?.canonicalUrl === "string" && blog.seo.canonicalUrl.startsWith("http") ? blog.seo.canonicalUrl : null

    return {
        title,
        description,
        alternates: { canonical: canonicalAbsolute || path },
        robots: blog.seo?.noIndex ? { index: false, follow: true } : { index: true, follow: true },
        keywords: [...(blog.seo?.keywords || []), ...(blog.tags?.map((t) => t.name) || [])].slice(0, 20),
        openGraph: {
            title,
            description,
            type: "article",
            url: canonicalAbsolute || buildAbsoluteUrl(path),
            publishedTime: blog.publishedAt,
            modifiedTime: blog.updatedAt,
            images: image ? [{ url: image, alt: blog.title }] : [],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: image ? [image] : [],
        },
    }
}

export default async function BlogDetailPage({ params }: PageProps) {
    const { slug } = await params
    const response = await blogApi.getBlogBySlug(slug).catch(() => null)
    const blog = response?.data

    if (!blog) notFound()

    const [commentsResponse, relatedListing] = await Promise.all([
        blogApi.getComments(blog.id).catch(() => ({ data: [] })),
        blog.tags[0]
            ? blogApi.listBlogs({ tag: blog.tags[0].id || blog.tags[0]._id, limit: 4 })
            : blogApi.listBlogs({ limit: 4 }),
    ])

    const relatedBlogs = relatedListing.data.filter((item) => item.id !== blog.id).slice(0, 3)

    return (
        <>
            <BlogJsonLd blog={blog} />
            <BlogArticleContent blog={blog} comments={commentsResponse.data} relatedBlogs={relatedBlogs} />
        </>
    )
}
