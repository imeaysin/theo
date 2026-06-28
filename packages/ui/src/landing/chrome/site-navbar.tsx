"use client"

import type { ReactNode } from "react"
import { motion } from "motion/react"
import { cn } from "@workspace/ui/lib/utils"

interface SiteNavbarProps {
  brand: ReactNode
  desktopNavigation?: ReactNode
  actions?: ReactNode
  mobileMenu?: ReactNode
  overlay?: ReactNode
  transparent?: boolean
  isMenuOpen?: boolean
  onMenuToggle?: () => void
  className?: string
  navClassName?: string
}

export function SiteNavbar({
  brand,
  desktopNavigation,
  actions,
  mobileMenu,
  overlay,
  transparent = false,
  isMenuOpen = false,
  onMenuToggle,
  className,
  navClassName,
}: SiteNavbarProps) {
  return (
    <>
      {overlay}

      <nav className={cn("fixed top-9 right-0 left-0 z-50 w-full", className)}>
        <div
          className={cn(
            "relative flex items-center justify-between px-4 py-3 xl:gap-6 xl:px-6 xl:py-4 2xl:px-8",
            isMenuOpen && "border-b border-border",
            !transparent && "bg-background-semi-transparent backdrop-blur-md",
            navClassName
          )}
        >
          {brand}

          {desktopNavigation}

          {actions ? (
            <div className="hidden items-center gap-3 xl:flex">{actions}</div>
          ) : null}

          <div className="flex items-center xl:hidden">
            <NavbarMenuButton
              isOpen={isMenuOpen}
              onClick={onMenuToggle ?? (() => undefined)}
            />
          </div>
        </div>
      </nav>

      {isMenuOpen && mobileMenu ? (
        <div className="fixed inset-0 z-40 bg-background xl:hidden">
          {mobileMenu}
        </div>
      ) : null}
    </>
  )
}

interface NavbarMenuButtonProps {
  isOpen: boolean
  onClick: () => void
  className?: string
}

export function NavbarMenuButton({
  isOpen,
  onClick,
  className,
}: NavbarMenuButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative flex min-h-[44px] min-w-[44px] items-center justify-end p-2 text-primary transition-colors hover:text-primary/80 focus:outline-none focus-visible:outline-none xl:active:text-primary",
        className
      )}
      style={{ WebkitTapHighlightColor: "transparent" }}
      aria-label={isOpen ? "Close menu" : "Open menu"}
    >
      <div className="relative flex size-5 flex-col items-center justify-center">
        <motion.span
          className="absolute h-[1.5px] w-4 rounded-none bg-current"
          animate={{ rotate: isOpen ? 45 : 0, y: isOpen ? 0 : -4.5 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        />
        <motion.span
          className="absolute h-[1.5px] w-4 rounded-none bg-current"
          animate={{ opacity: isOpen ? 0 : 1, scaleX: isOpen ? 0 : 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        />
        <motion.span
          className="absolute h-[1.5px] w-4 rounded-none bg-current"
          animate={{ rotate: isOpen ? -45 : 0, y: isOpen ? 0 : 4.5 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        />
      </div>
    </button>
  )
}

interface NavbarDropdownOverlayProps {
  visible: boolean
  topOffset?: string
}

export function NavbarDropdownOverlay({
  visible,
  topOffset = "108px",
}: NavbarDropdownOverlayProps) {
  return (
    <div
      className={cn(
        "fixed right-0 bottom-0 left-0 z-40 bg-black/40 transition-opacity duration-150",
        visible
          ? "visible opacity-100"
          : "pointer-events-none invisible opacity-0"
      )}
      style={{ top: topOffset }}
    />
  )
}

interface NavbarBrandProps {
  href: string
  logo: ReactNode
  label?: string
  onClick?: () => void
}

export function NavbarBrand({ href, logo, label, onClick }: NavbarBrandProps) {
  return (
    <a
      href={href}
      onClick={onClick}
      className="flex touch-manipulation items-center gap-2 transition-opacity duration-200 hover:opacity-80 active:opacity-80"
      style={{ WebkitTapHighlightColor: "transparent" }}
    >
      {logo}
      {label ? (
        <span className="font-sans text-base text-foreground xl:hidden">
          {label}
        </span>
      ) : null}
    </a>
  )
}
