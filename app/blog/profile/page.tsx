"use client"

import { useState, type FormEvent, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useBlogAuth } from "@/hooks/useBlogAuth"

export default function BlogProfilePage() {
    const { user, isAuthenticated, isReady, updateProfile, logout } = useBlogAuth()
    const router = useRouter()

    const [name, setName] = useState("")
    const [bio, setBio] = useState("")
    const [website, setWebsite] = useState("")
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
    const [message, setMessage] = useState("")

    useEffect(() => {
        if (user) {
            setName(user.name || "")
            setBio(user.bio || "")
            setWebsite(user.socialLinks?.website || "")
        }
    }, [user])

    if (!isReady) {
        return <div className="py-20 text-center text-sm text-gray-500">Loading profile...</div>
    }

    if (!isAuthenticated || !user) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900">Sign in to view your profile</h1>
                <p className="mt-2 text-sm text-gray-600">Access your saved articles, author dashboard, and profile settings.</p>
                <Link
                    href="/blog"
                    className="mt-6 rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white hover:bg-gray-800 transition-colors"
                >
                    Back to Blog Home
                </Link>
            </div>
        )
    }

    const handleSubmit = async (e: FormEvent) => {
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
            setMessage("Profile updated successfully!")
        } catch (err: any) {
            setStatus("error")
            setMessage(err.message || "Failed to update profile.")
        }
    }

    const handleLogout = async () => {
        await logout()
        router.push("/blog")
    }

    return (
        <div className="min-h-screen bg-gray-50/50 py-10 px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl space-y-8">
                {/* Header card */}
                <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                    <div className="flex items-center space-x-4">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black text-2xl font-bold text-white uppercase">
                            {user.name ? user.name[0] : "U"}
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-gray-900">{user.name}</h1>
                            <div className="flex items-center space-x-2 mt-1">
                                <span className="text-xs text-gray-500">@{user.username || "reader"}</span>
                                <span className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                                    user.role && user.role !== "reader"
                                        ? "bg-purple-100 text-purple-800"
                                        : "bg-gray-100 text-gray-700"
                                }`}>
                                    {user.role || "reader"}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3 w-full sm:w-auto">
                        <Link
                            href="/blog/create"
                            className="flex-1 sm:flex-initial rounded-xl bg-black px-4 py-2.5 text-center text-xs font-semibold text-white hover:bg-gray-800 transition-colors"
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

                {/* Main profile form */}
                <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
                    <h2 className="text-lg font-bold text-gray-900">Profile Details</h2>
                    <p className="mt-1 text-sm text-gray-500">Update your public author and reader display information.</p>

                    <form onSubmit={handleSubmit} className="mt-6 space-y-5">
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
                                className="mt-1 block w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">Bio</label>
                            <textarea
                                rows={3}
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                placeholder="Short biography for article author cards..."
                                className="mt-1 block w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">Website URL</label>
                            <input
                                type="url"
                                value={website}
                                onChange={(e) => setWebsite(e.target.value)}
                                placeholder="https://example.com"
                                className="mt-1 block w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                            />
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={status === "loading"}
                                className="rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-50 transition-colors"
                            >
                                {status === "loading" ? "Saving..." : "Save Profile"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
