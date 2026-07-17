"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { docsConfig, type SidebarGroup } from "../docs-config"

export function DocsSidebar() {
  const pathname = usePathname()

  const isActive = (slug: string) => {
    return pathname === `/docs/${slug}` || pathname === `/docs/${slug}/`
  }

  return (
    <nav className="sticky top-14 h-[calc(100vh-56px)] w-[260px] shrink-0 overflow-y-auto border-r border-border px-4 py-6">
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
  )
}
