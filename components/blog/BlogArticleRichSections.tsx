import Link from "next/link"
import { CustomImage } from "@/components/ui/CustomImage"
import type { BlogArticle } from "@/lib/blog-types"

function youtubeEmbedUrl(raw: string): string | null {
    try {
        const u = new URL(raw.trim())
        if (u.hostname === "youtu.be") {
            const id = u.pathname.replace(/^\//, "").split("/")[0]
            return id ? `https://www.youtube.com/embed/${id}` : null
        }
        if (u.hostname.includes("youtube.com")) {
            const v = u.searchParams.get("v")
            if (v) return `https://www.youtube.com/embed/${v}`
            const m = u.pathname.match(/\/embed\/([^/]+)/)
            if (m) return `https://www.youtube.com/embed/${m[1]}`
            const s = u.pathname.match(/\/shorts\/([^/]+)/)
            if (s) return `https://www.youtube.com/embed/${s[1]}`
        }
    } catch {
        return null
    }
    return null
}

/** Editorial-only sections; SEO signals stay in meta tags + JSON-LD (see BlogJsonLd). */
export function BlogArticleRichSections({ blog }: { blog: BlogArticle }) {
    const faq = blog.schemaMarkup?.faq?.filter((item) => item.question && item.answer) ?? []
    const gallery = blog.gallery?.filter((img) => img?.url) ?? []
    const videos = blog.videoEmbeds?.filter(Boolean) ?? []

    return (
        <div className="mt-16 space-y-16 border-t border-zinc-100/80 pt-16">
            {videos.length ? (
                <section>
                    <div className="mt-6 flex flex-col gap-10">
                        {videos.map((url) => {
                            const embed = youtubeEmbedUrl(url)
                            return (
                                <div key={url} className="overflow-hidden rounded-xl bg-black">
                                    {embed ? (
                                        <div className="relative aspect-video w-full">
                                            <iframe
                                                title={blog.title}
                                                src={embed}
                                                className="absolute inset-0 h-full w-full"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                            />
                                        </div>
                                    ) : (
                                        <a href={url} rel="noopener noreferrer" className="block p-6 text-sm text-white underline">{url}</a>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </section>
            ) : null}

            {gallery.length ? (
                <section>
                    <div className="mt-6 grid gap-3 sm:grid-cols-2">
                        {gallery.map((img, i) => (
                            <div key={`${img.url}-${i}`} className="relative aspect-[4/3] overflow-hidden rounded-xl bg-zinc-50">
                                <CustomImage src={img.url} alt={img.alt || blog.title} fill className="object-cover" />
                            </div>
                        ))}
                    </div>
                </section>
            ) : null}

            {blog.tags?.length ? (
                <section aria-label="Article topics">
                    <div className="flex flex-wrap gap-2">
                        {blog.tags.map((tag) => (
                            <Link
                                key={tag._id || tag.id || tag.slug}
                                href={`/blog/tag/${tag.slug}`}
                                className="rounded-full bg-zinc-50 px-3 py-1.5 text-[13px] text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
                            >
                                {tag.name}
                            </Link>
                        ))}
                    </div>
                </section>
            ) : null}

            {faq.length ? (
                <section aria-labelledby="article-faq">
                    <h2 id="article-faq" className="text-[1.375rem] font-bold tracking-tight text-zinc-900">
                        Frequently asked questions
                    </h2>
                    <dl className="mt-8 divide-y divide-zinc-100">
                        {faq.map((item) => (
                            <div key={`${item.question}-${item.answer}`} className="py-6 first:pt-0">
                                <dt className="font-medium text-zinc-900">{item.question}</dt>
                                <dd className="mt-2 text-[0.9375rem] leading-7 text-zinc-600">{item.answer}</dd>
                            </div>
                        ))}
                    </dl>
                </section>
            ) : null}
        </div>
    )
}
