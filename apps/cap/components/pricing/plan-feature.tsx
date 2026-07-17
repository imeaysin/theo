"use client"

import { cn as classNames } from "@workspace/ui-shadcn/lib/utils"
import { faCheck } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import type { ReactNode } from "react"

interface PlanFeatureProps {
  children: ReactNode
  strong?: boolean
}

export const PlanFeature = ({ children, strong }: PlanFeatureProps) => {
  return (
    <li className="flex items-start gap-3">
      <FontAwesomeIcon
        icon={faCheck}
        className="mt-1 size-3.5 shrink-0 text-primary"
      />
      <span
        className={classNames(
          "text-base leading-relaxed",
          strong ? "font-medium text-foreground" : "text-muted-foreground"
        )}
      >
        {children}
      </span>
    </li>
  )
}
