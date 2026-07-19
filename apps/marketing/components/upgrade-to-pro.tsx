"use client"

import { Button } from "@/components/product-ui"
import { productConfig } from "@workspace/config/public"

export default function UpgradeToPro({
  text,
  onClick,
}: {
  text?: string
  onClick?: () => void
}) {
  const label = text ?? `Get ${productConfig.name} Pro`

  return (
    <Button
      href="/pricing"
      onClick={onClick}
      size="lg"
      variant="outline"
      className="w-full font-medium sm:w-auto"
    >
      {label}
    </Button>
  )
}
