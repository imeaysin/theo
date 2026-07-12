"use client"

import type * as React from "react"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "./tooltip"

export interface TooltipHintProps extends React.ComponentPropsWithoutRef<
  typeof Tooltip
> {
  content: React.ReactNode
  children: React.ReactElement
  side?: "top" | "right" | "bottom" | "left"
  align?: "start" | "center" | "end"
  sideOffset?: number
}

export function TooltipHint({
  content,
  children,
  side,
  align,
  sideOffset,
  ...props
}: TooltipHintProps): React.ReactElement {
  return (
    <TooltipProvider>
      <Tooltip {...props}>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent align={align} side={side} sideOffset={sideOffset}>
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
