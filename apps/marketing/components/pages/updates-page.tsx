import { format, parseISO } from "date-fns"
import Image from "next/image"
import Link from "next/link"
import {
  type BlogPost,
  getBlogPosts,
  type PostMetadata,
} from "@/lib/content/blog"
import {
  getInteractiveBlogContent,
  isInteractiveBlogPost,
} from "@/lib/content/blog-registry"
import { generateGradientFromSlug } from "@/utils/gradients"

const FEATURED_SLUGS = ["theo-v05"]

export const UpdatesPage = () => {
  const allUpdates = getBlogPosts() as BlogPost[]

  const featuredPosts = allUpdates
    .filter((post) => FEATURED_SLUGS.includes(post.slug))
    .sort((a, b) => {
      if ("publishedAt" in a.metadata && "publishedAt" in b.metadata) {
        return (
          new Date(b.metadata.publishedAt).getTime() -
          new Date(a.metadata.publishedAt).getTime()
        )
      }
      return 0
    })

  const remainingPosts = allUpdates
    .filter((post) => !FEATURED_SLUGS.includes(post.slug))
    .sort((a, b) => {
      if ("publishedAt" in a.metadata && "publishedAt" in b.metadata) {
        return (
          new Date(b.metadata.publishedAt).getTime() -
          new Date(a.metadata.publishedAt).getTime()
        )
      }
      return 0
    })
  const featuredGridClassName =
    featuredPosts.length === 1
      ? "grid grid-cols-1 gap-6"
      : "grid grid-cols-1 gap-6 md:grid-cols-2"
  const featuredImageClassName =
    featuredPosts.length === 1
      ? "object-cover w-full h-80 md:h-[460px]"
      : "object-cover w-full h-48"

  return (
    <div className="mx-auto w-full max-w-5xl px-5 pt-24 pb-32 sm:px-8 md:py-40">
      {featuredPosts.length > 0 && (
        <div className="mb-6">
          <div className={featuredGridClassName}>
            {featuredPosts.map((post) => (
              <article
                key={post.slug}
                className="w-full overflow-hidden rounded-xl border border-border bg-muted transition-shadow hover:shadow-md"
              >
                <Link href={`/blog/${post.slug}`}>
                  {post.metadata.image ? (
                    <div className="w-full border-b">
                      <Image
                        src={post.metadata.image}
                        width={900}
                        height={400}
                        objectFit="cover"
                        alt={post.metadata.title}
                        className={featuredImageClassName}
                      />
                    </div>
                  ) : isInteractiveBlogPost(post.slug) ? (
                    (() => {
                      const interactiveContent = getInteractiveBlogContent(
                        post.slug
                      )
                      return (
                        <div
                          className="h-48 w-full border-b"
                          style={{
                            background: generateGradientFromSlug(
                              post.slug,
                              interactiveContent.gradientColors
                            ),
                          }}
                        />
                      )
                    })()
                  ) : null}
                  <div className="flex flex-col gap-3 p-6">
                    <h3 className="text-xl font-medium text-foreground">
                      {post.metadata.title}
                    </h3>
                    <div className="flex gap-2 text-sm">
                      {"author" in post.metadata && (
                        <>
                          <p className="text-muted-foreground">
                            by {(post.metadata as PostMetadata).author}
                          </p>
                          <span>{` • `}</span>
                        </>
                      )}
                      {"publishedAt" in post.metadata && (
                        <p className="text-muted-foreground">
                          {format(
                            parseISO(
                              (post.metadata as PostMetadata).publishedAt
                            ),
                            "MMMM dd, yyyy"
                          )}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {post.metadata.tags?.split(", ").map((tag) => (
                        <p
                          key={tag}
                          className="rounded-md bg-muted px-2 py-0.5 text-sm font-medium text-muted-foreground"
                        >
                          {tag}
                        </p>
                      ))}
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      )}

      <div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {remainingPosts.map((post) => (
            <article
              key={post.slug}
              className="w-full overflow-hidden rounded-xl border border-border bg-muted transition-shadow hover:shadow-md"
            >
              <Link href={`/blog/${post.slug}`}>
                {post.metadata.image ? (
                  <div className="w-full border-b">
                    <Image
                      src={post.metadata.image}
                      width={900}
                      height={400}
                      objectFit="cover"
                      alt={post.metadata.title}
                      className="h-48 w-full object-cover"
                    />
                  </div>
                ) : isInteractiveBlogPost(post.slug) ? (
                  (() => {
                    const interactiveContent = getInteractiveBlogContent(
                      post.slug
                    )
                    return (
                      <div
                        className="h-48 w-full border-b"
                        style={{
                          background: generateGradientFromSlug(
                            post.slug,
                            interactiveContent.gradientColors
                          ),
                        }}
                      />
                    )
                  })()
                ) : null}
                <div className="flex flex-col gap-3 p-6">
                  <h3 className="text-xl font-medium text-foreground">
                    {post.metadata.title}
                  </h3>
                  <div className="flex gap-2 text-sm">
                    {"author" in post.metadata && (
                      <>
                        <p className="text-muted-foreground">
                          by {(post.metadata as PostMetadata).author}
                        </p>
                        <span>{` • `}</span>
                      </>
                    )}
                    {"publishedAt" in post.metadata && (
                      <p className="text-muted-foreground">
                        {format(
                          parseISO((post.metadata as PostMetadata).publishedAt),
                          "MMMM dd, yyyy"
                        )}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {post.metadata.tags?.split(", ").map((tag) => (
                      <p
                        key={tag}
                        className="rounded-md bg-muted px-2 py-0.5 text-sm font-medium text-muted-foreground"
                      >
                        {tag}
                      </p>
                    ))}
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}
