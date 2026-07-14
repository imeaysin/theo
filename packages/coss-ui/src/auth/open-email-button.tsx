"use client"

import { SquareArrowOutUpRight } from "lucide-react"
import { getEmailProviderLink } from "@workspace/auth/react"
import { Button } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"

export type OpenEmailButtonProps = {
  email: string
  label?: string
  className?: string
}

export function OpenEmailButton({
  email,
  label,
  className,
}: OpenEmailButtonProps) {
  const provider = getEmailProviderLink(email)
  if (!provider) return null

  const buttonLabel = label ?? `Open ${provider.providerName}`

  return (
    <Button
      className={cn("w-full", className)}
      render={
        <a href={provider.loginUrl} rel="noopener noreferrer" target="_blank" />
      }
      size="lg"
      type="button"
      variant="outline"
    >
      {buttonLabel}
      <SquareArrowOutUpRight aria-hidden="true" />
    </Button>
  )
}
