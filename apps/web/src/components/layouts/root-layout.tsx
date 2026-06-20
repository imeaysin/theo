import { Outlet } from "react-router-dom"
import { ThemeProvider } from "@/providers/theme-provider"
import {
  AnchoredToastProvider,
  ToastProvider,
} from "@workspace/ui/components/toast"

export function RootLayout() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AnchoredToastProvider>
          <Outlet />
        </AnchoredToastProvider>
      </ToastProvider>
    </ThemeProvider>
  )
}
