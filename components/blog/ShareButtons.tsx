"use client"

import { Copy, Facebook, Linkedin, Share2, Twitter } from "lucide-react"

export function ShareButtons({ url, title }: { url: string; title: string }) {
    const shareUrl = encodeURIComponent(url)
    const shareTitle = encodeURIComponent(title)
    const canShare = typeof navigator !== "undefined" && typeof navigator.share === "function"

    return (
        <div className="flex flex-wrap items-center gap-2">
            <a href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`} target="_blank" rel="noreferrer" className="rounded-full border border-zinc-200 p-3 text-zinc-700"><Twitter className="h-4 w-4" /></a>
            <a href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`} target="_blank" rel="noreferrer" className="rounded-full border border-zinc-200 p-3 text-zinc-700"><Facebook className="h-4 w-4" /></a>
            <a href={`https://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}&title=${shareTitle}`} target="_blank" rel="noreferrer" className="rounded-full border border-zinc-200 p-3 text-zinc-700"><Linkedin className="h-4 w-4" /></a>
            <button onClick={() => navigator.clipboard.writeText(url)} className="rounded-full border border-zinc-200 p-3 text-zinc-700"><Copy className="h-4 w-4" /></button>
            {canShare ? (
                <button onClick={() => navigator.share({ title, url })} className="rounded-full border border-zinc-200 p-3 text-zinc-700"><Share2 className="h-4 w-4" /></button>
            ) : null}
        </div>
    )
}
