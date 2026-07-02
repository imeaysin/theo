"use client"

import type React from "react"
import { createContext, useContext } from "react"
import { useMediaQuery } from "@workspace/ui/hooks/use-media-query"

export type PaneOverlayMode = "drawer" | "dialog" | "alert-dialog" | "sheet"

export type PaneLayout = "dialog" | "side"

export interface PaneRootProps {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  children?: React.ReactNode
  /** `dialog` = centered modal on desktop; `side` = edge sheet on desktop. */
  layout?: PaneLayout
}

const PaneOverlayModeContext = createContext<PaneOverlayMode>("dialog")

const PaneLayoutContext = createContext<PaneLayout>("dialog")

export function usePaneOverlayMode(): PaneOverlayMode {
  return useContext(PaneOverlayModeContext)
}

export function usePaneLayout(): PaneLayout {
  return useContext(PaneLayoutContext)
}

/** Matches Tailwind `md:` (768px) — bottom drawer below desktop shell layout. */
export function usePaneDrawer(): boolean {
  return useMediaQuery({ max: 767 })
}

export function PaneOverlayProvider({
  mode,
  layout = "dialog",
  children,
}: {
  mode: PaneOverlayMode
  layout?: PaneLayout
  children: React.ReactNode
}): React.ReactElement {
  return (
    <PaneOverlayModeContext.Provider value={mode}>
      <PaneLayoutContext.Provider value={layout}>
        {children}
      </PaneLayoutContext.Provider>
    </PaneOverlayModeContext.Provider>
  )
}

/** Picks drawer or desktop primitive based on pane overlay mode and layout. */
export function createPanePart<P extends object>(
  DialogComponent: React.ComponentType<P>,
  SheetComponent: React.ComponentType<P>,
  DrawerComponent: React.ComponentType<P>
) {
  function PanePart(props: P): React.ReactElement {
    const mode = usePaneOverlayMode()
    const layout = usePaneLayout()

    if (mode === "drawer") {
      return <DrawerComponent {...props} />
    }

    if (layout === "side" || mode === "sheet") {
      return <SheetComponent {...props} />
    }

    return <DialogComponent {...props} />
  }

  PanePart.displayName = `PanePart(${(DialogComponent as { displayName?: string }).displayName ?? "Dialog"})`

  return PanePart
}

/** Alert panes use alert-dialog chrome on desktop instead of dialog/sheet. */
export function createAlertPanePart<P extends object>(
  AlertComponent: React.ComponentType<P>,
  DrawerComponent: React.ComponentType<P>
) {
  function AlertPanePart(props: P): React.ReactElement {
    const mode = usePaneOverlayMode()

    if (mode === "drawer") {
      return <DrawerComponent {...props} />
    }

    return <AlertComponent {...props} />
  }

  AlertPanePart.displayName = `Pane.AlertPart(${(AlertComponent as { displayName?: string }).displayName ?? "Alert"})`

  return AlertPanePart
}
