"use client"

import { useState, type FormEvent, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useBlogAuth } from "@/hooks/useBlogAuth"

export default function BlogSignUpPage() {
    const { register, isAuthenticated, isReady } = useBlogAuth()
    const router = useRouter()

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [status, setStatus] = useState<"idle" | "loading" | "error">("idle")
    const [errorMessage, setErrorMessage] = useState("")

    useEffect(() => {
        if (isReady && isAuthenticated) {
            router.push("/blog")
        }
    }, [isReady, isAuthenticated, router])

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        if (!name.trim() || !email.trim() || !password) return

        if (password.length < 6) {
            setErrorMessage("Password must be at least 6 characters.")
            return
        }

        setStatus("loading")
        setErrorMessage("")

        try {
            await register(name, email, password)
            router.push("/blog")
        } catch (err: any) {
            setStatus("error")
            setErrorMessage(err.message || "Registration failed. Please try again.")
        }
    }

    return (
        <div className="flex min-h-[75vh] items-center justify-center bg-gray-50/50 px-4 py-12">
            <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
                <div className="text-center">
                    <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">BookBy247 Reader Access</p>
                    <h1 className="mt-2 text-2xl font-bold tracking-tight text-gray-900">Create Reader Account</h1>
                    <p className="mt-2 text-sm text-gray-600">
                        Join discussions, save articles across sessions, and follow wellness authors.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    {errorMessage && (
                        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                            {errorMessage}
                        </div>
                    )}

                    <div>
                        <label htmlFor="name" className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            Full Name
                        </label>
                        <input
                            id="name"
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="John Doe"
                            className="mt-1 block w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                        />
                    </div>

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
                        <label htmlFor="password" className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="At least 6 characters"
                            className="mt-1 block w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={status === "loading"}
                        className="w-full rounded-xl bg-black px-4 py-3 text-sm font-semibold text-white hover:bg-gray-800 focus:outline-none disabled:opacity-50 transition-colors"
                    >
                        {status === "loading" ? "Creating account..." : "Sign Up"}
                    </button>

                    <div className="pt-4 border-t border-gray-100 text-center text-xs text-gray-600">
                        Already have an account?{" "}
                        <Link href="/blog/login" className="font-semibold text-black hover:underline">
                            Sign In
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    )
}
