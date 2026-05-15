import type { BlogArticle } from "@/lib/blog-types"
import { BlogGrid } from "@/components/blog/BlogGrid"

export function BlogList({ blogs }: { blogs: BlogArticle[] }) {
    return <BlogGrid blogs={blogs} />
}
