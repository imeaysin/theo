"use client"

import { X } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { docsConfig, type SidebarGroup } from "../docs-config"

export function DocsMobileMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const prevPathname = useRef(pathname)

  useEffect(() => {
    const handleOpen = () => setIsOpen(true)
    window.addEventListener("open-docs-mobile-menu", handleOpen)
    return () => window.removeEventListener("open-docs-mobile-menu", handleOpen)
  }, [])

  useEffect(() => {
    if (prevPathname.current !== pathname) {
      setIsOpen(false)
      prevPathname.current = pathname
    }
  }, [pathname])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  const isActive = (slug: string) => {
    return pathname === `/docs/${slug}` || pathname === `/docs/${slug}/`
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <button
        type="button"
        className="absolute inset-0 cursor-default bg-foreground/40"
        onClick={() => setIsOpen(false)}
        aria-label="Close menu"
      />
      <div className="absolute top-0 bottom-0 left-0 w-[280px] overflow-y-auto bg-background shadow-xl">
        <div className="flex h-14 items-center justify-between border-b border-border px-4">
          <span className="text-sm font-semibold text-muted-foreground">
            Documentation
          </span>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-muted-foreground"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="px-4 py-6">
          <div className="flex flex-col gap-6">
            {docsConfig.sidebar.map((group: SidebarGroup) => (
              <div key={group.title}>
                <h4 className="mb-2 px-3 text-xs font-semibold tracking-wider text-foreground uppercase">
                  {group.title}
                </h4>
                <ul className="flex flex-col gap-0.5">
                  {group.items.map((item) => {
                    const active = isActive(item.slug)
                    return (
                      <li key={item.slug}>
                        <Link
                          href={`/docs/${item.slug}`}
                          className={`block rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                            active
                              ? "border-l-2 border-primary bg-primary text-primary"
                              : "text-muted-foreground hover:bg-muted hover:text-muted-foreground"
                          }`}
                        >
                          {item.title}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </div>
        </nav>
      </div>
    </div>
  )
}
