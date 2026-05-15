"use client"

import { useEffect, useState } from "react"

export function useReadingProgress() {
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
            const nextProgress = scrollHeight > 0 ? Math.min((scrollTop / scrollHeight) * 100, 100) : 0
            setProgress(nextProgress)
        }

        handleScroll()
        window.addEventListener("scroll", handleScroll, { passive: true })
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    return progress
}
