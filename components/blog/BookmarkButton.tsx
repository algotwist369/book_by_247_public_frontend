"use client"

import { useState } from "react"
import { Bookmark } from "lucide-react"
import { blogApi } from "@/api/public/blog"
import { useBlogBookmarks } from "@/hooks/useBlogBookmarks"

export function BookmarkButton({
    blogId,
    requireAuth,
}: {
    blogId: string
    requireAuth: () => boolean
}) {
    const { bookmarkSet, toggleLocalBookmark } = useBlogBookmarks()
    const [remoteBookmarked, setRemoteBookmarked] = useState(false)
    const localBookmarked = bookmarkSet.has(blogId)
    const isBookmarked = remoteBookmarked || localBookmarked

    return (
        <button
            onClick={async () => {
                const allowed = requireAuth()
                if (!allowed) {
                    toggleLocalBookmark(blogId)
                    return
                }
                const next = !remoteBookmarked
                setRemoteBookmarked(next)
                try {
                    await blogApi.toggleBookmark(blogId)
                } catch {
                    setRemoteBookmarked(!next)
                }
            }}
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium ${isBookmarked ? "border-zinc-900 bg-zinc-900 text-white" : "border-zinc-200 bg-white text-zinc-700"}`}
        >
            <Bookmark className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`} />
            Save
        </button>
    )
}
