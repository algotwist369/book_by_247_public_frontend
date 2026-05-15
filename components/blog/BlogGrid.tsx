import type { BlogArticle } from "@/lib/blog-types"
import { BlogCard } from "@/components/blog/BlogCard"

export function BlogGrid({ blogs }: { blogs: BlogArticle[] }) {
    if (!blogs.length) {
        return <p className="py-12 text-[15px] text-zinc-500">No articles yet.</p>
    }

    return (
        <ul className="divide-y divide-zinc-100">
            {blogs.map((blog) => (
                <li key={blog.id} className="py-10 first:pt-0">
                    <BlogCard blog={blog} />
                </li>
            ))}
        </ul>
    )
}
