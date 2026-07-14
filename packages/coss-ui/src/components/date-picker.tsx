"use client"

import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import * as React from "react"
import { Button } from "@workspace/ui/components/button"
import { Calendar } from "@workspace/ui/components/calendar"
import {
  Popover,
  PopoverPopup,
  PopoverTrigger,
} from "@workspace/ui/components/popover"
import { cn } from "@workspace/ui/lib/utils"

export type DatePickerProps = {
  value?: Date
  onChange?: (date: Date | undefined) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  closeOnSelect?: boolean
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Pick a date",
  disabled,
  className,
  closeOnSelect = false,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        disabled={disabled}
        render={
          <Button
            className={cn(
              "w-full justify-start text-left font-normal",
              !value && "text-muted-foreground",
              className
            )}
            variant="outline"
          />
        }
      >
        <CalendarIcon aria-hidden="true" />
        {value ? format(value, "PPP") : placeholder}
      </PopoverTrigger>
      <PopoverPopup className="w-auto p-0">
        <Calendar
          defaultMonth={value}
          mode="single"
          onSelect={(date) => {
            onChange?.(date)
            if (closeOnSelect) {
              setOpen(false)
            }
          }}
          selected={value}
        />
      </PopoverPopup>
    </Popover>
  )
}
