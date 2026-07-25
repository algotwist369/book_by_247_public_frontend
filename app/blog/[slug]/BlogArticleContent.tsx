"use client"

import Link from "next/link"
import { ChevronDown } from "lucide-react"
import { useMemo, useState } from "react"
import Breadcrumbs from "@/components/ui/Breadcrumbs"
import { BlogArticleRichSections } from "@/components/blog/BlogArticleRichSections"
import { ReadingProgress } from "@/components/blog/ReadingProgress"
import { TableOfContents } from "@/components/blog/TableOfContents"
import { ShareButtons } from "@/components/blog/ShareButtons"
import { LikeButton } from "@/components/blog/LikeButton"
import { BookmarkButton } from "@/components/blog/BookmarkButton"
import { AuthorCard } from "@/components/blog/AuthorCard"
import { CommentSection } from "@/components/blog/CommentSection"
import { RelatedBlogs } from "@/components/blog/RelatedBlogs"
import { ReaderPopup } from "@/components/blog/ReaderPopup"
import { AiSummaryCard } from "@/components/blog/AiSummaryCard"
import { CustomImage } from "@/components/ui/CustomImage"
import { useBlogAuth } from "@/hooks/useBlogAuth"
import type { BlogArticle, BlogComment } from "@/lib/blog-types"
import { buildAbsoluteUrl, extractHeadings, formatDate, getArticleHtml, truncateToWords } from "@/lib/blog-utils"
import { cn } from "@/lib/utils"

const CATEGORY_META_WORDS = 3

/** Article HTML body - mobile-first type scale, `sm:` matches desktop reader */
const articleBodyProseClassName = cn(
    "prose prose-zinc max-w-none text-zinc-800",
    // Mobile: 16px body (readable), clear heading ladder
    "text-base leading-[1.7]",
    "prose-p:text-base prose-p:leading-[1.7] prose-p:text-zinc-700",
    "prose-headings:scroll-mt-20 prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-zinc-950",
    "prose-h1:mt-8 prose-h1:break-words prose-h1:text-[1.375rem] prose-h1:leading-snug",
    "prose-h2:mt-8 prose-h2:break-words prose-h2:text-[1.1875rem] prose-h2:leading-snug",
    "prose-h3:mt-6 prose-h3:break-words prose-h3:text-[1.0625rem] prose-h3:leading-snug prose-h3:font-semibold",
    "prose-li:my-0.5 prose-li:text-base prose-li:leading-relaxed prose-li:marker:text-zinc-300",
    "prose-blockquote:border-l-zinc-800 prose-blockquote:border-l-[3px] prose-blockquote:py-0 prose-blockquote:pl-4 prose-blockquote:text-[0.9375rem] prose-blockquote:leading-relaxed prose-blockquote:text-zinc-600 prose-blockquote:not-italic",
    "prose-pre:text-[13px] prose-pre:leading-relaxed prose-pre:max-w-full prose-pre:overflow-x-auto",
    "prose-a:break-words prose-a:text-base prose-a:font-normal prose-a:text-zinc-900 prose-a:no-underline prose-a:decoration-zinc-300 prose-a:underline-offset-4 hover:prose-a:underline",
    "prose-img:my-5 prose-img:max-h-[70vh] prose-img:w-auto prose-img:max-w-full prose-img:rounded-lg",
    "[&_iframe]:aspect-video [&_iframe]:max-w-full [&_iframe]:rounded-lg",
    "[&_table]:my-5 [&_table]:block [&_table]:max-w-full [&_table]:overflow-x-auto [&_table]:text-sm",
    // sm and up: slightly larger body + editorial headings
    "sm:prose-lg sm:text-[1.0625rem] sm:leading-[1.75]",
    "sm:prose-p:text-[1.0625rem] sm:prose-p:leading-relaxed sm:prose-p:text-zinc-700",
    "sm:prose-headings:scroll-mt-28",
    "sm:prose-h1:mt-10 sm:prose-h1:text-3xl sm:prose-h1:leading-tight",
    "sm:prose-h2:mt-10 sm:prose-h2:text-[1.65rem] sm:prose-h2:leading-snug",
    "sm:prose-h3:mt-8 sm:prose-h3:text-xl sm:prose-h3:font-bold",
    "sm:prose-li:text-[1.0625rem]",
    "sm:prose-blockquote:text-base sm:prose-blockquote:leading-relaxed",
    "sm:prose-pre:text-sm",
    "sm:[&_table]:text-sm"
)

