import Link from "next/link"
import type { BlogArticle, BlogTaxonomy } from "@/lib/blog-types"
import { FeaturedBlogCard } from "@/components/blog/FeaturedBlogCard"

const BLOG_INDEX_ROUTES = [
    { href: "/blog", label: "All articles" },
    { href: "/blog/latest", label: "Latest" },
    { href: "/blog/popular", label: "Popular" },
    { href: "/blog/trending", label: "Trending" },
    { href: "/blog/search", label: "Search" },
    { href: "/blog/bookmarks", label: "Bookmarks" },
    { href: "/blog/login", label: "Sign In" },
    { href: "/blog/signup", label: "Sign Up" },
] as const

const pillLinkClass =
    "inline-flex rounded-md border border-gray-200 bg-gray-950/[0.035] px-3 py-1.5 text-[13px] leading-snug text-gray-900 transition-colors hover:border-gray-300 hover:bg-gray-950/[0.06]"

interface BlogHeroProps {
    featured?: BlogArticle
    topics: BlogTaxonomy[]
}

export function BlogHero({ featured, topics }: BlogHeroProps) {
    return (
        <section className="border-b border-gray-100 bg-white">
            <div className="mx-auto max-w-6xl px-4 pb-12 pt-10 sm:px-6 lg:px-8">
                <header className="max-w-2xl">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-500">BookBy247</p>
                    <h1 className="mt-3 text-3xl font-semibold tracking-tight text-gray-900 sm:text-[2.125rem] sm:leading-snug">
                        Insights for salons, spas & beauty brands
                    </h1>
                    <p className="mt-3 text-[15px] leading-relaxed text-gray-600">
                        Editorial guides on discovery, bookings, and growth-so wellness teams run smoother day to day and guests book with confidence.
                    </p>
                </header>

                <nav className="mt-10" aria-labelledby="hero-blog-routes-heading">
                    <h2 id="hero-blog-routes-heading" className="text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-500">
                        Browse
                    </h2>
                    <ul className="mt-3 flex flex-wrap gap-2">
                        {BLOG_INDEX_ROUTES.map((route) => (
                            <li key={route.href}>
                                <Link href={route.href} className={pillLinkClass}>
                                    {route.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                {topics.length ? (
                    <nav className="mt-10" aria-labelledby="hero-categories-heading">
                        <h2 id="hero-categories-heading" className="text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-500">
                            Categories
                        </h2>
                        <ul className="mt-3 flex flex-wrap gap-2">
                            {topics.slice(0, 12).map((topic) => (
                                <li key={topic.slug}>
                                    <Link href={`/blog/category/${topic.slug}`} className={pillLinkClass}>
                                        {topic.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
                ) : null}

                {featured ? (
                    <div className="mt-12 border-t border-gray-100 pt-12">
                        <FeaturedBlogCard blog={featured} />
                    </div>
                ) : null}
            </div>
        </section>
    )
}
