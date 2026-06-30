"use client"

/**
 * App shell public API
 *
 * - `AppShell` — full dashboard layout (sidebar, mobile nav, command palette)
 * - `ShellMain` — optional page header wrapper inside the main area
 * - `NavItem` — navigation config passed to `AppShell`
 * - `MORE_SEPARATOR_NAME` — mobile "more" tab marker in nav config
 */

import type React from "react"
import { useCallback, useState } from "react"
import { cn } from "@workspace/ui/lib/utils"
import { BannerContainer } from "./banners/layout-banner"
import { CommandPalette, useCommandPaletteShortcut } from "./command-palette"
import { ShellMobileNav } from "./navigation/navigation"
import { ShellProvider } from "./shell-context"
import { SidebarStateProvider } from "./sidebar-state"
import { ShellBackButton } from "./shell-back-button"
import { getShellCtaClassName } from "./shell-layout"
import { ShellSidebar } from "./sidebar"
import { TopNav } from "./top-nav"
import type {
  CommandAction,
  NavItem,
  ShellLinkComponent,
  ShellUser,
  UserMenuItem,
} from "./types"

export interface ShellMainProps {
  heading?: React.ReactNode
  subtitle?: React.ReactNode
  CTA?: React.ReactNode
  actions?: React.ReactNode
  beforeCTAactions?: React.ReactNode
  afterHeading?: React.ReactNode
  headerClassName?: string
  smallHeading?: boolean
  large?: boolean
  backPath?: string | boolean
  onBack?: () => void
  disableSticky?: boolean
  flexChildrenContainer?: boolean
  children: React.ReactNode
}

export function ShellMain({
  heading,
  subtitle,
  CTA,
  actions,
  beforeCTAactions,
  afterHeading,
  headerClassName,
  smallHeading,
  large,
  backPath,
  onBack,
  disableSticky: _disableSticky,
  flexChildrenContainer,
  children,
}: ShellMainProps): React.ReactElement {
  const backButton =
    backPath != null && backPath !== false ? (
      <ShellBackButton backPath={backPath} onBack={onBack} />
    ) : null

  return (
    <>
      {(heading || !!backPath) && (
        <div
          className={cn(
            "flex items-center md:mt-0",
            smallHeading ? "lg:mb-7" : "lg:mb-8"
          )}
        >
          {backButton}
          {heading && (
            <header
              className={cn(
                "flex w-full max-w-full flex-wrap items-center gap-2 md:flex-nowrap md:gap-0",
                large && "py-8"
              )}
            >
              <div
                className={cn(
                  "hidden min-w-0 flex-1 truncate md:block",
                  headerClassName
                )}
              >
                <h3
                  className={cn(
                    "inline max-w-28 truncate font-heading tracking-wide text-foreground sm:max-w-72 md:max-w-80 xl:max-w-full",
                    smallHeading ? "text-base" : "text-xl"
                  )}
                >
                  {heading}
                </h3>
                {subtitle && (
                  <p
                    className="text-sm text-muted-foreground md:block"
                    data-testid="subtitle"
                  >
                    {subtitle}
                  </p>
                )}
              </div>
              {beforeCTAactions}
              {CTA ? (
                <div className={getShellCtaClassName(Boolean(backPath))}>
                  {CTA}
                </div>
              ) : null}
              {actions}
            </header>
          )}
        </div>
      )}
      {afterHeading}
      <div className={cn(flexChildrenContainer && "flex flex-1 flex-col")}>
        {children}
      </div>
    </>
  )
}

export interface ShellProps extends ShellMainProps {
  linkComponent?: ShellLinkComponent
  pathname?: string
  t?: (key: string) => string

  navigation: NavItem[]
  bottomNavItems?: NavItem[]
  user?: ShellUser | null
  userLoading?: boolean
  onSignOut?: () => void
  userMenuItems?: UserMenuItem[]
  signOutLabel?: string

  logo?: React.ReactNode
  logoIcon?: React.ReactNode
  brandLabel?: string
  homeHref?: string
  settingsHref?: string

  commandActions?: CommandAction[]
  onSelectCommandAction?: (action: CommandAction) => void
  commandPlaceholder?: string
  enableCommandPalette?: boolean

  banners?: React.ReactNode
  withoutMain?: boolean
}

export function Shell({
  linkComponent,
  pathname,
  t,
  navigation,
  bottomNavItems,
  user: _user,
  userLoading: _userLoading,
  onSignOut: _onSignOut,
  userMenuItems: _userMenuItems,
  signOutLabel: _signOutLabel,
  logo,
  logoIcon,
  brandLabel,
  homeHref = "/",
  settingsHref: _settingsHref,
  commandActions = [],
  onSelectCommandAction,
  commandPlaceholder,
  enableCommandPalette,
  banners,
  withoutMain,
  children,
  ...mainProps
}: ShellProps): React.ReactElement {
  const isCommandPaletteEnabled =
    enableCommandPalette ?? commandActions.length > 0
  const [commandOpen, setCommandOpen] = useState(false)

  const toggleCommandPalette = useCallback(() => {
    if (isCommandPaletteEnabled) setCommandOpen((value) => !value)
  }, [isCommandPaletteEnabled])

  const openCommandPalette = useCallback(() => {
    if (isCommandPaletteEnabled) setCommandOpen(true)
  }, [isCommandPaletteEnabled])

  useCommandPaletteShortcut(toggleCommandPalette)

  return (
    <ShellProvider
      isCommandPaletteEnabled={isCommandPaletteEnabled}
      linkComponent={linkComponent}
      openCommandPalette={openCommandPalette}
      pathname={pathname}
      t={t}
    >
      <SidebarStateProvider>
        <div className="flex min-h-screen flex-col bg-sidebar">
          {banners && <BannerContainer>{banners}</BannerContainer>}

          <div className="flex flex-1" data-testid="dashboard-shell">
            <ShellSidebar
              bottomNavItems={bottomNavItems}
              brandLabel={brandLabel}
              homeHref={homeHref}
              logo={logoIcon ?? logo}
              navigation={navigation}
            />

            <main
              className={cn(
                "relative z-0 flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-background focus:outline-none md:m-2 md:ms-0 md:rounded-xl md:shadow-sm/5"
              )}
            >
              <TopNav
                brandLabel={brandLabel}
                homeHref={homeHref}
                logo={logo}
              />
              <div className="max-w-full flex-1 overflow-y-auto p-2 sm:p-4 lg:p-6">
                {withoutMain ? (
                  children
                ) : (
                  <ShellMain {...mainProps}>{children}</ShellMain>
                )}
                {!mainProps.backPath && (
                  <ShellMobileNav
                    bottomNavItems={bottomNavItems}
                    items={navigation}
                  />
                )}
              </div>
            </main>
          </div>
        </div>

        {isCommandPaletteEnabled && (
          <CommandPalette
            actions={commandActions}
            onOpenChange={setCommandOpen}
            onSelectAction={onSelectCommandAction}
            open={commandOpen}
            placeholder={commandPlaceholder}
          />
        )}
      </SidebarStateProvider>
    </ShellProvider>
  )
}

export const AppShell = Shell

export { flattenNavItems } from "./navigation/navigation-utils"
export { MORE_SEPARATOR_NAME } from "./navigation/navigation"

export type {
  CommandAction,
  NavItem,
  NavigationItemType,
  ShellLinkComponent,
  ShellLinkProps,
  ShellUser,
  UserMenuItem,
} from "./types"
