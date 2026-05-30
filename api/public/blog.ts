import { apiClient } from "@/api/apiClient"
import type { BlogArticle, BlogAuthor, BlogComment, BlogListResponse, BlogTaxonomy } from "@/lib/blog-types"
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
}
