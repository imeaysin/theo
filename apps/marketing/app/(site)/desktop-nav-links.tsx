"use client"

import { navigationMenuTriggerStyle } from "@/components/product-ui"
import { cn as classNames } from "@workspace/ui/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"

const Links = [
  { label: "Features", href: "/features" },
  { label: "Download", href: "/download" },
  { label: "Pricing", href: "/pricing" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
  { label: "Support", href: "/support" },
] as const

export function DesktopNavLinks() {
  const pathname = usePathname()

  return (
    <ul className="flex list-none items-center gap-0.5 pl-3">
      {Links.map((link) => {
        const isActive =
          pathname === link.href || pathname.startsWith(`${link.href}/`)
        return (
          <li key={link.href}>
            <Link
              href={link.href}
              className={classNames(
                navigationMenuTriggerStyle(),
                "rounded-lg px-2.5 text-sm font-medium",
                isActive ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {link.label}
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
