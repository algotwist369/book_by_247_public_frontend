"use client"

import { useEffect, useState } from "react"
import { blogApi } from "@/api/public/blog"
import { BlogList } from "@/components/blog/BlogList"
import { ReaderPopup } from "@/components/blog/ReaderPopup"
import { useBlogBookmarks } from "@/hooks/useBlogBookmarks"
import { useBlogAuth } from "@/hooks/useBlogAuth"
import type { BlogArticle } from "@/lib/blog-types"

export default function BlogBookmarksPage() {
    const { isAuthenticated, isReady } = useBlogAuth()
    const { bookmarks } = useBlogBookmarks()
    const [blogs, setBlogs] = useState<BlogArticle[]>([])
    const [showPopup, setShowPopup] = useState(false)

    useEffect(() => {
        if (!isReady) return
        if (!isAuthenticated) {
            setShowPopup(true)
            return
        }

        blogApi.getBookmarks().then((response) => {
            setBlogs(response.data.map((item) => item.blog))
        }).catch(() => {
            setBlogs([])
        })
    }, [isReady, isAuthenticated])

    return (
        <div className="min-h-screen bg-white">
            <div className="mx-auto max-w-6xl px-4 pb-14 pt-6 sm:px-6 lg:px-8">
                <header className="pb-6 pt-6">
                    <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Bookmarks</h1>
                    <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-gray-600">
                        {isAuthenticated ? "Your synced saved articles." : `Guest saves stored locally: ${bookmarks.length}`}
                    </p>
                </header>

                <div className="pb-8">
                    {blogs.length ? (
                        <BlogList blogs={blogs} />
                    ) : (
                        <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50/80 px-6 py-12 text-center text-[15px] text-gray-500">
                            No saved articles yet.
                        </div>
                    )}
                </div>

                <ReaderPopup
                    isOpen={showPopup}
                    onClose={() => setShowPopup(false)}
                    title="Sign in to sync your saves"
                    description="Guest bookmarks stay on this device. Reader access syncs them across sessions."
                />
            </div>
        </div>
    )
}
