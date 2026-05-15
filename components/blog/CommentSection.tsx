"use client"

import { useMemo, useState } from "react"
import { MessageSquare, Pencil, ThumbsUp, Trash2 } from "lucide-react"
import { blogApi } from "@/api/public/blog"
import type { BlogComment } from "@/lib/blog-types"
import { buildCommentTree, formatDate } from "@/lib/blog-utils"
import { Button } from "@/components/ui/Button"
import { ReaderPopup } from "@/components/blog/ReaderPopup"
import { useBlogAuth } from "@/hooks/useBlogAuth"

const BLOG_TOKEN_KEY = "blog_access_token"

interface CommentSectionProps {
    blogId: string
    initialComments: BlogComment[]
}

export function CommentSection({ blogId, initialComments }: CommentSectionProps) {
    const { user, isAuthenticated } = useBlogAuth()
    const [comments, setComments] = useState(initialComments)
    const [content, setContent] = useState("")
    const [replyingTo, setReplyingTo] = useState<string | null>(null)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [showReaderPopup, setShowReaderPopup] = useState(false)
    const tree = useMemo(() => buildCommentTree(comments), [comments])

    const ensureAuth = () => {
        if (isAuthenticated) return true
        if (typeof window !== "undefined" && localStorage.getItem(BLOG_TOKEN_KEY)) return true
        setShowReaderPopup(true)
        return false
    }

    const submitComment = async () => {
        if (!ensureAuth() || !content.trim()) return
        const optimistic: BlogComment = {
            _id: `temp-${Date.now()}`,
            blog: blogId,
            content,
            createdAt: new Date().toISOString(),
            parentComment: replyingTo,
            user: {
                _id: user?.id,
                name: user?.name,
                avatar: user?.avatar,
            },
            likes: [],
        }

        setComments((current) => [optimistic, ...current])
        const currentContent = content
        setContent("")
        setReplyingTo(null)

        try {
            const response = await blogApi.createComment(blogId, { content: currentContent, parentComment: replyingTo })
            setComments((current) => current.map((item) => item._id === optimistic._id ? response.data : item))
        } catch {
            setComments((current) => current.filter((item) => item._id !== optimistic._id))
        }
    }

    const toggleCommentLike = async (commentId: string) => {
        if (!ensureAuth()) return
        const userId = user?.id || ""
        setComments((current) => current.map((comment) => {
            if (comment._id !== commentId) return comment
            const liked = comment.likes?.includes(userId)
            return {
                ...comment,
                likes: liked ? comment.likes?.filter((id) => id !== userId) : [...(comment.likes || []), userId],
            }
        }))
        try {
            await blogApi.toggleCommentLike(commentId)
        } catch { }
    }

    const removeComment = async (commentId: string) => {
        const snapshot = comments
        setComments((current) => current.filter((item) => item._id !== commentId && item.parentComment !== commentId))
        try {
            await blogApi.deleteComment(commentId)
        } catch {
            setComments(snapshot)
        }
    }

    const saveEdit = async (commentId: string) => {
        try {
            const response = await blogApi.updateComment(commentId, { content })
            setComments((current) => current.map((item) => item._id === commentId ? { ...item, content: response.data.content } : item))
            setEditingId(null)
            setContent("")
        } catch { }
    }

    const renderComment = (comment: BlogComment & { replies?: BlogComment[] }, nested = false) => {
        const isOwner = user?.id && comment.user?._id === user.id
        const isEditing = editingId === comment._id

        return (
            <div key={comment._id} className={`rounded-2xl border border-zinc-100 bg-white p-5 ${nested ? "ml-6 mt-4" : ""}`}>
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <p className="font-semibold text-zinc-950">{comment.user?.name || "Reader"}</p>
                        <p className="text-xs text-zinc-500">{formatDate(comment.createdAt)}</p>
                    </div>
                    {isOwner ? (
                        <div className="flex items-center gap-2">
                            <button onClick={() => { setEditingId(comment._id); setContent(comment.content) }} className="text-zinc-500"><Pencil className="h-4 w-4" /></button>
                            <button onClick={() => removeComment(comment._id)} className="text-zinc-500"><Trash2 className="h-4 w-4" /></button>
                        </div>
                    ) : null}
                </div>

                {isEditing ? (
                    <div className="mt-4 space-y-3">
                        <textarea value={content} onChange={(event) => setContent(event.target.value)} className="min-h-24 w-full rounded-2xl border border-zinc-200 p-4 outline-none" />
                        <div className="flex gap-2">
                            <Button onClick={() => saveEdit(comment._id)} size="sm">Save</Button>
                            <Button onClick={() => { setEditingId(null); setContent("") }} variant="ghost" size="sm">Cancel</Button>
                        </div>
                    </div>
                ) : (
                    <p className="mt-4 text-sm leading-7 text-zinc-700">{comment.content}</p>
                )}

                <div className="mt-4 flex items-center gap-4 text-sm text-zinc-500">
                    <button onClick={() => toggleCommentLike(comment._id)} className="inline-flex items-center gap-2">
                        <ThumbsUp className="h-4 w-4" />
                        {comment.likes?.length || 0}
                    </button>
                    <button onClick={() => setReplyingTo(comment._id)} className="inline-flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        Reply
                    </button>
                </div>

                {replyingTo === comment._id ? (
                    <div className="mt-4 space-y-3">
                        <textarea value={content} onChange={(event) => setContent(event.target.value)} className="min-h-24 w-full rounded-2xl border border-zinc-200 p-4 outline-none" placeholder="Write your reply" />
                        <div className="flex gap-2">
                            <Button onClick={submitComment} size="sm">Post reply</Button>
                            <Button onClick={() => { setReplyingTo(null); setContent("") }} variant="ghost" size="sm">Cancel</Button>
                        </div>
                    </div>
                ) : null}

                {comment.replies?.map((reply) => renderComment(reply as BlogComment & { replies?: BlogComment[] }, true))}
            </div>
        )
    }

    return (
        <section className="mt-16 border-t border-zinc-100 pt-12">
            <div className="flex items-end justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold tracking-tight text-zinc-950 sm:text-3xl sm:font-black">Comments</h2>
                    <p className="mt-2 text-sm text-zinc-500">Join the conversation around this article.</p>
                </div>
            </div>

            <div className="mt-8 rounded-[2rem] border border-zinc-100 bg-zinc-50 p-5">
                <textarea
                    value={content}
                    onChange={(event) => setContent(event.target.value)}
                    placeholder="Share your perspective"
                    className="min-h-28 w-full rounded-2xl border border-zinc-200 bg-white p-4 outline-none"
                />
                <div className="mt-4 flex justify-end">
                    <Button onClick={submitComment}>Post comment</Button>
                </div>
            </div>

            <div className="mt-8 space-y-4">
                {tree.map((comment) => renderComment(comment))}
            </div>

            <ReaderPopup isOpen={showReaderPopup} onClose={() => setShowReaderPopup(false)} title="Sign in to participate" description="Reader accounts unlock comments, bookmarks, and article reactions." />
        </section>
    )
}
