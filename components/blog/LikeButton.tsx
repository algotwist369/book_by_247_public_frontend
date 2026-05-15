"use client"

import { useState } from "react"
import { Heart } from "lucide-react"
import { blogApi } from "@/api/public/blog"
import { formatNumber } from "@/lib/blog-utils"

export function LikeButton({
    blogId,
    initialCount,
    requireAuth,
}: {
    blogId: string
    initialCount: number
    requireAuth: () => boolean
}) {
    const [count, setCount] = useState(initialCount)
    const [liked, setLiked] = useState(false)

    return (
        <button
            onClick={async () => {
                if (!requireAuth()) return
                const nextLiked = !liked
                setLiked(nextLiked)
                setCount((current) => current + (nextLiked ? 1 : -1))
                try {
                    const res = await blogApi.toggleLike(blogId)
                    if (res.data && typeof res.data.likes === "number") {
                        setCount(res.data.likes)
                    }
                } catch {
                    setLiked(!nextLiked)
                    setCount((current) => current - (nextLiked ? 1 : -1))
                }
            }}
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium ${liked ? "border-red-200 bg-red-50 text-red-600" : "border-zinc-200 bg-white text-zinc-700"}`}
        >
            <Heart className={`h-4 w-4 ${liked ? "fill-current" : ""}`} />
            {formatNumber(count)}
        </button>
    )
}
