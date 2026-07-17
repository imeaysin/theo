"use client"

import { useEffect, useState } from "react"

interface Heading {
  level: number
  text: string
  slug: string
}

interface DocsTableOfContentsProps {
  headings: Heading[]
}

export function DocsTableOfContents({ headings }: DocsTableOfContentsProps) {
  const [activeSlug, setActiveSlug] = useState<string>("")

  useEffect(() => {
    if (headings.length === 0) return

    const slugs = headings.map((h) => h.slug)
    const elements = slugs
      .map((slug) => document.getElementById(slug))
      .filter(Boolean) as HTMLElement[]

    if (elements.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries.filter((entry) => entry.isIntersecting)
        if (visibleEntries.length > 0) {
          const topEntry = visibleEntries.reduce((prev, curr) =>
            prev.boundingClientRect.top < curr.boundingClientRect.top
              ? prev
              : curr
          )
          setActiveSlug(topEntry.target.id)
        }
      },
      {
        rootMargin: "-80px 0px -60% 0px",
        threshold: 0,
      }
    )

    for (const el of elements) {
      observer.observe(el)
    }

    return () => observer.disconnect()
  }, [headings])

  const filteredHeadings = headings.filter(
    (h) => h.level === 2 || h.level === 3
  )

  if (filteredHeadings.length === 0) return null

  return (
    <div className="sticky top-[80px] hidden max-h-[calc(100vh-100px)] w-[200px] shrink-0 overflow-y-auto xl:block">
      <h4 className="mb-3 text-xs font-semibold tracking-wider text-foreground uppercase">
        On this page
      </h4>
      <ul className="flex flex-col gap-1">
        {filteredHeadings.map((heading, index) => (
          <li key={`${heading.slug}-${index}`}>
            <a
              href={`#${heading.slug}`}
              className={`block py-1 text-sm transition-colors ${
                heading.level === 3 ? "pl-3" : ""
              } ${
                activeSlug === heading.slug
                  ? "font-medium text-primary"
                  : "text-muted-foreground hover:text-muted-foreground"
              }`}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
