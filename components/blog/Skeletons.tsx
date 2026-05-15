/** Light-theme placeholders (`gray-*`, white surfaces) matching blog listing & article layouts */

const pulse = "animate-pulse bg-gray-100"

export function BlogCardSkeleton() {
    return (
        <article className="border border-gray-200 bg-white">
            <div className="flex flex-col gap-6 rounded-md p-4 sm:flex-row sm:gap-8">
                {/* Thumbnail - 16:9 aspect ratio matching BlogCard */}
                <div
                    className={`w-full shrink-0 rounded-md ${pulse} aspect-[16/9] sm:w-[200px] md:w-[240px]`}
                    aria-hidden
                />
                <div className="min-w-0 flex-1 space-y-3">
                    <div className={`h-3 w-52 rounded-md ${pulse}`} />
                    <div className={`h-7 w-[92%] max-w-xl rounded-md ${pulse}`} />
                    <div className={`h-4 w-full rounded-md ${pulse}`} />
                    <div className={`h-4 w-[88%] rounded-md ${pulse}`} />
                    <div className={`h-3 w-36 rounded-md ${pulse}`} />
                    <div className="flex flex-wrap gap-1.5 pt-1">
                        <div className={`h-7 w-14 rounded-md ${pulse}`} />
                        <div className={`h-7 w-20 rounded-md ${pulse}`} />
                        <div className={`h-7 w-16 rounded-md ${pulse}`} />
                    </div>
                </div>
            </div>
        </article>
    )
}

/** Article page shell - breadcrumbs, TOC column + body (`max-w-[680px]`) */
export function ArticleSkeleton() {
    return (
        <div className="min-h-screen bg-white">
            <div className="mx-auto max-w-6xl border-b border-gray-100 px-4 py-8 sm:px-6 lg:px-10">
                <div className={`h-4 w-40 rounded-md ${pulse}`} />
            </div>

            <div className="mx-auto grid max-w-6xl gap-10 px-4 pb-24 pt-6 sm:px-6 lg:grid-cols-[228px_minmax(0,1fr)] lg:gap-16 lg:px-10">
                <aside className="hidden lg:block">
                    <div className="sticky top-28 space-y-3 pt-2">
                        <div className={`h-3 w-28 rounded-md ${pulse}`} />
                        <div className="space-y-2">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div
                                    key={i}
                                    className={`h-3 rounded-md ${pulse} ${i % 2 === 1 ? "ml-3 w-[85%]" : "w-full"}`}
                                />
                            ))}
                        </div>
                    </div>
                </aside>

                <div className="flex min-w-0 justify-center lg:justify-start">
                    <div className="w-full max-w-[680px] space-y-6">
                        <header className="space-y-4">
                            <div className={`h-3 w-64 rounded-md ${pulse}`} />
                            <div className={`h-10 w-full max-w-xl rounded-md ${pulse}`} />
                            <div className={`h-5 w-full max-w-lg rounded-md ${pulse}`} />
                            <div className={`h-5 w-full max-w-md rounded-md ${pulse}`} />
                            <div className="flex flex-wrap items-center gap-4 pt-2">
                                <div className={`h-4 w-36 rounded-md ${pulse}`} />
                                <div className={`h-9 w-24 rounded-full ${pulse}`} />
                                <div className={`h-9 w-28 rounded-full ${pulse}`} />
                            </div>
                        </header>

                        <div className={`aspect-[16/9] w-full rounded-lg ${pulse}`} aria-hidden />

                        <div className="space-y-4 pt-2">
                            {Array.from({ length: 10 }).map((_, index) => (
                                <div
                                    key={index}
                                    className={`h-5 rounded-md ${pulse} ${index % 4 === 3 ? "w-[72%]" : "w-full"}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

/** Stacked list placeholder for blog listing routes */
export function BlogListSkeleton({ count = 4 }: { count?: number }) {
    return (
        <div className="divide-y divide-gray-100">
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="py-10 first:pt-2">
                    <BlogCardSkeleton />
                </div>
            ))}
        </div>
    )
}
