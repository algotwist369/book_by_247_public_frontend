import { apiClient } from "@/api/apiClient"
import type {
    AiArticleLlmPayload,
    BlogArticle,
    BlogAuthor,
    BlogComment,
    BlogListResponse,
    BlogSeoMetadata,
    BlogTaxonomy,
    CreateBlogPayload,
    LuomoGeneratePayload,
    LuomoGenerateResponse,
    MediaAsset,
    UpdateBlogPayload,
    UpdateUserProfilePayload,
} from "@/lib/blog-types"
import { getBlogApiBaseUrl } from "@/lib/blog-utils"

const BLOG_API_BASE_URL = getBlogApiBaseUrl()
console.log(`[blogApi] BLOG_API_BASE_URL: ${BLOG_API_BASE_URL}`)

interface ApiResponse<T> {
    success: boolean
    message: string
    data: T
    meta?: unknown
}

const getAuthToken = () => {
    if (typeof window === "undefined") return null
    return localStorage.getItem("blog_access_token")
}

const withBlogBase = (options: RequestInit & { authToken?: string | null; onUnauthorized?: () => void } = {}) => ({
    ...options,
    credentials: "include" as RequestCredentials,
    baseUrl: BLOG_API_BASE_URL,
    includeAttribution: true,
})

/** Dispatched when blog API returns 401 while a reader token was sent. */
export const BLOG_AUTH_SESSION_EXPIRED_EVENT = "blog-auth-session-expired"

function emitBlogSessionExpired() {
    if (typeof window === "undefined") return
    window.dispatchEvent(new CustomEvent(BLOG_AUTH_SESSION_EXPIRED_EVENT))
}

/** Blog requests that send Bearer token; triggers session cleanup + re-login UI on 401. */
const withBlogAuth = (options: RequestInit & { authToken?: string | null } = {}) => {
    const token = options.authToken ?? getAuthToken()
    return withBlogBase({
        ...options,
        authToken: token,
        onUnauthorized: token ? emitBlogSessionExpired : undefined,
    })
}

