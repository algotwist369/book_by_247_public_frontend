"use client"

import { useState } from "react"
import { X, Search, Globe, Tag as TagIcon, Folder, FileText } from "lucide-react"
import type { BlogTaxonomy } from "@/lib/blog-types"

import { blogApi } from "@/api/public/blog"

interface WpEditorSidebarProps {
    isOpen: boolean
    onClose: () => void
    status: "draft" | "published"
    onChangeStatus: (status: "draft" | "published") => void
    visibility: "public" | "private"
    onChangeVisibility: (visibility: "public" | "private") => void
    categories: BlogTaxonomy[]
    selectedCategories: string[]
    onChangeCategories: (categories: string[]) => void
    tags: BlogTaxonomy[]
    selectedTags: string[]
    onChangeTags: (tags: string[]) => void
    metaTitle: string
    onChangeMetaTitle: (val: string) => void
    metaDescription: string
    onChangeMetaDescription: (val: string) => void
    title: string
    excerpt: string
    slug: string
    onRefreshTaxonomies?: () => void
}

export function WpEditorSidebar({
    isOpen,
    onClose,
    status,
    onChangeStatus,
    visibility,
    onChangeVisibility,
    categories,
    selectedCategories,
    onChangeCategories,
    tags,
    selectedTags,
    onChangeTags,
    metaTitle,
    onChangeMetaTitle,
    metaDescription,
    onChangeMetaDescription,
    title,
    excerpt,
    slug,
    onRefreshTaxonomies,
}: WpEditorSidebarProps) {
    const [categoryQuery, setCategoryQuery] = useState("")
    const [tagQuery, setTagQuery] = useState("")
    const [activeTab, setActiveTab] = useState<"document" | "seo">("document")
    const [creatingCategory, setCreatingCategory] = useState(false)
    const [creatingTag, setCreatingTag] = useState(false)

    if (!isOpen) return null

    const handleCreateCategory = async () => {
        if (!categoryQuery.trim()) return
        setCreatingCategory(true)
        try {
            const res = await blogApi.createCategory({ name: categoryQuery.trim() })
            if (res.data?.id || res.data?._id) {
                const id = res.data.id || res.data._id || ""
                onChangeCategories([...selectedCategories, id])
                setCategoryQuery("")
                onRefreshTaxonomies?.()
            }
        } catch (err: any) {
            alert(err.message || "Failed to create category")
        } finally {
            setCreatingCategory(false)
        }
    }

    const handleCreateTag = async () => {
        if (!tagQuery.trim()) return
        setCreatingTag(true)
        try {
            const res = await blogApi.createTag({ name: tagQuery.trim() })
            if (res.data?.id || res.data?._id) {
                const id = res.data.id || res.data._id || ""
                onChangeTags([...selectedTags, id])
                setTagQuery("")
                onRefreshTaxonomies?.()
            }
        } catch (err: any) {
            alert(err.message || "Failed to create tag")
        } finally {
            setCreatingTag(false)
        }
    }

    const filteredCategories = categories.filter((c) =>
        c.name.toLowerCase().includes(categoryQuery.toLowerCase())
    )

    const filteredTags = tags.filter((t) =>
        t.name.toLowerCase().includes(tagQuery.toLowerCase())
    )

    const toggleCategory = (id: string) => {
        if (selectedCategories.includes(id)) {
            onChangeCategories(selectedCategories.filter((item) => item !== id))
        } else {
            onChangeCategories([...selectedCategories, id])
        }
    }

    const toggleTag = (id: string) => {
        if (selectedTags.includes(id)) {
            onChangeTags(selectedTags.filter((item) => item !== id))
        } else {
            onChangeTags([...selectedTags, id])
        }
    }

    const displayTitle = metaTitle || title || "Article Title Preview"
    const displayDesc = metaDescription || excerpt || "Write a brief description or meta snippet for search engine previews..."
    const displayUrl = `https://bookby247.com/blog/${slug || "article-slug"}`

    return (
        <aside className="fixed inset-y-0 right-0 z-50 w-full max-w-xs sm:max-w-sm border-l border-gray-200 bg-white shadow-2xl flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
                <div className="flex rounded-lg bg-gray-100 p-1 text-xs font-semibold">
                    <button
                        type="button"
                        onClick={() => setActiveTab("document")}
                        className={`rounded-md px-3 py-1 transition-all ${
                            activeTab === "document" ? "bg-white text-black shadow-sm" : "text-gray-600"
                        }`}
                    >
                        Post Settings
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab("seo")}
                        className={`rounded-md px-3 py-1 transition-all ${
                            activeTab === "seo" ? "bg-white text-black shadow-sm" : "text-gray-600"
                        }`}
                    >
                        SEO & SERP
                    </button>
                </div>
                <button
                    type="button"
                    onClick={onClose}
                    className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-black transition-colors"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {activeTab === "document" ? (
                    <>
                        {/* Status & Visibility */}
                        <div className="space-y-3">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                                <FileText className="h-3.5 w-3.5" /> Publish Settings
                            </h3>

                            <div className="space-y-2 text-xs">
                                <div>
                                    <label className="block text-gray-600 font-medium mb-1">Post Status</label>
                                    <select
                                        value={status}
                                        onChange={(e) => onChangeStatus(e.target.value as any)}
                                        className="w-full rounded-lg border border-gray-300 p-2 font-medium focus:border-black focus:outline-none"
                                    >
                                        <option value="published">Published</option>
                                        <option value="draft">Draft</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-gray-600 font-medium mb-1">Visibility</label>
                                    <select
                                        value={visibility}
                                        onChange={(e) => onChangeVisibility(e.target.value as any)}
                                        className="w-full rounded-lg border border-gray-300 p-2 font-medium focus:border-black focus:outline-none"
                                    >
                                        <option value="public">Public</option>
                                        <option value="private">Private</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <hr className="border-gray-100" />

                        {/* Categories Selector */}
                        <div className="space-y-3">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                                <Folder className="h-3.5 w-3.5" /> Categories ({selectedCategories.length})
                            </h3>

                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-gray-400" />
                                <input
                                    type="text"
                                    value={categoryQuery}
                                    onChange={(e) => setCategoryQuery(e.target.value)}
                                    placeholder="Filter categories..."
                                    className="w-full rounded-lg border border-gray-200 pl-8 pr-3 py-1.5 text-xs focus:border-black focus:outline-none"
                                />
                            </div>

                            <div className="max-h-40 overflow-y-auto space-y-1 pr-1">
                                {filteredCategories.map((cat) => {
                                    const id = cat.id || cat._id || ""
                                    const isSelected = selectedCategories.includes(id)
                                    return (
                                        <label
                                            key={id}
                                            className={`flex items-center gap-2 rounded-lg p-2 text-xs font-medium cursor-pointer transition-colors ${
                                                isSelected ? "bg-black text-white" : "hover:bg-gray-100 text-gray-800"
                                            }`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={isSelected}
                                                onChange={() => toggleCategory(id)}
                                                className="sr-only"
                                            />
                                            <span className="truncate">{cat.name}</span>
                                        </label>
                                    )
                                })}

                                {categoryQuery.trim() && !categories.some(c => c.name.toLowerCase() === categoryQuery.trim().toLowerCase()) && (
                                    <button
                                        type="button"
                                        onClick={handleCreateCategory}
                                        disabled={creatingCategory}
                                        className="w-full text-left rounded-lg border border-dashed border-gray-300 p-2 text-xs font-semibold text-black hover:bg-gray-50 transition-colors"
                                    >
                                        + Create Category "{categoryQuery.trim()}"
                                    </button>
                                )}
                            </div>
                        </div>

                        <hr className="border-gray-100" />

                        {/* Tags Selector */}
                        <div className="space-y-3">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                                <TagIcon className="h-3.5 w-3.5" /> Tags ({selectedTags.length})
                            </h3>

                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-gray-400" />
                                <input
                                    type="text"
                                    value={tagQuery}
                                    onChange={(e) => setTagQuery(e.target.value)}
                                    placeholder="Filter tags..."
                                    className="w-full rounded-lg border border-gray-200 pl-8 pr-3 py-1.5 text-xs focus:border-black focus:outline-none"
                                />
                            </div>

                            <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto pr-1">
                                {filteredTags.map((tag) => {
                                    const id = tag.id || tag._id || ""
                                    const isSelected = selectedTags.includes(id)
                                    return (
                                        <button
                                            key={id}
                                            type="button"
                                            onClick={() => toggleTag(id)}
                                            className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition-all ${
                                                isSelected
                                                    ? "bg-black text-white shadow-xs"
                                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                            }`}
                                        >
                                            #{tag.name}
                                        </button>
                                    )
                                })}

                                {tagQuery.trim() && !tags.some(t => t.name.toLowerCase() === tagQuery.trim().toLowerCase()) && (
                                    <button
                                        type="button"
                                        onClick={handleCreateTag}
                                        disabled={creatingTag}
                                        className="rounded-full border border-dashed border-gray-400 px-2.5 py-1 text-[11px] font-semibold text-black hover:bg-gray-100 transition-colors"
                                    >
                                        + Create Tag "#{tagQuery.trim()}"
                                    </button>
                                )}
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        {/* SEO & SERP Inspector */}
                        <div className="space-y-4">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                                <Globe className="h-3.5 w-3.5" /> Google Search SERP Preview
                            </h3>

                            {/* Google Search Card Preview */}
                            <div className="rounded-xl border border-gray-200 bg-gray-50 p-3.5 space-y-1 font-sans text-xs">
                                <div className="flex items-center gap-1.5 text-[11px] text-gray-600">
                                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-100 text-[9px] font-bold text-blue-700">G</span>
                                    <span className="truncate">{displayUrl}</span>
                                </div>
                                <p className="text-sm font-semibold text-blue-700 hover:underline cursor-pointer truncate">
                                    {displayTitle}
                                </p>
                                <p className="text-[11px] leading-relaxed text-gray-600 line-clamp-2">
                                    {displayDesc}
                                </p>
                            </div>

                            <div className="space-y-3 pt-2">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                                        SEO Meta Title ({metaTitle.length}/60)
                                    </label>
                                    <input
                                        type="text"
                                        maxLength={60}
                                        value={metaTitle}
                                        onChange={(e) => onChangeMetaTitle(e.target.value)}
                                        placeholder="Custom Google Search title..."
                                        className="w-full rounded-lg border border-gray-300 p-2 text-xs focus:border-black focus:outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                                        SEO Meta Description ({metaDescription.length}/160)
                                    </label>
                                    <textarea
                                        rows={3}
                                        maxLength={160}
                                        value={metaDescription}
                                        onChange={(e) => onChangeMetaDescription(e.target.value)}
                                        placeholder="Custom description snippet for Google..."
                                        className="w-full rounded-lg border border-gray-300 p-2 text-xs focus:border-black focus:outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </aside>
    )
}
