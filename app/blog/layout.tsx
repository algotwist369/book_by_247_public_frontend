import { BlogSessionExpiredGate } from "@/components/blog/BlogSessionExpiredGate"
import { BlogAuthProvider } from "@/hooks/useBlogAuth"

export default function BlogLayout({ children }: { children: React.ReactNode }) {
    return (
        <BlogAuthProvider>
            <BlogSessionExpiredGate />
            {children}
        </BlogAuthProvider>
    )
}
