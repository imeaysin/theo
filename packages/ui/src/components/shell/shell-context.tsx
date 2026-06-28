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

export interface ShellContextValue {
  /** Router-aware link component. Defaults to a plain anchor. */
  Link: ShellLinkComponent
  /** Current pathname used to resolve active navigation items. */
  pathname: string
  /** Optional label translator. Defaults to identity. */
  t: (key: string) => string
  /** Opens the command palette (no-op when disabled). */
  openCommandPalette: () => void
  /** Whether the command palette is mounted. */
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
  const resolvedPathname =
    pathname ??
    (typeof window !== "undefined" ? window.location.pathname : "/")

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
