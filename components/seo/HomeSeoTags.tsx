import Link from "next/link";
import { slugToTitleCase } from "@/lib/utils";

interface SeoTag {
    slug: string;
    name: string;
    count: number;
    seo: {
        title: string;
        description: string;
        keywords: string;
    };
}

interface HomeSeoTagsProps {
    tags: SeoTag[];
}

const HomeSeoTags: React.FC<HomeSeoTagsProps> = ({ tags }) => {
    if (!tags || tags.length === 0) return null;

    const tagNames = tags.map(tag => slugToTitleCase(tag.slug)).join(", ");

    return (
        <section className="border-t border-zinc-100 bg-white/80 py-8 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="sr-only">
                    <p>
                        Explore {tagNames} and wellness services near you. Book verified spas, salons, and beauty professionals for instant appointments.
                    </p>
                </div>

                <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4">
                    Popular Tags
                </h2>

                <ul className="flex flex-wrap gap-2" role="list">
                    {tags.map((tag) => {
                        const tagUrl = `/tags/${encodeURIComponent(tag.slug)}`;
                        const displayName = slugToTitleCase(tag.slug);
                        const titleAttr = `${tag.seo.title} - Book Now`;
                        const ariaLabel = `Explore ${displayName} services and book appointments`;

                        return (
                            <li key={tag.slug}>
                                <Link
                                    href={tagUrl}
                                    title={titleAttr}
                                    aria-label={ariaLabel}
                                    rel="noopener"
                                    className="inline-flex items-center px-3 py-1.5 bg-zinc-50 border border-zinc-200 rounded-full text-xs font-medium text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 transition-colors duration-200"
                                >
                                    {displayName}
                                    <span className="ml-1.5 text-[10px] text-zinc-400">
                                        ({tag.count})
                                    </span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </section>
    );
};

export default HomeSeoTags;
