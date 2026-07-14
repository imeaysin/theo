import { cn } from "@workspace/ui/lib/utils"

/** Height of the fixed mobile bottom tab bar (excluding safe area). */
export const shellMobileBottomNavHeight = "4.5rem"

/** Consistent FAB / floating CTA inset from screen edges and above the tab bar. */
export const shellMobileFabInset = "1rem"

export const shellContentClassName = cn(
  "flex max-w-full flex-1 flex-col overflow-x-hidden overflow-y-auto",
  "px-4 pt-4 sm:px-6 md:px-8 md:pb-4 lg:py-6"
)

export const shellMobileBottomSpacerClassName = cn(
  "pointer-events-none shrink-0 md:hidden",
  "h-[calc(var(--shell-mobile-bottom-nav-height)+env(safe-area-inset-bottom,0px))]"
)

export const shellMobileBottomNavClassName = cn(
  "fixed bottom-0 left-0 z-30 flex w-full border-t border-border bg-background/95 shadow-[0_-4px_24px_-4px] shadow-black/5 backdrop-blur-md",
  "px-2 pt-1 pb-[max(0.5rem,env(safe-area-inset-bottom))]",
  "md:hidden"
)

export function getShellCtaClassName(hasBackPath: boolean): string {
  if (hasBackPath) {
    return "relative shrink-0"
  }

  return cn(
    "fixed z-40 shrink-0 shadow-lg",
    "end-[var(--shell-mobile-fab-inset)]",
    "bottom-[calc(var(--shell-mobile-bottom-nav-height)+env(safe-area-inset-bottom,0px)+var(--shell-mobile-fab-inset))]",
    "md:relative md:end-auto md:bottom-auto md:z-auto md:shadow-none"
  )
}

/** Page header block — stacks on mobile, row on desktop. */
export const shellMainHeaderClassName = cn(
  "flex w-full max-w-full min-w-0 flex-col gap-3",
  "md:flex-row md:items-center md:justify-between md:gap-4"
)

export const shellMainHeadingClassName = cn(
  "font-heading tracking-wide text-foreground",
  "text-xl sm:text-2xl"
)

export const shellMainSubtitleClassName = cn(
  "mt-1.5 max-w-prose text-sm leading-relaxed text-pretty text-muted-foreground",
  "sm:mt-2"
)

/** Space between page header and main content at every breakpoint. */
export function getShellMainSectionClassName(compact: boolean): string {
  return cn("mb-6 sm:mb-7", compact ? "lg:mb-7" : "lg:mb-8")
}

export const shellPageStackClassName = "flex flex-col gap-5 sm:gap-6"

/** Prevents scrollable content from sitting under the mobile FAB. */
export const shellMainContentWithCtaClassName = cn("pb-[3.75rem]", "md:pb-0")
