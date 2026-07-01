"use client"

import { EyeIcon, EyeOffIcon } from "lucide-react"
import { forwardRef, useState } from "react"
import { Button } from "@workspace/ui/components/button"
import type { InputProps } from "@workspace/ui/components/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@workspace/ui/components/input-group"
import {
  Tooltip,
  TooltipPopup,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip"

export type PasswordInputProps = Omit<InputProps, "type">

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  function PasswordInput({ disabled, ...props }, ref) {
    const [showPassword, setShowPassword] = useState(false)
    const toggleLabel = showPassword ? "Hide password" : "Show password"

    return (
      <InputGroup>
        <InputGroupInput
          disabled={disabled}
          ref={ref}
          type={showPassword ? "text" : "password"}
          {...props}
        />
        <InputGroupAddon align="inline-end">
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  aria-label={toggleLabel}
                  disabled={disabled}
                  onClick={() => setShowPassword((visible) => !visible)}
                  size="icon-xs"
                  type="button"
                  variant="ghost"
                />
              }
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </TooltipTrigger>
            <TooltipPopup>{toggleLabel}</TooltipPopup>
          </Tooltip>
        </InputGroupAddon>
      </InputGroup>
    )
  }
)
