"use client"

import type React from "react"
import { createContext, useContext, useMemo } from "react"
import type { ShellLinkComponent, ShellLinkProps } from "./types"

const DefaultLink: ShellLinkComponent = ({
  href,
  children,
  ...props
}: ShellLinkProps) => (
  <a href={href} {...props}>
    {children}
  </a>
)

const identity = (key: string): string => key

const noop = (): void => undefined

function resolvePathname(pathname?: string): string {
  if (pathname) return pathname
  if (typeof window !== "undefined") return window.location.pathname
  return "/"
}

export interface ShellContextValue {
  Link: ShellLinkComponent
  pathname: string
  t: (key: string) => string
  openCommandPalette: () => void
  isCommandPaletteEnabled: boolean
}

const ShellContext = createContext<ShellContextValue | null>(null)

export function useShell(): ShellContextValue {
  const ctx = useContext(ShellContext)
  if (!ctx) {
    throw new Error("useShell must be used within a <Shell> / <AppShell>")
  }
  return ctx
}

export interface ShellProviderProps {
  linkComponent?: ShellLinkComponent
  pathname?: string
  t?: (key: string) => string
  openCommandPalette?: () => void
  isCommandPaletteEnabled?: boolean
  children: React.ReactNode
}

export function ShellProvider({
  linkComponent,
  pathname,
  t,
  openCommandPalette,
  isCommandPaletteEnabled = false,
  children,
}: ShellProviderProps): React.ReactElement {
  const resolvedPathname = resolvePathname(pathname)

  const value = useMemo<ShellContextValue>(
    () => ({
      Link: linkComponent ?? DefaultLink,
      pathname: resolvedPathname,
      t: t ?? identity,
      openCommandPalette: openCommandPalette ?? noop,
      isCommandPaletteEnabled,
    }),
    [
      linkComponent,
      resolvedPathname,
      t,
      openCommandPalette,
      isCommandPaletteEnabled,
    ]
  )

  return <ShellContext.Provider value={value}>{children}</ShellContext.Provider>
}

export type { ShellLinkProps }
