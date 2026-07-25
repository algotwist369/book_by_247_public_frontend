"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react"
import { blogApi } from "@/api/public/blog"
import type { BlogAuthor, UpdateUserProfilePayload } from "@/lib/blog-types"

const ACCESS_TOKEN_KEY = "blog_access_token"
const USER_KEY = "blog_user"

function readStoredUser(): BlogAuthor | null {
    if (typeof window === "undefined") return null
    const storedUser = localStorage.getItem(USER_KEY)
    if (!storedUser) return null
    try {
        return JSON.parse(storedUser) as BlogAuthor
    } catch {
        return null
    }
}

type BlogAuthContextValue = {
    user: BlogAuthor | null
    isReady: boolean
    isAuthenticated: boolean
    login: (email: string, password: string) => Promise<BlogAuthor>
    register: (name: string, email: string, password: string) => Promise<BlogAuthor>
    refreshProfile: () => Promise<BlogAuthor | null>
    updateProfile: (payload: UpdateUserProfilePayload) => Promise<BlogAuthor>
    forgotPassword: (email: string) => Promise<void>
    resetPassword: (payload: { token: string; password: string }) => Promise<void>
    logout: () => Promise<void>
}

const BlogAuthContext = createContext<BlogAuthContextValue | null>(null)

export function BlogAuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<BlogAuthor | null>(readStoredUser)
    const [isReady, setIsReady] = useState(false)

    const persistSession = useCallback((nextUser: BlogAuthor, accessToken?: string) => {
        setUser(nextUser)
        localStorage.setItem(USER_KEY, JSON.stringify(nextUser))
        if (accessToken) {
            localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
        }
    }, [])

    const login = useCallback(
        async (email: string, password: string) => {
            const response = await blogApi.login({ email, password })
            persistSession(response.data.user, response.data.tokens.accessToken)
            return response.data.user
        },
        [persistSession]
    )

    const register = useCallback(
        async (name: string, email: string, password: string) => {
            await blogApi.register({ name, email, password })
            return login(email, password)
        },
        [login]
    )

    const refreshProfile = useCallback(async () => {
        try {
            const response = await blogApi.getCurrentUser()
            persistSession(response.data)
            return response.data
        } catch {
            return null
        }
    }, [persistSession])

    const updateProfile = useCallback(
        async (payload: UpdateUserProfilePayload) => {
            const response = await blogApi.updateCurrentUser(payload)
            persistSession(response.data)
            return response.data
        },
        [persistSession]
    )

    const forgotPassword = useCallback(async (email: string) => {
        await blogApi.forgotPassword(email)
    }, [])

    const resetPassword = useCallback(async (payload: { token: string; password: string }) => {
        await blogApi.resetPassword(payload)
    }, [])

    const logout = useCallback(async () => {
        try {
            await blogApi.logout()
        } catch {
            /* ignore logout API error */
        } finally {
            setUser(null)
            localStorage.removeItem(USER_KEY)
            localStorage.removeItem(ACCESS_TOKEN_KEY)
        }
    }, [])

    /** If token exists but user JSON was cleared, restore profile; then mark ready (bookmarks page gates on this). */
    useEffect(() => {
        let cancelled = false
        ;(async () => {
            if (!readStoredUser() && typeof window !== "undefined") {
                const token = localStorage.getItem(ACCESS_TOKEN_KEY)
                if (token) {
                    try {
                        const response = await blogApi.getCurrentUser()
                        if (!cancelled) persistSession(response.data)
                    } catch {
                        /* token invalid or network */
                    }
                }
            }
            if (!cancelled) setIsReady(true)
        })()
        return () => {
            cancelled = true
        }
    }, [persistSession])

    useEffect(() => {
        const onStorage = (event: StorageEvent) => {
            if (event.key !== USER_KEY && event.key !== ACCESS_TOKEN_KEY) return
            if (event.key === USER_KEY) {
                if (!event.newValue) {
                    setUser(null)
                } else {
                    try {
                        setUser(JSON.parse(event.newValue) as BlogAuthor)
                    } catch {
                        setUser(null)
                    }
                }
            }
            if (event.key === ACCESS_TOKEN_KEY && event.newValue === null) {
                setUser(null)
            }
        }
        window.addEventListener("storage", onStorage)
        return () => window.removeEventListener("storage", onStorage)
    }, [])

    const value = useMemo<BlogAuthContextValue>(
        () => ({
            user,
            isReady,
            isAuthenticated: Boolean(user),
            login,
            register,
            refreshProfile,
            updateProfile,
            forgotPassword,
            resetPassword,
            logout,
        }),
        [user, isReady, login, register, refreshProfile, updateProfile, forgotPassword, resetPassword, logout]
    )

    return <BlogAuthContext.Provider value={value}>{children}</BlogAuthContext.Provider>
}

export function useBlogAuth() {
    const ctx = useContext(BlogAuthContext)
    if (ctx) return ctx
    return {
        user: null,
        isReady: false,
        isAuthenticated: false,
        login: async () => { throw new Error("No Auth Provider") },
        register: async () => { throw new Error("No Auth Provider") },
        refreshProfile: async () => null,
        updateProfile: async () => { throw new Error("No Auth Provider") },
        forgotPassword: async () => {},
        resetPassword: async () => {},
        logout: async () => {},
    }
}
