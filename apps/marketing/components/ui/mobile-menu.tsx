"use client"

import { Button, Logo } from "@/components/product-ui"
import { cn as classNames } from "@workspace/ui-shadcn/lib/utils"
import { Menu, X } from "lucide-react"
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
  { href: "/pricing", text: "Pricing" },
  { href: "/download", text: "Download" },
  { href: "/blog", text: "Blog" },
  { href: "/about", text: "About" },
  { href: "/testimonials", text: "Testimonials" },
  { href: "/faq", text: "FAQs" },
]

const secondaryLinks: NavLink[] = [
  {
    href: "https://github.com/imeaysin/theo",
    text: "Open Source",
    external: true,
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        className="size-5"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
      </svg>
    ),
  },
  {
    href: "https://discord.gg/y8gdQ3WRN3",
    text: "Join the community",
    external: true,
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        className="size-5"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
      </svg>
    ),
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
    const timeout = setTimeout(() => setVisible(false), 300)
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
      if (event.matches) {
        setOpen(false)
      }
    }

    query.addEventListener("change", onChange)
    return () => query.removeEventListener("change", onChange)
  }, [])

  useEffect(() => {
    if (!open) {
      return
    }

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
      if (event.key === "Escape") {
        setOpen(false)
      }
    }

    window.addEventListener("keydown", onKeyDown)

    return () => {
      html.style.overflow = previousOverflow
      body.style.paddingRight = previousPaddingRight
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [open])

  useEffect(() => {
    if (active) {
      closeRef.current?.focus()
    }
  }, [active])

  const wasVisible = useRef(false)
  useEffect(() => {
    if (wasVisible.current && !visible) {
      triggerRef.current?.focus()
    }
    wasVisible.current = visible
  }, [visible])

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
        className="-mr-1 inline-flex size-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-muted active:scale-95"
      >
        <Menu className="size-6" strokeWidth={2} aria-hidden="true" />
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
                className={classNames(
                  "absolute inset-0 bg-foreground/50 backdrop-blur-sm transition-opacity duration-300 ease-out motion-reduce:transition-none",
                  active ? "opacity-100" : "opacity-0"
                )}
              />

              <div
                className={classNames(
                  "absolute inset-x-0 top-0 flex h-dvh flex-col overflow-hidden bg-card transition-opacity duration-300 ease-out motion-reduce:transition-none",
                  active ? "opacity-100" : "opacity-0"
                )}
              >
                <div className="flex h-[72px] shrink-0 items-center justify-between px-5 pt-[env(safe-area-inset-top)]">
                  <Link
                    href="/home"
                    aria-label="Theo home"
                    onClick={() => setOpen(false)}
                  >
                    <Logo viewBoxDimensions="0 0 120 40" className="h-9 w-20" />
                  </Link>
                  <button
                    ref={closeRef}
                    type="button"
                    aria-label="Close menu"
                    onClick={() => setOpen(false)}
                    className="inline-flex size-10 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-muted active:scale-95"
                  >
                    <X className="size-5" strokeWidth={2} aria-hidden="true" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto overscroll-contain px-5 pt-2 pb-6">
                  <nav aria-label="Primary">
                    <ul className="flex list-none flex-col gap-1">
                      {primaryLinks.map((link, index) => (
                        <li
                          key={link.href}
                          className={classNames(
                            "transition-opacity duration-300 ease-out motion-reduce:transition-none",
                            active ? "opacity-100" : "opacity-0"
                          )}
                          style={{
                            transitionDelay: active
                              ? `${250 + index * 45}ms`
                              : "0ms",
                          }}
                        >
                          <Link
                            href={link.href}
                            onClick={() => setOpen(false)}
                            className="-mx-4 flex h-12 items-center rounded-xl px-4 text-xl font-medium text-foreground transition-colors hover:bg-muted"
                          >
                            {link.text}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </nav>

                  <div className="my-5 h-px bg-muted" />

                  <ul className="flex list-none flex-col gap-1">
                    {secondaryLinks.map((link, index) => (
                      <li
                        key={link.href}
                        className={classNames(
                          "transition-opacity duration-300 ease-out motion-reduce:transition-none",
                          active ? "opacity-100" : "opacity-0"
                        )}
                        style={{
                          transitionDelay: active
                            ? `${250 + (primaryLinks.length + index) * 45}ms`
                            : "0ms",
                        }}
                      >
                        <Link
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="-mx-4 flex h-11 items-center gap-3 rounded-xl px-4 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        >
                          {link.icon}
                          <span className="text-base font-medium">
                            {link.text === "Open Source" && stars
                              ? `${stars} Stars on GitHub`
                              : link.text}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex shrink-0 flex-col gap-3 border-t border-border bg-card px-5 pt-4 pb-[calc(env(safe-area-inset-bottom)+24px)]">
                  <Button
                    variant="dark"
                    href="https://theo.example/signup"
                    size="lg"
                    className="w-full font-medium"
                    onClick={() => setOpen(false)}
                  >
                    Sign up
                  </Button>
                  <Button
                    variant="gray"
                    href="https://theo.example/login"
                    size="lg"
                    className="w-full font-medium"
                    onClick={() => setOpen(false)}
                  >
                    Login
                  </Button>
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
