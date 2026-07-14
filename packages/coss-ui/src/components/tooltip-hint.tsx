"use client"

import type * as React from "react"
import {
  Tooltip,
  TooltipPopup,
  TooltipPrimitive,
  TooltipTrigger,
} from "./tooltip"

export interface TooltipHintProps extends React.ComponentPropsWithoutRef<
  typeof TooltipPrimitive.Root
> {
  content: React.ReactNode
  children: React.ReactElement
  side?: TooltipPrimitive.Positioner.Props["side"]
  align?: TooltipPrimitive.Positioner.Props["align"]
  sideOffset?: TooltipPrimitive.Positioner.Props["sideOffset"]
  portalProps?: TooltipPrimitive.Portal.Props
}

export function TooltipHint({
  content,
  children,
  side,
  align,
  sideOffset,
  portalProps,
  ...props
}: TooltipHintProps): React.ReactElement {
  return (
    <Tooltip {...props}>
      <TooltipTrigger render={children} />
      <TooltipPopup
        align={align}
        portalProps={portalProps}
        side={side}
        sideOffset={sideOffset}
      >
        {content}
      </TooltipPopup>
    </Tooltip>
  )
}
