import type { BlogArticle } from "@/lib/blog-types"
import { buildAbsoluteUrl, renderJsonLd } from "@/lib/blog-utils"

/** Resolve CMS breadcrumb URL to absolute for JSON-LD. */
function normalizeJsonLdHref(href: string) {
    if (href.startsWith("http")) return href
    const path = href.startsWith("/") ? href : `/${href}`
    try {
        return buildAbsoluteUrl(path)
    } catch {
        return href
    }
}

export function BlogJsonLd({ blog }: { blog: BlogArticle }) {
    const canonical =
        typeof blog.seo?.canonicalUrl === "string" && blog.seo.canonicalUrl.startsWith("http")
            ? blog.seo.canonicalUrl
            : buildAbsoluteUrl(`/blog/${blog.slug}`)
    const description = (blog.seo?.metaDescription || blog.excerpt || "").slice(0, 5000)

    const imageUrls = [blog.featuredImage?.url, blog.seo?.ogImage].filter(Boolean) as string[]

    const cmsCrumbs = blog.schemaMarkup?.breadcrumbs?.filter((b) => b.name?.trim() && b.url?.trim())

    const breadcrumbList =
        cmsCrumbs?.length ? {
              "@type": "BreadcrumbList",
              itemListElement: cmsCrumbs.map((crumb, idx) => ({
                  "@type": "ListItem",
                  position: idx + 1,
                  name: crumb.name,
                  item: normalizeJsonLdHref(crumb.url),
              })),
          } : {
              "@type": "BreadcrumbList",
              itemListElement: [
                  { "@type": "ListItem", position: 1, name: "Home", item: buildAbsoluteUrl("/") },
                  { "@type": "ListItem", position: 2, name: "Blog", item: buildAbsoluteUrl("/blog") },
                  { "@type": "ListItem", position: 3, name: blog.title, item: canonical },
              ],
          }

    const blogPosting: Record<string, unknown> = {
        "@type": "BlogPosting",
        headline: blog.title,
        description,
        datePublished: blog.publishedAt || blog.createdAt,
        dateModified: blog.updatedAt || blog.publishedAt || blog.createdAt,
        author: {
            "@type": "Person",
            name: blog.author?.name,
        },
        publisher: {
            "@type": "Organization",
            name: "Bookby247",
            url: buildAbsoluteUrl("/"),
        },
        url: canonical,
        mainEntityOfPage: { "@type": "WebPage", "@id": canonical },
    }

    if (imageUrls.length) {
        blogPosting.image = [...new Set(imageUrls)]
    }
    const keywordsCombined = [...(blog.seo?.keywords || []), ...(blog.tags?.map((t) => t.name) || [])].filter(Boolean)
    if (keywordsCombined.length) {
        blogPosting.keywords = [...new Set(keywordsCombined)].join(", ")
    }

    const faqEntities = blog.schemaMarkup?.faq?.filter((item) => item.question && item.answer)

    const payload = {
        "@context": "https://schema.org",
        "@graph": [
            blogPosting,
            breadcrumbList,
            ...(faqEntities?.length ? [{
                      "@type": "FAQPage",
                      mainEntity: faqEntities.map((item) => ({
                          "@type": "Question",
                          name: item.question,
                          acceptedAnswer: {
                              "@type": "Answer",
                              text: item.answer,
                          },
                      })),
                  }] : []),
        ],
    }

    return <script type="application/ld+json" dangerouslySetInnerHTML={renderJsonLd(payload)} />
}
