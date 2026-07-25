import { blogApi } from "@/api/public/blog"
import type { BlogArticle, BlogTaxonomy } from "@/lib/blog-types"

export async function getBlogShellData() {
    const [categoriesResponse, tagsResponse, trendingResponse, latestResponse] = await Promise.all([
        blogApi.getCategories().catch(() => ({ data: [] as BlogTaxonomy[] })),
        blogApi.getTags().catch(() => ({ data: [] as BlogTaxonomy[] })),
        blogApi.getTrendingBlogs().catch(() => ({ data: [] as BlogArticle[] })),
        blogApi.listBlogs({ limit: 12 }).catch(() => ({ data: [], meta: { page: 1, limit: 12, total: 0, totalPages: 0 } })),
    ])

    return {
        categories: categoriesResponse.data,
        tags: tagsResponse.data,
        trending: trendingResponse.data,
        latest: latestResponse.data,
    }
}

export async function getCategoryBySlug(slug: string) {
    const response = await blogApi.getCategories().catch(() => ({ data: [] as BlogTaxonomy[] }))
    return response.data.find((category) => category.slug === slug) || null
}

export async function getTagBySlug(slug: string) {
    const response = await blogApi.getTags().catch(() => ({ data: [] as BlogTaxonomy[] }))
    return response.data.find((tag) => tag.slug === slug) || null
}

