import { QueryClientProvider } from "@tanstack/react-query"
import { useState, type ReactNode } from "react"
import {
  AnchoredToastProvider,
  ToastProvider,
} from "@workspace/ui-shadcn/components/toast"
import { TooltipProvider } from "@workspace/ui-shadcn/components/tooltip"
import { createQueryClient } from "@/lib/query-client"
import { AppErrorBoundary } from "./app-error-boundary"

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(createQueryClient)

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ToastProvider>
          <AnchoredToastProvider>
            <AppErrorBoundary>{children}</AppErrorBoundary>
          </AnchoredToastProvider>
        </ToastProvider>
      </TooltipProvider>
    </QueryClientProvider>
  )
}
