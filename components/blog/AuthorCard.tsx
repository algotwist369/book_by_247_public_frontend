import Link from "next/link"
import { CustomImage } from "@/components/ui/CustomImage"
import type { BlogAuthor } from "@/lib/blog-types"

export function AuthorCard({ author }: { author: BlogAuthor }) {
    return (
        <div className="flex items-start gap-4">
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full">
                <CustomImage
                    src={author.avatar?.url || "https://ui-avatars.com/api/?name=Bookby247"}
                    alt={author.name}
                    fill
                    className="object-cover"
                />
            </div>
            <div className="min-w-0">
                <Link
                    href={`/blog/author/${author.username || author.id || author._id || ""}`}
                    className="text-base font-semibold text-zinc-950 hover:underline hover:underline-offset-4"
                >
                    {author.name}
                </Link>
                <p className="mt-1.5 text-[14px] leading-relaxed text-zinc-600">{author.bio || "Editorial contributor at Bookby247."}</p>
            </div>
        </div>
    )
}
