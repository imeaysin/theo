"use client"

import { FileText, Search } from "lucide-react"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react"

interface SearchItem {
  slug: string
  title: string
  summary: string
  content: string
  group: string
}

interface DocsSearchProps {
  searchIndex: SearchItem[]
}

interface GroupedResults {
  group: string
  items: SearchItem[]
}

function groupResults(items: SearchItem[]): GroupedResults[] {
  const map = new Map<string, SearchItem[]>()
  for (const item of items) {
    const existing = map.get(item.group)
    if (existing) {
      existing.push(item)
    } else {
      map.set(item.group, [item])
    }
  }
  return Array.from(map.entries()).map(([group, items]) => ({
    group,
    items,
  }))
}

function truncateSummary(text: string, maxLength = 120): string {
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength).trimEnd()}...`
}

export function DocsSearch({ searchIndex }: DocsSearchProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [activeIndex, setActiveIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)
  const activeItemRef = useRef<HTMLButtonElement>(null)
  const instanceId = useId()
  const resultsId = `${instanceId}-docs-search-results`

  const filteredResults = useMemo(() => {
    if (!query.trim()) return []
    const lowerQuery = query.toLowerCase()
    return searchIndex.filter(
      (item) =>
        item.title.toLowerCase().includes(lowerQuery) ||
        item.summary.toLowerCase().includes(lowerQuery) ||
        item.content.toLowerCase().includes(lowerQuery)
    )
  }, [query, searchIndex])

  const grouped = useMemo(
    () => groupResults(filteredResults),
    [filteredResults]
  )

  const flatResults = useMemo(() => grouped.flatMap((g) => g.items), [grouped])

  const open = useCallback(() => {
    setIsOpen(true)
    setQuery("")
    setActiveIndex(0)
    requestAnimationFrame(() => {
      setIsAnimating(true)
      inputRef.current?.focus()
    })
  }, [])

  const close = useCallback(() => {
    setIsAnimating(false)
    const timeout = setTimeout(() => {
      setIsOpen(false)
      setQuery("")
      setActiveIndex(0)
    }, 150)
    return () => clearTimeout(timeout)
  }, [])

  const navigateTo = useCallback(
    (slug: string) => {
      close()
      router.push(`/docs/${slug}`)
    },
    [close, router]
  )

  useEffect(() => {
    const handleCustomEvent = () => open()
    window.addEventListener("open-docs-search", handleCustomEvent)
    return () =>
      window.removeEventListener("open-docs-search", handleCustomEvent)
  }, [open])

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault()
        close()
        return
      }

      if (e.key === "ArrowDown") {
        e.preventDefault()
        setActiveIndex((prev) => (prev < flatResults.length - 1 ? prev + 1 : 0))
        return
      }

      if (e.key === "ArrowUp") {
        e.preventDefault()
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : flatResults.length - 1))
        return
      }

      if (e.key === "Enter") {
        e.preventDefault()
        const selected = flatResults[activeIndex]
        if (selected) {
          navigateTo(selected.slug)
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, flatResults, activeIndex, close, navigateTo])

  useEffect(() => {
    activeItemRef.current?.scrollIntoView({ block: "nearest" })
  }, [activeIndex])

  useEffect(() => {
    if (isOpen) {
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth
      document.documentElement.style.setProperty(
        "--scrollbar-compensation",
        `${scrollbarWidth}px`
      )
      document.body.style.paddingRight = `${scrollbarWidth}px`
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
      document.body.style.paddingRight = ""
      document.documentElement.style.removeProperty("--scrollbar-compensation")
    }
    return () => {
      document.body.style.overflow = ""
      document.body.style.paddingRight = ""
      document.documentElement.style.removeProperty("--scrollbar-compensation")
    }
  }, [isOpen])

  if (!isOpen) return null

  let flatIndex = -1

  return (
    <div className="fixed inset-0 z-60 flex items-start justify-center pt-[min(20vh,120px)]">
      <button
        type="button"
        className={`absolute inset-0 cursor-default bg-foreground/30 transition-opacity duration-150 ${
          isAnimating ? "opacity-100" : "opacity-0"
        }`}
        onClick={close}
        aria-label="Close search"
        tabIndex={-1}
      />

      <div
        className={`relative mx-4 w-full max-w-xl overflow-hidden rounded-xl bg-background shadow-2xl transition-all duration-150 ${
          isAnimating
            ? "translate-y-0 scale-100 opacity-100"
            : "-translate-y-2 scale-[0.98] opacity-0"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Search documentation"
      >
        <div className="flex items-center gap-3 border-b border-border px-4">
          <Search className="h-4.5 w-4.5 shrink-0 text-muted-foreground" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setActiveIndex(0)
            }}
            placeholder="Search documentation..."
            className="h-14 flex-1 bg-transparent text-base text-muted-foreground placeholder-gray-400 outline-none"
            aria-label="Search documentation"
            aria-autocomplete="list"
            aria-controls={resultsId}
            aria-activedescendant={
              flatResults[activeIndex]
                ? `${instanceId}-item-${flatResults[activeIndex].slug}`
                : undefined
            }
          />
          <kbd className="inline-flex shrink-0 items-center rounded border border-border bg-muted px-1.5 py-0.5 text-xs font-medium text-muted-foreground select-none">
            ESC
          </kbd>
        </div>

        <div
          ref={resultsRef}
          id={resultsId}
          role="listbox"
          className="max-h-[400px] overflow-y-auto overscroll-contain"
        >
          {!query.trim() && (
            <div className="flex flex-col items-center justify-center px-4 py-12">
              <Search className="mb-3 h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Start typing to search...
              </p>
            </div>
          )}

          {query.trim() && flatResults.length === 0 && (
            <div className="flex flex-col items-center justify-center px-4 py-12">
              <Search className="mb-3 h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                No results found for &ldquo;{query}&rdquo;
              </p>
            </div>
          )}

          {grouped.map((group) => (
            <div key={group.group} className="py-2">
              <div className="px-4 py-1.5">
                <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                  {group.group}
                </span>
              </div>
              {group.items.map((item) => {
                flatIndex++
                const isActive = flatIndex === activeIndex
                const currentIndex = flatIndex
                return (
                  <button
                    key={item.slug}
                    ref={isActive ? activeItemRef : undefined}
                    id={`${instanceId}-item-${item.slug}`}
                    role="option"
                    aria-selected={isActive}
                    type="button"
                    className={`flex w-full cursor-pointer items-start gap-3 px-4 py-2.5 text-left transition-colors duration-75 ${
                      isActive ? "bg-primary" : "hover:bg-muted"
                    }`}
                    onClick={() => navigateTo(item.slug)}
                    onMouseEnter={() => setActiveIndex(currentIndex)}
                  >
                    <FileText
                      className={`mt-0.5 h-4 w-4 shrink-0 ${
                        isActive ? "text-primary" : "text-muted-foreground"
                      }`}
                    />
                    <div className="min-w-0 flex-1">
                      <div
                        className={`truncate text-sm font-medium ${
                          isActive ? "text-primary" : "text-muted-foreground"
                        }`}
                      >
                        {item.title}
                      </div>
                      {item.summary && (
                        <div className="mt-0.5 truncate text-xs text-muted-foreground">
                          {truncateSummary(item.summary)}
                        </div>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          ))}
        </div>

        {flatResults.length > 0 && (
          <div className="flex items-center gap-4 border-t border-border bg-muted px-4 py-2.5">
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <kbd className="inline-flex h-5 w-5 items-center justify-center rounded border border-border bg-background text-xs font-medium">
                ↑
              </kbd>
              <kbd className="inline-flex h-5 w-5 items-center justify-center rounded border border-border bg-background text-xs font-medium">
                ↓
              </kbd>
              <span>to navigate</span>
            </span>
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <kbd className="inline-flex h-5 items-center justify-center rounded border border-border bg-background px-1.5 text-xs font-medium">
                ↵
              </kbd>
              <span>to select</span>
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
