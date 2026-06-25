import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "@workspace/ui/globals.css"
import App from "./App"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <div className="relative isolate min-h-svh">
      <App />
    </div>
  </StrictMode>
)
