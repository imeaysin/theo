"use client"

import { Button, Logo } from "@/components/product-ui"
import { productConfig } from "@workspace/config/public"
import { cn } from "@workspace/ui/lib/utils"
import { ArrowUpRight, Menu, X } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  type ReactNode,
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
} from "react"
import { createPortal } from "react-dom"

interface MobileMenuProps {
  stars?: string
}

interface NavLink {
  href: string
  text: string
  external?: boolean
  icon?: ReactNode
}

const primaryLinks: NavLink[] = [
  { href: "/features", text: "Features" },
  { href: "/pricing", text: "Pricing" },
  { href: "/download", text: "Download" },
  { href: "/blog", text: "Blog" },
  { href: "/about", text: "About" },
  { href: "/support", text: "Support" },
  { href: "/faq", text: "FAQ" },
]

const GitHubIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    className="size-4"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
)

const secondaryLinks: NavLink[] = [
  {
    href: productConfig.repositoryUrl,
    text: "Open source",
    external: true,
    icon: <GitHubIcon />,
  },
  {
    href: "/migrate",
    text: "Migrate from another tool",
  },
]

const subscribeToHydration = () => () => undefined
const getClientSnapshot = () => true
const getServerSnapshot = () => false

const MobileMenu = ({ stars }: MobileMenuProps) => {
  const pathname = usePathname()
  const menuId = useId()
  const [open, setOpen] = useState(false)
  const [visible, setVisible] = useState(false)
  const [active, setActive] = useState(false)
  const mounted = useSyncExternalStore(
    subscribeToHydration,
    getClientSnapshot,
    getServerSnapshot
  )
  const triggerRef = useRef<HTMLButtonElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const previousPathname = useRef(pathname)

  useEffect(() => {
    if (open) {
      let activeFrame = 0
      const visibleFrame = requestAnimationFrame(() => {
        setVisible(true)
        activeFrame = requestAnimationFrame(() => setActive(true))
      })
      return () => {
        cancelAnimationFrame(visibleFrame)
        cancelAnimationFrame(activeFrame)
      }
    }

    const frame = requestAnimationFrame(() => setActive(false))
    const timeout = setTimeout(() => setVisible(false), 280)
    return () => {
      cancelAnimationFrame(frame)
      clearTimeout(timeout)
    }
  }, [open])

  useEffect(() => {
    if (previousPathname.current !== pathname) {
      previousPathname.current = pathname
      setOpen(false)
    }
  }, [pathname])

  useEffect(() => {
    const query = window.matchMedia("(min-width: 1024px)")
    const onChange = (event: MediaQueryListEvent) => {
      if (event.matches) setOpen(false)
    }
    query.addEventListener("change", onChange)
    return () => query.removeEventListener("change", onChange)
  }, [])

  useEffect(() => {
    if (!open) return

    const html = document.documentElement
    const { body } = document
    const scrollbarWidth = window.innerWidth - html.clientWidth
    const previousOverflow = html.style.overflow
    const previousPaddingRight = body.style.paddingRight

    html.style.overflow = "hidden"
    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${scrollbarWidth}px`
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false)
    }
    window.addEventListener("keydown", onKeyDown)

    return () => {
      html.style.overflow = previousOverflow
      body.style.paddingRight = previousPaddingRight
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [open])

  useEffect(() => {
    if (active) closeRef.current?.focus()
  }, [active])

  const wasVisible = useRef(false)
  useEffect(() => {
    if (wasVisible.current && !visible) triggerRef.current?.focus()
    wasVisible.current = visible
  }, [visible])

  const isActivePath = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(`${href}/`))

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-label="Open menu"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen(true)}
        className="-mr-1 inline-flex size-9 items-center justify-center rounded-xl text-foreground transition-colors hover:bg-muted active:scale-95"
      >
        <Menu className="size-5" strokeWidth={2} aria-hidden="true" />
      </button>

      {mounted && visible
        ? createPortal(
            <div
              id={menuId}
              role="dialog"
              aria-modal="true"
              aria-label="Site navigation"
              className="fixed inset-0 z-100 lg:hidden"
            >
              <button
                type="button"
                aria-label="Close menu"
                tabIndex={-1}
                onClick={() => setOpen(false)}
                className={cn(
                  "absolute inset-0 bg-foreground/40 backdrop-blur-[2px] transition-opacity duration-300 ease-out motion-reduce:transition-none",
                  active ? "opacity-100" : "opacity-0"
                )}
              />

              <div
                className={cn(
                  "absolute inset-x-3 top-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] flex flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-xl transition-all duration-300 ease-out motion-reduce:transition-none",
                  active
                    ? "translate-y-0 opacity-100"
                    : "-translate-y-2 opacity-0"
                )}
              >
                <div className="flex h-14 shrink-0 items-center justify-between border-b border-border px-4">
                  <Link
                    href="/"
                    aria-label="Home"
                    onClick={() => setOpen(false)}
                    className="rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <Logo className="h-8" />
                  </Link>
                  <button
                    ref={closeRef}
                    type="button"
                    aria-label="Close menu"
                    onClick={() => setOpen(false)}
                    className="inline-flex size-9 items-center justify-center rounded-xl bg-muted text-foreground transition-colors hover:bg-muted/80 active:scale-95"
                  >
                    <X
                      className="size-4"
                      strokeWidth={2.25}
                      aria-hidden="true"
                    />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto overscroll-contain px-3 py-4">
                  <p className="mb-2 px-3 text-xs font-medium tracking-[0.14em] text-muted-foreground uppercase">
                    Explore
                  </p>
                  <nav aria-label="Primary">
                    <ul className="flex list-none flex-col gap-0.5">
                      {primaryLinks.map((link, index) => {
                        const current = isActivePath(link.href)
                        return (
                          <li
                            key={link.href}
                            className={cn(
                              "transition-all duration-300 ease-out motion-reduce:transition-none",
                              active
                                ? "translate-y-0 opacity-100"
                                : "translate-y-1 opacity-0"
                            )}
                            style={{
                              transitionDelay: active
                                ? `${80 + index * 30}ms`
                                : "0ms",
                            }}
                          >
                            <Link
                              href={link.href}
                              onClick={() => setOpen(false)}
                              aria-current={current ? "page" : undefined}
                              className={cn(
                                "flex h-11 items-center rounded-xl px-3 text-[15px] font-medium transition-colors",
                                current
                                  ? "bg-muted text-foreground"
                                  : "text-foreground/80 hover:bg-muted/70 hover:text-foreground"
                              )}
                            >
                              {link.text}
                            </Link>
                          </li>
                        )
                      })}
                    </ul>
                  </nav>

                  <div className="my-4 h-px bg-border" />

                  <p className="mb-2 px-3 text-xs font-medium tracking-[0.14em] text-muted-foreground uppercase">
                    More
                  </p>
                  <ul className="flex list-none flex-col gap-0.5">
                    {secondaryLinks.map((link, index) => (
                      <li
                        key={link.href}
                        className={cn(
                          "transition-all duration-300 ease-out motion-reduce:transition-none",
                          active
                            ? "translate-y-0 opacity-100"
                            : "translate-y-1 opacity-0"
                        )}
                        style={{
                          transitionDelay: active
                            ? `${80 + (primaryLinks.length + index) * 30}ms`
                            : "0ms",
                        }}
                      >
                        <Link
                          href={link.href}
                          {...(link.external
                            ? {
                                target: "_blank",
                                rel: "noopener noreferrer",
                              }
                            : { onClick: () => setOpen(false) })}
                          className="flex h-10 items-center gap-2.5 rounded-xl px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/70 hover:text-foreground"
                        >
                          {link.icon}
                          <span className="flex-1 truncate">
                            {link.text === "Open source" && stars
                              ? `GitHub · ${stars} stars`
                              : link.text}
                          </span>
                          {link.external ? (
                            <ArrowUpRight
                              className="size-3.5 shrink-0 opacity-50"
                              aria-hidden="true"
                            />
                          ) : null}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex shrink-0 flex-col gap-2 border-t border-border bg-muted/30 px-3 pt-3 pb-3">
                  <Button
                    variant="dark"
                    href="/download"
                    size="lg"
                    className="w-full font-medium"
                    onClick={() => setOpen(false)}
                  >
                    Download for free
                  </Button>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="gray"
                      href={`${productConfig.siteUrl}/login`}
                      size="lg"
                      className="w-full font-medium"
                      onClick={() => setOpen(false)}
                    >
                      Login
                    </Button>
                    <Button
                      variant="outline"
                      href={`${productConfig.siteUrl}/signup`}
                      size="lg"
                      className="w-full font-medium"
                      onClick={() => setOpen(false)}
                    >
                      Sign up
                    </Button>
                  </div>
                </div>
              </div>
            </div>,
            document.body
          )
        : null}
    </>
  )
}

export default MobileMenu
