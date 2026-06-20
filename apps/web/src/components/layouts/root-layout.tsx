import { Outlet, useNavigate } from "react-router-dom"
import { ThemeProvider } from "@/providers/theme-provider"
import { AnchoredToastProvider, ToastProvider } from "@workspace/ui/components/toast"


export function RootLayout() {
  const navigate = useNavigate()

  return (
    <ThemeProvider>
      <ToastProvider>
        <AnchoredToastProvider>
          <main><Outlet /></main>
        </AnchoredToastProvider>
      </ToastProvider>
    </ThemeProvider>
  )
}
