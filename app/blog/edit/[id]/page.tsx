"use client"

import { useState, type FormEvent, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { blogApi } from "@/api/public/blog"
import { useBlogAuth } from "@/hooks/useBlogAuth"
import type { BlogArticle, BlogTaxonomy } from "@/lib/blog-types"

interface EditPageProps {
    params: Promise<{ id: string }>
}

export default function EditBlogPage({ params }: EditPageProps) {
    const { id } = use(params)
    const { isAuthenticated, isReady } = useBlogAuth()
    const router = useRouter()

    const [loading, setLoading] = useState(true)
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
    const [deleting, setDeleting] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [successMessage, setSuccessMessage] = useState("")

    useEffect(() => {
        if (!id) return
        Promise.all([
            blogApi.getBlogBySlug(id).catch(() => null),
            blogApi.getCategories().catch(() => ({ data: [] })),
            blogApi.getTags().catch(() => ({ data: [] })),
        ]).then(([blogRes, catRes, tagRes]) => {
            setAllCategories(catRes.data)
            setAllTags(tagRes.data)

            if (blogRes?.data) {
                const b = blogRes.data
                setTitle(b.title || "")
                setExcerpt(b.excerpt || "")
                setMarkdown(b.content?.markdown || "")
                setStatus((b.status as any) || "published")
                setSelectedCategories((b.categories || []).map((c) => c.id || c._id || "").filter(Boolean))
                setSelectedTags((b.tags || []).map((t) => t.id || t._id || "").filter(Boolean))
                setFeaturedImageUrl(b.featuredImage?.url || "")
                setFeaturedImageAlt(b.featuredImage?.alt || "")
            } else {
                setErrorMessage("Article not found or access denied.")
            }
            setLoading(false)
        })
    }, [id])

    if (!isReady || loading) {
        return <div className="py-20 text-center text-sm text-gray-500">Loading article data...</div>
    }

    if (!isAuthenticated) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900">Sign in required</h1>
                <p className="mt-2 text-sm text-gray-600">You must be signed in to edit this post.</p>
                <Link href="/blog/profile" className="mt-6 rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white">
                    Sign In
                </Link>
            </div>
        )
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setSubmitting(true)
        setErrorMessage("")
        setSuccessMessage("")

        try {
            await blogApi.updateBlog(id, {
                title,
                excerpt,
                content: { markdown },
                categories: selectedCategories,
                tags: selectedTags,
                status,
                featuredImage: featuredImageUrl
                    ? { url: featuredImageUrl, alt: featuredImageAlt || title }
                    : undefined,
            })

            setSuccessMessage("Article updated successfully!")
            setTimeout(() => {
                router.push("/blog")
            }, 1500)
        } catch (err: any) {
            setErrorMessage(err.message || "Failed to update article.")
        } finally {
            setSubmitting(false)
        }
    }

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this article? This action cannot be undone.")) return

        setDeleting(true)
        try {
            await blogApi.deleteBlog(id)
            router.push("/blog")
        } catch (err: any) {
            setErrorMessage(err.message || "Failed to delete article.")
            setDeleting(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50/50 py-10 px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Edit Article</h1>
                        <p className="text-sm text-gray-600">Update or remove post.</p>
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
                        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">Title *</label>
                        <input
                            type="text"
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="mt-1 block w-full rounded-xl border border-gray-300 px-4 py-3 text-base font-medium focus:border-black focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">Excerpt</label>
                        <textarea
                            rows={2}
                            value={excerpt}
                            onChange={(e) => setExcerpt(e.target.value)}
                            className="mt-1 block w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-black focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">Markdown Content</label>
                        <textarea
                            rows={12}
                            required
                            value={markdown}
                            onChange={(e) => setMarkdown(e.target.value)}
                            className="mt-1 block w-full font-mono rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-black focus:outline-none"
                        />
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={handleDelete}
                            disabled={deleting}
                            className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-xs font-semibold text-red-700 hover:bg-red-100 disabled:opacity-50 transition-colors"
                        >
                            {deleting ? "Deleting..." : "Delete Article"}
                        </button>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-50 transition-colors"
                        >
                            {submitting ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
