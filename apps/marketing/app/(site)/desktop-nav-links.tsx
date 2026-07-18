"use client"

import { navigationMenuTriggerStyle } from "@/components/product-ui"
import { productConfig } from "@workspace/config/public"
import { cn as classNames } from "@workspace/ui-shadcn/lib/utils"
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
    <ul className="flex list-none items-center gap-1 pl-4">
      {Links.map((link) => {
        const isActive =
          pathname === link.href || pathname.startsWith(`${link.href}/`)
        return (
          <li key={link.href}>
            <Link
              href={link.href}
              className={classNames(
                navigationMenuTriggerStyle(),
                "px-3 font-medium",
                isActive ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {link.label}
            </Link>
          </li>
        )
      })}
      <li>
        <a
          href={productConfig.repositoryUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={classNames(
            navigationMenuTriggerStyle(),
            "px-3 font-medium text-muted-foreground"
          )}
        >
          GitHub
        </a>
      </li>
    </ul>
  )
}
