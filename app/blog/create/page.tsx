"use client"

import { useState, type FormEvent, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { blogApi } from "@/api/public/blog"
import { useBlogAuth } from "@/hooks/useBlogAuth"
import type { BlogArticle, BlogTaxonomy } from "@/lib/blog-types"
import { ReaderAuthorAccessGate } from "@/components/blog/ReaderAuthorAccessGate"
import { WpEditorHeader } from "@/components/blog/editor/WpEditorHeader"
import { WpEditorToolbar } from "@/components/blog/editor/WpEditorToolbar"
import { WpEditorSidebar } from "@/components/blog/editor/WpEditorSidebar"
import { LuomoAiModal } from "@/components/blog/editor/LuomoAiModal"
import { markdownToHtml, extractHeadings } from "@/lib/blog-utils"
import {
    Upload,
    Image as ImageIcon,
    Trash2,
    Sparkles,
    CheckCircle2,
    TrendingUp,
    List,
    HelpCircle,
    Loader2,
    Zap,
    PenTool
} from "lucide-react"

export default function CreateBlogPage() {
    const { user, isAuthenticated, isReady } = useBlogAuth()
    const router = useRouter()

    const [mode, setMode] = useState<"edit" | "preview">("edit")
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)
    const [isLuomoModalOpen, setIsLuomoModalOpen] = useState(false)

    // Editor Content State
    const [title, setTitle] = useState("")
    const [excerpt, setExcerpt] = useState("")
    const [markdown, setMarkdown] = useState("")
    const [status, setStatus] = useState<"draft" | "published">("published")
    const [visibility, setVisibility] = useState<"public" | "private">("public")
    const [selectedCategories, setSelectedCategories] = useState<string[]>([])
    const [selectedTags, setSelectedTags] = useState<string[]>([])

    const [featuredImageUrl, setFeaturedImageUrl] = useState("")
    const [featuredImageAlt, setFeaturedImageAlt] = useState("")

    const [metaTitle, setMetaTitle] = useState("")
    const [metaDescription, setMetaDescription] = useState("")
    const [schemaFaqs, setSchemaFaqs] = useState<Array<{ question: string; answer: string }>>([])

    const [allCategories, setAllCategories] = useState<BlogTaxonomy[]>([])
    const [allTags, setAllTags] = useState<BlogTaxonomy[]>([])

    const [submitting, setSubmitting] = useState(false)
    const [uploadingImage, setUploadingImage] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [successMessage, setSuccessMessage] = useState("")

    // Live AI Stream Writing State
    const [isGeneratingAi, setIsGeneratingAi] = useState(false)
    const [isWritingLive, setIsWritingLive] = useState(false)
    const [aiStatusText, setAiStatusText] = useState("")

    const textareaRef = useRef<HTMLTextAreaElement>(null)

    useEffect(() => {
        blogApi.getCategories().then((res) => setAllCategories(res.data)).catch(() => {})
        blogApi.getTags().then((res) => setAllTags(res.data)).catch(() => {})
    }, [])

    if (!isReady) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-black" />
            </div>
        )
    }

    if (!isAuthenticated || !user) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900">Sign in to write articles</h1>
                <button
                    onClick={() => router.push("/blog/login")}
                    className="mt-6 rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white hover:bg-gray-800 transition-colors"
                >
                    Sign In
                </button>
            </div>
        )
    }

    // Role check: Readers are gated!
    const isAllowedAuthor = user.role && user.role !== "reader"
    if (!isAllowedAuthor) {
        return <ReaderAuthorAccessGate />
    }

    const wordsCount = markdown.trim() ? markdown.trim().split(/\s+/).length : 0
    const readingTimeMinutes = Math.max(1, Math.ceil(wordsCount / 200))
    const headings = extractHeadings(markdown)
    const slug = title.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")

    // Live SEO Quality Score Calculation (0-100%)
    let seoScore = 0
    if (title.trim().length >= 20) seoScore += 20
    if (excerpt.trim().length >= 40) seoScore += 20
    if (wordsCount >= 600) seoScore += 25
    else if (wordsCount >= 300) seoScore += 15
    if (headings.length >= 2) seoScore += 15
    if (selectedCategories.length > 0) seoScore += 10
    if (metaTitle.trim() && metaDescription.trim()) seoScore += 10

    const handleInsertText = (prefix: string, suffix = "", defaultText = "") => {
        const textarea = textareaRef.current
        if (!textarea) return

        const start = textarea.selectionStart
        const end = textarea.selectionEnd
        const selectedText = markdown.substring(start, end) || defaultText

        const replacement = `${prefix}${selectedText}${suffix}`
        const nextMarkdown = markdown.substring(0, start) + replacement + markdown.substring(end)

        setMarkdown(nextMarkdown)

        setTimeout(() => {
            textarea.focus()
            textarea.setSelectionRange(start + prefix.length, start + prefix.length + selectedText.length)
        }, 10)
    }

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setUploadingImage(true)
        setErrorMessage("")

        try {
            const formData = new FormData()
            formData.append("file", file)
            formData.append("alt", featuredImageAlt || title || "Featured banner image")

            const response = await blogApi.uploadMedia(formData)
            if (response.data?.url) {
                setFeaturedImageUrl(response.data.url)
            }
        } catch (err: any) {
            setErrorMessage(err.message || "Image upload failed. Ensure S3 configuration is valid.")
        } finally {
            setUploadingImage(false)
        }
    }

    const handlePublish = async () => {
        if (!title.trim() || !markdown.trim()) {
            setErrorMessage("Please enter an article title and content body.")
            return
        }

        setSubmitting(true)
        setErrorMessage("")
        setSuccessMessage("")

        try {
            const response = await blogApi.createBlog({
                title,
                excerpt,
                content: {
                    markdown,
                },
                categories: selectedCategories,
                tags: selectedTags,
                status,
                visibility,
                featuredImage: featuredImageUrl
                    ? { url: featuredImageUrl, alt: featuredImageAlt || title }
                    : undefined,
                seo: {
                    metaTitle: metaTitle || title,
                    metaDescription: metaDescription || excerpt,
                },
            })

            setSuccessMessage("High-ranking article published successfully!")

            if (response.data?.slug && status === "published" && visibility === "public") {
                fetch("/api/indexnow", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ urls: [`https://bookby247.com/blog/${response.data.slug}`] }),
                }).catch(() => {})
            }

            setTimeout(() => {
                router.push(`/blog/${response.data.slug}`)
            }, 1200)
        } catch (err: any) {
            setErrorMessage(err.message || "Publishing failed. Please check permissions or input data.")
        } finally {
            setSubmitting(false)
        }
    }

    // Typewriter effect streaming markdown into canvas
    const streamMarkdownLive = async (fullText: string) => {
        setIsWritingLive(true)
        setMarkdown("")

        const chunkSize = 20
        let currentIdx = 0

        return new Promise<void>((resolve) => {
            const interval = setInterval(() => {
                currentIdx += chunkSize
                if (currentIdx >= fullText.length) {
                    setMarkdown(fullText)
                    clearInterval(interval)
                    setIsWritingLive(false)
                    resolve()
                } else {
                    setMarkdown(fullText.slice(0, currentIdx))
                }
            }, 12)
        })
    }

    // Trigger AI generation & live typewriter writing on canvas
    const handleStartLuomoGenerating = async (payload: {
        title: string
        subtitle: string
        selectedCategoryIds: string[]
        selectedTagIds: string[]
        tone: string
        categoryNames: string[]
        tagNames: string[]
    }) => {
        setIsGeneratingAi(true)
        setErrorMessage("")
        setSuccessMessage("")
        setAiStatusText("Connecting to Luomo AI Engine...")

        if (payload.title) setTitle(payload.title)
        if (payload.subtitle) setExcerpt(payload.subtitle)

        if (payload.selectedCategoryIds.length > 0) {
            setSelectedCategories((prev) => Array.from(new Set([...prev, ...payload.selectedCategoryIds])))
        }
        if (payload.selectedTagIds.length > 0) {
            setSelectedTags((prev) => Array.from(new Set([...prev, ...payload.selectedTagIds])))
        }

        try {
            setAiStatusText("Luomo AI is researching & structuring high-ranking sections...")
            const res = await blogApi.generateAiBlog({
                title: payload.title,
                subtitle: payload.subtitle,
                categoryNames: payload.categoryNames,
                tagNames: payload.tagNames,
                tone: payload.tone,
            })

            if (res.data) {
                if (res.data.title) setTitle(res.data.title)
                if (res.data.excerpt) setExcerpt(res.data.excerpt)
                if (res.data.seo?.metaTitle) setMetaTitle(res.data.seo.metaTitle)
                if (res.data.seo?.metaDescription) setMetaDescription(res.data.seo.metaDescription)
                if (res.data.schemaMarkup?.faq) setSchemaFaqs(res.data.schemaMarkup.faq)

                // Live typewriter stream writing onto canvas
                if (res.data.markdown) {
                    setAiStatusText("Luomo AI is writing your article live on canvas...")
                    await streamMarkdownLive(res.data.markdown)
                }

                setSuccessMessage("✨ Article generated and written live on canvas by Luomo AI!")
            }
        } catch (err: any) {
            setErrorMessage(err.message || "Luomo AI generation failed. Please check backend OpenAI API key.")
        } finally {
            setIsGeneratingAi(false)
            setAiStatusText("")
        }
    }

    return (
        <div className="min-h-screen bg-gray-50/50">
            {/* Gutenberg Header */}
            <WpEditorHeader
                title={title}
                isEditMode={mode === "edit"}
                onToggleMode={setMode}
                wordCount={wordsCount}
                readingTimeMinutes={readingTimeMinutes}
                isSubmitting={submitting}
                onPublish={handlePublish}
                isSidebarOpen={isSidebarOpen}
                onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                userRole={user.role}
                onOpenLuomoModal={() => setIsLuomoModalOpen(true)}
            />

            {/* Admin Only: Luomo AI Generation Modal */}
            {user.role === "admin" && (
                <LuomoAiModal
                    isOpen={isLuomoModalOpen}
                    onClose={() => setIsLuomoModalOpen(false)}
                    categories={allCategories}
                    tags={allTags}
                    onStartGenerating={handleStartLuomoGenerating}
                />
            )}

            {/* Main Canvas Workspace Container */}
            <div className="flex">
                <main className={`flex-1 transition-all ${isSidebarOpen ? "pr-0 sm:pr-80 lg:pr-96" : ""}`}>
                    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-8">
                        {errorMessage && (
                            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 shadow-xs">
                                {errorMessage}
                            </div>
                        )}
                        {successMessage && (
                            <div className="mb-6 flex items-center justify-between rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900 shadow-xs">
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                                    <span className="font-semibold">{successMessage}</span>
                                </div>
                            </div>
                        )}

                        {/* Top Live AI Writing Status Banner */}
                        {(isGeneratingAi || isWritingLive) && (
                            <div className="mb-6 flex items-center justify-between gap-3 rounded-2xl border border-indigo-200 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 p-4 text-indigo-950 shadow-xs animate-pulse">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/30">
                                        <Sparkles className="h-5 w-5 animate-spin text-amber-300" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-bold text-indigo-950">Luomo AI Live Generation</span>
                                            <span className="inline-flex items-center gap-1 rounded-full bg-indigo-200 px-2 py-0.5 text-[10px] font-bold text-indigo-900">
                                                <PenTool className="h-3 w-3 animate-bounce" /> Writing...
                                            </span>
                                        </div>
                                        <p className="text-xs text-indigo-700 font-mono mt-0.5">{aiStatusText || "Generating content live on canvas..."}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Top Canvas SEO Ranking Score Indicator Bar */}
                        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white p-3.5 shadow-xs">
                            <div className="flex items-center gap-2">
                                <div
                                    className={`flex h-8 w-8 items-center justify-center rounded-xl font-bold text-xs ${
                                        seoScore >= 80
                                            ? "bg-emerald-100 text-emerald-800"
                                            : seoScore >= 50
                                            ? "bg-amber-100 text-amber-800"
                                            : "bg-gray-100 text-gray-700"
                                    }`}
                                >
                                    {seoScore}%
                                </div>
                                <div>
                                    <span className="text-xs font-bold text-gray-900">SEO Ranking Score</span>
                                    <p className="text-[11px] text-gray-500">
                                        {seoScore >= 80
                                            ? "Ready to Rank #1 on Google"
                                            : seoScore >= 50
                                            ? "Good content depth, add subheadings & metadata"
                                            : "Add title, headings & detailed content"}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 text-xs font-semibold text-gray-600">
                                <span className="flex items-center gap-1">
                                    <TrendingUp className="h-3.5 w-3.5 text-indigo-600" />
                                    {headings.length} Headings
                                </span>
                                <span>·</span>
                                <span>{wordsCount} words</span>
                                <span>·</span>
                                <span>{readingTimeMinutes} min read</span>
                            </div>
                        </div>

                        {mode === "edit" ? (
                            <div className="rounded-3xl border border-gray-200 bg-white p-6 sm:p-10 shadow-sm space-y-6">
                                {/* Cover Banner Dropzone */}
                                <div className="group relative rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/60 p-6 transition-colors hover:border-gray-300">
                                    {featuredImageUrl ? (
                                        <div className="relative aspect-[21/9] w-full overflow-hidden rounded-xl bg-gray-100">
                                            <img
                                                src={featuredImageUrl}
                                                alt={featuredImageAlt || title}
                                                className="h-full w-full object-cover"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setFeaturedImageUrl("")}
                                                className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg bg-black/70 text-white hover:bg-black transition-colors"
                                                title="Remove cover image"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center text-center py-6">
                                            <ImageIcon className="h-10 w-10 text-gray-400 mb-2" />
                                            <p className="text-xs font-semibold text-gray-700">Set Featured Cover Image</p>
                                            <p className="text-[11px] text-gray-500 mt-0.5">High resolution landscape image for top of article</p>

                                            <div className="mt-4 flex items-center gap-3">
                                                <label className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-black px-4 py-2 text-xs font-semibold text-white hover:bg-gray-800 transition-colors">
                                                    <Upload className="h-3.5 w-3.5" />
                                                    <span>{uploadingImage ? "Uploading..." : "Upload File"}</span>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handleImageUpload}
                                                        disabled={uploadingImage}
                                                        className="hidden"
                                                    />
                                                </label>
                                                <span className="text-xs text-gray-400">or</span>
                                                <input
                                                    type="url"
                                                    value={featuredImageUrl}
                                                    onChange={(e) => setFeaturedImageUrl(e.target.value)}
                                                    placeholder="Paste Image URL..."
                                                    className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs focus:border-black focus:outline-none"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Article Title Input */}
                                <div>
                                    <textarea
                                        rows={1}
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="Article Title..."
                                        className="w-full resize-none bg-transparent font-serif text-3xl font-bold tracking-tight text-gray-900 placeholder-gray-300 focus:outline-none sm:text-4xl"
                                    />
                                </div>

                                {/* Excerpt Subtitle Input */}
                                <div>
                                    <textarea
                                        rows={2}
                                        value={excerpt}
                                        onChange={(e) => setExcerpt(e.target.value)}
                                        placeholder="Add a subtitle or brief overview excerpt..."
                                        className="w-full resize-none bg-transparent text-lg text-gray-600 placeholder-gray-300 focus:outline-none"
                                    />
                                </div>

                                {/* Floating / Sticky WYSIWYG Formatting Toolbar */}
                                <div className="sticky top-16 z-20 pt-2 pb-1">
                                    <WpEditorToolbar onInsertText={handleInsertText} />
                                </div>

                                {/* Markdown Content Body Editor with Live Typing Highlight */}
                                <div>
                                    <textarea
                                        ref={textareaRef}
                                        rows={18}
                                        value={markdown}
                                        onChange={(e) => setMarkdown(e.target.value)}
                                        placeholder="Start writing your article content in Markdown format..."
                                        className={`w-full rounded-2xl border bg-white p-5 font-mono text-sm leading-relaxed text-gray-800 transition-all focus:outline-none ${
                                            isWritingLive
                                                ? "border-indigo-500 ring-2 ring-indigo-500/30 bg-indigo-50/10"
                                                : "border-gray-200 focus:border-black focus:ring-1 focus:ring-black"
                                        }`}
                                    />
                                </div>
                            </div>
                        ) : (
                            /* Professional High-Ranking Article Preview */
                            <div className="rounded-3xl border border-gray-200 bg-white p-6 sm:p-12 shadow-sm space-y-8">
                                {/* Reader Header Bar */}
                                <div className="border-b border-gray-100 pb-4 flex items-center justify-between text-xs text-gray-500">
                                    <div className="flex items-center gap-2">
                                        <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 font-bold uppercase tracking-wider text-emerald-700 border border-emerald-200">
                                            High-Ranking Layout
                                        </span>
                                        <span>·</span>
                                        <span>By {user.name || "Author"}</span>
                                    </div>
                                    <span>{readingTimeMinutes} min read</span>
                                </div>

                                {/* Featured Image */}
                                {featuredImageUrl && (
                                    <figure className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl">
                                        <img src={featuredImageUrl} alt={title} className="h-full w-full object-cover" />
                                    </figure>
                                )}

                                {/* Article Title & Subtitle */}
                                <div>
                                    <h1 className="font-serif text-3xl sm:text-5xl font-extrabold tracking-tight text-gray-900 leading-tight">
                                        {title || "Untitled Article"}
                                    </h1>
                                    {excerpt && (
                                        <p className="mt-4 text-xl text-gray-600 leading-relaxed italic border-l-4 border-indigo-600 pl-4 py-1">
                                            {excerpt}
                                        </p>
                                    )}
                                </div>

                                {/* Interactive Table of Contents */}
                                {headings.length > 0 && (
                                    <div className="rounded-2xl border border-indigo-100 bg-indigo-50/50 p-5">
                                        <div className="flex items-center gap-2 font-bold text-sm text-indigo-950 mb-3">
                                            <List className="h-4 w-4 text-indigo-600" />
                                            <span>Table of Contents</span>
                                        </div>
                                        <ul className="space-y-1.5 text-xs text-indigo-900 font-medium">
                                            {headings.map((h) => (
                                                <li key={h.id} style={{ paddingLeft: `${(h.level - 2) * 12}px` }}>
                                                    <a href={`#${h.id}`} className="hover:underline hover:text-indigo-600">
                                                        {h.text}
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Article Content Body */}
                                <div className="prose prose-zinc max-w-none text-base leading-relaxed text-gray-800 border-t border-gray-100 pt-6">
                                    <div dangerouslySetInnerHTML={{ __html: markdownToHtml(markdown) }} />
                                </div>

                                {/* FAQ Section Preview if Present */}
                                {schemaFaqs.length > 0 && (
                                    <div className="mt-12 rounded-3xl border border-gray-200 bg-gray-50/80 p-6 sm:p-8">
                                        <div className="flex items-center gap-2 font-bold text-lg text-gray-900 mb-6">
                                            <HelpCircle className="h-5 w-5 text-indigo-600" />
                                            <span>Frequently Asked Questions</span>
                                        </div>
                                        <div className="space-y-4">
                                            {schemaFaqs.map((faq, idx) => (
                                                <div key={idx} className="rounded-2xl border border-gray-200 bg-white p-4">
                                                    <h4 className="font-bold text-sm text-gray-900">{faq.question}</h4>
                                                    <p className="mt-2 text-xs text-gray-600 leading-relaxed">{faq.answer}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </main>

                {/* Gutenberg Side Inspector Drawer */}
                <WpEditorSidebar
                    isOpen={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                    status={status}
                    onChangeStatus={setStatus}
                    visibility={visibility}
                    onChangeVisibility={setVisibility}
                    categories={allCategories}
                    selectedCategories={selectedCategories}
                    onChangeCategories={setSelectedCategories}
                    tags={allTags}
                    selectedTags={selectedTags}
                    onChangeTags={setSelectedTags}
                    metaTitle={metaTitle}
                    onChangeMetaTitle={setMetaTitle}
                    metaDescription={metaDescription}
                    onChangeMetaDescription={setMetaDescription}
                    title={title}
                    excerpt={excerpt}
                    slug={slug}
                    onRefreshTaxonomies={() => {
                        blogApi.getCategories().then((res) => setAllCategories(res.data)).catch(() => {})
                        blogApi.getTags().then((res) => setAllTags(res.data)).catch(() => {})
                    }}
                />
            </div>
        </div>
    )
}
