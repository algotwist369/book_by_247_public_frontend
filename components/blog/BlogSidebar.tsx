import Link from "next/link"
import type { BlogArticle, BlogTaxonomy } from "@/lib/blog-types"
import { BlogTagChipLink } from "@/components/blog/BlogTagChip"
import { NewsletterCTA } from "@/components/blog/NewsletterCTA"

interface BlogSidebarProps {
    popularBlogs: BlogArticle[]
    tags: BlogTaxonomy[]
}

export function BlogSidebar({ popularBlogs, tags }: BlogSidebarProps) {
    return (
        <aside className="mt-14 min-w-0 border-t border-gray-100 pt-10 lg:mt-0 lg:min-w-[260px] lg:max-w-[300px] lg:border-t-0 lg:border-l lg:border-gray-100 lg:pl-10 lg:pt-0">
            <section aria-labelledby="sidebar-popular">
                <h3 id="sidebar-popular" className="text-[13px] font-semibold uppercase tracking-wide text-gray-500">
                    Popular
                </h3>
                <ol className="mt-4 border-t border-gray-100">
                    {popularBlogs.slice(0, 5).map((blog, index) => {
                        const rowTags = blog.tags?.filter((t) => t.slug && t.name).slice(0, 4) ?? []
                        return (
                            <li key={blog.id} className="border-b border-gray-100 py-3.5 last:border-b-0">
                                <div className="flex gap-3">
                                    <span
                                        className="w-7 shrink-0 pt-0.5 text-right text-[11px] tabular-nums leading-none text-gray-400"
                                        aria-hidden
                                    >
                                        {String(index + 1).padStart(2, "0")}
                                    </span>
                                    <div className="min-w-0 flex-1">
                                        <Link
                                            href={`/blog/${blog.slug}`}
                                            className="block text-[14px] font-medium leading-snug text-gray-900 hover:text-gray-700 hover:underline"
                                        >
                                            {blog.title}
                                        </Link>
                                        {rowTags.length ? (
                                            <ul className="mt-2 flex flex-wrap gap-1.5" aria-label={`Tags for ${blog.title}`}>
                                                {rowTags.map((tag) => (
                                                    <li key={tag.slug}>
                                                        <BlogTagChipLink slug={tag.slug} name={tag.name} />
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : null}
                                    </div>
                                </div>
                            </li>
                        )
                    })}
                </ol>
            </section>

            {tags.length ? (
                <section className="mt-10" aria-labelledby="sidebar-tags">
                    <h3 id="sidebar-tags" className="text-[13px] font-semibold uppercase tracking-wide text-gray-500">
                        Tags
                    </h3>
                    <ul className="mt-3 flex flex-wrap gap-1.5">
                        {tags.slice(0, 16).map((tag) => (
                            <li key={tag.slug}>
                                <BlogTagChipLink slug={tag.slug} name={tag.name} />
                            </li>
                        ))}
                    </ul>
                </section>
            ) : null}

            <div className="mt-10">
                <NewsletterCTA />
            </div>
        </aside>
    )
}
