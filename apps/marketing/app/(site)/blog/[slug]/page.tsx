import { AuthorByline } from "@/components/blog/author-byline"
import { CustomMDX } from "@/components/mdx"
import { ReadyToGetStarted } from "@/components/ready-to-get-started"
import { getBlogPosts } from "@/lib/content/blog"
import {
  getInteractiveBlogContent,
  isInteractiveBlogPost,
} from "@/lib/content/blog-registry"
import { calculateReadingTime } from "@/utils/read-time"
import { productConfig } from "@workspace/config/public"
import { format, parseISO } from "date-fns"
import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { BlogTemplate } from "@/components/blog/blog-template"
import { Share } from "../_components/share"

interface PostProps {
  params: Promise<{
    slug: string
  }>
}

const articleBodyClassName = [
  "text-base leading-7 text-muted-foreground",
  "[&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:text-2xl [&_h2]:font-medium [&_h2]:tracking-tight [&_h2]:text-foreground",
  "[&_h3]:mt-8 [&_h3]:mb-2 [&_h3]:text-xl [&_h3]:font-medium [&_h3]:text-foreground",
  "[&_h4]:mt-6 [&_h4]:mb-2 [&_h4]:text-lg [&_h4]:font-medium [&_h4]:text-foreground",
  "[&_p]:mb-5",
  "[&_a]:font-medium [&_a]:text-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary",
  "[&_ul]:mb-5 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5",
  "[&_ol]:mb-5 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-5",
  "[&_li]:leading-7",
  "[&_blockquote]:my-6 [&_blockquote]:border-l-2 [&_blockquote]:border-border [&_blockquote]:pl-4 [&_blockquote]:text-muted-foreground [&_blockquote]:italic",
  "[&_hr]:my-10 [&_hr]:border-border",
  "[&_strong]:font-medium [&_strong]:text-foreground",
  "[&_code]:rounded-md [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-sm [&_code]:text-foreground",
  "[&_pre]:my-6 [&_pre]:overflow-x-auto [&_pre]:rounded-xl [&_pre]:border [&_pre]:border-border [&_pre]:bg-muted [&_pre]:p-4 [&_pre]:text-sm",
  "[&_pre_code]:bg-transparent [&_pre_code]:p-0",
  "[&_img]:my-8 [&_img]:rounded-xl",
  "[&_table]:my-8 [&_table]:w-full [&_table]:border-collapse [&_table]:text-sm",
  "[&_th]:border [&_th]:border-border [&_th]:bg-muted [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:font-medium [&_th]:text-foreground",
  "[&_td]:border [&_td]:border-border [&_td]:px-3 [&_td]:py-2",
].join(" ")

export async function generateMetadata(
  props: PostProps
): Promise<Metadata | undefined> {
  const params = await props.params
  const post = getBlogPosts().find((entry) => entry.slug === params.slug)
  if (!post) {
    return
  }

  const {
    title,
    publishedAt: publishedTime,
    description,
    image,
  } = post.metadata as {
    title: string
    publishedAt: string
    description: string
    image: string
  }
  const ogImage = image?.startsWith("http")
    ? image
    : `${productConfig.siteUrl}${image}`

  return {
    title: `${title} — ${productConfig.name}`,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime,
      url: `${productConfig.siteUrl}/blog/${post.slug}`,
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
  }
}

export default async function PostPage(props: PostProps) {
  const params = await props.params
  const post = getBlogPosts().find((entry) => entry.slug === params.slug)

  if (!post) {
    notFound()
  }

  if (isInteractiveBlogPost(params.slug)) {
    const interactiveContent = getInteractiveBlogContent(params.slug)
    return <BlogTemplate content={interactiveContent} />
  }

  const readingTime = calculateReadingTime(post.content)
  const publishedAt =
    ("publishedAt" in post.metadata ? post.metadata.publishedAt : undefined) ||
    new Date().toISOString()
  const postUrl = `${productConfig.siteUrl}/blog/${post.slug}`

  return (
    <>
      <article className="mx-auto w-full max-w-3xl px-5 pt-28 pb-16 md:pt-36 md:pb-24">
        <Link
          href="/blog"
          className="mb-8 inline-flex text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          ← Back to blog
        </Link>

        <header className="mb-10">
          {"category" in post.metadata && post.metadata.category ? (
            <p className="mb-3 text-sm font-medium text-muted-foreground">
              {String(post.metadata.category)}
            </p>
          ) : null}
          <h1 className="mb-4 text-3xl font-medium tracking-tight text-balance text-foreground md:text-5xl md:leading-tight">
            {post.metadata.title}
          </h1>
          {"description" in post.metadata && post.metadata.description ? (
            <p className="mb-6 text-lg leading-relaxed text-muted-foreground md:text-xl">
              {post.metadata.description}
            </p>
          ) : null}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
            <time dateTime={publishedAt}>
              {format(parseISO(publishedAt), "MMMM d, yyyy")}
            </time>
            <span aria-hidden="true">·</span>
            <span>{readingTime} min read</span>
            {"author" in post.metadata && post.metadata.author ? (
              <>
                <span aria-hidden="true">·</span>
                <span>{post.metadata.author}</span>
              </>
            ) : null}
          </div>
        </header>

        {post.metadata.image ? (
          <div className="relative mb-10 aspect-video w-full overflow-hidden rounded-2xl border border-border bg-muted">
            <Image
              src={post.metadata.image}
              alt={post.metadata.title}
              fill
              priority
              sizes="(min-width: 768px) 768px, 100vw"
              className="object-cover"
            />
          </div>
        ) : null}

        <div className={articleBodyClassName}>
          <CustomMDX source={post.content} />
        </div>

        {"author" in post.metadata && post.metadata.author ? (
          <AuthorByline authors={post.metadata.author} />
        ) : null}

        <Share post={post} url={postUrl} />
      </article>

      <div className="mx-auto mb-16 w-full max-w-5xl px-5">
        <ReadyToGetStarted />
      </div>
    </>
  )
}
