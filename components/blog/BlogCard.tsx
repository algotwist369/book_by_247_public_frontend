import Link from "next/link"
import { Bookmark, Eye } from "lucide-react"
import { CustomImage } from "@/components/ui/CustomImage"
import type { BlogArticle } from "@/lib/blog-types"
import { formatDate, formatNumber } from "@/lib/blog-utils"

interface BlogCardProps {
    blog: BlogArticle
}

/** Thumbnail box: 16:9 aspect ratio for consistent display across devices */
const CARD_IMAGE_CLASSES =
    "relative block w-full shrink-0 overflow-hidden rounded-md bg-gray-100 aspect-[16/9] sm:w-[200px] md:w-[240px]"

export function BlogCard({ blog }: BlogCardProps) {
    const fallbackImg = "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f"

    const href = `/blog/${blog.slug}`
    const views = blog.stats?.views ?? 0
    const bookmarks = blog.stats?.bookmarks ?? 0

    return (
        <article>
            <div className="border border-gray-200 group -m-3 flex flex-col gap-6 rounded-md p-3 transition-colors hover:bg-gray-50 sm:flex-row sm:gap-8 sm:p-4">
                <Link href={href} className={CARD_IMAGE_CLASSES}>
                    <CustomImage
                        src={blog.featuredImage?.url || fallbackImg}
                        alt=""
                        aria-hidden
                        fill
                        sizes="(min-width: 640px) 200px, 100vw"
                        className="object-cover"
                    />
                </Link>

                <div className="flex min-w-0 flex-1 gap-4">
                    <Link href={href} className="min-w-0 flex-1">
                        <p className="text-[13px] text-gray-500">
                            {blog.categories[0]?.name ?? "Blog"}
                            <span className="mx-1.5 text-gray-300">·</span>
                            <time dateTime={blog.publishedAt || blog.createdAt}>{formatDate(blog.publishedAt || blog.createdAt)}</time>
                            {blog.readingTimeMinutes ? (
                                <>
                                    <span className="mx-1.5 text-gray-300">·</span>
                                    {blog.readingTimeMinutes} min
                                </>
                            ) : null}
                        </p>

                        <h3 className="mt-2 text-xl font-semibold leading-snug text-gray-900 group-hover:underline">{blog.title}</h3>

                        <p className="mt-2 line-clamp-2 text-[15px] leading-relaxed text-gray-600">{blog.excerpt}</p>

                        {blog.author?.name ? (
                            <p className="mt-3 text-[13px] text-gray-500">{blog.author.name}</p>
                        ) : null}
                    </Link>

                    <div
                        className="flex shrink-0 flex-col items-end gap-2 pt-0.5 text-[13px] tabular-nums text-gray-500 sm:flex-row sm:items-start sm:gap-3"
                        aria-label="Article stats"
                    >
                        <span className="inline-flex items-center gap-1.5" title="Views">
                            <Eye className="h-3.5 w-3.5 shrink-0 text-gray-400" aria-hidden />
                            <span>{formatNumber(views)}</span>
                        </span>
                        <span className="inline-flex items-center gap-1.5" title="Saves">
                            <Bookmark className="h-3.5 w-3.5 shrink-0 text-gray-400" aria-hidden />
                            <span>{formatNumber(bookmarks)}</span>
                        </span>
                    </div>
                </div>
            </div>
        </article>
    )
}
