import { safeJsonLdStringify } from "@/lib/utils"
import type { BlogArticle, BlogComment } from "@/lib/blog-types"
import { getPublicBlogApiBaseUrl } from "@/lib/api-env"

export const BLOG_BASE_PATH = "/blog"

export const getBlogApiBaseUrl = getPublicBlogApiBaseUrl

export const getSiteBaseUrl = () => "https://bookby247.com"

export const buildAbsoluteUrl = (path: string) => `${getSiteBaseUrl()}${path}`

export const formatDate = (value?: string) =>
    value
        ? new Date(value).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
        })
        : ""

export const formatNumber = (value = 0) =>
    new Intl.NumberFormat("en-IN", { notation: "compact", maximumFractionDigits: 1 }).format(value)

/** Short label for mobile meta rows (e.g. categories). Appends "..." only when trimmed. */
export const truncateToWords = (text: string, maxWords: number): string => {
    const words = text.trim().split(/\s+/).filter(Boolean)
    if (words.length <= maxWords) return text.trim()
    return `${words.slice(0, maxWords).join(" ")}...`
}

export const slugifyText = (value: string) =>
    value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")

const escapeHtml = (value: string) =>
    value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;")

const inlineMarkdown = (value: string) =>
    escapeHtml(value)
        .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
        .replace(/\*(.+?)\*/g, "<em>$1</em>")
        .replace(/`(.+?)`/g, "<code>$1</code>")
        .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-black underline underline-offset-4">$1</a>')

export const markdownToHtml = (markdown = "") => {
    const lines = markdown.split(/\r?\n/)
    const html: string[] = []
    let inList = false

    const closeList = () => {
        if (inList) {
            html.push("</ul>")
            inList = false
        }
    }

    for (const rawLine of lines) {
        const line = rawLine.trim()
        if (!line) {
            closeList()
            continue
        }

        if (/^(-{3,}|\*{3,}|_{3,})$/.test(line)) {
            closeList()
            html.push('<hr class="my-10 border-0 border-t border-zinc-200" />')
            continue
        }

        if (line.startsWith("### ")) {
            closeList()
            html.push(`<h3 id="${slugifyText(line.slice(4))}" class="mt-8 text-xl font-bold text-zinc-950">${inlineMarkdown(line.slice(4))}</h3>`)
            continue
        }
        if (line.startsWith("## ")) {
            closeList()
            html.push(`<h2 id="${slugifyText(line.slice(3))}" class="mt-10 text-2xl font-bold text-zinc-950">${inlineMarkdown(line.slice(3))}</h2>`)
            continue
        }
        if (line.startsWith("# ")) {
            closeList()
            html.push(`<h1 id="${slugifyText(line.slice(2))}" class="mt-10 text-3xl font-bold text-zinc-950">${inlineMarkdown(line.slice(2))}</h1>`)
            continue
        }
        if (line.startsWith("- ") || line.startsWith("* ")) {
            if (!inList) {
                html.push('<ul class="my-6 list-disc space-y-2 pl-6 text-zinc-700">')
                inList = true
            }
            html.push(`<li>${inlineMarkdown(line.slice(2))}</li>`)
            continue
        }
        if (line.startsWith("> ")) {
            closeList()
            html.push(`<blockquote class="my-6 border-l-4 border-zinc-900 pl-4 italic text-zinc-600">${inlineMarkdown(line.slice(2))}</blockquote>`)
            continue
        }

        closeList()
        html.push(`<p class="text-base leading-8 text-zinc-700">${inlineMarkdown(line)}</p>`)
    }

    closeList()
    return html.join("")
}

/** Avoid duplicate page title when markdown opens with the same H1 as the article title. */
export const stripLeadingH1IfMatchesTitle = (title: string, markdown: string) => {
    const lines = markdown.split(/\r?\n/)
    const first = lines[0]?.trim()
    if (!first) return markdown
    const match = /^#\s+(.+)$/.exec(first)
    if (!match) return markdown
    const h1Text = match[1].trim().toLowerCase()
    if (h1Text === title.trim().toLowerCase()) {
        const rest = lines.slice(1).join("\n").replace(/^\s+/, "")
        return rest
    }
    return markdown
}

/**
 * Prefer long-form markdown over API `html`, which may be only a generated excerpt/snippet.
 */
export const getArticleHtml = (article: BlogArticle) => {
    const mdRaw = article.content?.markdown ?? ""
    const md = mdRaw.trim()
    const rawHtml = (article.content?.html ?? "").trim()
    if (md.length > rawHtml.length) {
        return markdownToHtml(stripLeadingH1IfMatchesTitle(article.title, mdRaw))
    }
    if (rawHtml) return rawHtml
    return markdownToHtml(stripLeadingH1IfMatchesTitle(article.title, mdRaw))
}

export const extractHeadings = (markdown = "") =>
    markdown
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter((line) => /^#{1,3}\s+/.test(line))
        .map((line) => {
            const hashes = (/^(#{1,3})\s+/.exec(line) || [])[1] || "##"
            const text = line.replace(/^#{1,3}\s+/, "").trim()
            return {
                id: slugifyText(text),
                text,
                level: hashes.length,
            }
        })

export const buildCommentTree = (comments: BlogComment[]) => {
    const map = new Map<string, BlogComment & { replies: BlogComment[] }>()
    const roots: Array<BlogComment & { replies: BlogComment[] }> = []

    comments.forEach((comment) => {
        map.set(comment._id, { ...comment, replies: [] })
    })

    map.forEach((comment) => {
        if (comment.parentComment && map.has(comment.parentComment)) {
            map.get(comment.parentComment)?.replies.push(comment)
        } else {
            roots.push(comment)
        }
    })

    return roots
}

export const renderJsonLd = (payload: unknown) => ({
    __html: safeJsonLdStringify(payload),
})
