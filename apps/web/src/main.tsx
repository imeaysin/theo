import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { RouterProvider } from "react-router-dom"
import { Providers } from "@/app/providers"
import { router } from "@/app/router"
import { initSentry } from "@/lib/sentry"
import "@/index.css"

initSentry()

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Providers>
      <RouterProvider router={router} />
    </Providers>
  </StrictMode>
)
