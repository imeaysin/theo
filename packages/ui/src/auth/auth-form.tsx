"use client"

import type { ReactNode } from "react"
import { Card, CardPanel } from "@workspace/ui/components/card"
import { OTPField, OTPFieldInput } from "@workspace/ui/components/otp-field"
import { Spinner } from "@workspace/ui/components/spinner"
import { cn } from "@workspace/ui/lib/utils"

export interface AuthOtpInputProps {
  value: string
  onValueChange: (value: string) => void
  onComplete?: (value: string) => void
  disabled?: boolean
  invalid?: boolean
  verifying?: boolean
  verifyingLabel?: string
}

export function AuthOtpInput({
  value,
  onValueChange,
  onComplete,
  disabled = false,
  invalid = false,
  verifying = false,
  verifyingLabel = "Verifying...",
}: AuthOtpInputProps) {
  if (verifying) {
    return (
      <Card className="rounded-none shadow-xs">
        <CardPanel className="flex h-16 items-center justify-center">
          <div className="flex items-center gap-2">
            <Spinner className="text-primary" size={16} />
            <span className="text-sm font-medium text-foreground">
              {verifyingLabel}
            </span>
          </div>
        </CardPanel>
      </Card>
    )
  }

  return (
    <OTPField
      aria-invalid={invalid || undefined}
      className="justify-center gap-2"
      disabled={disabled}
      length={6}
      onValueChange={(next) => {
        onValueChange(next)
        if (next.length === 6) {
          onComplete?.(next)
        }
      }}
      value={value}
    >
      {Array.from({ length: 6 }).map((_, index) => (
        <OTPFieldInput
          key={index}
          aria-label={`Character ${index + 1} of 6`}
          className={cn(
            "size-14 text-lg leading-14 sm:size-14 sm:text-lg sm:leading-14",
            invalid && "border-destructive"
          )}
        />
      ))}
    </OTPField>
  )
}

export interface AuthPageBodyProps {
  children: ReactNode
  footer?: ReactNode
}

export function AuthPageBody({ children, footer }: AuthPageBodyProps) {
  return (
    <div className="space-y-6">
      {children}
      {footer ? <div className="text-center">{footer}</div> : null}
    </div>
  )
}
