import type { Metadata } from "next"
import { blogApi } from "@/api/public/blog"
import { getBlogShellData } from "@/lib/blog-queries"
import { BlogLandingContent } from "@/app/blog/BlogLandingContent"

export const revalidate = 300

const BLOG_INDEX_DESCRIPTION =
    "Editorial guides on discovery, bookings, and growth for salons, spas, and beauty brands in India. Practical reads for wellness teams and guests using BookBy247."

const BLOG_INDEX_OG_IMAGE = "https://res.cloudinary.com/dwsv275kv/image/upload/v1774691836/555666_m75jkf.png"

const BLOG_INDEX_SHARE_TITLE = "BookBy247 Blog | Salons, spas & beauty business insights"

export const metadata: Metadata = {
    title: {
        absolute: BLOG_INDEX_SHARE_TITLE,
    },
    description: BLOG_INDEX_DESCRIPTION,
    keywords: [
        "BookBy247 blog",
        "salon business tips India",
        "spa marketing",
        "beauty salon booking",
        "wellness business growth",
        "salon appointment booking software",
        "editorial wellness guides",
        "booking insights for salons",
    ],
    alternates: { canonical: "/blog" },
    openGraph: {
        title: BLOG_INDEX_SHARE_TITLE,
        description: BLOG_INDEX_DESCRIPTION,
        url: "/blog",
        siteName: "BookBy247",
        locale: "en_IN",
        type: "website",
        images: [
            {
                url: BLOG_INDEX_OG_IMAGE,
                width: 1200,
                height: 630,
                alt: "BookBy247 blog — salons, spas and beauty brands",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: BLOG_INDEX_SHARE_TITLE,
        description: BLOG_INDEX_DESCRIPTION,
        images: [BLOG_INDEX_OG_IMAGE],
    },
    robots: {
        index: true,
        follow: true,
    },
}

const ALLOWED_SORT = new Set(["-publishedAt", "-stats.views", "-stats.likes", "-readingTimeMinutes"])

interface BlogPageProps {
    searchParams: Promise<{ sort?: string }>
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
    const sp = await searchParams
    const sort = sp.sort && ALLOWED_SORT.has(sp.sort) ? sp.sort : "-publishedAt"

    const [{ data: blogs }, shell] = await Promise.all([
        blogApi.listBlogs({ limit: 12, sort }).catch(() => ({ data: [], meta: { page: 1, limit: 12, total: 0, totalPages: 0 } })),
        getBlogShellData(),
    ])

    return (
        <BlogLandingContent
            title="Articles"
            description="Short reads on wellness brands, salons, spas, and using BookBy247 day to day."
            blogs={blogs}
            featured={shell.trending[0] || blogs[0]}
            categories={shell.categories}
            tags={shell.tags}
            sidebarBlogs={shell.trending}
            showHero
        />
    )
}