interface BlogArticleContentProps {
    blog: BlogArticle
    comments: BlogComment[]
    relatedBlogs: BlogArticle[]
}

const BLOG_TOKEN_KEY = "blog_access_token"

export default function BlogArticleContent({ blog, comments, relatedBlogs }: BlogArticleContentProps) {
    const { isAuthenticated } = useBlogAuth()
    const [showReaderPopup, setShowReaderPopup] = useState(false)
    const headings = useMemo(() => extractHeadings(blog.content?.markdown || ""), [blog.content?.markdown])

    const requireAuth = () => {
        if (isAuthenticated) return true
        if (typeof window !== "undefined" && localStorage.getItem(BLOG_TOKEN_KEY)) return true
        setShowReaderPopup(true)
        return false
    }

    return (
        <div className="min-h-screen bg-white pb-[env(safe-area-inset-bottom,0px)]">
            <ReadingProgress />
            <div className="mx-auto max-w-6xl px-3 py-6 sm:px-6 sm:py-8 lg:px-10">
                <div className="-mx-1 min-w-0 overflow-x-auto overflow-y-visible pb-1 sm:mx-0 sm:overflow-visible">
                    <Breadcrumbs
                        items={[
                            { label: "Blog", href: "/blog" },
                            { label: blog.title, mobileTruncateWords: 3 },
                        ]}
                    />
                </div>
            </div>

            <article className="mx-auto grid max-w-6xl gap-8 px-3 pb-16 pt-0 sm:gap-10 sm:px-6 sm:pb-24 lg:grid-cols-[228px_minmax(0,1fr)] lg:gap-16 lg:px-10 lg:pb-28">
                <aside className="hidden min-w-0 lg:block lg:translate-y-px">
                    <TableOfContents headings={headings} />
                </aside>

                <div className="min-w-0 flex justify-center lg:justify-start">
                    <div className="w-full max-w-[680px]">
                        <header>
                            <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 text-[12px] leading-snug text-zinc-500 sm:text-[13px]">
                                {blog.categories?.length ? (
                                    blog.categories.map((cat, i) => (
                                        <span key={cat.slug || cat._id || cat.id || i}>
                                            <Link
                                                href={`/blog/category/${cat.slug}`}
                                                className="text-zinc-500 underline decoration-zinc-200 underline-offset-4 hover:text-zinc-800"
                                            >
                                                <span className="sm:hidden">{truncateToWords(cat.name, CATEGORY_META_WORDS)}</span>
                                                <span className="hidden sm:inline">{cat.name}</span>
                                            </Link>
                                            {i < blog.categories.length - 1 ? <span className="mx-1.5 text-zinc-300">·</span> : null}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-zinc-500">Blog</span>
                                )}
                                <span className="text-zinc-300">·</span>
                                <time dateTime={blog.publishedAt || blog.createdAt}>{formatDate(blog.publishedAt || blog.createdAt)}</time>
                                <span className="text-zinc-300">·</span>
                                <span>{blog.readingTimeMinutes} min read</span>
                            </div>
                            <h1 className="mt-4 text-balance break-words text-[1.5rem] font-bold leading-[1.2] tracking-tight text-zinc-950 sm:mt-6 sm:text-[2.75rem] sm:leading-[1.12] sm:tracking-tighter">
                                {blog.title}
                            </h1>
                            <p className="mt-3 text-[15px] leading-relaxed text-zinc-600 sm:mt-5 sm:text-xl sm:leading-snug md:text-2xl">
                                {blog.excerpt}
                            </p>

                            <div className="mt-7 flex flex-col gap-4 sm:mt-9 sm:flex-row sm:items-center sm:justify-between sm:gap-5">
                                <div className="min-w-0">
                                    <p className="text-[14px] font-semibold leading-snug text-zinc-900 sm:text-[15px]">{blog.author?.name}</p>
                                    <p className="mt-0.5 text-[12px] text-zinc-500 sm:text-[13px]">
                                        <time dateTime={blog.publishedAt || blog.createdAt}>{formatDate(blog.publishedAt || blog.createdAt)}</time>
                                    </p>
                                </div>
                                <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:justify-end sm:gap-3">
                                    <LikeButton blogId={blog.id} initialCount={blog.stats.likes} requireAuth={requireAuth} />
                                    <BookmarkButton blogId={blog.id} requireAuth={requireAuth} />
                                    <ShareButtons url={buildAbsoluteUrl(`/blog/${blog.slug}`)} title={blog.title} />
                                </div>
                            </div>

                            {blog.featuredImage?.url ? (
                                <figure className="relative mt-8 overflow-hidden rounded-lg sm:mt-10">
                                    <div className="relative aspect-[16/9] w-full">
                                        <CustomImage src={blog.featuredImage.url} alt={blog.featuredImage.alt || blog.title} fill priority className="object-cover" sizes="(max-width: 768px) 100vw, 680px" />
                                    </div>
                                    {blog.featuredImage.alt ? (
                                        <figcaption className="mt-2.5 px-1 text-center text-[11px] leading-snug text-zinc-500 sm:mt-3 sm:text-[13px]">
                                            {blog.featuredImage.alt}
                                        </figcaption>
                                    ) : null}
                                </figure>
                            ) : null}
                        </header>

                        {headings.length > 0 ? (
                            <details className="group mb-8 mt-8 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5 open:bg-white sm:px-4 sm:py-3 lg:hidden">
                                <summary className="flex cursor-pointer list-none items-center justify-between gap-2 text-[13px] font-semibold text-zinc-900 sm:text-sm [&::-webkit-details-marker]:hidden">
                                    <span>On this page</span>
                                    <ChevronDown className="h-4 w-4 shrink-0 text-zinc-500 transition-transform group-open:rotate-180" aria-hidden />
                                </summary>
                                <div className="mt-4 border-t border-zinc-100 pt-4">
                                    <TableOfContents headings={headings} compact />
                                </div>
                            </details>
                        ) : null}

                        <div className="mt-10 sm:mt-10">
                            <AiSummaryCard slug={blog.slug} />
                            <div className={articleBodyProseClassName}>
                                <div dangerouslySetInnerHTML={{ __html: getArticleHtml(blog) }} />
                            </div>

                            {blog.ai?.keyTakeaways?.length ? (
                                <section className="mt-10 rounded-lg bg-zinc-50 px-3.5 py-5 sm:mt-14 sm:px-6 sm:py-6">
                                    <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 sm:text-[12px]">Takeaways</p>
                                    <ul className="mt-3 space-y-2.5 border-l-[3px] border-zinc-900 pl-3.5 sm:mt-4 sm:space-y-3 sm:pl-5">
                                        {blog.ai.keyTakeaways.map((item) => (
                                            <li key={item} className="text-[14px] leading-relaxed text-zinc-700 sm:text-[1.0625rem] sm:leading-7">
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </section>
                            ) : null}

                            <BlogArticleRichSections blog={blog} />

                            <div className="mt-12 border-t border-zinc-100 pt-10 sm:mt-16 sm:pt-12">
                                <AuthorCard author={blog.author} />
                            </div>

                            <CommentSection blogId={blog.id} initialComments={comments} />
                            <RelatedBlogs blogs={relatedBlogs} />
                        </div>
                    </div>
                </div>
            </article>

            <ReaderPopup isOpen={showReaderPopup} onClose={() => setShowReaderPopup(false)} />
        </div>
    )
}
