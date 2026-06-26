"use client"

import { cn } from "@workspace/ui/lib/utils"

interface IntegrationLogoProps {
  id: string
  logoUrl?: string
  className?: string
  alt?: string
}

const logoById: Record<string, string> = {
  gmail: "/images/gmail.svg",
  outlook: "/images/outlook.svg",
  slack: "/images/slack.svg",
  stripe: "/images/stripe.svg",
  "google-drive": "/images/gdrive.svg",
  dropbox: "/images/dropbox.svg",
  whatsapp: "/images/whatsapp.svg",
  xero: "/images/xero.svg",
  quickbooks: "/images/quickbooks.svg",
  fortnox: "/images/fortnox.svg",
}

export function IntegrationLogo({
  id,
  logoUrl,
  className,
  alt,
}: IntegrationLogoProps) {
  const src = logoUrl ?? logoById[id]

  if (!src) {
    return (
      <div
        className={cn(
          "flex size-full items-center justify-center bg-muted text-xs font-medium text-muted-foreground",
          className
        )}
      >
        {id.charAt(0).toUpperCase()}
      </div>
    )
  }

  return (
    <img
      alt={alt ?? id}
      className={cn("size-full object-contain", className)}
      height={16}
      src={src}
      width={16}
    />
  )
}
