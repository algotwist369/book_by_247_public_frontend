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
    let inTable = false
    let tableHeaderDone = false
    let inCodeBlock = false
    let codeBuffer: string[] = []

    const closeList = () => {
        if (inList) {
            html.push("</ul>")
            inList = false
        }
    }

    const closeTable = () => {
        if (inTable) {
            html.push("</tbody></table></div>")
            inTable = false
            tableHeaderDone = false
        }
    }

    for (const rawLine of lines) {
        const line = rawLine.trim()

        if (line.startsWith("```")) {
            closeList()
            closeTable()
            if (inCodeBlock) {
                html.push(`<pre class="my-6 rounded-2xl bg-zinc-950 p-4 text-xs font-mono text-zinc-100 overflow-x-auto shadow-md"><code>${escapeHtml(codeBuffer.join("\n"))}</code></pre>`)
                codeBuffer = []
                inCodeBlock = false
            } else {
                inCodeBlock = true
            }
            continue
        }

        if (inCodeBlock) {
            codeBuffer.push(rawLine)
            continue
        }

        // Markdown Table Processing (| Col 1 | Col 2 |)
        if (line.startsWith("|") && line.endsWith("|")) {
            closeList()
            const cells = line.split("|").slice(1, -1).map((c) => c.trim())

            // Divider row check (| --- | --- |)
            if (cells.every((c) => /^:?-+:?$/.test(c))) {
                continue
            }

            if (!inTable) {
                inTable = true
                html.push('<div class="my-8 overflow-x-auto rounded-2xl border border-zinc-200 bg-white shadow-xs"><table class="w-full text-left text-sm text-zinc-700">')
                html.push('<thead class="bg-zinc-100/80 font-semibold text-zinc-900 border-b border-zinc-200"><tr>')
                cells.forEach((cell) => {
                    html.push(`<th class="px-4 py-3">${inlineMarkdown(cell)}</th>`)
                })
                html.push('</tr></thead><tbody class="divide-y divide-zinc-100">')
                tableHeaderDone = true
                continue
            }

            html.push('<tr class="hover:bg-zinc-50/50 transition-colors">')
            cells.forEach((cell) => {
                html.push(`<td class="px-4 py-3">${inlineMarkdown(cell)}</td>`)
            })
            html.push('</tr>')
            continue
        } else {
            closeTable()
        }

        if (!line) {
            closeList()
            continue
        }

        if (/^(-{3,}|\*{3,}|_{3,})$/.test(line)) {
            closeList()
            html.push('<hr class="my-10 border-0 border-t border-zinc-200" />')
            continue
        }

        // Image match: ![alt](url)
        const imgMatch = /^!\[(.*?)\]\((.*?)\)$/.exec(line)
        if (imgMatch) {
            closeList()
            const alt = escapeHtml(imgMatch[1] || "Article Image")
            const src = imgMatch[2]
            html.push(`
                <figure class="my-8 overflow-hidden rounded-2xl border border-zinc-200/80 bg-zinc-50 shadow-sm">
                    <img src="${src}" alt="${alt}" class="w-full h-auto max-h-[550px] object-cover" />
                    ${alt ? `<figcaption class="p-3 text-center text-xs font-medium text-zinc-500 italic border-t border-zinc-100">${alt}</figcaption>` : ""}
                </figure>
            `)
            continue
        }

        if (line.startsWith("### ")) {
            closeList()
            html.push(`<h3 id="${slugifyText(line.slice(4))}" class="mt-8 text-xl font-bold tracking-tight text-zinc-950">${inlineMarkdown(line.slice(4))}</h3>`)
            continue
        }
        if (line.startsWith("## ")) {
            closeList()
            html.push(`<h2 id="${slugifyText(line.slice(3))}" class="mt-10 text-2xl font-bold tracking-tight text-zinc-950">${inlineMarkdown(line.slice(3))}</h2>`)
            continue
        }
        if (line.startsWith("# ")) {
            closeList()
            html.push(`<h1 id="${slugifyText(line.slice(2))}" class="mt-10 text-3xl font-bold tracking-tight text-zinc-950">${inlineMarkdown(line.slice(2))}</h1>`)
            continue
        }
        if (line.startsWith("- ") || line.startsWith("* ")) {
            if (!inList) {
                html.push('<ul class="my-6 list-disc space-y-2.5 pl-6 text-zinc-700 font-medium">')
                inList = true
            }
            html.push(`<li>${inlineMarkdown(line.slice(2))}</li>`)
            continue
        }

        // Callout box variations
        if (line.startsWith("> 💡") || line.startsWith("> Pro Tip") || line.startsWith("> Note:")) {
            closeList()
            html.push(`<div class="my-6 flex gap-3 rounded-2xl border border-amber-200 bg-amber-50/90 p-4 text-sm font-medium text-amber-950 leading-relaxed shadow-xs">${inlineMarkdown(line.slice(2))}</div>`)
            continue
        }
        if (line.startsWith("> 📌") || line.startsWith("> Key Takeaway") || line.startsWith("> Summary:")) {
            closeList()
            html.push(`<div class="my-6 flex gap-3 rounded-2xl border border-indigo-200 bg-indigo-50/90 p-4 text-sm font-medium text-indigo-950 leading-relaxed shadow-xs">${inlineMarkdown(line.slice(2))}</div>`)
            continue
        }
        if (line.startsWith("> ⚠️") || line.startsWith("> Warning") || line.startsWith("> Caution:")) {
            closeList()
            html.push(`<div class="my-6 flex gap-3 rounded-2xl border border-rose-200 bg-rose-50/90 p-4 text-sm font-medium text-rose-950 leading-relaxed shadow-xs">${inlineMarkdown(line.slice(2))}</div>`)
            continue
        }

        if (line.startsWith("> ")) {
            closeList()
            html.push(`<blockquote class="my-6 border-l-4 border-zinc-900 pl-4 py-1 italic font-serif text-lg text-zinc-800">${inlineMarkdown(line.slice(2))}</blockquote>`)
            continue
        }

        closeList()
        html.push(`<p class="my-4 text-base leading-8 text-zinc-800 font-normal">${inlineMarkdown(line)}</p>`)
    }

    closeList()
    closeTable()
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
