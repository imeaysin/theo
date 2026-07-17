import { ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import { getAdjacentDocs } from "../docs-config"

interface DocsPrevNextProps {
  currentSlug: string
}

export function DocsPrevNext({ currentSlug }: DocsPrevNextProps) {
  const { prev, next } = getAdjacentDocs(currentSlug)

  if (!prev && !next) return null

  return (
    <div className="mt-12 flex items-stretch justify-between gap-4 border-t border-border pt-6">
      {prev ? (
        <Link
          href={`/docs/${prev.slug}`}
          className="group flex flex-1 items-center gap-3 rounded-lg border border-border px-4 py-3 transition-colors hover:border-border hover:bg-muted"
        >
          <ChevronLeft className="h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-muted-foreground" />
          <div className="flex flex-col">
            <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Previous
            </span>
            <span className="text-sm font-medium text-muted-foreground transition-colors group-hover:text-muted-foreground">
              {prev.title}
            </span>
          </div>
        </Link>
      ) : (
        <div className="flex-1" />
      )}
      {next ? (
        <Link
          href={`/docs/${next.slug}`}
          className="group flex flex-1 items-center justify-end gap-3 rounded-lg border border-border px-4 py-3 text-right transition-colors hover:border-border hover:bg-muted"
        >
          <div className="flex flex-col items-end">
            <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Next
            </span>
            <span className="text-sm font-medium text-muted-foreground transition-colors group-hover:text-muted-foreground">
              {next.title}
            </span>
          </div>
          <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-muted-foreground" />
        </Link>
      ) : (
        <div className="flex-1" />
      )}
    </div>
  )
}
