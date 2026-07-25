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
import { markdownToHtml } from "@/lib/blog-utils"
import { Upload, Image as ImageIcon, Trash2 } from "lucide-react"

export default function CreateBlogPage() {
    const { user, isAuthenticated, isReady } = useBlogAuth()
    const router = useRouter()

    const [mode, setMode] = useState<"edit" | "preview">("edit")
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)

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

    const [allCategories, setAllCategories] = useState<BlogTaxonomy[]>([])
    const [allTags, setAllTags] = useState<BlogTaxonomy[]>([])

    const [submitting, setSubmitting] = useState(false)
    const [uploadingImage, setUploadingImage] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [successMessage, setSuccessMessage] = useState("")

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
    const slug = title.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")

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

            setSuccessMessage("Article published successfully!")

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

    return (
        <div className="min-h-screen bg-white">
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
            />

            {/* Main Canvas & Inspector Drawer Container */}
            <div className="flex">
                <main className={`flex-1 transition-all ${isSidebarOpen ? "pr-0 sm:pr-80 lg:pr-96" : ""}`}>
                    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-8">
                        {errorMessage && (
                            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                                {errorMessage}
                            </div>
                        )}
                        {successMessage && (
                            <div className="mb-6 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">
                                {successMessage}
                            </div>
                        )}

                        {mode === "edit" ? (
                            <div className="space-y-6">
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
                                <div className="sticky top-16 z-30 pt-2 pb-1">
                                    <WpEditorToolbar onInsertText={handleInsertText} />
                                </div>

                                {/* Markdown Content Body Editor */}
                                <div>
                                    <textarea
                                        ref={textareaRef}
                                        rows={18}
                                        value={markdown}
                                        onChange={(e) => setMarkdown(e.target.value)}
                                        placeholder="Start writing your article content in Markdown format..."
                                        className="w-full rounded-2xl border border-gray-200 bg-white p-5 font-mono text-sm leading-relaxed text-gray-800 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                                    />
                                </div>
                            </div>
                        ) : (
                            /* Live Article Preview Tab */
                            <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-10 shadow-sm space-y-6">
                                <div className="border-b border-gray-100 pb-4 flex items-center justify-between">
                                    <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Live Reader Preview</span>
                                    <span className="text-xs text-gray-500">{readingTimeMinutes} min read</span>
                                </div>

                                {featuredImageUrl && (
                                    <figure className="relative aspect-[16/9] w-full overflow-hidden rounded-xl">
                                        <img src={featuredImageUrl} alt={title} className="h-full w-full object-cover" />
                                    </figure>
                                )}

                                <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
                                    {title || "Untitled Article"}
                                </h1>

                                {excerpt && (
                                    <p className="text-lg text-gray-600 leading-relaxed italic border-l-2 border-black pl-4">
                                        {excerpt}
                                    </p>
                                )}

                                <div className="prose prose-zinc max-w-none text-base leading-relaxed text-gray-800 border-t border-gray-100 pt-6">
                                    <div dangerouslySetInnerHTML={{ __html: markdownToHtml(markdown) }} />
                                </div>
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
