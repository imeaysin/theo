"use client"

import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import NumberFlow from "@number-flow/react"

interface StepperProps {
  label: string
  value: number
  onIncrement: () => void
  onDecrement: () => void
  decrementLabel?: string
  incrementLabel?: string
}

const buttonClasses =
  "flex justify-center items-center rounded-lg border shadow-sm transition-colors size-9 bg-muted border-border text-foreground hover:bg-muted hover:border-border active:bg-muted disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"

export const Stepper = ({
  label,
  value,
  onIncrement,
  onDecrement,
  decrementLabel,
  incrementLabel,
}: StepperProps) => {
  return (
    <div className="flex items-center justify-between">
      <span className="text-base font-medium text-muted-foreground">
        {label}
      </span>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={onDecrement}
          disabled={value <= 1}
          className={buttonClasses}
          aria-label={decrementLabel}
        >
          <FontAwesomeIcon icon={faMinus} className="size-3.5" />
        </button>
        <span className="w-10 text-center text-base font-semibold text-foreground tabular-nums">
          <NumberFlow value={value} />
        </span>
        <button
          type="button"
          onClick={onIncrement}
          className={buttonClasses}
          aria-label={incrementLabel}
        >
          <FontAwesomeIcon icon={faPlus} className="size-3.5" />
        </button>
      </div>
    </div>
  )
}
