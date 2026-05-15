import type { BlogArticle } from "@/lib/blog-types"
import { BlogGrid } from "@/components/blog/BlogGrid"

export function RelatedBlogs({ blogs }: { blogs: BlogArticle[] }) {
    if (!blogs.length) return null

    return (
        <section className="mt-16 border-t border-zinc-100 pt-12">
            <h2 className="text-xl font-bold tracking-tight text-zinc-950 sm:text-3xl sm:font-black">Related reads</h2>
            <div className="mt-8">
                <BlogGrid blogs={blogs} />
            </div>
        </section>
    )
}
