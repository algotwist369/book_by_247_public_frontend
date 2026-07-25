"use client"

import { useState, type FormEvent, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useBlogAuth } from "@/hooks/useBlogAuth"
import { blogApi } from "@/api/public/blog"
import type { BlogArticle, BlogAuthor, BlogTaxonomy } from "@/lib/blog-types"
import { Users, FileText, FolderPlus, BarChart3, Settings, ShieldCheck, CheckCircle2, UserCheck, Trash2, Edit3 } from "lucide-react"

export default function BlogProfilePage() {
    const { user, isAuthenticated, isReady, updateProfile, logout } = useBlogAuth()
    const router = useRouter()

    const [activeTab, setActiveTab] = useState<"profile" | "users" | "blogs" | "taxonomies" | "analytics">("profile")

    // Profile form state
    const [name, setName] = useState("")
    const [bio, setBio] = useState("")
    const [website, setWebsite] = useState("")
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
    const [message, setMessage] = useState("")

    // Admin Users state
    const [usersList, setUsersList] = useState<BlogAuthor[]>([])
    const [loadingUsers, setLoadingUsers] = useState(false)
    const [updatingUserId, setUpdatingUserId] = useState<string | null>(null)

    // Admin Blogs state
    const [blogsList, setBlogsList] = useState<BlogArticle[]>([])
    const [loadingBlogs, setLoadingBlogs] = useState(false)

    // Taxonomies state
    const [categories, setCategories] = useState<BlogTaxonomy[]>([])
    const [tags, setTags] = useState<BlogTaxonomy[]>([])
    const [newCategoryName, setNewCategoryName] = useState("")
    const [newTagName, setNewTagName] = useState("")

    // Analytics state
    const [dashboardCounts, setDashboardCounts] = useState<{ blogs: number; pendingComments: number; subscribers: number } | null>(null)

    const isAdminOrEditor = user?.role === "admin" || user?.role === "editor"

    useEffect(() => {
        if (user) {
            setName(user.name || "")
            setBio(user.bio || "")
            setWebsite(user.socialLinks?.website || "")
        }
    }, [user])

    const fetchUsers = async () => {
        setLoadingUsers(true)
        try {
            const res = await blogApi.listUsers({ limit: 100 })
            setUsersList(res.data || [])
        } catch {
            setUsersList([])
        } finally {
            setLoadingUsers(false)
        }
    }

    const fetchBlogs = async () => {
        setLoadingBlogs(true)
        try {
            const res = await blogApi.listBlogs({ limit: 100 })
            setBlogsList(res.data || [])
        } catch {
            setBlogsList([])
        } finally {
            setLoadingBlogs(false)
        }
    }

    const fetchTaxonomies = async () => {
        try {
            const [cRes, tRes] = await Promise.all([blogApi.getCategories(), blogApi.getTags()])
            setCategories(cRes.data || [])
            setTags(tRes.data || [])
        } catch {}
    }

    const fetchDashboard = async () => {
        try {
            const res = await blogApi.getAdminDashboard()
            if (res.data?.counts) {
                setDashboardCounts(res.data.counts)
            }
        } catch {}
    }

    useEffect(() => {
        if (isAdminOrEditor) {
            if (activeTab === "users") fetchUsers()
            if (activeTab === "blogs") fetchBlogs()
            if (activeTab === "taxonomies") fetchTaxonomies()
            if (activeTab === "analytics") fetchDashboard()
        }
    }, [activeTab, isAdminOrEditor])

    if (!isReady) {
        return <div className="py-20 text-center text-sm text-gray-500">Loading profile...</div>
    }

    if (!isAuthenticated || !user) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900">Sign in to view your profile</h1>
                <p className="mt-2 text-sm text-gray-600">Access your saved articles, author dashboard, and profile settings.</p>
                <Link
                    href="/blog/login"
                    className="mt-6 rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white hover:bg-gray-800 transition-colors"
                >
                    Sign In
                </Link>
            </div>
        )
    }

    const handleSubmitProfile = async (e: FormEvent) => {
        e.preventDefault()
        setStatus("loading")
        setMessage("")

        try {
            await updateProfile({
                name,
                bio,
                socialLinks: {
                    ...user.socialLinks,
                    website,
                },
            })
            setStatus("success")
            setMessage("Profile details saved!")
        } catch (err: any) {
            setStatus("error")
            setMessage(err.message || "Failed to update profile.")
        }
    }

    const handleRoleChange = async (userId: string, newRole: string, requestStatus?: string) => {
        setUpdatingUserId(userId)
        try {
            await blogApi.updateUserRole(userId, { role: newRole, authorRequestStatus: requestStatus || "approved" })
            await fetchUsers()
        } catch (err: any) {
            alert(err.message || "Failed to update user role.")
        } finally {
            setUpdatingUserId(null)
        }
    }

    const handleCreateCategory = async (e: FormEvent) => {
        e.preventDefault()
        if (!newCategoryName.trim()) return
        try {
            await blogApi.createCategory({ name: newCategoryName.trim() })
            setNewCategoryName("")
            fetchTaxonomies()
        } catch (err: any) {
            alert(err.message || "Failed to create category")
        }
    }

    const handleCreateTag = async (e: FormEvent) => {
        e.preventDefault()
        if (!newTagName.trim()) return
        try {
            await blogApi.createTag({ name: newTagName.trim() })
            setNewTagName("")
            fetchTaxonomies()
        } catch (err: any) {
            alert(err.message || "Failed to create tag")
        }
    }

    const handleDeleteArticle = async (id: string) => {
        if (!confirm("Are you sure you want to delete this article?")) return
        try {
            await blogApi.deleteBlog(id)
            fetchBlogs()
        } catch (err: any) {
            alert(err.message || "Failed to delete article")
        }
    }

    const handleLogout = async () => {
        await logout()
        router.push("/blog")
    }

    return (
        <div className="min-h-screen bg-gray-50/50 py-10 px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-5xl space-y-8">
                {/* Profile Header Banner */}
                <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                    <div className="flex items-center space-x-4">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black text-2xl font-bold text-white uppercase shadow-sm">
                            {user.name ? user.name[0] : "U"}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-2xl font-bold tracking-tight text-gray-900">{user.name}</h1>
                                {isAdminOrEditor && (
                                    <span title="Admin/Editor Verified">
                                        <ShieldCheck className="h-5 w-5 text-purple-600" />
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center space-x-2 mt-1">
                                <span className="text-xs text-gray-500">@{user.username || "user"}</span>
                                <span
                                    className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                                        isAdminOrEditor
                                            ? "bg-purple-100 text-purple-800"
                                            : user.role === "author"
                                            ? "bg-blue-100 text-blue-800"
                                            : "bg-gray-100 text-gray-700"
                                    }`}
                                >
                                    {user.role || "reader"}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center space-x-3 w-full sm:w-auto">
                        <Link
                            href="/blog/create"
                            className="flex-1 sm:flex-initial rounded-xl bg-black px-4 py-2.5 text-center text-xs font-semibold text-white hover:bg-gray-800 transition-colors shadow-sm"
                        >
                            {user.role && user.role !== "reader" ? "+ Write Article" : "Request Author Access"}
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="flex-1 sm:flex-initial rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                </div>

                {/* Tab Navigation for Admin / Editor / Author */}
                <div className="flex overflow-x-auto no-scrollbar gap-2 border-b border-gray-200 pb-2">
                    <button
                        onClick={() => setActiveTab("profile")}
                        className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition-all ${
                            activeTab === "profile" ? "bg-black text-white shadow-xs" : "bg-white text-gray-600 hover:bg-gray-100"
                        }`}
                    >
                        <Settings className="h-4 w-4" /> Profile Settings
                    </button>

                    {isAdminOrEditor && (
                        <>
                            <button
                                onClick={() => setActiveTab("users")}
                                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition-all ${
                                    activeTab === "users" ? "bg-black text-white shadow-xs" : "bg-white text-gray-600 hover:bg-gray-100"
                                }`}
                            >
                                <Users className="h-4 w-4" /> User & Role Management
                            </button>

                            <button
                                onClick={() => setActiveTab("blogs")}
                                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition-all ${
                                    activeTab === "blogs" ? "bg-black text-white shadow-xs" : "bg-white text-gray-600 hover:bg-gray-100"
                                }`}
                            >
                                <FileText className="h-4 w-4" /> Articles Management
                            </button>

                            <button
                                onClick={() => setActiveTab("taxonomies")}
                                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition-all ${
                                    activeTab === "taxonomies" ? "bg-black text-white shadow-xs" : "bg-white text-gray-600 hover:bg-gray-100"
                                }`}
                            >
                                <FolderPlus className="h-4 w-4" /> Categories & Tags
                            </button>

                            <button
                                onClick={() => setActiveTab("analytics")}
                                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition-all ${
                                    activeTab === "analytics" ? "bg-black text-white shadow-xs" : "bg-white text-gray-600 hover:bg-gray-100"
                                }`}
                            >
                                <BarChart3 className="h-4 w-4" /> Platform Analytics
                            </button>
                        </>
                    )}
                </div>

                {/* Tab 1: Profile Details */}
                {activeTab === "profile" && (
                    <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
                        <h2 className="text-lg font-bold text-gray-900">Profile Details</h2>
                        <p className="mt-1 text-sm text-gray-500">Update your author display information and public links.</p>

                        <form onSubmit={handleSubmitProfile} className="mt-6 space-y-5">
                            {message && (
                                <div
                                    className={`rounded-xl p-4 text-sm ${
                                        status === "success"
                                            ? "bg-green-50 border border-green-200 text-green-800"
                                            : "bg-red-50 border border-red-200 text-red-800"
                                    }`}
                                >
                                    {message}
                                </div>
                            )}

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">Full Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="mt-1 block w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-black focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">Bio</label>
                                <textarea
                                    rows={3}
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    placeholder="Short biography for article author cards..."
                                    className="mt-1 block w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-black focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">Website URL</label>
                                <input
                                    type="url"
                                    value={website}
                                    onChange={(e) => setWebsite(e.target.value)}
                                    placeholder="https://example.com"
                                    className="mt-1 block w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-black focus:outline-none"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={status === "loading"}
                                className="rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-50 transition-colors"
                            >
                                {status === "loading" ? "Saving..." : "Save Profile"}
                            </button>
                        </form>
                    </div>
                )}

                {/* Tab 2: User & Role Management */}
                {activeTab === "users" && isAdminOrEditor && (
                    <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">User & Role Management</h2>
                                <p className="mt-1 text-xs text-gray-500">Manage user roles, review author access requests, and grant publishing privileges.</p>
                            </div>
                            <button
                                onClick={fetchUsers}
                                className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium hover:bg-gray-50"
                            >
                                Refresh Users
                            </button>
                        </div>

                        {loadingUsers ? (
                            <div className="py-12 text-center text-xs text-gray-500">Loading platform users...</div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs">
                                    <thead>
                                        <tr className="border-b border-gray-200 bg-gray-50 text-gray-600 font-semibold uppercase tracking-wider">
                                            <th className="p-3">User</th>
                                            <th className="p-3">Role</th>
                                            <th className="p-3">Author Request</th>
                                            <th className="p-3 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {usersList.map((u) => {
                                            const id = u.id || u._id || ""
                                            const isPending = u.authorRequestStatus === "pending"
                                            return (
                                                <tr key={id} className="hover:bg-gray-50/80">
                                                    <td className="p-3 font-medium text-gray-900">
                                                        <div>{u.name}</div>
                                                        <div className="text-[11px] text-gray-500 font-normal">{u.email}</div>
                                                    </td>
                                                    <td className="p-3">
                                                        <span
                                                            className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                                                                u.role === "admin" || u.role === "editor"
                                                                    ? "bg-purple-100 text-purple-800"
                                                                    : u.role === "author"
                                                                    ? "bg-blue-100 text-blue-800"
                                                                    : "bg-gray-100 text-gray-700"
                                                            }`}
                                                        >
                                                            {u.role || "reader"}
                                                        </span>
                                                    </td>
                                                    <td className="p-3">
                                                        {isPending ? (
                                                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-bold uppercase text-amber-800">
                                                                ⚠️ Request Pending
                                                            </span>
                                                        ) : (
                                                            <span className="text-gray-400 text-[11px]">—</span>
                                                        )}
                                                    </td>
                                                    <td className="p-3 text-right space-x-2">
                                                        {isPending && (
                                                            <button
                                                                onClick={() => handleRoleChange(id, "author", "approved")}
                                                                disabled={updatingUserId === id}
                                                                className="rounded-lg bg-green-600 px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-green-700"
                                                            >
                                                                Approve Author
                                                            </button>
                                                        )}

                                                        {u.role === "reader" && !isPending && (
                                                            <button
                                                                onClick={() => handleRoleChange(id, "author")}
                                                                disabled={updatingUserId === id}
                                                                className="rounded-lg border border-gray-300 bg-white px-2.5 py-1 text-[11px] font-semibold text-gray-700 hover:bg-gray-100"
                                                            >
                                                                Make Author
                                                            </button>
                                                        )}

                                                        {u.role === "author" && (
                                                            <button
                                                                onClick={() => handleRoleChange(id, "editor")}
                                                                disabled={updatingUserId === id}
                                                                className="rounded-lg border border-purple-200 bg-purple-50 px-2.5 py-1 text-[11px] font-semibold text-purple-700 hover:bg-purple-100"
                                                            >
                                                                Make Editor
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {/* Tab 3: Articles Management */}
                {activeTab === "blogs" && isAdminOrEditor && (
                    <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">Articles Management</h2>
                                <p className="mt-1 text-xs text-gray-500">Edit, inspect status, or delete editorial articles.</p>
                            </div>
                            <Link
                                href="/blog/create"
                                className="rounded-xl bg-black px-4 py-2 text-xs font-semibold text-white hover:bg-gray-800"
                            >
                                + New Article
                            </Link>
                        </div>

                        {loadingBlogs ? (
                            <div className="py-12 text-center text-xs text-gray-500">Loading articles...</div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs">
                                    <thead>
                                        <tr className="border-b border-gray-200 bg-gray-50 text-gray-600 font-semibold uppercase tracking-wider">
                                            <th className="p-3">Article Title</th>
                                            <th className="p-3">Author</th>
                                            <th className="p-3">Status</th>
                                            <th className="p-3 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {blogsList.map((b) => {
                                            const id = b.id || (b as any)._id || ""
                                            return (
                                                <tr key={id} className="hover:bg-gray-50/80">
                                                    <td className="p-3 font-medium text-gray-900 max-w-xs truncate">
                                                        <Link href={`/blog/${b.slug}`} className="hover:underline">
                                                            {b.title}
                                                        </Link>
                                                    </td>
                                                    <td className="p-3 text-gray-600">{b.author?.name || "Author"}</td>
                                                    <td className="p-3">
                                                        <span
                                                            className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                                                                b.status === "published"
                                                                    ? "bg-green-100 text-green-800"
                                                                    : "bg-gray-100 text-gray-700"
                                                            }`}
                                                        >
                                                            {b.status}
                                                        </span>
                                                    </td>
                                                    <td className="p-3 text-right space-x-2">
                                                        <Link
                                                            href={`/blog/edit/${b.slug}`}
                                                            className="inline-flex items-center gap-1 rounded-lg border border-gray-300 px-2.5 py-1 text-[11px] font-semibold text-gray-700 hover:bg-gray-100"
                                                        >
                                                            <Edit3 className="h-3 w-3" /> Edit
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDeleteArticle(id)}
                                                            className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-2.5 py-1 text-[11px] font-semibold text-red-700 hover:bg-red-100"
                                                        >
                                                            <Trash2 className="h-3 w-3" /> Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {/* Tab 4: Categories & Tags Taxonomy Manager */}
                {activeTab === "taxonomies" && isAdminOrEditor && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Categories Box */}
                        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
                            <h2 className="text-base font-bold text-gray-900">Categories ({categories.length})</h2>

                            <form onSubmit={handleCreateCategory} className="flex gap-2">
                                <input
                                    type="text"
                                    value={newCategoryName}
                                    onChange={(e) => setNewCategoryName(e.target.value)}
                                    placeholder="New Category Name..."
                                    className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-xs focus:border-black focus:outline-none"
                                />
                                <button
                                    type="submit"
                                    className="rounded-lg bg-black px-4 py-2 text-xs font-semibold text-white hover:bg-gray-800"
                                >
                                    + Add
                                </button>
                            </form>

                            <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
                                {categories.map((c) => (
                                    <div key={c.id || c._id} className="flex items-center justify-between rounded-lg bg-gray-50 p-2.5 text-xs font-medium text-gray-800">
                                        <span>{c.name}</span>
                                        <span className="text-[11px] text-gray-400">/{c.slug}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Tags Box */}
                        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
                            <h2 className="text-base font-bold text-gray-900">Tags ({tags.length})</h2>

                            <form onSubmit={handleCreateTag} className="flex gap-2">
                                <input
                                    type="text"
                                    value={newTagName}
                                    onChange={(e) => setNewTagName(e.target.value)}
                                    placeholder="New Tag Name..."
                                    className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-xs focus:border-black focus:outline-none"
                                />
                                <button
                                    type="submit"
                                    className="rounded-lg bg-black px-4 py-2 text-xs font-semibold text-white hover:bg-gray-800"
                                >
                                    + Add
                                </button>
                            </form>

                            <div className="flex flex-wrap gap-1.5 max-h-60 overflow-y-auto pr-1">
                                {tags.map((t) => (
                                    <span key={t.id || t._id} className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                                        #{t.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Tab 5: Analytics Overview */}
                {activeTab === "analytics" && isAdminOrEditor && (
                    <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
                        <h2 className="text-lg font-bold text-gray-900">Platform Analytics & Metrics</h2>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="rounded-xl border border-gray-200 bg-gray-50/80 p-5 text-center">
                                <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Total Published Articles</p>
                                <p className="mt-2 text-3xl font-black text-gray-900">{dashboardCounts?.blogs ?? 0}</p>
                            </div>
                            <div className="rounded-xl border border-gray-200 bg-gray-50/80 p-5 text-center">
                                <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Pending Comments</p>
                                <p className="mt-2 text-3xl font-black text-amber-600">{dashboardCounts?.pendingComments ?? 0}</p>
                            </div>
                            <div className="rounded-xl border border-gray-200 bg-gray-50/80 p-5 text-center">
                                <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Active Newsletter Subscribers</p>
                                <p className="mt-2 text-3xl font-black text-emerald-600">{dashboardCounts?.subscribers ?? 0}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
