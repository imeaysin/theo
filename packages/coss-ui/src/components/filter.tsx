"use client"

import { SearchIcon } from "lucide-react"
import type * as React from "react"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@workspace/ui/components/input-group"
import {
  Select,
  SelectButton,
  SelectItem,
  SelectPopup,
  SelectValue,
} from "@workspace/ui/components/select"
import { cn } from "@workspace/ui/lib/utils"

export const filterClassName = cn(
  "flex flex-col gap-3 sm:flex-row sm:items-center"
)

export type FilterOption<T extends string = string> = {
  value: T
  label: string
}

function FilterRoot({
  className,
  children,
  ...props
}: React.ComponentProps<"div">): React.ReactElement {
  return (
    <div
      className={cn(filterClassName, className)}
      data-slot="filter"
      {...props}
    >
      {children}
    </div>
  )
}

function FilterSearch({
  value,
  onChange,
  onValueChange,
  placeholder = "Search…",
  "aria-label": ariaLabel = "Search",
  className,
  ...props
}: Omit<
  React.ComponentProps<typeof InputGroupInput>,
  "value" | "onChange" | "defaultValue"
> & {
  value: string
  onChange?: React.ChangeEventHandler<HTMLInputElement>
  onValueChange?: (value: string) => void
  className?: string
}): React.ReactElement {
  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    onChange?.(event)
    onValueChange?.(event.target.value)
  }

  return (
    <InputGroup
      className={cn("max-w-md flex-1", className)}
      data-slot="filter-search"
    >
      <InputGroupAddon align="inline-start">
        <SearchIcon className="size-4 text-muted-foreground" />
      </InputGroupAddon>
      <InputGroupInput
        aria-label={ariaLabel}
        onChange={handleChange}
        placeholder={placeholder}
        value={value}
        {...props}
      />
    </InputGroup>
  )
}

function FilterSelect<T extends string>({
  value,
  onValueChange,
  options,
  className,
  placeholder,
  "aria-label": ariaLabel,
}: {
  value: T
  onValueChange: (value: T) => void
  options: readonly FilterOption<T>[]
  className?: string
  placeholder?: string
  "aria-label"?: string
}): React.ReactElement {
  return (
    <Select
      onValueChange={(next) => {
        if (next) onValueChange(next as T)
      }}
      value={value}
    >
      <SelectButton
        aria-label={ariaLabel}
        className={cn("w-full sm:w-44", className)}
        data-slot="filter-select"
      >
        <SelectValue placeholder={placeholder} />
      </SelectButton>
      <SelectPopup>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectPopup>
    </Select>
  )
}

function FilterItem({
  className,
  ...props
}: React.ComponentProps<"div">): React.ReactElement {
  return (
    <div
      className={cn("min-w-0", className)}
      data-slot="filter-item"
      {...props}
    />
  )
}

/** Responsive search + select row for list pages. */
export const Filter = Object.assign(FilterRoot, {
  Search: FilterSearch,
  Select: FilterSelect,
  Item: FilterItem,
})
