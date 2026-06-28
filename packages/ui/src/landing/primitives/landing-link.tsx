import type { ReactNode } from "react"
import { Button, type ButtonProps } from "@workspace/ui/components/button"

export interface LandingLinkProps extends Omit<ButtonProps, "render"> {
  href: string
  external?: boolean
  children: ReactNode
}

export function LandingLink({
  href,
  external = false,
  children,
  variant = "link",
  ...props
}: LandingLinkProps) {
  return (
    <Button
      render={
        <a
          href={href}
          rel={external ? "noopener noreferrer" : undefined}
          target={external ? "_blank" : undefined}
        />
      }
      variant={variant}
      {...props}
    >
      {children}
    </Button>
  )
}
