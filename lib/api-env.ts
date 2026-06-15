const trimTrailingSlash = (value: string) => value.replace(/\/+$/, "")

const isDevelopment = process.env.NODE_ENV === "development"

export const getPublicApiBaseUrl = () =>
    trimTrailingSlash(
        process.env.NEXT_PUBLIC_API_URL ||
        (isDevelopment ? "http://localhost:9004/api" : "https://api.bookby247.com/api")
    )

export const getPublicBlogApiBaseUrl = () =>
    trimTrailingSlash(
        process.env.NEXT_PUBLIC_BLOG_API_URL ||
        (isDevelopment ? "http://localhost:9009/api/v1" : "https://blog-api.bookby247.com/api/v1")
    )

