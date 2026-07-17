"use client"

import { Badge } from "@workspace/ui-shadcn/components/badge"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@workspace/ui-shadcn/components/toggle-group"

interface BillingToggleOption {
  value: string
  label: string
  badge?: string
}

interface BillingToggleProps {
  options: readonly [BillingToggleOption, BillingToggleOption]
  value: string
  onChange: (value: string) => void
  ariaLabel?: string
}

export const BillingToggle = ({
  options,
  value,
  onChange,
  ariaLabel,
}: BillingToggleProps) => {
  return (
    <ToggleGroup
      aria-label={ariaLabel}
      value={[value]}
      onValueChange={(values) => {
        const selected = values[0]
        if (selected) onChange(selected)
      }}
      variant="outline"
      spacing={0}
      className="w-full"
    >
      {options.map((option) => (
        <ToggleGroupItem
          key={option.value}
          value={option.value}
          className="flex-1"
        >
          {option.label}
          {option.badge ? <Badge>{option.badge}</Badge> : null}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}
