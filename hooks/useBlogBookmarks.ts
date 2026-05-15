"use client"

import { useEffect, useMemo, useState } from "react"

const STORAGE_KEY = "blog_guest_bookmarks"

export function useBlogBookmarks() {
    const [bookmarks, setBookmarks] = useState<string[]>([])

    useEffect(() => {
        try {
            const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]")
            if (Array.isArray(stored)) {
                setBookmarks(stored)
            }
        } catch { }
    }, [])

    const bookmarkSet = useMemo(() => new Set(bookmarks), [bookmarks])

    const toggleLocalBookmark = (blogId: string) => {
        const next = bookmarkSet.has(blogId)
            ? bookmarks.filter((item) => item !== blogId)
            : [...bookmarks, blogId]

        setBookmarks(next)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
        return next.includes(blogId)
    }

    return {
        bookmarks,
        bookmarkSet,
        toggleLocalBookmark,
    }
}
