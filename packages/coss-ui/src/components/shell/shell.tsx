"use client"

import type React from "react"
import { useCallback, useState } from "react"
import { cn } from "@workspace/ui/lib/utils"
import { CommandPalette, useCommandPaletteShortcut } from "./command-palette"
import { ShellMobileNav } from "./navigation/navigation"
import { ShellProvider } from "./shell-context"
import { shellContentClassName } from "./shell-layout"
import { ShellMain } from "./shell-main"
import { SidebarStateProvider, useSidebarState } from "./sidebar-state"
export { SidebarStateProvider, useSidebarState }
import { ShellSidebar } from "./sidebar"
import { TopNav } from "./top-nav"
import type { CommandAction, NavItem, ShellLinkComponent } from "./types"

export { ShellMain }
export { shellPageStackClassName } from "./shell-layout"
export type {
  ShellMainBackProps,
  ShellMainHeaderProps,
  ShellMainProps,
} from "./shell-main"

export type ShellProps = {
  linkComponent?: ShellLinkComponent
  pathname?: string
  navigation: NavItem[]
  logo?: React.ReactNode
  brandLabel?: string
  homeHref?: string
  commandActions?: CommandAction[]
  onSelectCommandAction?: (action: CommandAction) => void
  commandPlaceholder?: string
  userControl?: React.ReactNode
  sidebarUserControl?: React.ReactNode
  children: React.ReactNode
}

export function Shell({
  linkComponent,
  pathname,
  navigation,
  logo,
  brandLabel,
  homeHref = "/",
  commandActions = [],
  onSelectCommandAction,
  commandPlaceholder,
  userControl,
  sidebarUserControl,
  children,
}: ShellProps): React.ReactElement {
  const isCommandPaletteEnabled = commandActions.length > 0
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
    >
      <SidebarStateProvider>
        <div className="flex h-dvh min-h-0 flex-1 flex-col overflow-hidden bg-sidebar [--shell-mobile-bottom-nav-height:4.5rem] [--shell-mobile-fab-inset:1rem]">
          <div
            className="flex min-h-0 flex-1 overflow-hidden"
            data-testid="dashboard-shell"
          >
            <ShellSidebar
              brandLabel={brandLabel}
              homeHref={homeHref}
              logo={logo}
              navigation={navigation}
              sidebarUserControl={sidebarUserControl}
            />

            <main
              className={cn(
                "relative z-0 flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-background focus:outline-none",
                "md:m-2 md:ms-0 md:rounded-xl md:shadow-sm/5"
              )}
            >
              <TopNav
                brandLabel={brandLabel}
                homeHref={homeHref}
                logo={logo}
                userControl={userControl}
              />
              <div className={shellContentClassName}>
                {children}
                <ShellMobileNav items={navigation} />
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

export { flattenNavItems } from "./navigation/navigation-utils"

export type {
  CommandAction,
  NavItem,
  ShellLinkComponent,
  ShellLinkProps,
} from "./types"
