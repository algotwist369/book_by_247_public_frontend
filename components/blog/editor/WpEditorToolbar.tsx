"use client"

import { useState } from "react"
import {
    Bold,
    Italic,
    Heading2,
    Heading3,
    Quote,
    List,
    ListOrdered,
    CheckSquare,
    Code,
    Link as LinkIcon,
    Image as ImageIcon,
    Upload,
    Minus,
    Table as TableIcon,
    Lightbulb,
} from "lucide-react"
import { blogApi } from "@/api/public/blog"

interface WpEditorToolbarProps {
    onInsertText: (prefix: string, suffix?: string, defaultText?: string) => void
}

export function WpEditorToolbar({ onInsertText }: WpEditorToolbarProps) {
    const [uploading, setUploading] = useState(false)

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setUploading(true)
        try {
            const formData = new FormData()
            formData.append("file", file)
            formData.append("alt", file.name)

            const res = await blogApi.uploadMedia(formData)
            if (res.data?.url) {
                onInsertText(`\n![${res.data.alt || "Article Image"}](${res.data.url})\n`)
            }
        } catch (err: any) {
            alert(err.message || "Failed to upload inline image")
        } finally {
            setUploading(false)
            e.target.value = ""
        }
    }

    const tools = [
        {
            label: "Bold (Ctrl+B)",
            icon: Bold,
            action: () => onInsertText("**", "**", "bold text"),
        },
        {
            label: "Italic (Ctrl+I)",
            icon: Italic,
            action: () => onInsertText("*", "*", "italic text"),
        },
        {
            label: "Heading 2 (H2)",
            icon: Heading2,
            action: () => onInsertText("## ", "", "Heading Title"),
        },
        {
            label: "Heading 3 (H3)",
            icon: Heading3,
            action: () => onInsertText("### ", "", "Subheading Title"),
        },
        {
            label: "Callout Box",
            icon: Lightbulb,
            action: () => onInsertText("> 💡 **Pro Tip:** ", "", "Write your key callout insight here..."),
        },
        {
            label: "Blockquote",
            icon: Quote,
            action: () => onInsertText("> ", "", "Important quote or highlight..."),
        },
        {
            label: "Bullet List",
            icon: List,
            action: () => onInsertText("- ", "", "List item"),
        },
        {
            label: "Numbered List",
            icon: ListOrdered,
            action: () => onInsertText("1. ", "", "First item"),
        },
        {
            label: "Checklist",
            icon: CheckSquare,
            action: () => onInsertText("- [ ] ", "", "Actionable item"),
        },
        {
            label: "Code Block",
            icon: Code,
            action: () => onInsertText("```js\n", "\n```", "// Write code snippet here"),
        },
        {
            label: "Insert Table",
            icon: TableIcon,
            action: () => onInsertText("\n| Feature | Description |\n| --- | --- |\n| Item 1 | Detail 1 |\n| Item 2 | Detail 2 |\n"),
        },
        {
            label: "Insert Link",
            icon: LinkIcon,
            action: () => onInsertText("[", "](https://example.com)", "Link text"),
        },
        {
            label: "Insert Image URL",
            icon: ImageIcon,
            action: () => onInsertText("![Image Alt](", ")", "https://images.unsplash.com/photo-example"),
        },
        {
            label: "Horizontal Divider",
            icon: Minus,
            action: () => onInsertText("\n---\n", ""),
        },
    ]

    return (
        <div className="flex flex-wrap items-center gap-1 rounded-xl border border-gray-200 bg-white p-1.5 shadow-sm">
            {tools.map((tool) => {
                const Icon = tool.icon
                return (
                    <button
                        key={tool.label}
                        type="button"
                        onClick={tool.action}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 hover:text-black transition-colors"
                        title={tool.label}
                    >
                        <Icon className="h-4 w-4" />
                    </button>
                )
            })}

            <div className="h-4 w-px bg-gray-200 mx-1" />

            {/* Upload & Insert Image from File */}
            <label
                className={`flex h-8 items-center gap-1.5 rounded-lg bg-gray-100 px-2.5 text-xs font-semibold text-gray-800 hover:bg-gray-200 cursor-pointer transition-colors ${
                    uploading ? "opacity-50" : ""
                }`}
                title="Upload image file and insert into article"
            >
                <Upload className="h-3.5 w-3.5" />
                <span>{uploading ? "Uploading..." : "Upload Image"}</span>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={uploading}
                    className="hidden"
                />
            </label>
        </div>
    )
}
