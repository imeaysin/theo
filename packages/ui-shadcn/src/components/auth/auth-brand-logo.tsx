import { Icons } from "@workspace/ui-shadcn/components/icons"
import { cn } from "@workspace/ui-shadcn/lib/utils"

type AuthBrandLogoProps = {
  className?: string
}

export function AuthBrandLogo({ className }: AuthBrandLogoProps) {
  return (
    <Icons.LogoSmall
      aria-hidden="true"
      className={cn("size-6 text-foreground", className)}
    />
  )
}
