import Link from "next/link"
import type { BlogArticle } from "@/lib/blog-types"
import { CustomImage } from "@/components/ui/CustomImage"
import { formatDate } from "@/lib/blog-utils"

export function FeaturedBlogCard({ blog }: { blog: BlogArticle }) {
    return (
        <article>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-500">Featured</p>
            <div className="mt-4 flex flex-col gap-6 sm:flex-row sm:gap-10">
                {blog.featuredImage?.url ? (
                    <Link href={`/blog/${blog.slug}`} className="relative shrink-0 sm:w-[200px] md:w-[240px]">
                        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-md bg-gray-100">
                            <CustomImage
                                src={blog.featuredImage.url}
                                alt={blog.featuredImage.alt || blog.title}
                                fill
                                className="object-cover"
                            />
                        </div>
                    </Link>
                ) : null}
                <div className="min-w-0 flex-1">
                    <Link href={`/blog/${blog.slug}`} className="text-2xl font-semibold leading-snug text-gray-900 hover:underline md:text-[1.75rem]">
                        {blog.title}
                    </Link>
                    <p className="mt-3 text-[15px] leading-relaxed text-gray-600">{blog.excerpt}</p>
                    <p className="mt-4 text-[13px] text-gray-500">
                        {blog.author?.name ? <>{blog.author.name} · </> : null}
                        <time dateTime={blog.publishedAt || blog.createdAt}>{formatDate(blog.publishedAt || blog.createdAt)}</time>
                        {blog.readingTimeMinutes ? <> · {blog.readingTimeMinutes} min read</> : null}
                    </p>
                </div>
            </div>
        </article>
    )
}
