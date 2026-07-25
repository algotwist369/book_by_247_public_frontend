"use client"

import { useState, type FormEvent, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { blogApi } from "@/api/public/blog"
import { useBlogAuth } from "@/hooks/useBlogAuth"
import type { BlogTaxonomy } from "@/lib/blog-types"

export default function CreateBlogPage() {
    const { isAuthenticated, isReady } = useBlogAuth()
    const router = useRouter()

    const [title, setTitle] = useState("")
    const [excerpt, setExcerpt] = useState("")
    const [markdown, setMarkdown] = useState("")
    const [status, setStatus] = useState<"draft" | "published">("published")
    const [selectedCategories, setSelectedCategories] = useState<string[]>([])
    const [selectedTags, setSelectedTags] = useState<string[]>([])
    const [featuredImageUrl, setFeaturedImageUrl] = useState("")
    const [featuredImageAlt, setFeaturedImageAlt] = useState("")

    const [allCategories, setAllCategories] = useState<BlogTaxonomy[]>([])
    const [allTags, setAllTags] = useState<BlogTaxonomy[]>([])

    const [submitting, setSubmitting] = useState(false)
    const [uploadingImage, setUploadingImage] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [successMessage, setSuccessMessage] = useState("")

    useEffect(() => {
        blogApi.getCategories().then((res) => setAllCategories(res.data)).catch(() => {})
        blogApi.getTags().then((res) => setAllTags(res.data)).catch(() => {})
    }, [])

    if (!isReady) {
        return <div className="py-20 text-center text-sm text-gray-500">Loading...</div>
    }

    if (!isAuthenticated) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900">Sign in to write articles</h1>
                <p className="mt-2 text-sm text-gray-600">You must be logged in as an author or admin to publish new posts.</p>
                <Link
                    href="/blog/profile"
                    className="mt-6 rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white hover:bg-gray-800 transition-colors"
                >
                    Sign In / View Profile
                </Link>
            </div>
        )
    }

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setUploadingImage(true)
        setErrorMessage("")

        try {
            const formData = new FormData()
            formData.append("file", file)
            formData.append("alt", featuredImageAlt || title || "Featured image")

            const response = await blogApi.uploadMedia(formData)
            if (response.data?.url) {
                setFeaturedImageUrl(response.data.url)
            }
        } catch (err: any) {
            setErrorMessage(err.message || "Failed to upload image. Make sure AWS S3/media upload is configured.")
        } finally {
            setUploadingImage(false)
        }
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        if (!title.trim() || !markdown.trim()) {
            setErrorMessage("Title and content markdown are required.")
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
                visibility: "public",
                featuredImage: featuredImageUrl
                    ? { url: featuredImageUrl, alt: featuredImageAlt || title }
                    : undefined,
            })

            setSuccessMessage("Article published successfully!")
            setTimeout(() => {
                router.push(`/blog/${response.data.slug}`)
            }, 1500)
        } catch (err: any) {
            setErrorMessage(err.message || "Failed to create article. Please check your permissions or input data.")
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50/50 py-10 px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Create New Article</h1>
                        <p className="text-sm text-gray-600">Draft or publish a new editorial post.</p>
                    </div>
                    <Link href="/blog" className="text-xs font-semibold text-gray-600 hover:text-black">
                        &larr; Back to Blog
                    </Link>
                </div>

                <form onSubmit={handleSubmit} className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
                    {errorMessage && (
                        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                            {errorMessage}
                        </div>
                    )}
                    {successMessage && (
                        <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">
                            {successMessage}
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">Article Title *</label>
                        <input
                            type="text"
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. 10 Spa Treatments for Rejuvenation in 2026"
                            className="mt-1 block w-full rounded-xl border border-gray-300 px-4 py-3 text-base font-medium focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">Excerpt / Summary</label>
                        <textarea
                            rows={2}
                            value={excerpt}
                            onChange={(e) => setExcerpt(e.target.value)}
                            placeholder="Short overview sentence for article cards..."
                            className="mt-1 block w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">Featured Image</label>
                        <div className="mt-2 space-y-3">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="block w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                            />
                            {uploadingImage && <p className="text-xs text-gray-500">Uploading media image...</p>}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <input
                                    type="url"
                                    value={featuredImageUrl}
                                    onChange={(e) => setFeaturedImageUrl(e.target.value)}
                                    placeholder="Or paste Direct Image URL..."
                                    className="rounded-xl border border-gray-300 px-4 py-2.5 text-xs focus:border-black focus:outline-none"
                                />
                                <input
                                    type="text"
                                    value={featuredImageAlt}
                                    onChange={(e) => setFeaturedImageAlt(e.target.value)}
                                    placeholder="Alt text..."
                                    className="rounded-xl border border-gray-300 px-4 py-2.5 text-xs focus:border-black focus:outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">Markdown Body *</label>
                        <textarea
                            rows={14}
                            required
                            value={markdown}
                            onChange={(e) => setMarkdown(e.target.value)}
                            placeholder="## Section Title&#10;&#10;Write your article content in markdown format..."
                            className="mt-1 block w-full font-mono rounded-xl border border-gray-300 px-4 py-3 text-sm leading-relaxed focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">Categories</label>
                            <select
                                multiple
                                value={selectedCategories}
                                onChange={(e) =>
                                    setSelectedCategories(Array.from(e.target.selectedOptions, (opt) => opt.value))
                                }
                                className="mt-1 block w-full rounded-xl border border-gray-300 px-3 py-2 text-xs h-28 focus:border-black focus:outline-none"
                            >
                                {allCategories.map((cat) => (
                                    <option key={cat.id || cat._id} value={cat.id || cat._id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                            <p className="mt-1 text-[11px] text-gray-400">Hold Ctrl/Cmd to pick multiple</p>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">Tags</label>
                            <select
                                multiple
                                value={selectedTags}
                                onChange={(e) =>
                                    setSelectedTags(Array.from(e.target.selectedOptions, (opt) => opt.value))
                                }
                                className="mt-1 block w-full rounded-xl border border-gray-300 px-3 py-2 text-xs h-28 focus:border-black focus:outline-none"
                            >
                                {allTags.map((tag) => (
                                    <option key={tag.id || tag._id} value={tag.id || tag._id}>
                                        #{tag.name}
                                    </option>
                                ))}
                            </select>
                            <p className="mt-1 text-[11px] text-gray-400">Hold Ctrl/Cmd to pick multiple</p>
                        </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-center space-x-4">
                            <label className="text-xs font-semibold text-gray-700">Status:</label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value as "draft" | "published")}
                                className="rounded-xl border border-gray-300 px-3 py-1.5 text-xs focus:border-black focus:outline-none"
                            >
                                <option value="published">Published</option>
                                <option value="draft">Draft</option>
                            </select>
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-50 transition-colors"
                        >
                            {submitting ? "Publishing..." : "Publish Article"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