export const blogApi = {
    async listBlogs(params: Record<string, string | number | boolean | undefined> = {}) {
        const query = new URLSearchParams()
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "") {
                query.set(key, String(value))
            }
        })
        const response = await apiClient<ApiResponse<BlogArticle[]> & { meta: BlogListResponse["meta"] }>(
            `/blogs${query.toString() ? `?${query.toString()}` : ""}`,
            withBlogBase({ next: { revalidate: 300 } })
        )
        return {
            data: response.data,
            meta: response.meta,
        } satisfies BlogListResponse
    },

    getTrendingBlogs: () =>
        apiClient<ApiResponse<BlogArticle[]>>("/blogs/trending", withBlogBase({ next: { revalidate: 300 } })),

    getBlogBySlug: (slug: string) =>
        apiClient<ApiResponse<BlogArticle>>(`/blogs/${slug}`, withBlogBase({ cache: "no-store" })),

    getCategories: () =>
        apiClient<ApiResponse<BlogTaxonomy[]>>("/categories", withBlogBase({ next: { revalidate: 3600 } })),

    getTags: () =>
        apiClient<ApiResponse<BlogTaxonomy[]>>("/tags", withBlogBase({ next: { revalidate: 3600 } })),

    getComments: (blogId: string) =>
        apiClient<ApiResponse<BlogComment[]>>(`/comments/${blogId}`, withBlogBase({ cache: "no-store" })),

    createComment: (blogId: string, payload: { content: string; parentComment?: string | null }) =>
        apiClient<ApiResponse<BlogComment>>(`/comments/${blogId}`, withBlogAuth({
            method: "POST",
            body: JSON.stringify(payload),
        })),

    updateComment: (commentId: string, payload: { content: string }) =>
        apiClient<ApiResponse<BlogComment>>(`/comments/item/${commentId}`, withBlogAuth({
            method: "PATCH",
            body: JSON.stringify(payload),
        })),

    deleteComment: (commentId: string) =>
        apiClient<ApiResponse<null>>(`/comments/item/${commentId}`, withBlogAuth({
            method: "DELETE",
        })),

    toggleCommentLike: (commentId: string) =>
        apiClient<ApiResponse<{ id: string; likesCount: number; liked: boolean }>>(`/comments/item/${commentId}/like`, withBlogAuth({
            method: "POST",
        })),

    toggleLike: (blogId: string) =>
        apiClient<ApiResponse<{ likes: number } | null>>(`/likes/${blogId}/toggle`, withBlogAuth({
            method: "POST",
        })),

    getBookmarks: () =>
        apiClient<ApiResponse<Array<{ blog: BlogArticle }>>>("/bookmarks", withBlogAuth({
            cache: "no-store",
        })),

    toggleBookmark: (blogId: string) =>
        apiClient<ApiResponse<{ bookmarks: number } | null>>(`/bookmarks/${blogId}/toggle`, withBlogAuth({
            method: "POST",
        })),

    searchBlogs: (query: string) =>
        apiClient<ApiResponse<BlogArticle[]>>(`/search?q=${encodeURIComponent(query)}`, withBlogBase({ cache: "no-store" })),

    getSearchSuggestions: (query: string) =>
        apiClient<ApiResponse<{ blogs: Array<Pick<BlogArticle, "title" | "slug">>; tags: BlogTaxonomy[] }>>(
            `/search/suggestions?q=${encodeURIComponent(query)}`,
            withBlogBase({ cache: "no-store" })
        ),

    subscribeNewsletter: (email: string) =>
        apiClient<ApiResponse<{ email: string }>>("/newsletter/subscribe", withBlogBase({
            method: "POST",
            body: JSON.stringify({ email }),
        })),

    login: (payload: { email: string; password: string }) =>
        apiClient<ApiResponse<{ user: BlogAuthor; tokens: { accessToken: string; refreshToken: string } }>>(
            "/auth/login",
            withBlogBase({
                method: "POST",
                body: JSON.stringify(payload),
            })
        ),

    register: (payload: { name: string; email: string; password: string }) =>
        apiClient<ApiResponse<BlogAuthor>>("/auth/register", withBlogBase({
            method: "POST",
            body: JSON.stringify(payload),
        })),

    refreshSession: () =>
        apiClient<ApiResponse<{ accessToken: string; refreshToken: string }>>("/auth/refresh", withBlogBase({
            method: "POST",
            cache: "no-store",
        })),

    getCurrentUser: () =>
        apiClient<ApiResponse<BlogAuthor>>("/users/me", withBlogAuth({
            cache: "no-store",
        })),

    getAuthorByUsername: (username: string) =>
        apiClient<ApiResponse<BlogAuthor>>(`/users/public/${username}`, withBlogBase({ next: { revalidate: 300 } })),

    getAiArticlePayload: (slug: string) =>
        apiClient<ApiResponse<unknown>>(`/ai/articles/${slug}/extract`, withBlogBase({ next: { revalidate: 3600 } })),

    logout: () =>
        apiClient<ApiResponse<null>>("/auth/logout", withBlogAuth({
            method: "POST",
        })),

    verifyEmail: (token: string) =>
        apiClient<ApiResponse<null>>(`/auth/verify-email?token=${encodeURIComponent(token)}`, withBlogBase({
            cache: "no-store",
        })),

    forgotPassword: (email: string) =>
        apiClient<ApiResponse<null>>("/auth/forgot-password", withBlogBase({
            method: "POST",
            body: JSON.stringify({ email }),
        })),

    resetPassword: (payload: { token: string; password: string }) =>
        apiClient<ApiResponse<null>>("/auth/reset-password", withBlogBase({
            method: "POST",
            body: JSON.stringify(payload),
        })),

    updateCurrentUser: (payload: UpdateUserProfilePayload) =>
        apiClient<ApiResponse<BlogAuthor>>("/users/me", withBlogAuth({
            method: "PATCH",
            body: JSON.stringify(payload),
        })),

    requestAuthorAccess: (reason?: string) =>
        apiClient<ApiResponse<BlogAuthor>>("/users/request-author-access", withBlogAuth({
            method: "POST",
            body: JSON.stringify({ reason }),
        })),

    listUsers: (query?: { role?: string; page?: number; limit?: number }) =>
        apiClient<ApiResponse<BlogAuthor[]>>(`/users${query ? `?${new URLSearchParams(query as any).toString()}` : ""}`, withBlogAuth({
            cache: "no-store",
        })),

    updateUserRole: (id: string, payload: { role?: string; authorRequestStatus?: string }) =>
        apiClient<ApiResponse<BlogAuthor>>(`/users/${id}/role`, withBlogAuth({
            method: "PATCH",
            body: JSON.stringify(payload),
        })),

    getAdminDashboard: () =>
        apiClient<ApiResponse<{ counts: { blogs: number; pendingComments: number; subscribers: number }; analytics: any }>>("/admin/dashboard", withBlogAuth({
            cache: "no-store",
        })),

    createBlog: (payload: CreateBlogPayload) =>
        apiClient<ApiResponse<BlogArticle>>("/blogs", withBlogAuth({
            method: "POST",
            body: JSON.stringify(payload),
        })),

    updateBlog: (id: string, payload: UpdateBlogPayload) =>
        apiClient<ApiResponse<BlogArticle>>(`/blogs/${id}`, withBlogAuth({
            method: "PATCH",
            body: JSON.stringify(payload),
        })),

    deleteBlog: (id: string) =>
        apiClient<ApiResponse<null>>(`/blogs/${id}`, withBlogAuth({
            method: "DELETE",
        })),

    createCategory: (payload: { name: string; slug?: string; description?: string }) =>
        apiClient<ApiResponse<BlogTaxonomy>>("/categories", withBlogAuth({
            method: "POST",
            body: JSON.stringify(payload),
        })),

    createTag: (payload: { name: string; slug?: string }) =>
        apiClient<ApiResponse<BlogTaxonomy>>("/tags", withBlogAuth({
            method: "POST",
            body: JSON.stringify(payload),
        })),

    unsubscribeNewsletter: (email: string) =>
        apiClient<ApiResponse<{ email: string }>>("/newsletter/unsubscribe", withBlogBase({
            method: "POST",
            body: JSON.stringify({ email }),
        })),

    getSeoMetadata: (slug: string) =>
        apiClient<ApiResponse<BlogSeoMetadata>>(`/seo/metadata/${slug}`, withBlogBase({ next: { revalidate: 3600 } })),

    getSitemapXml: () =>
        fetch(`${BLOG_API_BASE_URL}/seo/sitemap.xml`).then((res) => res.text()),

    getRobotsTxt: () =>
        fetch(`${BLOG_API_BASE_URL}/seo/robots.txt`).then((res) => res.text()),

    getAiArticleLlm: (slug: string) =>
        apiClient<ApiResponse<AiArticleLlmPayload>>(`/ai/articles/${slug}/llm`, withBlogBase({ next: { revalidate: 3600 } })),

    uploadMedia: (formData: FormData) =>
        apiClient<ApiResponse<MediaAsset>>("/media/upload", withBlogAuth({
            method: "POST",
            body: formData,
        })),

    getSignedMediaUrl: (id: string) =>
        apiClient<ApiResponse<{ signedUrl: string }>>(`/media/signed-url/${id}`, withBlogAuth({
            cache: "no-store",
        })),

    generateAiBlog: (payload: LuomoGeneratePayload) =>
        apiClient<ApiResponse<LuomoGenerateResponse>>("/ai/generate-blog", withBlogAuth({
            method: "POST",
            body: JSON.stringify(payload),
        })),
}


