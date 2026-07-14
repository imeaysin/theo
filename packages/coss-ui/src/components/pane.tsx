"use client"

import type React from "react"
import {
  AlertDialog,
  AlertDialogClose,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogPopup,
  AlertDialogTitle,
} from "@workspace/ui/components/alert-dialog"
import {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPanel,
  DialogPopup,
  DialogTitle,
} from "@workspace/ui/components/dialog"
import {
  Drawer,
  DrawerClose,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerPanel,
  DrawerPopup,
  DrawerTitle,
} from "@workspace/ui/components/drawer"
import {
  createAlertPanePart,
  createPanePart,
  PaneOverlayProvider,
  type PaneRootProps,
  usePaneDrawer,
  usePaneLayout,
} from "@workspace/ui/components/pane-overlay"
import {
  Sheet,
  SheetClose,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetPanel,
  SheetPopup,
  SheetTitle,
} from "@workspace/ui/components/sheet"

type DialogPopupProps = React.ComponentProps<typeof DialogPopup>
type SheetPopupProps = React.ComponentProps<typeof SheetPopup>

function PaneRoot({
  layout = "side",
  open,
  defaultOpen,
  onOpenChange,
  children,
}: PaneRootProps): React.ReactElement {
  const isDrawer = usePaneDrawer()

  if (isDrawer) {
    return (
      <PaneOverlayProvider layout={layout} mode="drawer">
        <Drawer
          defaultOpen={defaultOpen}
          onOpenChange={onOpenChange}
          open={open}
          position="bottom"
        >
          {children}
        </Drawer>
      </PaneOverlayProvider>
    )
  }

  if (layout === "side") {
    return (
      <PaneOverlayProvider layout={layout} mode="sheet">
        <Sheet
          defaultOpen={defaultOpen}
          onOpenChange={onOpenChange}
          open={open}
        >
          {children}
        </Sheet>
      </PaneOverlayProvider>
    )
  }

  return (
    <PaneOverlayProvider layout={layout} mode="dialog">
      <Dialog defaultOpen={defaultOpen} onOpenChange={onOpenChange} open={open}>
        {children}
      </Dialog>
    </PaneOverlayProvider>
  )
}

function PaneContent({
  showCloseButton = true,
  className,
  children,
  closeProps,
  portalProps,
  side = "right",
  variant = "inset",
}: {
  showCloseButton?: boolean
  className?: string
  children?: React.ReactNode
  closeProps?: React.ComponentProps<typeof DialogClose>
  portalProps?: DialogPopupProps["portalProps"]
  side?: SheetPopupProps["side"]
  variant?: SheetPopupProps["variant"]
}): React.ReactElement {
  const isDrawer = usePaneDrawer()
  const layout = usePaneLayout()

  if (isDrawer) {
    return (
      <DrawerPopup
        className={className}
        showBar
        showCloseButton={showCloseButton}
      >
        {children}
      </DrawerPopup>
    )
  }

  if (layout === "side") {
    return (
      <SheetPopup
        className={className}
        closeProps={closeProps as React.ComponentProps<typeof SheetClose>}
        portalProps={portalProps}
        showCloseButton={showCloseButton}
        side={side}
        variant={variant}
      >
        {children}
      </SheetPopup>
    )
  }

  return (
    <DialogPopup
      bottomStickOnMobile={false}
      className={className}
      closeProps={closeProps}
      portalProps={portalProps}
      showCloseButton={showCloseButton}
    >
      {children}
    </DialogPopup>
  )
}

function PaneAlertRoot({
  open,
  defaultOpen,
  onOpenChange,
  children,
}: Omit<PaneRootProps, "layout">): React.ReactElement {
  const isDrawer = usePaneDrawer()

  if (isDrawer) {
    return (
      <PaneOverlayProvider layout="dialog" mode="drawer">
        <Drawer
          defaultOpen={defaultOpen}
          onOpenChange={onOpenChange}
          open={open}
          position="bottom"
        >
          {children}
        </Drawer>
      </PaneOverlayProvider>
    )
  }

  return (
    <PaneOverlayProvider layout="dialog" mode="alert-dialog">
      <AlertDialog
        defaultOpen={defaultOpen}
        onOpenChange={onOpenChange}
        open={open}
      >
        {children}
      </AlertDialog>
    </PaneOverlayProvider>
  )
}

function PaneAlertContent({
  className,
  children,
  portalProps,
}: {
  className?: string
  children?: React.ReactNode
  portalProps?: React.ComponentProps<typeof AlertDialogPopup>["portalProps"]
}): React.ReactElement {
  const isDrawer = usePaneDrawer()

  if (isDrawer) {
    return (
      <DrawerPopup className={className} showBar>
        {children}
      </DrawerPopup>
    )
  }

  return (
    <AlertDialogPopup
      bottomStickOnMobile={false}
      className={className}
      portalProps={portalProps}
    >
      {children}
    </AlertDialogPopup>
  )
}

const PaneHeader = createPanePart(DialogHeader, SheetHeader, DrawerHeader)
const PaneFooter = createPanePart(DialogFooter, SheetFooter, DrawerFooter)
const PaneTitle = createPanePart(DialogTitle, SheetTitle, DrawerTitle)
const PaneDescription = createPanePart(
  DialogDescription,
  SheetDescription,
  DrawerDescription
)
const PanePanel = createPanePart(DialogPanel, SheetPanel, DrawerPanel)
const PaneClose = createPanePart(DialogClose, SheetClose, DrawerClose)

const PaneAlertHeader = createAlertPanePart(AlertDialogHeader, DrawerHeader)
const PaneAlertFooter = createAlertPanePart(AlertDialogFooter, DrawerFooter)
const PaneAlertTitle = createAlertPanePart(AlertDialogTitle, DrawerTitle)
const PaneAlertDescription = createAlertPanePart(
  AlertDialogDescription,
  DrawerDescription
)
const PaneAlertClose = createAlertPanePart(AlertDialogClose, DrawerClose)

/** Edge sheet from the right on desktop, bottom drawer on mobile. Use `layout="dialog"` for centered modals. */
export const Pane = Object.assign(PaneRoot, {
  Content: PaneContent,
  Header: PaneHeader,
  Footer: PaneFooter,
  Title: PaneTitle,
  Description: PaneDescription,
  Panel: PanePanel,
  Close: PaneClose,
  Alert: Object.assign(PaneAlertRoot, {
    Content: PaneAlertContent,
    Header: PaneAlertHeader,
    Footer: PaneAlertFooter,
    Title: PaneAlertTitle,
    Description: PaneAlertDescription,
    Close: PaneAlertClose,
  }),
})

export type { PaneRootProps }
