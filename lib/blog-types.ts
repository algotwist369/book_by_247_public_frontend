export interface BlogAuthor {
    id: string
    _id?: string
    name: string
    username?: string
    email?: string
    role?: string
    authorRequestStatus?: "none" | "pending" | "approved" | "rejected"
    bio?: string
    isLocked?: boolean
    avatar?: {
        url?: string
        alt?: string
    }
    socialLinks?: {
        website?: string
        x?: string
        linkedin?: string
        github?: string
    }
    stats?: {
        publishedBlogs: number
        totalViews: number
    }
}

export interface BlogTaxonomy {
    _id?: string
    id?: string
    name: string
    slug: string
    description?: string
    seo?: {
        metaTitle?: string
        metaDescription?: string
    }
}

export interface BlogImage {
    url: string
    alt?: string
    width?: number
    height?: number
    blurDataUrl?: string
}

export interface BlogComment {
    _id: string
    blog: string
    content: string
    createdAt: string
    updatedAt?: string
    parentComment?: string | null
    likes?: string[]
    user?: {
        _id?: string
        name?: string
        avatar?: {
            url?: string
        }
    }
}

export interface BlogArticle {
    id: string
    title: string
    slug: string
    excerpt: string
    content: {
        markdown?: string
        html?: string
    }
    author: BlogAuthor
    categories: BlogTaxonomy[]
    tags: BlogTaxonomy[]
    status?: string
    visibility?: string
    publishedAt?: string
    createdAt: string
    updatedAt: string
    featuredImage?: BlogImage
    gallery?: BlogImage[]
    videoEmbeds?: string[]
    seo?: {
        metaTitle?: string
        metaDescription?: string
        canonicalUrl?: string
        focusKeyword?: string
        ogImage?: string
        twitterImage?: string
        keywords?: string[]
        noIndex?: boolean
        readingTime?: number
        aiSummary?: string
    }
    schemaMarkup?: {
        faq?: Array<{ question: string; answer: string }>
        breadcrumbs?: Array<{ name: string; url: string }>
    }
    ai?: {
        summary?: string
        keyTakeaways?: string[]
        entities?: string[]
        embeddingsStatus?: string
    }
    stats: {
        views: number
        uniqueViews: number
        likes: number
        comments: number
        bookmarks: number
        shares: number
    }
    readingTimeMinutes: number
    contentScore?: {
        seoScore?: number
        readabilityScore?: number
        keywordDensityScore?: number
        aiSnippetScore?: number
    }
    isPinned?: boolean
    isFeatured?: boolean
}

export interface BlogListResponse {
    data: BlogArticle[]
    meta: {
        page: number
        limit: number
        total: number
        totalPages: number
    }
}

export interface BlogFiltersState {
    category?: string
    tag?: string
    search?: string
    sort?: string
}

export interface BlogSeoMetadata {
    title: string
    description: string
    canonicalUrl: string
    openGraph: {
        title: string
        description: string
        image?: string
    }
    twitter: {
        card: string
        image?: string
    }
    jsonLd: Record<string, any>
}

export interface AiArticleLlmPayload {
    title: string
    slug: string
    summary?: string
    markdown?: string
    plainText?: string
    entities?: string[]
    keyTakeaways?: string[]
    categories?: BlogTaxonomy[]
    tags?: BlogTaxonomy[]
    author?: BlogAuthor
}

export interface MediaAsset {
    _id: string
    id?: string
    uploader: string
    originalName: string
    mimeType: string
    size: number
    url: string
    s3Key: string
    alt?: string
    createdAt?: string
}

export interface CreateBlogPayload {
    title: string
    excerpt?: string
    content: {
        markdown: string
        html?: string
    }
    categories?: string[]
    tags?: string[]
    featuredImage?: BlogImage
    gallery?: BlogImage[]
    status?: "draft" | "review" | "published" | "archived"
    visibility?: "public" | "private" | "unlisted"
    seo?: {
        metaTitle?: string
        metaDescription?: string
        canonicalUrl?: string
        focusKeyword?: string
        keywords?: string[]
        noIndex?: boolean
    }
}

export interface UpdateBlogPayload extends Partial<CreateBlogPayload> {}

export interface UpdateUserProfilePayload {
    name?: string
    bio?: string
    avatarUrl?: string
    socialLinks?: {
        website?: string
        x?: string
        linkedin?: string
        github?: string
    }
}

