import type { ReactNode } from "react"
import {
  MaterialIcon,
  type MaterialIconName,
} from "@workspace/ui/components/material-icon"
import { cn } from "@workspace/ui/lib/utils"

export interface LandingFeatureTileProps {
  href: string
  icon: MaterialIconName
  title: string
  description: string
  className?: string
}

export function LandingFeatureTile({
  href,
  icon,
  title,
  description,
  className,
}: LandingFeatureTileProps) {
  return (
    <a
      className={cn(
        "flex w-full touch-manipulation flex-col items-center sm:w-[150px]",
        className
      )}
      href={href}
    >
      <div className="mb-4 flex h-[60px] w-[60px] items-center justify-center rounded-none border border-border bg-secondary transition-all duration-200 hover:border-muted-foreground">
        <MaterialIcon
          className="text-muted-foreground"
          name={icon}
          size={24}
        />
      </div>
      <div className="flex flex-col items-center text-center">
        <h3 className="text-sm leading-[21px] text-foreground">{title}</h3>
        <p className="text-sm leading-[21px] text-muted-foreground">
          {description}
        </p>
      </div>
    </a>
  )
}

export interface LandingIntegrationPillProps {
  href: string
  logo: ReactNode
  label: string
  className?: string
}

export function LandingIntegrationPill({
  href,
  logo,
  label,
  className,
}: LandingIntegrationPillProps) {
  return (
    <a
      className={cn(
        "flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 text-sm whitespace-nowrap transition-colors hover:border-foreground/20",
        className
      )}
      href={href}
    >
      <span className="flex size-4 shrink-0 items-center justify-center [&_img]:size-full [&_img]:object-contain [&_svg]:size-full">
        {logo}
      </span>
      <span className="text-foreground">{label}</span>
    </a>
  )
}
