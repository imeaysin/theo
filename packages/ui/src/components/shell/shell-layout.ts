import { cn } from "@workspace/ui/lib/utils"

export function getShellCtaClassName(hasBackPath: boolean): string {
  if (hasBackPath) {
    return "relative shrink-0"
  }

  return cn(
    "fixed right-4 bottom-20 z-40 shrink-0",
    "md:relative md:right-0 md:bottom-auto md:z-auto"
  )
}
