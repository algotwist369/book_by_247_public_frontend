"use client"

import { useState, type FormEvent, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useBlogAuth } from "@/hooks/useBlogAuth"

export default function BlogLoginPage() {
    const { login, isAuthenticated, isReady } = useBlogAuth()
    const router = useRouter()
    const searchParams = useSearchParams()
    const redirectUrl = searchParams?.get("redirect") || "/blog"

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [status, setStatus] = useState<"idle" | "loading" | "error">("idle")
    const [errorMessage, setErrorMessage] = useState("")

    useEffect(() => {
        if (isReady && isAuthenticated) {
            router.push(redirectUrl)
        }
    }, [isReady, isAuthenticated, redirectUrl, router])

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        if (!email.trim() || !password) return

        setStatus("loading")
        setErrorMessage("")

        try {
            await login(email, password)
            router.push(redirectUrl)
        } catch (err: any) {
            setStatus("error")
            setErrorMessage(err.message || "Invalid credentials. Please try again.")
        }
    }

    return (
        <div className="flex min-h-[75vh] items-center justify-center bg-gray-50/50 px-4 py-12">
            <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
                <div className="text-center">
                    <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">BookBy247 Reader Access</p>
                    <h1 className="mt-2 text-2xl font-bold tracking-tight text-gray-900">Sign in to Blog</h1>
                    <p className="mt-2 text-sm text-gray-600">
                        Access saved bookmarks, like posts, and join author discussions.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    {errorMessage && (
                        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                            {errorMessage}
                        </div>
                    )}

                    <div>
                        <label htmlFor="email" className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            Email address
                        </label>
                        <input
                            id="email"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            className="mt-1 block w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                        />
                    </div>

                    <div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="password" className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                Password
                            </label>
                            <Link href="/blog/auth/forgot-password" className="text-xs font-medium text-gray-600 hover:text-black">
                                Forgot password?
                            </Link>
                        </div>
                        <input
                            id="password"
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="mt-1 block w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={status === "loading"}
                        className="w-full rounded-xl bg-black px-4 py-3 text-sm font-semibold text-white hover:bg-gray-800 focus:outline-none disabled:opacity-50 transition-colors"
                    >
                        {status === "loading" ? "Signing in..." : "Sign In"}
                    </button>

                    <div className="pt-4 border-t border-gray-100 text-center text-xs text-gray-600">
                        Don't have a reader account?{" "}
                        <Link href="/blog/signup" className="font-semibold text-black hover:underline">
                            Sign Up
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    )
}
