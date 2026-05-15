"use client"

import { useEffect, useState } from "react"
import { BLOG_AUTH_SESSION_EXPIRED_EVENT } from "@/api/public/blog"
import { ReaderPopup } from "@/components/blog/ReaderPopup"
import { useBlogAuth } from "@/hooks/useBlogAuth"

/** Opens the reader login modal when the blog API returns 401 for an authenticated request. */
export function BlogSessionExpiredGate() {
    const { logout } = useBlogAuth()
    const [open, setOpen] = useState(false)

    useEffect(() => {
        const onExpired = () => {
            logout()
            setOpen(true)
        }
        window.addEventListener(BLOG_AUTH_SESSION_EXPIRED_EVENT, onExpired)
        return () => window.removeEventListener(BLOG_AUTH_SESSION_EXPIRED_EVENT, onExpired)
    }, [logout])

    return (
        <ReaderPopup
            isOpen={open}
            onClose={() => setOpen(false)}
            title="Session expired"
            description="Your sign-in has expired or is no longer valid. Please sign in again to like, comment, or save articles."
        />
    )
}
