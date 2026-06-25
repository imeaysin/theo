"use client"

import type * as React from "react"
import { ThemeProvider } from "@workspace/ui/components/theme-provider"
import {
  AnchoredToastProvider,
  ToastProvider,
} from "@workspace/ui/components/toast"
import { TooltipProvider } from "@workspace/ui/components/tooltip"

export interface AppProvidersProps {
  children: React.ReactNode
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ThemeProvider>
      <TooltipProvider>
        <ToastProvider>
          <AnchoredToastProvider>{children}</AnchoredToastProvider>
        </ToastProvider>
      </TooltipProvider>
    </ThemeProvider>
  )
}
