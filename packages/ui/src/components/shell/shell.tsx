"use client"

import { ArrowLeftIcon } from "lucide-react"
import type React from "react"
import { useCallback, useState } from "react"
import { Button } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"
import { BannerContainer } from "./banners/layout-banner"
import {
  CommandPalette,
  useCommandPaletteShortcut,
} from "./command-palette"
import { MobileNavigation } from "./navigation/navigation"
import { ShellProvider, useShell } from "./shell-context"
import { SideBar } from "./sidebar"
import { TopNav } from "./top-nav"
import type {
  CommandAction,
  NavigationItemType,
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
  disableSticky,
  flexChildrenContainer,
  children,
}: ShellMainProps): React.ReactElement {
  const { Link } = useShell()

  const backButton = backPath ? (
    typeof backPath === "string" ? (
      <Button
        aria-label="Go back"
        className="mr-2 rounded-md"
        render={<Link href={backPath} />}
        size="icon-sm"
        variant="ghost"
      >
        <ArrowLeftIcon />
      </Button>
    ) : (
      <Button
        aria-label="Go back"
        className="mr-2 rounded-md"
        onClick={() =>
          onBack
            ? onBack()
            : typeof window !== "undefined" && window.history.back()
        }
        size="icon-sm"
        variant="ghost"
      >
        <ArrowLeftIcon />
      </Button>
    )
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
                    "inline max-w-28 truncate font-cal font-semibold tracking-wide text-foreground sm:max-w-72 md:max-w-80 xl:max-w-full",
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
              {CTA && (
                <div
                  className={cn(
                    backPath
                      ? "relative"
                      : "fixed right-4 bottom-20 z-40 md:relative md:right-0 md:bottom-auto md:z-auto",
                    "shrink-0"
                  )}
                >
                  {CTA}
                </div>
              )}
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
  // routing / i18n
  linkComponent?: ShellLinkComponent
  pathname?: string
  t?: (key: string) => string

  // navigation + identity
  navigation: NavigationItemType[]
  bottomNavItems?: NavigationItemType[]
  user?: ShellUser | null
  userLoading?: boolean
  onSignOut?: () => void
  userMenuItems?: UserMenuItem[]
  signOutLabel?: string

  // branding
  logo?: React.ReactNode
  logoIcon?: React.ReactNode
  brandLabel?: string
  homeHref?: string
  settingsHref?: string

  // command palette
  commandActions?: CommandAction[]
  onSelectCommandAction?: (action: CommandAction) => void
  commandPlaceholder?: string
  enableCommandPalette?: boolean

  // banners
  banners?: React.ReactNode

  // main content
  withoutMain?: boolean
}

export function Shell({
  linkComponent,
  pathname,
  t,
  navigation,
  bottomNavItems,
  user,
  userLoading,
  onSignOut,
  userMenuItems,
  signOutLabel,
  logo,
  logoIcon,
  brandLabel,
  homeHref = "/",
  settingsHref,
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
      <div className="flex min-h-screen flex-col bg-sidebar">
        {banners && <BannerContainer>{banners}</BannerContainer>}

        <div className="flex flex-1" data-testid="dashboard-shell">
          <SideBar
            bottomNavItems={bottomNavItems}
            brandLabel={brandLabel}
            logo={logoIcon ?? logo}
            homeHref={homeHref}
            navigation={navigation}
            onSignOut={onSignOut}
            signOutLabel={signOutLabel}
            user={user}
            userLoading={userLoading}
            userMenuItems={userMenuItems}
          />

          <div className="flex min-w-0 flex-1 flex-col md:p-2 md:pl-0 md:pr-2 lg:p-3 lg:pl-0 lg:pr-3">
            <main className="relative z-0 flex min-h-0 flex-1 flex-col overflow-hidden bg-background focus:outline-none md:rounded-2xl md:rounded-l-2xl">
              <TopNav
                brandLabel={brandLabel}
                homeHref={homeHref}
                logo={logo}
                onSignOut={onSignOut}
                signOutLabel={signOutLabel}
                user={user}
                userLoading={userLoading}
                userMenuItems={userMenuItems}
              />
              <div className="max-w-full flex-1 overflow-y-auto p-2 sm:p-4 lg:p-6">
                {withoutMain ? (
                  children
                ) : (
                  <ShellMain {...mainProps}>{children}</ShellMain>
                )}
                {!mainProps.backPath && (
                  <MobileNavigation items={navigation} />
                )}
              </div>
            </main>
          </div>
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
    </ShellProvider>
  )
}

export const AppShell = Shell

export { ShellProvider, useShell } from "./shell-context"
export type { ShellContextValue } from "./shell-context"
export {
  CommandPalette,
  CommandTrigger,
  useCommandPaletteShortcut,
} from "./command-palette"
export { SideBar } from "./sidebar"
export { TopNav } from "./top-nav"
export { BannerContainer } from "./banners/layout-banner"
export {
  Navigation,
  MobileNavigation,
  MobileNavigationMoreItems,
  MORE_SEPARATOR_NAME,
} from "./navigation/navigation"
export {
  NavigationItem,
  MobileNavigationItem,
  MobileNavigationMoreItem,
} from "./navigation/navigation-item"
export { UserDropdown } from "./user-dropdown/user-dropdown"
export type {
  CommandAction,
  NavigationItemType,
  ShellLinkComponent,
  ShellLinkProps,
  ShellUser,
  UserMenuItem,
} from "./types"
