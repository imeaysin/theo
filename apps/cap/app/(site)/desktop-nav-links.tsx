"use client"

import { navigationMenuTriggerStyle } from "@/components/cap-ui"
import { cn as classNames } from "@workspace/ui-shadcn/lib/utils"
import { ChevronDown, Clapperboard, Zap } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  type CSSProperties,
  type FocusEvent,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react"

interface NavDropdownItem {
  label: string
  sub: string
  href: string
  icon?: ReactNode
}

interface NavItem {
  label: string
  href?: string
  width?: number
  dropdown?: NavDropdownItem[]
}

const Links: NavItem[] = [
  {
    label: "Product",
    width: 600,
    dropdown: [
      {
        label: "Instant Mode",
        sub: "Quick recordings with instant shareable links",
        href: "/features/instant-mode",
        icon: <Zap fill="yellow" className="size-4" strokeWidth={1.5} />,
      },
      {
        label: "Studio Mode",
        sub: "Professional recordings with advanced editing",
        href: "/features/studio-mode",
        icon: (
          <Clapperboard
            fill="var(--primary)"
            className="size-4"
            strokeWidth={1.5}
          />
        ),
      },
      {
        label: "Download App",
        sub: "Downloads for macOS & Windows",
        href: "/download",
      },
      {
        label: "Open Source",
        sub: "Cap is open source and available on GitHub",
        href: "https://github.com/CapSoftware/Cap",
      },
      {
        label: "Self-host Cap",
        sub: "Self-host Cap on your own infrastructure",
        href: "/self-hosting",
      },
      {
        label: "Join the community",
        sub: "Join the Cap community on Discord",
        href: "https://cap.link/discord",
      },
    ],
  },
  {
    label: "Download",
    href: "/download",
  },
  {
    label: "Testimonials",
    href: "/testimonials",
  },
  {
    label: "Help",
    width: 480,
    dropdown: [
      {
        label: "Support",
        sub: "Get help via Discord, email, and more",
        href: "/support",
      },
      {
        label: "Documentation",
        sub: "Documentation for using Cap",
        href: "/docs",
      },
      {
        label: "FAQs",
        sub: "Frequently asked questions about Cap",
        href: "/faq",
      },
      {
        label: "Chat support",
        sub: "Support via chat",
        href: "https://discord.gg/y8gdQ3WRN3",
      },
    ],
  },
  {
    label: "About",
    href: "/about",
  },
  {
    label: "Blog",
    href: "/blog",
  },
  {
    label: "Pricing",
    href: "/pricing",
  },
]

const dropdownStyle = (width: number | undefined): CSSProperties => ({
  width: width ?? 460,
  maxWidth: "calc(100vw - 2rem)",
})

export function DesktopNavLinks() {
  const pathname = usePathname()
  const previousPathname = useRef(pathname)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  useEffect(() => {
    if (previousPathname.current === pathname) {
      return
    }

    previousPathname.current = pathname
    setOpenDropdown(null)
  }, [pathname])

  const closeDropdown = () => setOpenDropdown(null)

  const closeDropdownIfFocusLeaves = (
    event: FocusEvent<HTMLLIElement>,
    label: string
  ) => {
    const nextFocusedElement = event.relatedTarget

    if (
      nextFocusedElement instanceof Node &&
      event.currentTarget.contains(nextFocusedElement)
    ) {
      return
    }

    setOpenDropdown((current) => (current === label ? null : current))
  }

  return (
    <nav aria-label="Main">
      <ul className="flex list-none items-center px-0">
        {Links.map((link) => {
          const isOpen = openDropdown === link.label

          return (
            <li
              key={link.label}
              className="relative"
              onMouseEnter={() => setOpenDropdown(link.label)}
              onMouseLeave={() =>
                setOpenDropdown((current) =>
                  current === link.label ? null : current
                )
              }
              onBlur={(event) => closeDropdownIfFocusLeaves(event, link.label)}
            >
              {link.dropdown ? (
                <>
                  <button
                    type="button"
                    aria-haspopup="true"
                    aria-expanded={isOpen}
                    onFocus={() => setOpenDropdown(link.label)}
                    onClick={() => setOpenDropdown(link.label)}
                    className={classNames(
                      navigationMenuTriggerStyle(),
                      "flex items-center gap-1 px-2 py-0 text-sm font-medium text-muted-foreground transition-colors hover:text-primary focus:text-primary",
                      isOpen && "text-primary"
                    )}
                  >
                    {link.label}
                    <ChevronDown
                      className={classNames(
                        "size-3.5 transition-transform duration-200 ease-out",
                        isOpen && "rotate-180"
                      )}
                      strokeWidth={2.25}
                      aria-hidden="true"
                    />
                  </button>
                  <div
                    className={classNames(
                      "absolute top-full left-1/2 z-50 -translate-x-1/2 pt-3 transition duration-150",
                      isOpen
                        ? "visible block opacity-100"
                        : "invisible hidden opacity-0"
                    )}
                  >
                    <div className="relative" style={dropdownStyle(link.width)}>
                      <span
                        className="absolute top-[-7px] left-1/2 z-10 size-3.5 -translate-x-1/2 rotate-45 rounded-tl-[4px] border-t border-l border-border bg-background"
                        aria-hidden="true"
                      />
                      <div className="relative overflow-hidden rounded-2xl border border-border bg-background shadow-xl">
                        <ul className="grid list-none grid-cols-2 gap-1.5 p-3">
                          {link.dropdown.map((sublink) => (
                            <li key={sublink.href}>
                              <Link
                                href={sublink.href}
                                onClick={closeDropdown}
                                className="group/item block rounded-xl p-3 transition-colors duration-200 outline-none hover:bg-muted focus-visible:bg-muted"
                              >
                                <div className="mb-0.5 flex items-center gap-2 text-sm font-semibold text-foreground">
                                  {sublink.icon}
                                  <span>{sublink.label}</span>
                                </div>
                                <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                  {sublink.sub}
                                </p>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <Link
                  href={link.href ?? "#"}
                  onClick={closeDropdown}
                  className={classNames(
                    navigationMenuTriggerStyle(),
                    "px-2 py-0 text-sm font-medium text-muted-foreground hover:text-primary focus:text-primary"
                  )}
                >
                  {link.label}
                </Link>
              )}
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
