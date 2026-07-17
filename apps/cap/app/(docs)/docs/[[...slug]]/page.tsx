import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { CustomMDX } from "@/components/mdx"
import { extractHeadings, getDocBySlug } from "@/utils/docs"
import { DocsBreadcrumbs } from "../_components/DocsBreadcrumbs"
import { DocsPrevNext } from "../_components/DocsPrevNext"
import { DocsTableOfContents } from "../_components/DocsTableOfContents"

interface DocPageProps {
  params: Promise<{ slug?: string[] }>
}

const siteUrl = "https://cap.so"

export async function generateMetadata(
  props: DocPageProps
): Promise<Metadata | undefined> {
  const params = await props.params
  const slug = params.slug?.join("/") ?? "introduction"
  const doc = getDocBySlug(slug)
  if (!doc) return

  const { title, summary: description, image } = doc.metadata
  const ogImage = image ? `${siteUrl}${image}` : undefined

  return {
    title: `${title} - Cap Docs`,
    description: description || title,
    openGraph: {
      title: `${title} - Cap Docs`,
      description: description || title,
      type: "article",
      url: `${siteUrl}/docs/${slug}`,
      ...(ogImage && { images: [{ url: ogImage }] }),
    },
  }
}

export default async function DocPage(props: DocPageProps) {
  const params = await props.params
  const slug = params.slug?.join("/") ?? "introduction"
  const doc = getDocBySlug(slug)

  if (!doc) {
    notFound()
  }

  const headings = extractHeadings(doc.content)

  return (
    <div className="flex">
      <div className="mx-auto max-w-3xl min-w-0 flex-1 px-6 py-10 sm:px-8">
        <DocsBreadcrumbs currentSlug={slug} />
        <article className="mt-4">
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-foreground">
            {doc.metadata.title}
          </h1>
          {doc.metadata.summary && (
            <p className="mb-8 text-lg text-muted-foreground">
              {doc.metadata.summary}
            </p>
          )}
          <div className="prose prose-gray prose-headings:scroll-mt-20 prose-headings:font-semibold prose-a:text-primary prose-code:before:content-none prose-code:after:content-none prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm max-w-none [&_iframe]:w-full [&_iframe]:max-w-full [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:p-4 [&_pre]:text-sm [&_pre]:leading-relaxed [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-inherit">
            <CustomMDX source={doc.content} />
          </div>
        </article>
        <DocsPrevNext currentSlug={slug} />
      </div>
      <div className="hidden w-[200px] shrink-0 xl:block">
        <DocsTableOfContents headings={headings} />
      </div>
    </div>
  )
}
