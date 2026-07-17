import { ChevronRight } from "lucide-react"
import Link from "next/link"
import { getBreadcrumbs } from "../docs-config"

interface DocsBreadcrumbsProps {
  currentSlug: string
}

export function DocsBreadcrumbs({ currentSlug }: DocsBreadcrumbsProps) {
  const breadcrumbs = getBreadcrumbs(currentSlug)

  return (
    <nav
      className="mb-6 flex items-center gap-1 text-sm"
      aria-label="Breadcrumb"
    >
      {breadcrumbs.map((crumb, index) => {
        const isLast = index === breadcrumbs.length - 1

        return (
          <span
            key={crumb.slug + crumb.title}
            className="flex items-center gap-1"
          >
            {index > 0 && (
              <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            )}
            {isLast ? (
              <span className="font-medium text-muted-foreground">
                {crumb.title}
              </span>
            ) : (
              <Link
                href={crumb.slug ? `/docs/${crumb.slug}` : "/docs"}
                className="text-muted-foreground transition-colors hover:text-muted-foreground"
              >
                {crumb.title}
              </Link>
            )}
          </span>
        )
      })}
    </nav>
  )
}
