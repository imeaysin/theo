"use client"

import { Logo } from "@/components/product-ui"
import { ExternalLink, Menu, Search } from "lucide-react"
import Link from "next/link"
import { useEffect, useSyncExternalStore } from "react"

const subscribeToPlatform = () => () => undefined

function useIsMac() {
  return useSyncExternalStore(
    subscribeToPlatform,
    () => navigator.platform.toUpperCase().includes("MAC"),
    () => true
  )
}

export function DocsHeader() {
  const isMac = useIsMac()

  const handleSearchClick = () => {
    window.dispatchEvent(new CustomEvent("open-docs-search"))
  }

  const handleMobileMenuClick = () => {
    window.dispatchEvent(new CustomEvent("open-docs-mobile-menu"))
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        window.dispatchEvent(new CustomEvent("open-docs-search"))
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  return (
    <header
      className="fixed top-0 right-0 left-0 z-50 flex h-14 items-center justify-between border-b border-border bg-background px-4"
      style={{
        paddingRight: "calc(1rem + var(--scrollbar-compensation, 0px))",
      }}
    >
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleMobileMenuClick}
          className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-muted-foreground lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <Link href="/" className="flex items-center">
          <Logo className="h-5 w-auto" />
        </Link>
        <span className="text-sm font-semibold text-muted-foreground">/</span>
        <Link
          href="/docs"
          className="text-sm font-semibold text-muted-foreground transition-colors hover:text-muted-foreground"
        >
          Docs
        </Link>
      </div>

      <button
        type="button"
        onClick={handleSearchClick}
        className="hidden h-8 min-w-[240px] cursor-pointer items-center gap-2 rounded-lg border border-border bg-muted px-3 text-sm text-muted-foreground transition-colors hover:border-border hover:bg-muted sm:flex"
      >
        <Search className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="flex-1 text-left">Search docs...</span>
        <kbd className="hidden items-center gap-0.5 rounded border border-border bg-background px-1.5 py-0.5 text-xs font-medium text-muted-foreground md:inline-flex">
          {isMac ? "\u2318" : "Ctrl"}K
        </kbd>
      </button>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleSearchClick}
          className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-muted-foreground sm:hidden"
          aria-label="Search"
        >
          <Search className="h-4 w-4" />
        </button>
        <Link
          href="https://theo.example"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-muted-foreground sm:flex"
        >
          theo.example
          <ExternalLink className="h-3 w-3" />
        </Link>
        <Link
          href="https://github.com/imeaysin/theo"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center text-muted-foreground transition-colors hover:text-muted-foreground"
        >
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-5 w-5"
            role="img"
            aria-label="GitHub"
          >
            <title>GitHub</title>
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
        </Link>
      </div>
    </header>
  )
}
