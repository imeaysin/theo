"use client"

import { Button } from "@/components/product-ui"

export default function UpgradeToPro({
  text = "Upgrade to Pro",
  onClick,
}: {
  text?: string
  onClick?: () => void
}) {
  return (
    <Button
      href="/pricing"
      onClick={onClick}
      size="lg"
      variant="blue"
      className="w-fit max-w-full font-medium"
    >
      {text}
    </Button>
  )
}
